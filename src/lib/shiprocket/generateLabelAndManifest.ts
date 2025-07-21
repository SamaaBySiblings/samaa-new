import { getValidShiprocketToken } from "./auth";

export async function generateLabelAndManifest(shipment_id: number) {
  const token = await getValidShiprocketToken();

  // Generate Label
  const labelRes = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/generate/label`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipment_id: [shipment_id] }), // ✅ array
    }
  );
  const labelData = await labelRes.json();

  // Generate Manifest
  const manifestRes = await fetch(
    `https://apiv2.shiprocket.in/v1/external/manifests/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipment_id }),
    }
  );
  const manifestData = await manifestRes.json();

  // Generate Invoice
  const invoiceRes = await fetch(
    `https://apiv2.shiprocket.in/v1/external/orders/print/invoice`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids: [shipment_id] }), // order_id can be used too
    }
  );
  const invoiceData = await invoiceRes.json();

  return {
    label_url: labelData?.label_url || null,
    manifest_url: manifestData?.manifest_url || null,
    shiprocket_invoice_url: invoiceData?.invoice_url || null,
  };
}
