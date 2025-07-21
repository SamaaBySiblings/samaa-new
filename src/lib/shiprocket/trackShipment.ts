// lib/shiprocket/trackShipment.ts

import { getValidShiprocketToken } from "./auth";

export async function trackShipment(awb_code: string) {
  const token = await getValidShiprocketToken();

  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb_code}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok || !data?.tracking_data) {
    console.error("❌ Tracking failed:", data);
    throw new Error("Tracking info unavailable");
  }

  return data.tracking_data;
}
