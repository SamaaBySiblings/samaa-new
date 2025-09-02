// app/about/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SAMAA - Indian Soul, Luxury Craft",
  description:
    "Learn the story behind SAMAA—candles inspired by heritage, designed for soulful, sustainable living.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#f5f5eb] text-[#262626]">
      {/* Top hero image */}
      <div className="pt-24 pb-10 flex justify-center px-4">
        <Image
          src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922254/about1_eiyllt.jpg"
          alt="Hero"
          width={400}
          height={400}
          className="w-full max-w-md object-cover rounded-lg"
          priority
        />
      </div>

      {/* Poetic Intro */}
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <p className="font-[D-DIN] text-lg leading-relaxed">
          For the ones who want to feel again.
        </p>
        <br />
        <p className="font-[D-DIN] text-lg leading-relaxed">
          There are two of us—siblings Naman and Garima, but not mirrors. <br />
          Born into the same soil, shaped by very different winds.
        </p>
        <br />
        <p className="font-[D-DIN] text-lg leading-relaxed">
          One of us grew in the wild rhythm of the corporate world. The other
          wandered with art, culture,
        </p>
        <p className="font-[D-DIN] text-lg leading-relaxed">
          And a weather-beaten journal tucked under their arm. But both of us—
          always—felt the same pull.
        </p>
      </div>

      {/* Quote Section */}
      <section className="w-full py-1">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full md:w-auto max-w-md text-center md:text-left">
            <p className="font-[D-DIN] text-lg leading-relaxed text-gray-800 font-light">
              A pull to <br />
              return. To <br />
              slowness. <br />
              To stories. <br />
              To the kind of beauty that doesn't <br />
              shout, but hums quietly through a <br />
              room like the scent of jasmine on a <br />
              warm, late evening.
            </p>
          </div>

          <div className="w-full md:w-auto flex justify-center">
            <Image
              src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922256/client_pic_lb7rqr.jpg"
              alt="Descriptive image"
              width={245}
              height={245}
              className="w-full max-w-xs md:max-w-sm h-auto object-cover rounded-lg shadow-md"
              priority
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 w-full py-1">
        <p className="font-[D-DIN] text-lg leading-relaxed text-gray-800 mt-8 text-center">
          <i>This is our rebellion:</i> to rekindle what the world forgot. Not
          with opulence, but with embers.
        </p>

        <p className="font-[D-DIN] text-lg leading-relaxed text-gray-800 mt-4 text-center">
          Even in the chaos of wedding planning as Naman's background, he was
          always drawn to <br />
          candles—their gentle flicker, the calm warmth they brought. They
          weren't just decor; they <br />
          turned ordinary spaces into something sacred. That quiet magic stayed
          with me, and became <br />
          one of the inspiration for SAMAA Candle.
        </p>

        <div className="mt-10 mx-auto max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Image
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922251/about3_m5hljj.jpg"
            alt="Collage 1"
            width={300}
            height={200}
            className="rounded-md object-cover"
            priority
          />
          <Image
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922249/about2_i6pdur.png"
            alt="Collage 2"
            width={300}
            height={200}
            className="rounded-md object-cover"
            priority
          />
        </div>

        <p className="font-[D-DIN] text-lg leading-relaxed text-gray-800 mt-8 text-center">
          SAMAA is not because the world needed another “luxury brand,” but
          because luxury had <br />
          stopped feeling like anything at all.
        </p>
      </section>

      {/* Meaning of Samaa */}
      <section className="max-w-screen-lg mx-auto my-16 px-4 sm:px-6 lg:px-8 p-8 bg-[#5B261D] rounded-4xl border  text-white">
        <div className="mb-8 space-y-4">
          {/* Heading - aligned left */}
          <div className="text-left pl-20">
            <h2 className="font-[D-DIN] text-sm md:text-xl">
              <i className="text-light italic">So What Is SAMAA?</i>
            </h2>
          </div>

          {/* Quote centered, logo on the right */}
          <div className="relative w-full my-4">
            {/* Centered Quote */}
            <p className="font-[D-DIN] italic text-lg text-center">
              It's not a product line. It's a love language.
            </p>

            {/* Logo on the far right, vertically aligned */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Image
                src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922286/logo-new_fbv3vv.png"
                alt="SAMAA Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="max-w-xl font-[D-DIN] mx-auto text-center text-lg leading-relaxed mb-14 normal-case space-y-1">
          <p>
            <span className="capitalize">a</span> vintage one.
          </p>
          <p>
            One that speaks in brass and terracotta, in marigold and
            sandalwood...
          </p>
          <p>Stories passed down by our great-great-grandmothers.</p>
          <p>They were just living—beautifully, consciously, richly.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 max-w-screen-lg mx-auto mb-14">
          <div className="md:w-1/2 w-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              src="https://res.cloudinary.com/db5c7s6lw/video/upload/v1753039785/samaa-video_epxfqe.mp4"
              className="w-full h-auto shadow-lg"
            />
          </div>

          <div className="md:w-1/2 w-full text-center max-w-md mx-auto text-lg leading-relaxed space-y-1 normal-case">
            <p>
              <span className="uppercase">SAMAA</span> is the sheer atmosphere
              of an ancient time.
            </p>
            <p>Surrounded in those candles, reawakened in the modern world.</p>
            <p>It is the warmth of the soil of India.</p>
            <p>A life lived not for attention, but with intention.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center text-lg leading-relaxed space-y-1 normal-case">
          <p>
            <span className="capitalize">luxury</span>, to us, is not gold
            leaf—it's the soil.
          </p>
          <p>
            It's the tremor in a potter's hands as they shape clay. It's the
            confidence to wear a threadbare shawl because its stitches hum
            stories of past winters.
          </p>
          <p>
            It's the radical act of slowing down to feel the weight of a
            candleholder carved by a 90-year-old's hands.
          </p>
          <p>
            We exist for those who crave this quiet, who want to be in that
            light again.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mt-11 max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 grid-rows-2 gap-2">
          {/* Column 1 - images aligned */}
          <Image
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922250/collage1_khgtgy.jpg"
            alt="Collage 1"
            width={400}
            height={300}
            className="w-full h-[350px] object-cover"
            priority
          />
          {/* Column 2 - top row with vertical offset */}
          <Image
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922251/collage2_jp9wpd.jpg"
            alt="Collage 2"
            width={400}
            height={300}
            className="w-[350px] h-[350px] object-cover  translate-y-2"
            priority
          />
          {/* Column 3 - images aligned */}
          <Image
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922252/collage3_ojssra.jpg"
            alt="Collage 3"
            width={400}
            height={300}
            className="w-full h-[350px] object-cover"
            priority
          />

          {/* Column 1 - images aligned */}
          <Image
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922253/collage4_olbvg7.jpg"
            alt="Collage 4"
            width={400}
            height={300}
            className="w-full h-[350px] object-cover"
            priority
          />
          {/* Column 2 - bottom row with vertical offset */}
          <Image
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922254/collage5_dcq2gt.jpg"
            alt="Collage 5"
            width={400}
            height={300}
            className="w-full h-[350px] object-cover  translate-y-2"
            priority
          />
          {/* Column 3 - images aligned */}
          <Image
            src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922255/collage6_vzkuug.jpg"
            alt="Collage 6"
            width={400}
            height={300}
            className="w-full h-[350px] object-cover"
            priority
          />
        </div>
      </section>

      <div className="max-w-screen-md mx-auto mt-8 text-gray-800">
        <p className="font-[D-DIN] text-lg leading-relaxed text-center">
          For purity over polish. <br />
          For sustainability not as a selling point, but as an ancestral truth.{" "}
          <br />
          For luxury that reconnects you with your inner world, not distances
          you from your roots.
        </p>

        <p className="text-lg font-[D-DIN] leading-relaxed mt-10 text-left ml-2">
          We believe in: <br />
          Conversations that mean something <br />
          Craft that lasts longer than trends <br />
          Communities where people share—not perform <br />
          Objects that make you remember who you are
        </p>
      </div>

      {/* Final Section */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-1">
          {/* Pic 1 container */}
          <div className="flex justify-center items-center w-full h-[400px]">
            <div className="w-full h-full relative">
              <Image
                src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922261/collage8_jqueey.jpg"
                alt="Collage 8"
                width={400} // fixed width
                height={400} // fixed height (square container)
                className="object-cover"
                priority
                style={{ width: "100%", height: "100%" }} // fill container responsively
              />
            </div>
          </div>

          {/* Pic 2 container */}
          <div className="flex justify-center items-center px-4 w-full h-[400px]">
            <div className="w-full h-full relative">
              <Image
                src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922262/collage9_rb9ayj.jpg"
                alt="Collage 9"
                width={400}
                height={400}
                className="object-cover"
                priority
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Text container */}
          <div className="bg-[#94562A] py-20 px-10 shadow-sm flex items-center justify-center w-full h-[400px]">
            <p className="font-[D-DIN] text-lg text-white leading-relaxed text-center">
              Gather Around the Flame: <br />
              This is not a "brand." It's a circle.
              <br />
              Here, you'll share monsoon-season poetry at 2 AM. <br />
              Debate jasmine vs marigold. Revive moth-eaten saris. <br />
              Every candle you light becomes a signal fire: “I'm here.
              remember.”
              <br />
              Because luxury, done right, is a conversation, not a monologue.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-16 px-4 bg-[#f5f5eb]">
        <div className="max-w-3xl mx-auto text-gray-800">
          {/* Wrap So Tell Us and paragraph in a div with limited width and aligned left */}
          <div className="max-w-xl ml-0">
            <h2 className="font-[D-DIN] text-2xl sm:text-3xl font-light tracking-wide text-left">
              So Tell Us…
            </h2>

            <p className="font-[D-DIN] text-base leading-relaxed text-left mb-12">
              Have you been missing yourself lately? <br />
              Light one of our candles, and you're not igniting wax—you're
              summoning a village. <br />
              The hum of a 16th-century loom. The laughter of a chai-seller who
              knows your name. The silence of a temple where time pools like honey. This is luxury as your great-great-<br/>grandmother knew it.
            </p>
          </div>

          {/* Centered Join Us Section */}
          <div className="font-[D-DIN] text-center text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            <p>Join us if:</p>
            <p>
              You've ever felt homesick for a place you've never been. <br />
              You crave elegance that doesn't demand you shrink.
            </p>
            <p>
              You believe “sustainability” isn't a trend, but a covenant with
              the earth.
            </p>
            <p className="underline italic">
              <Link href="https://substack.com/@samaacircle">
                Come as You Are
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
