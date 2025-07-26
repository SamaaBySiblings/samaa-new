
import Image from "next/image";

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
            shine
          </h1>
        </div>
      </div>
    </div>
  );
}

