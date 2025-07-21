import { dbConnect } from "@/lib/dbConnect";
import { EmailLog } from "@/lib/models/EmailLog";
import { NextResponse } from "next/server";

interface EmailLogBody {
  to: string;
  subject: string;
  success: boolean;
  type: string;
  errorMessage?: string | null;
  orderId?: string | null;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body: EmailLogBody = await req.json();

    const log = await EmailLog.create({
      to: body.to,
      subject: body.subject,
      success: body.success,
      type: body.type,
      errorMessage: body.errorMessage ?? null,
      orderId: body.orderId ?? null,
    });

    return NextResponse.json({ success: true, log });
  } catch (err) {
    console.error("Email log error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to log email" },
      { status: 500 }
    );
  }
}
