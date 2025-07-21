// lib/shiprocket/assignAWB.ts
import { getValidShiprocketToken } from "./auth";

export async function assignAWB(shipment_id: number) {
  const token = await getValidShiprocketToken();

  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/assign/awb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipment_id }),
    }
  );

  const data = await res.json();

  const awbData = data.response?.data;
  if (!res.ok || !awbData?.awb_code) {
    console.error("❌ Shiprocket AWB assignment failed:", data);
    throw new Error("AWB assignment failed");
  }

  return {
    awb_code: awbData.awb_code,
    courier_company_id: awbData.courier_company_id,
    courier: awbData.courier_name || "Unknown",
  };
}


  
