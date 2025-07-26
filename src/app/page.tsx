import Image from "next/image";
import Link from "next/link";



export default function HomePage() {
  return (
    <div className="bg-[var(--brand-light)] text-black font-light">
      {/* Hero Section - Fullscreen Banner */}
      <section className="relative w-full h-screen overflow-hidden">
        <Image
          src={`https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922304/top_chsozn.jpg`}
          alt="SAMAA Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-3xl font-semibold font-[TANTanglon] tracking-widest text-black animate-fade-up">
            Light Love Heritage
          </h1>
        </div>
      </section>

      {/* Text below Hero */}
      <div
        className="text-center font-[D-DIN] px-6 lowercase py-10 text-sm md:text-base font-light leading-relaxed text-black"
        style={{ backgroundColor: "#f5f5eb" }}
      >
        “<span className="capitalize">The</span> hum Of A 16Th-century loom.{" "}
        <br />
        <span className="capitalize">The</span> silence of a temple where time
        pools like honey. <br />
        <span className="capitalize">This</span> is the luxury as your
        great-great-grandmother knew it”
      </div>
      {/* Section 2: Community CTA */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src={
            "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922267/community_dlx1qo.jpg"
          }
          alt="Community"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-center text-white text-center pb-8 px-4">
          <div className="mb-4 animate-fade-up">
            <h2 className="font-[TANTanglon] text-3xl md:text-4xl font-medium mb-6">
              SAMAA CIRCLE
            </h2>
            <Link
              href="/stories"
              className="font-[D-DIN] border border-white px-6 py-2 inline-block bg-transparent hover:bg-white hover:text-black transition"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Text below Community */}
      <div
        className="font-[D-DIN] text-center lowercase px-6 py-10 text-sm md:text-base font-light leading-relaxed text-black whitespace-pre-line"
        style={{ backgroundColor: "#f5f5eb" }}
      >
        “<span className="capitalize">Share</span>{" "}
        <span className="capitalize">Monsoon</span>-season poetry at 2 AM.{" "}
        <br />
        <span className="capitalize">Trade</span> secrets for reviving{" "}
        <span className="capitalize">Moth</span>-eaten silk saris. <br />
        <span className="capitalize">Debate</span> whether jasmine or marigold
        makes better midnight company. <br />
        <span className="capitalize">Every</span> candle you light becomes a
        signal fire .
        <br />
        <span className="capitalize">I</span>'m here.{" "}
        <span className="capitalize">I</span> remember.”
      </div>

      {/* Section 3: Scent Blocks */}
      <section className="px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            src: "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922296/sharp-scent_wxdm2e.jpg",
            text: "Sharp Notes",
            scent: "sharp",
          },
          {
            src: "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922297/soft-scent_usjkze.jpg",
            text: "Soft Notes",
            scent: "soft",
          },
        ].map(({ src, text, scent }) => (
          <div
            key={src}
            className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] rounded overflow-hidden shadow-md"
          >
            <Image
              src={src}
              alt={text}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <Link
                href={`/candles/filter?scent=${encodeURIComponent(scent)}`}
                className="font-[D-DIN] border border-white px-5 py-2 text-sm text-white bg-transparent hover:bg-white hover:text-black transition"
              >
                {text}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Section 4: Soy Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={`https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922302/soy_ttsaf5.jpg`}
          alt="Soy"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-center text-center pb-8 px-4">
          <div className="text-white mb-4 animate-fade-up">
            <Link
              href="/stories/why-choose-soy"
              className="font-[D-DIN] mt-4 inline-block border border-white text-white px-6 py-2 hover:bg-white hover:text-black transition"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Text below Soy */}
      <div
        className="font-[D-DIN] text-center lowercase px-10 py-10 text-sm md:text-base font-light leading-relaxed text-black"
        style={{ backgroundColor: "#f5f5eb" }}
      >
        “Soy wax has emerged as the gold standard for those who crave not only
        <br />
        beauty but meaning. A tender offering of the soybean—renewable, humble,
        <br />
        abundant—pressed into a form that cradles fire.”
      </div>

      {/* Logo after Soy Section */}
      <div className="flex justify-center mt-2 mb-6">
        <Image
          src={`https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922295/samaa_logo_down_pc9wx4.png`}
          alt="SAMAA Logo"
          width={35} // adjust width as needed
          height={35} // adjust height as needed
          priority // optional, for faster loading
        />
      </div>
    </div>
  );
}
