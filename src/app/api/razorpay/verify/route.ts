import crypto from "crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { dbConnect } from "@/lib/dbConnect";
import { Order } from "@/lib/models/Order";
import axios from "axios";

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

    let currentOrder;
    let shouldCallBackendAPI = false;

    const existing = await Order.findOne({ payment_id: razorpay_payment_id });

    if (existing) {
      // Patch only if needed
      const needsPatch =
        !existing.addressObject?.street ||
        !Array.isArray(existing.items) ||
        existing.items.length === 0;

      if (needsPatch) {
        await Order.updateOne(
          { payment_id: razorpay_payment_id },
          {
            $set: {
              addressObject: formData,
              items: cartItems,
              total,
              admin_notes: "✅ Order enriched via /verify",
            },
          }
        );
        console.log("🔄 Order patched via /verify");
        shouldCallBackendAPI = true; // Only call API when order is patched
      }

      currentOrder = await Order.findOne({ payment_id: razorpay_payment_id });
    } else {
      // Step 3: Fetch payment details from Razorpay
      const payment = (await Promise.race([
        razorpay.payments.fetch(razorpay_payment_id),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Razorpay API timeout")), 10000)
        ),
      ])) as any;

      // Step 4: Save order to DB
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`;

      currentOrder = await Order.create({
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
        admin_notes: "⏳ Processing shipping and invoices...",
      });

      shouldCallBackendAPI = true; // Call API for new orders
    }

    // Step 5: Always call backend API for processing (necessary for shipping, emails, etc.)
    if (shouldCallBackendAPI) {
      try {
        const response = await axios.post(
          "https://api.samaabysiblings.com/backend/enqueue-order",
          { orderId: currentOrder._id }
        );
        console.log("✅ Order enqueued for background processing");
        console.log("Response:", response.data);
      } catch (error: any) {
        console.error("❌ Failed to enqueue order:");
        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Axios Error:", error.message);
        }
      }
    } else {
      console.log("⏭️ Order already complete - no backend processing needed");
    }

    // Debug: Log the currentOrder to see what fields might be undefined
    console.log("📋 Current Order Debug:", {
      id: currentOrder._id,
      createdAt: currentOrder.createdAt,
      hasCreatedAt: !!currentOrder.createdAt,
    });

    // Step 6: Return success response
    return NextResponse.json({
      success: true,
      order: {
        id: currentOrder._id,
        name: currentOrder.name,
        email: currentOrder.email,
        phone: currentOrder.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        items: currentOrder.items,
        total: currentOrder.total,
        status: currentOrder.status,
        payment_id: currentOrder.payment_id,
        createdAt: currentOrder.createdAt,
        processing_message: shouldCallBackendAPI
          ? "Order confirmed! Shipping details and invoice will be emailed shortly."
          : "Order found but already processed - no further action needed.",
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
