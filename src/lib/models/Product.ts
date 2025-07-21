import mongoose, { Schema, models, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  tagline: string[];
  isBundle: boolean;
  stock: number;
  description?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, default: "candles" },
    tagline: { type: [String], default: [] },
    isBundle: { type: Boolean, default: false },
    stock: { type: Number, default: 10 },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  models.Product || mongoose.model<IProduct>("Product", ProductSchema);
