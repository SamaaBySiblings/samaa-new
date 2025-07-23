import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import { Order } from "@/lib/models/Order";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

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

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error("❌ Invalid webhook payload", err);
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }

  if (event.event !== "payment.captured") {
    return NextResponse.json({ success: true, message: "Ignored event" });
  }

  const payment = event.payload.payment.entity;

  await dbConnect();

  // Idempotency check
  const existing = await Order.findOne({ payment_id: payment.id });
  if (existing) {
    console.log("✅ Webhook: Order already exists.");
    return NextResponse.json({
      success: true,
      message: "Order already recorded",
    });
  }

  // Extract minimal info from notes
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

  try {
    // Save minimal order, NO enqueue here
    await Order.create({
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
      source: "webhook",
      shipping_status: "not_shipped",
      payment_details: payment,
    });
  } catch (err) {
    console.error("❌ Webhook DB write failed:", err);
    return NextResponse.json(
      { success: false, message: "Order save failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Order recorded via webhook",
  });
}
