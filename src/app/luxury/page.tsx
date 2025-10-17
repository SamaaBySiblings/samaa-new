
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Luxury Candles - Premium Soy Collection | SAMAA",
  description:
    "Refined soy wax candles with rare scents and artisanal design. Discover SAMAA's luxury edit for collectors and connoisseurs.",
};

export default function LuxuryPage() {
  return (
    <div className="bg-[var(--brand-light)] min-h-screen text-center">
      <div className="mt-[150px] relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <Image
          src={`https://res.cloudinary.com/db5c7s6lw/image/upload/v1752963730/luxury-pic_echyki.jpg`}
          alt="Luxury Collection Preview"
          fill
          className="object-cover"
        />

        {/* Centered Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white font-[TANTanglon] text-2xl md:text-4xl tracking-wider">
            COMING TO SHINE
          </h1>
        </div>
      </div>
    </div>
  );
}

