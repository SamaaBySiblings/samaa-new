import { getValidShiprocketToken } from "./auth";

export async function generateShiprocketInvoicePDF(
  shiprocketOrderId: number
): Promise<Buffer> {
  try {
    const token = await getValidShiprocketToken();

    // 1. Ask Shiprocket to generate the invoice
    const invoiceReq = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/print/invoice",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [shiprocketOrderId] }),
      }
    );

    if (!invoiceReq.ok) {
      throw new Error("Failed to request invoice from Shiprocket");
    }

    const { invoice_url } = await invoiceReq.json();
    if (!invoice_url) throw new Error("No invoice URL returned");

    // 2. Download the actual invoice PDF
    const pdfRes = await fetch(invoice_url);
    if (!pdfRes.ok) {
      throw new Error("Failed to download invoice PDF from Shiprocket URL");
    }

    const arrayBuffer = await pdfRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.error("🚨 Shiprocket invoice generation failed:", err);
    return Buffer.from([]); // fallback to empty buffer
  }
}
