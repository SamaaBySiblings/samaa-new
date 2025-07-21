import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import { Order } from "@/lib/models/Order";
import { sendSuccessEmail } from "@/lib/send-success-email";
import { generateInvoicePDF } from "@/lib/pdf/generatePDF";
import { orderSuccessTemplate } from "@/lib/templates/orderSuccessEmail";
import { generateShiprocketInvoicePDF } from "@/lib/shiprocket/fetchShiprocketInvoice";

// Strongly typed Razorpay webhook structure
interface RazorpayPaymentEntity {
  id: string;
  method: string;
  notes?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    items?: string;
    total?: string;
  };
  [key: string]: unknown;
}

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment: {
      entity: RazorpayPaymentEntity;
    };
  };
}

export async function POST(req: Request) {
  const rawBody = await req.text(); // Important: use raw body for signature verification
  const signature = req.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // Step 1: Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("⚠️ Razorpay webhook signature mismatch.");
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 }
    );
  }

  // Step 2: Parse and type the event payload
  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayWebhookEvent;
  } catch (err) {
    console.error("❌ Webhook payload parse error", err);
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }

  // Step 3: Process only payment.captured events
  if (event.event !== "payment.captured") {
    return NextResponse.json({ success: true, message: "Ignored event" });
  }

  const payment = event.payload.payment.entity;

  await dbConnect();

  // Step 4: Idempotency check — avoid duplicate order entries
  const existing = await Order.findOne({ payment_id: payment.id });
  if (existing) {
    console.log("✅ Webhook: Order already exists.");
    return NextResponse.json({
      success: true,
      message: "Order already recorded",
    });
  }

  // Step 5: Extract and validate order data from payment notes
  const { name, email, phone, address, items, total } = payment.notes || {};

  if (!email || !items || !total) {
    console.error("❌ Webhook missing required notes data.");
    return NextResponse.json(
      { success: false, message: "Missing data in notes" },
      { status: 400 }
    );
  }

  let parsedItems;
  try {
    parsedItems = JSON.parse(items);
    if (!Array.isArray(parsedItems)) throw new Error("Items not an array");
  } catch {
    console.error("❌ Invalid items JSON");
    return NextResponse.json(
      { success: false, message: "Invalid items data" },
      { status: 400 }
    );
  }

  const parsedTotal = parseInt(total, 10);
  if (isNaN(parsedTotal) || parsedTotal <= 0) {
    console.error("❌ Invalid total amount");
    return NextResponse.json(
      { success: false, message: "Invalid total amount" },
      { status: 400 }
    );
  }

  // Step 6: Save new order and send confirmation email inside try-catch
  try {
    const newOrder = await Order.create({
      name,
      email,
      phone,
      address,
      items: parsedItems,
      total: parsedTotal,
      payment_method: payment.method,
      payment_id: payment.id,
      status: "paid",
      is_test_order: false,
      source: "web",
      shipping_status: "not_shipped",
      payment_details: payment,
    });

    const safeName = name ?? "";

    const html = orderSuccessTemplate({
      customer: { name: newOrder.name },
      items: newOrder.items,
      total: newOrder.total,
      method: payment.method,
    });

    const invoiceData = {
          customer: { name: newOrder.name },
          orderName: `Order #${newOrder._id}`,
          items: newOrder.items,
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
  } catch (emailOrDbError) {
    console.error("❌ Error saving order or sending email:", emailOrDbError);
    // Optionally decide how to respond here: you might want to still send 200 to Razorpay
  }

  return NextResponse.json({ success: true });
}
