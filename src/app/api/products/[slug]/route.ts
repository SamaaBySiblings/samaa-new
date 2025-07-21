import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Product } from "@/lib/models/Product";

interface Params {
  slug: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  await dbConnect();

  // In newer Next.js versions, params is a Promise
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
