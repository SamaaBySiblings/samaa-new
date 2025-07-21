import { dbConnect } from "@/lib/dbConnect";
import { Order } from "@/lib/models/Order";
import { NextResponse } from "next/server";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface OrderBody {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  is_test_order?: boolean;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body: OrderBody = await req.json();

    const newOrder = await Order.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      items: body.items,
      total: body.total,
      payment_method: body.payment_method,
      is_test_order: body.is_test_order ?? false,
      status: "pending",
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order DB creation error:", err);
    return NextResponse.json(
      { success: false, message: "Order creation failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
