// lib/shiprocket/requestPickup.ts
import { getValidShiprocketToken } from "./auth";

export async function requestShiprocketPickup(shipment_id: number) {
  const token = await getValidShiprocketToken();

  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipment_id }),
    }
  );

  const data = await res.json();

  // ✅ Fix: instead of checking `pickup_data`, check if status is 3 or data contains confirmation
  if (!res.ok || data.pickup_status !== 1 || !data.response?.data) {
    console.error("❌ Shiprocket pickup request failed:", data);
    throw new Error("Pickup request failed");
  }

  return {
    pickupToken: data.response.pickup_token_number,
    scheduledDate: data.response.pickup_scheduled_date,
    confirmation: data.response.data,
  };
}
