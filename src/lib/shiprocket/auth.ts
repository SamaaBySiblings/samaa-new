// lib/shiprocket/auth.ts

import { getShiprocketToken, setShiprocketToken } from "./tokenCache";

export async function getValidShiprocketToken(): Promise<string> {
  const existing = getShiprocketToken();
  if (existing) return existing;

  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_API_EMAIL!,
        password: process.env.SHIPROCKET_API_PASSWORD!,
      }),
    }
  );

  const data = await res.json();

  if (!data.token) {
    console.error("❌ Failed to get Shiprocket token:", data);
    throw new Error("Shiprocket authentication failed");
  }

  setShiprocketToken(data.token, 60 * 60 * 24); // 1 day (token is valid for 10 days, we refresh every 1)
  return data.token;
}
