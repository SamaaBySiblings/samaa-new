import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import { Order } from "@/lib/models/Order";

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
  const rawBody = await req.text(); // raw body needed for signature verification
  const signature = req.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // Step 1: Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("⚠️ Webhook signature mismatch.");
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 400 }
    );
  }

  // Step 2: Parse event
  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error("❌ Invalid webhook payload", err);
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }

  // Step 3: Only handle 'payment.captured' events
  if (event.event !== "payment.captured") {
    return NextResponse.json({ success: true, message: "Ignored event" });
  }

  const payment = event.payload.payment.entity;

  await dbConnect();

  // Step 4: Idempotency check
  const existing = await Order.findOne({ payment_id: payment.id });
  if (existing) {
    console.log("✅ Webhook: Order already exists.");
    return NextResponse.json({
      success: true,
      message: "Order already recorded",
    });
  }

  // Step 5: Extract & validate notes
  const { name, email, phone, address, items, total } = payment.notes || {};
  if (!email || !items || !total) {
    console.error("❌ Missing data in notes");
    return NextResponse.json(
      { success: false, message: "Missing required data" },
      { status: 400 }
    );
  }

  let parsedItems;
  try {
    parsedItems = JSON.parse(items);
    if (!Array.isArray(parsedItems)) throw new Error("Items not array");
  } catch {
    console.error("❌ Invalid items format");
    return NextResponse.json(
      { success: false, message: "Invalid items data" },
      { status: 400 }
    );
  }

  const parsedTotal = parseInt(total, 10);
  if (isNaN(parsedTotal) || parsedTotal <= 0) {
    console.error("❌ Invalid total amount");
    return NextResponse.json(
      { success: false, message: "Invalid total" },
      { status: 400 }
    );
  }

  // Step 6: Save minimal order + enqueue
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

    // ✅ Enqueue for backend processing (email, invoice, etc.)
    try {
      const enqueueRes = await fetch(
        "https://samaa-backend-ik0y.onrender.com/enqueue-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: newOrder._id }),
        }
      );

      if (!enqueueRes.ok) {
        console.error("❌ Failed to enqueue order:", await enqueueRes.text());
      } else {
        console.log("✅ Order enqueued via webhook");
      }
    } catch (err) {
      console.error("❌ Error calling enqueue endpoint:", err);
    }
  } catch (err) {
    console.error("❌ Webhook DB write failed:", err);
    return NextResponse.json(
      { success: false, message: "Order save failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Order processed via webhook",
  });
}
