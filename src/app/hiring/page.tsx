"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HiringPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-[var(--brand-light)] text-[var(--brand-dark)] min-h-screen px-6 md:px-12 py-24">
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="font-[D-DIN] text-sm md:text-base font-[var(--font-logo)] tracking-widest">
          HIRING
        </h1>
      </div>

      {/* Top Row - Different images and sizes for mobile & desktop */}
      {/* Top Row - Different images and sizes for mobile & desktop */}
      <div
        className={`max-w-5xl mx-auto flex gap-6 justify-center mb-12 ${
          isMobile ? "flex-col items-center" : "flex-row"
        }`}
      >
        {isMobile ? (
          <>
            <div className="flex justify-start w-full">
              <div className="relative aspect-square w-40 rounded overflow-hidden">
                <Image
                  src={
                    "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922273/hiring1_klvoss.jpg"
                  }
                  alt="Hiring 1"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Image 2 - Right */}
            <div className="flex justify-end w-full">
              <div className="relative aspect-square w-40 rounded overflow-hidden">
                <Image
                  src={
                    "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922276/hiring2_afmvxw.jpg"
                  }
                  alt="Hiring 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-square w-48 rounded overflow-hidden">
              <Image
                src={
                  "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922273/hiring1_klvoss.jpg"
                }
                alt="Hiring 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square w-64 rounded overflow-hidden">
              <Image
                src={
                  "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922276/hiring2_afmvxw.jpg"
                }
                alt="Hiring 2"
                fill
                className="object-cover"
              />
            </div>
          </>
        )}
      </div>

      {/* Center Text */}
      <div className="text-center mb-15">
        <h2 className="font-[TANTanglon] text-lg md:text-xl font-bold text-black uppercase tracking-wider">
          Come Create
        </h2>
      </div>

      {/* Bottom Row - Different images and sizes for mobile & desktop */}
      <div
        className={`max-w-5xl mx-auto flex gap-6 justify-center mb-16 ${
          isMobile ? "flex-col items-center" : "flex-row"
        }`}
      >
        {isMobile ? (
          <>
            <div className="flex justify-end w-full">
              <div className="relative aspect-square w-40 rounded overflow-hidden">
                <Image
                  src={
                    "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922278/hiring3_gzzoc3.jpg"
                  }
                  alt="Hiring 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex justify-start w-full">
              <div className="relative aspect-square w-40 rounded overflow-hidden">
                <Image
                  src={
                    "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922277/hiring4_pqmdh3.jpg"
                  }
                  alt="Hiring 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-square w-64 rounded overflow-hidden">
              <Image
                src={
                  "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922278/hiring3_gzzoc3.jpg"
                }
                alt="Hiring 3"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square w-48 rounded overflow-hidden">
              <Image
                src={
                  "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922277/hiring4_pqmdh3.jpg"
                }
                alt="Hiring 4"
                fill
                className="object-cover"
              />
            </div>
          </>
        )}
      </div>

      {/* Hiring Note */}
      <div className="max-w-7xl mx-auto text-sm md:text-base">
        <div className="border border-[#4d272e] bg-transparent p-6 text-center shadow-sm max-w-md mx-auto">
          <p className="mb-2 font-[D-DIN] font-semibold">No active positions</p>
          <p className="font-[D-DIN]">Check back for new opportunities</p>
        </div>
      </div>

      {/* Footer */}
      <div className="font-[D-DIN] text-center mt-16 text-xs text-black">
        <span className="capitalize">if</span> you had a great idea:{" "}
        <a
          href="mailto:careers@samaabysiblings.com"
          className="underline font-[D-DIN]"
        >
          careers@samaabysiblings.com
        </a>
      </div>
    </div>
  );
}
