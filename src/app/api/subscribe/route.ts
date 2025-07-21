import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Subscriber from "@/lib/models/Subscriber";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required and must be a string" },
        { status: 400 }
      );
    }

    try {
      await Subscriber.create({ email });
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscriber POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
