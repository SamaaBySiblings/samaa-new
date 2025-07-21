
export async function generateInvoicePDF(data: {
  customer: { name: string };
  orderName: string;
  trackingNumber: string;
}): Promise<Buffer> {
  try {
    const res = await fetch(`${process.env.PDF_SERVICE_URL}/generate-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to generate PDF");
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Return empty or fallback buffer if needed
    return Buffer.from([]);
  }
}

  
  
