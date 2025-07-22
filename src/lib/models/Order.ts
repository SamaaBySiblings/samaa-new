import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    address: { type: String, required: true },
    addressObject: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

    items: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    total: { type: Number, required: true },
    payment_method: { type: String, required: true },
    payment_id: { type: String, required: true },
    payment_details: { type: mongoose.Schema.Types.Mixed },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    shipping_status: {
      type: String,
      enum: ["not_shipped", "shipped", "delivered"],
      default: "not_shipped",
    },

    estimated_delivery: { type: Date },
    invoice_url: { type: String, default: "" },
    manifest_url: { type: String, default: "" },
    courier_company: { type: String, default: "" },
    awb_code: { type: String, default: "" },

    shiprocket_order_id: { type: String, default: "" },
    shiprocket_shipment_id: { type: String, default: "" },

    is_test_order: { type: Boolean, default: false },
    source: {
      type: String,
      enum: ["web", "admin"],
      default: "web",
    },
    admin_notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export { Order };
