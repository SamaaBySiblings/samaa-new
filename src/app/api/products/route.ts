import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Product } from "@/lib/models/Product";

interface ProductInput {
  name: string;
  slug: string;
  price: number;
  image: string;
  category?: string;
  isBundle?: boolean;
  stock?: number;
  description?: string;
  status?: "active" | "inactive";
}

export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("Product fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body: ProductInput = await req.json();

    // Optional: runtime validation here (e.g., using zod or yup)

    const newProduct = await Product.create(body);

    return NextResponse.json({ success: true, data: newProduct });
  } catch (err) {
    console.error("Product creation error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
