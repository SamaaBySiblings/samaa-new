import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Candle Care - Burn Beautifully | SAMAA",
  description:
    "Get the most from your SAMAA candle—tips for a safe, long-lasting, clean burn with optimal fragrance throw.",
};

export default function CarePage() {
  return (
    <div className="relative pt-24 px-4 md:px-12 bg-[var(--brand-light)] text-[var(--brand-dark)] min-h-screen overflow-hidden">
      {/* Background Image */}
      {/* Centered Image with Spacing */}
      <div className="flex justify-center mb-5 mt-20">
        <Image
          src={
            "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922252/care_zccwg5.png"
          }
          alt="Candle Care"
          height={300}
          width={300}
          priority
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Heading */}
        <h1 className="text-2xl font-[D-DIN]   md:text-2xl font-[var(--font-logo)] tracking-wide md:pr-20">
          Candle Care
        </h1>

        {/* Body Content */}
        <div className="text-xs font-[D-DIN]  md:text-sm leading-relaxed space-y-12 max-w-prose">
          <p className="italic mb-6">
            How to Take Care of Your Candles (So They Last Longer, Smell Better,
            and Actually Look Good)
          </p>

          {/** Tip 1 */}
          <section>
            <h2 className="text-sm font-[D-DIN] font-semibold mb-2">
              1. Trim the Wick Before Every Burn
            </h2>
            <p className="font-[D-DIN]">
              Before lighting your candle, trim the wick to ¼ inch. This keeps
              the flame clean and prevents smoke, soot, and that nasty black
              ring around the jar. Use a wick trimmer or nail scissors.
            </p>
            <p className="font-[D-DIN]">
              Shorter wicks = cleaner flames + slower wax consumption.
            </p>
          </section>

          {/** Tip 2 */}
          <section>
            <h2 className="text-sm font-semibold font-[D-DIN] mb-2">
              2. Burn It Right the First Time
            </h2>
            <p className="font-[D-DIN]">
              The first time you light a candle, let it melt all the way across
              the surface. Every burn creates "burn memory" and prevents
              tunneling.
            </p>
            <p className="font-[D-DIN]">
              Always allow your candle to melt edge-to-edge across the top.
            </p>
          </section>

          {/** Tip 3 */}
          <section>
            <h2 className="text-sm font-[D-DIN] font-semibold mb-2">
              3. Use Candles for 3-4 Hours Max per Session
            </h2>
            <p className="font-[D-DIN]">
              Yes, it's relaxing—but more than 4 hours and you risk:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li className="font-[D-DIN]">Wick mushrooming</li>
              <li className="font-[D-DIN]">Overheated wax (weak scent)</li>
              <li className="font-[D-DIN]">Hot glass container = hazard</li>
            </ul>
            <p className="font-[D-DIN]">Ideal burn time? 2-3 hours.</p>
          </section>

          {/** Tip 4 */}
          <section>
            <h2 className="text-sm font-[D-DIN] font-semibold mb-2">
              4. Keep Candles Out of Reach—and Off the Wrong Surfaces
            </h2>
            <p className="font-[D-DIN]">
              Always place candles on heat-resistant surfaces like ceramic or
              marble. Avoid flammable spots or anything reachable by kids or
              pets.
            </p>
            <p className="font-[D-DIN]">
              Pro Tip: Use candle-safe trays or coasters — they’re chic and
              protective.
            </p>
          </section>

          {/** Tip 5 */}
          <section>
            <h2 className="text-sm font-[D-DIN] font-semibold mb-2">
              5. Store Your Candles Like a Mood-Preserving Treasure
            </h2>
            <p className="font-[D-DIN]">
              Keep candles away from heat, light, and dust. Store with lids on
              if possible. No windows, no vents.
            </p>
          </section>

          {/** Tip 6 */}
          <section>
            <h2 className="text-sm font-[D-DIN] font-semibold mb-2">
              6. Don't Toss the Container—Repurpose It!
            </h2>
            <p className="font-[D-DIN]">
              Once your candle's done (leave ½ inch of wax), clean the jar and
              reuse it:
            </p>
            <ul className="font-[D-DIN] list-disc list-inside ml-4">
              <li>Mini plant pot 🌿</li>
              <li>Jewelry holder or desk organizer</li>
              <li>Cotton pads / earbuds jar</li>
              <li>Espresso cup (if food-safe)</li>
            </ul>
            <p>Bonus: Stylish. Sustainable. Conversation-starting.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
