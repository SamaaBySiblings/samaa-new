import mongoose, { Schema, models } from "mongoose";

const EmailLogSchema = new Schema({
  to: { type: String, required: true },
  subject: { type: String },
  success: { type: Boolean, required: true },
  type: {
    type: String,
    enum: ["order-success", "order-failure"],
    required: true,
  },
  errorMessage: { type: String },
  orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  timestamp: { type: Date, default: Date.now },
});

export const EmailLog =
  models.EmailLog || mongoose.model("EmailLog", EmailLogSchema);
