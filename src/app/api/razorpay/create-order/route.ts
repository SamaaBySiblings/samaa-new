import Razorpay from "razorpay";
import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    const { amount, formData, cartItems } = await req.json();

    if (
      !amount ||
      Number(amount) <= 0 ||
      !formData ||
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.pincode ||
      !formData.country ||
      !cartItems ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid data for order creation",
        },
        { status: 400 }
      );
    }

    const address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`;

    const options = {
      amount: Number(amount) * 100, // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address,
        items: JSON.stringify(cartItems),
        total: amount.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay create error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
