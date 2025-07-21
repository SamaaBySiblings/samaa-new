import nodemailer from "nodemailer";
import { orderFailureTemplate } from "./templates/orderFailureEmail"; // Adjust if needed

export async function sendFailureEmail({
  to,
  subject,
  customer,
  reason,
  orderId,
}: {
  to: string;
  subject: string;
  customer: { name: string };
  reason: string;
  orderId?: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in", // ✅ For Zoho India
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER!,
        pass: process.env.ZOHO_PASS!,
      },
    });

    const html = orderFailureTemplate({ customer, reason });

    const info = await transporter.sendMail({
      from: `"Samaa by Siblings" <${process.env.ZOHO_USER}>`,
      to,
      subject,
      html,
    });

    // Log email (success)
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject,
        success: true,
        type: "order-failure",
        orderId,
      }),
    });

    return { success: true, info };
  } catch (error: unknown) {
    console.error("Failure email send error:", error);

    // Extract error message safely
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown error";

    // Log failure
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject,
        success: false,
        type: "order-failure",
        errorMessage,
        orderId,
      }),
    });

    return { success: false, error };
  }
}
