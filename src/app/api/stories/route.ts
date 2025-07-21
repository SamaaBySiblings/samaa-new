// app/api/stories/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Story } from "@/lib/models/Story";

export async function GET() {
  try {
    await dbConnect();

    const stories = await Story.find({}, "slug image title").lean();

    return NextResponse.json(stories);
  } catch (error) {
    console.error("[GET /api/stories] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
