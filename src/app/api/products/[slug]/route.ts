import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Product } from "@/lib/models/Product";

interface Params {
  slug: string;
}

export async function GET(_req: Request, context: { params: Params }) {
  await dbConnect();

  // If context.params is a Promise, await it — but typically it's an object already
  const { slug } = await context.params;

  const product = await Product.findOne({ slug });

  if (!product) {
    return NextResponse.json(
      { success: false, message: "product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: product });
}
