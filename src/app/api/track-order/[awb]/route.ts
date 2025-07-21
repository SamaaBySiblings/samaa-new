import { NextResponse } from "next/server";
import { getValidShiprocketToken } from "@/lib/shiprocket/auth";

interface ShiprocketTrackingData {
  awb_code: string;
  shipment_status: string;
  courier_name: string;
  delivered_to?: string | null;
  etd?: string | null;
  current_city?: string | null;
  track_activities?: Array<Record<string, any>>;
}

interface ShiprocketApiResponse {
  tracking_data?: ShiprocketTrackingData | null;
  [key: string]: any;
}

export async function GET(
  _req: Request,
  context: { params: Promise<Record<string, string>> }
) {
  const params = await context.params;
  const awb = params.awb;

  if (!awb || awb.length < 5) {
    return NextResponse.json(
      { success: false, message: "Invalid AWB code" },
      { status: 400 }
    );
  }

  try {
    const token = await getValidShiprocketToken();
    const res = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data: ShiprocketApiResponse = await res.json();

    if (!res.ok || !data?.tracking_data) {
      console.error("❌ Shiprocket tracking failed:", data);
      return NextResponse.json(
        { success: false, message: "Tracking not found", details: data },
        { status: 404 }
      );
    }

    const track = data.tracking_data;
    const response = {
      awb_code: track.awb_code,
      shipment_status: track.shipment_status,
      courier_name: track.courier_name,
      delivered_to: track.delivered_to ?? null,
      etd: track.etd ?? null,
      current_city: track.current_city ?? null,
      events: track.track_activities ?? [],
    };

    return NextResponse.json({ success: true, tracking: response });
  } catch (error) {
    console.error("🚨 Shiprocket tracking error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while tracking" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
