import crypto from "crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { dbConnect } from "@/lib/dbConnect";
import { Order } from "@/lib/models/Order";

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

    // Step 1: Verify payment signature FIRST
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

    // Step 2: Check for existing order
    const existing = await Order.findOne({ payment_id: razorpay_payment_id });
    if (existing) {
      return NextResponse.json({ success: true, order: existing });
    }

    // Step 3: Fetch payment details with timeout
    const payment = (await Promise.race([
      razorpay.payments.fetch(razorpay_payment_id),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Razorpay API timeout")), 10000)
      ),
    ])) as any;

    // Step 4: Create order in database IMMEDIATELY
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
      admin_notes: "⏳ Processing shipping and invoices...",
    });

    // Step 5: Return SUCCESS immediately to user
    const response = NextResponse.json({
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
        estimated_delivery: newOrder.estimated_delivery.toISOString(),
        processing_message:
          "Order confirmed! Shipping details and invoice will be emailed shortly.",
      },
    });

    // Step 6: Process heavy operations in background (don't await)
    processOrderBackground(newOrder, cartItems, formData, total, payment);

    return response;
  } catch (error: unknown) {
    console.error("❌ Payment verification failed:", error);

    // Quick failure response
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}

// Background processing function (runs after response is sent)
async function processOrderBackground(
  order: any,
  cartItems: CartItem[],
  formData: FormData,
  total: number,
  payment: any
) {
  try {
    // Import heavy dependencies only when needed
    const { createShiprocketOrder } = await import(
      "@/lib/shiprocket/createOrder"
    );
    const { assignAWB } = await import("@/lib/shiprocket/assignAWB");
    const { requestShiprocketPickup } = await import(
      "@/lib/shiprocket/requestPickup"
    );
    const { generateLabelAndManifest } = await import(
      "@/lib/shiprocket/generateLabelAndManifest"
    );
    const { sendSuccessEmail } = await import("@/lib/send-success-email");
    const { generateInvoicePDF } = await import("@/lib/pdf/generatePDF");
    const { generateShiprocketInvoicePDF } = await import(
      "@/lib/shiprocket/fetchShiprocketInvoice"
    );
    const { orderSuccessTemplate } = await import(
      "@/lib/templates/orderSuccessEmail"
    );

    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`;

    // Process Shiprocket with timeout
    let shiprocketData = {};
    try {
      const shiprocketPromise = processShiprocket(
        order,
        cartItems,
        formData,
        fullAddress,
        total
      );
      shiprocketData = (await Promise.race([
        shiprocketPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Shiprocket timeout")), 80000)
        ),
      ])) as any;
    } catch (err) {
      console.error("🚨 Shiprocket failed:", err);
      shiprocketData = { error: err };
    }

    // Generate PDFs in parallel with timeout
    const pdfPromises = [
      Promise.race([
        generateInvoicePDF({
          customer: { name: order.name },
          orderName: `Order #${order._id}`,
          items: order.items,
          trackingNumber: (shiprocketData as any).awb_code || "NA",
        }),
        new Promise<Buffer>((_, reject) =>
          setTimeout(() => reject(new Error("Custom PDF timeout")), 15000)
        ),
      ]).catch(() => Buffer.from([])),

      Promise.race([
        (shiprocketData as any).shiprocket_order_id
          ? generateShiprocketInvoicePDF(
              Number((shiprocketData as any).shiprocket_order_id)
            )
          : Promise.resolve(Buffer.from([])),
        new Promise<Buffer>((_, reject) =>
          setTimeout(() => reject(new Error("Shiprocket PDF timeout")), 15000)
        ),
      ]).catch(() => Buffer.from([])),
    ];

    const [customPdf, shiprocketPdf] = await Promise.all(pdfPromises);

    // Update order with shipping details
    await Order.findByIdAndUpdate(order._id, {
      ...shiprocketData,
      admin_notes: (shiprocketData as any).error
        ? "⚠️ Shipping setup had issues. Manual processing may be needed."
        : "✅ Order processed successfully",
    });

    // Send email
    const html = orderSuccessTemplate({
      customer: { name: order.name },
      items: order.items,
      total: order.total,
      method: payment.method,
    });

    await Promise.race([
      sendSuccessEmail({
        to: order.email,
        subject: "🧾 Your SAMAA Order Confirmation",
        htmlData: html,
        orderId: order._id.toString(),
        customer: { name: order.name },
        items: order.items,
        total: order.total,
        method: payment.method,
        pdfBuffers: [
          { filename: `samaa_invoice_${order._id}.pdf`, buffer: customPdf },
          {
            filename: `tax_invoice_shiprocket_${order._id}.pdf`,
            buffer: shiprocketPdf,
          },
        ],
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), 20000)
      ),
    ]);

    console.log("✅ Background processing completed for order:", order._id);
  } catch (error) {
    console.error("❌ Background processing failed:", error);

    // Update order with error status
    try {
      await Order.findByIdAndUpdate(order._id, {
        admin_notes: "⚠️ Post-payment processing failed. Manual review needed.",
      });
    } catch (dbError) {
      console.error("Failed to update order with error status:", dbError);
    }
  }
}

// Helper function for Shiprocket processing
async function processShiprocket(
  order: any,
  cartItems: CartItem[],
  formData: FormData,
  fullAddress: string,
  total: number
) {
  const { createShiprocketOrder } = await import(
    "@/lib/shiprocket/createOrder"
  );
  const { assignAWB } = await import("@/lib/shiprocket/assignAWB");
  const { requestShiprocketPickup } = await import(
    "@/lib/shiprocket/requestPickup"
  );
  const { generateLabelAndManifest } = await import(
    "@/lib/shiprocket/generateLabelAndManifest"
  );

  const { shiprocket_order_id, shipment_id } = await createShiprocketOrder({
    orderId: order._id.toString(),
    customer: {
      name: order.name,
      email: order.email,
      phone: order.phone,
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

  return {
    shiprocket_order_id,
    shiprocket_shipment_id: shipment_id,
    awb_code,
    courier_company: courier,
    invoice_url: shiprocket_invoice_url || label_url,
    manifest_url,
    admin_notes: `✅ Pickup confirmed by ${courier}: ${pickup.confirmation}`,
  };
}
