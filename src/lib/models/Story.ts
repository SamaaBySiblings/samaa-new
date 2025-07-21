import mongoose, { Schema, Document, Model } from "mongoose";

interface ContentBlock {
  type: "paragraph" | "image";
  text?: string;
  src?: string;
  alt?: string;
}

export interface StoryDocument extends Document {
  slug: string;
  title: string;
  image: string;
  content: ContentBlock[];
}

const ContentBlockSchema = new Schema({
  type: { type: String, required: true },
  text: String,
  src: String,
  alt: String,
});

const StorySchema = new Schema<StoryDocument>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  content: [ContentBlockSchema],
});

export const Story: Model<StoryDocument> =
  mongoose.models.Story || mongoose.model("Story", StorySchema);
