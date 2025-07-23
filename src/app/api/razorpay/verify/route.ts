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

    // ✅ Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !formData ||
      !formData.phone ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.pincode ||
      !formData.country ||
      !formData.name ||
      !formData.email
    ) {
      return NextResponse.json(
        { success: false, message: "Incomplete order data" },
        { status: 400 }
      );
    }

    // Step 1: Verify payment signature
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

    // Step 2: Check if order already exists
    const existing = await Order.findOne({ payment_id: razorpay_payment_id });
    if (existing) {
      return NextResponse.json({ success: true, order: existing });
    }

    // Step 3: Fetch payment details from Razorpay
    const payment = (await Promise.race([
      razorpay.payments.fetch(razorpay_payment_id),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Razorpay API timeout")), 10000)
      ),
    ])) as any;

    // Step 4: Save order to DB
    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const newOrder = await Order.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: fullAddress,
      addressObject: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
      },
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

    // Step 5: Enqueue background job
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
        console.log("✅ Order enqueued for background processing");
      }
    } catch (err) {
      console.error("❌ Error while enqueuing order:", err);
    }

    // Step 6: Return success response
    return NextResponse.json({
      success: true,
      order: {
        id: newOrder._id,
        name: newOrder.name,
        email: newOrder.email,
        phone: newOrder.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
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
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}
