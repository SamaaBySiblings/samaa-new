import nodemailer from "nodemailer";
import { orderSuccessTemplate } from "../lib/templates/orderSuccessEmail";

interface EmailItem {
  name: string;
  quantity: number;
  price: number;
}

interface SendSuccessEmailOptions {
  to: string;
  orderId: string;
  htmlData?: string; // optional override
  subject: string;
  customer: { name: string };
  items: EmailItem[];
  total: number;
  method: string;
  pdfBuffers: Array<{ filename: string; buffer: Buffer }>; // 🔄 updated
}

export async function sendSuccessEmail({
  to,
  orderId,
  customer,
  items,
  total,
  method,
  pdfBuffers,
  subject,
  htmlData,
}: SendSuccessEmailOptions) {
  try {
    const html =
      htmlData ||
      orderSuccessTemplate({
        customer,
        items,
        total,
        method,
      });

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER!,
        pass: process.env.ZOHO_PASS!,
      },
    });

    const attachments = pdfBuffers.map((pdf) => ({
      filename: pdf.filename,
      content: pdf.buffer,
      contentType: "application/pdf",
    }));

    const mailOptions = {
      from: `"SAMAA by Siblings" <${process.env.ZOHO_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject,
        success: true,
        type: "order-success",
        orderId,
      }),
    });

    return { success: true, info };
  } catch (error: unknown) {
    let message: string;

    if (typeof error === "string") {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Unknown error";
    }

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject,
        success: false,
        type: "order-success",
        orderId,
        errorMessage: message,
      }),
    });

    return { success: false, error: message };
  }
}
