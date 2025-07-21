import crypto from "crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { dbConnect } from "@/lib/dbConnect";
import { Order } from "@/lib/models/Order";
import { sendSuccessEmail } from "@/lib/send-success-email";
import { sendFailureEmail } from "@/lib/send-failure-email";
import { generateInvoicePDF } from "@/lib/pdf/generatePDF";
import { generateShiprocketInvoicePDF } from "@/lib/shiprocket/fetchShiprocketInvoice";
import { orderSuccessTemplate } from "@/lib/templates/orderSuccessEmail";
import { createShiprocketOrder } from "@/lib/shiprocket/createOrder";
import { assignAWB } from "@/lib/shiprocket/assignAWB";
import { requestShiprocketPickup } from "@/lib/shiprocket/requestPickup";
import { generateLabelAndManifest } from "@/lib/shiprocket/generateLabelAndManifest";

export const dynamic = "force-dynamic";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface FormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface RequestBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  cartItems: CartItem[];
  formData: FormData;
  total: number;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      formData,
      total,
    }: RequestBody = await req.json();

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    const existing = await Order.findOne({ payment_id: razorpay_payment_id });
    if (existing) {
      return NextResponse.json({ success: true, order: existing });
    }

    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const newOrder = await Order.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: fullAddress,
      items: cartItems,
      total,
      payment_method: payment.method,
      payment_id: razorpay_payment_id,
      status: "paid",
      is_test_order: false,
      source: "web",
      shipping_status: "not_shipped",
      payment_details: payment,
      estimated_delivery: estimatedDelivery,
    });

    // -------- SHIPROCKET --------
    try {
      const { shiprocket_order_id, shipment_id } = await createShiprocketOrder({
        orderId: newOrder._id.toString(),
        customer: {
          name: newOrder.name,
          email: newOrder.email,
          phone: newOrder.phone,
        },
        address: {
          full: fullAddress,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        },
        items: cartItems,
        total,
      });

      const { awb_code, courier } = await assignAWB(Number(shipment_id));
      const pickup = await requestShiprocketPickup(Number(shipment_id));

      const { label_url, manifest_url, shiprocket_invoice_url } =
        await generateLabelAndManifest(Number(shipment_id));

      Object.assign(newOrder, {
        shiprocket_order_id,
        shiprocket_shipment_id: shipment_id,
        awb_code,
        courier_company: courier,
        invoice_url: shiprocket_invoice_url || label_url,
        manifest_url,
        admin_notes: `✅ Pickup confirmed by ${courier}: ${pickup.confirmation}`,
      });
    } catch (err) {
      console.error("🚨 Shiprocket failed:", err);
      newOrder.admin_notes =
        "⚠️ Shiprocket failed. Label or invoice could not be generated.";
    }

    await newOrder.save();

    // -------- EMAIL --------
    const html = orderSuccessTemplate({
      customer: { name: newOrder.name },
      items: newOrder.items,
      total: newOrder.total,
      method: payment.method,
    });

    const invoiceData = {
      customer: { name: newOrder.name },
      orderName: `Order #${newOrder._id}`,
      trackingNumber: newOrder.awb_code || "NA",
    };

    let customPdf: Buffer = Buffer.from([]);
    let shiprocketPdf: Buffer = Buffer.from([]);

    try {
      customPdf = await generateInvoicePDF(invoiceData);
    } catch (err) {
      console.error("⚠️ Custom invoice PDF generation failed:", err);
    }

    try {
      if (newOrder.shiprocket_order_id) {
        shiprocketPdf = await generateShiprocketInvoicePDF(
          Number(newOrder.shiprocket_order_id)
        );
      }
    } catch (err) {
      console.error("⚠️ Shiprocket invoice PDF fetch failed:", err);
    }

    await sendSuccessEmail({
      to: newOrder.email,
      subject: "🧾 Your SAMAA Order Confirmation",
      htmlData: html,
      orderId: newOrder._id.toString(),
      customer: { name: newOrder.name },
      items: newOrder.items,
      total: newOrder.total,
      method: payment.method,
      pdfBuffers: [
        { filename: `samaa_invoice_${newOrder._id}.pdf`, buffer: customPdf },
        {
          filename: `tax_invoice_shiprocket_${newOrder._id}.pdf`,
          buffer: shiprocketPdf,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder._id,
        name: newOrder.name,
        email: newOrder.email,
        phone: newOrder.phone,
        address: newOrder.address,
        items: newOrder.items,
        total: newOrder.total,
        status: newOrder.status,
        payment_id: newOrder.payment_id,
        createdAt: newOrder.createdAt,
        awb_code: newOrder.awb_code,
        courier: newOrder.courier_company,
        estimated_delivery: newOrder.estimated_delivery.toISOString(),
        invoice_url: newOrder.invoice_url,
      },
    });
  } catch (error: unknown) {
    console.error("❌ Razorpay verify failed:", error);

    try {
      const body = (await req.json()) as Partial<RequestBody>;
      if (body?.formData?.email && body?.formData?.name) {
        await sendFailureEmail({
          to: body.formData.email,
          subject: "❌ Order Failed",
          customer: { name: body.formData.name },
          reason:
            "We could not process your order due to a server issue. Please try again.",
        });
      }
    } catch (e) {
      console.error("Failure email fallback failed:", e);
    }

    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}
