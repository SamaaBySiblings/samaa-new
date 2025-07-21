// lib/shiprocket/createOrder.ts

import { getValidShiprocketToken } from "./auth";

export async function createShiprocketOrder({
  orderId,
  customer,
  address,
  items,
  total,
}: {
  orderId: string; // our MongoDB order._id
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    full: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    sku?: string;
    hsn?: string;
  }[];
  total: number;
}) {
  const token = await getValidShiprocketToken();

  const payload = {
    order_id: orderId,
    order_date: new Date().toISOString().slice(0, 10),
    pickup_location: "Home", // ✅ make sure your pickup name matches
    billing_customer_name: customer.name,
    billing_last_name: "",
    billing_address: address.full,
    billing_city: address.city,
    billing_pincode: address.pincode,
    billing_state: address.state,
    billing_country: address.country,
    billing_email: customer.email,
    billing_phone: customer.phone,
    shipping_is_billing: true,
    order_items: items.map((item) => ({
      name: item.name,
      sku: item.sku || item.name,
      units: item.quantity,
      selling_price: item.price,
      hsn: item.hsn || "34060090", // fallback to candle HSN
    })),
    payment_method: "Prepaid",
    sub_total: total,
    length: 10, // placeholder
    breadth: 10,
    height: 10,
    weight: 0.5, // default weight in kg
  };

  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.order_id || !data.shipment_id) {
    console.error("❌ Shiprocket order creation failed:", data);
    throw new Error("Shiprocket order failed");
  }

  return {
    shiprocket_order_id: data.order_id,
    shipment_id: data.shipment_id,
  };
}
