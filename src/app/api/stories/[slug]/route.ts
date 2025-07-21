import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Story } from "@/lib/models/Story";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  // Await the params Promise directly
  const { slug } = await context.params;

  await dbConnect();

  const story = await Story.findOne({ slug }).lean();

  if (!story) {
    return NextResponse.json(
      { success: false, message: "Story not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: story });
}
