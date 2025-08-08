// app/about/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

// Metadata for the About page

export const metadata: Metadata = {
  title: "About SAMAA - Indian Soul, Luxury Craft",
  description:
    "Learn the story behind SAMAA—candles inspired by heritage, designed for soulful, sustainable living.",
};

const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#f5f5eb] text-[#262626]">
      {/* Top hero image */}
      <div className="pt-24 pb-10 flex justify-center px-4">
        <Image
          src={
            "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922254/about1_eiyllt.jpg"
          }
          alt="Hero"
          width={400}
          height={400}
          className="w-full max-w-md object-cover rounded-lg"
          priority
        />
      </div>

      {/* Poetic Intro */}
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <p className="font-[D-DIN] text-xs leading-relaxed">
          For the ones who want to feel again. <br />
        </p>
        <br />
        <p className="font-[D-DIN] text-xs leading-relaxed">
          There are two of us- siblings Naman and Garima, but not mirrors.
          <br />
          Born into the same soil, shaped by very different winds.
        </p>
        <br />
        <p className="font-[D-DIN] text-xs leading-relaxed">
          One of us grew in the wild rhythm of the corporate world. The other
          wandered with art, culture,
        </p>
        <p className="font-[D-DIN] text-xs leading-relaxed">
          and a weather-beaten journal tucked under their arm. But both of
        </p>
        <p className="font-[D-DIN] text-xs leading-relaxed">
          us—always—felt the same pull.
        </p>
      </div>

      <section className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 w-full py-1">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left: Text */}
          <div className="md:w-2/3 w-full">
            <p className="font-[D-DIN] text-xs leading-relaxed text-gray-800 font-light">
              A pull to
              <br />
              return. To
              <br />
              slowness.
              <br />
              To stories.
              <br />
              To the kind of beauty that doesn't
              <br />
              shout, but hums quietly through a<br />
              room like the scent of jasmine on a<br />
              warm, late evening.
            </p>
          </div>

          {/* Right: Smaller Image */}
          <div className="md:w-1/3 w-full">
            <Image
              src={
                "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922256/client_pic_lb7rqr.jpg"
              }
              alt="Descriptive image"
              width={700}
              height={500}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              priority
            />
          </div>
        </div>

        <p className="font-[D-DIN] text-xs leading-relaxed text-gray-800 mt-8 text-center">
          This is our rebellion: to rekindle what the world forgot. Not with
          opulence, but with embers.
        </p>

        <p className="font-[D-DIN] text-xs leading-relaxed text-gray-800 mt-4 text-center">
          Even in the chaos of wedding planning as Naman's background, he was
          always drawn to <br />
          candles—their gentle flicker, the calm warmth they brought. They
          weren't just decor; they <br />
          turned ordinary spaces into something sacred. That quiet magic stayed
          with me, and became <br />
          one of the inspiration for SAMAA Candle."
        </p>

        {/* Two-picture collage 2x1 */}
        <div className="mt-10 mx-auto max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Image
            src={
              "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922251/about3_m5hljj.jpg"
            }
            alt="Collage 1"
            width={300}
            height={200}
            className="rounded-md object-cover"
            priority
          />
          <Image
            src={
              "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922249/about2_i6pdur.png"
            }
            alt="Collage 2"
            width={300}
            height={200}
            className="rounded-md object-cover"
            priority
          />
        </div>

        <p className="font-[D-DIN] text-xs leading-relaxed text-gray-800 mt-8 text-center">
          SAMAA is not because the world needed another “luxury brand,” but
          because luxury had <br />
          stopped feeling like anything at all.
        </p>
      </section>

      <section className="max-w-screen-lg mx-auto my-16 px-4 sm:px-6 lg:px-8 p-8 bg-[#5B261D] rounded-xl border text-white">
        {/* Top row: heading, subtitle, logo */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="font-[D-DIN] text-xl md:text-2xl text-left flex-1">
            So what is Samaa?
          </h2>

          <p className="font-[D-DIN] text-center italic flex-1 text-xs normal-case">
            It's not a product line. It's a love language.
          </p>

          <div className="flex-1 flex justify-end">
            <Image
              src={
                "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922286/logo-new_fbv3vv.png"
              }
              alt="SAMAA Logo"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Vintage paragraph */}
        <div
          className="max-w-xl font-[D-DIN] mx-auto text-center text-xs leading-relaxed space-y-0 mb-14 normal-case"
          style={{ fontSize: "0.85rem" }}
        >
          <p>
            <span className="capitalize font-[D-DIN]">a</span> vintage one.
          </p>
          <p className="font-[D-DIN]">
            One that speaks in brass and terracotta, in marigold and sandalwood,
            in stories passed
          </p>
          <p className="font-[D-DIN]">
            down by our great-great-grandmothers when they didn't even know they
            were telling
          </p>
          <p className="font-[D-DIN]">stories.</p>
          <p>They were just living—beautifully, consciously, richly.</p>
        </div>

        {/* Video + paragraph */}
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-screen-lg mx-auto mb-14">
          {/* Video */}
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

          {/* Paragraph */}
          <div className="md:w-1/2 w-full text-right max-w-md mx-auto text-xs leading-relaxed space-y-1 normal-case">
            <p className="text-center font-[D-DIN]">
              <span className="uppercase font-[D-DIN]">SAMAA</span> is the sheer
              atmosphere of an ancient
            </p>
            <p className="text-center font-[D-DIN]">
              time, surrounded in those candles, reawakened in
            </p>
            <p className="text-center font-[D-DIN]">the modern world.</p>
            <p className="text-center font-[D-DIN]">
              it is the warmth of the soil of india.
            </p>
            <p className="text-center font-[D-DIN]">
              it is a life lived not for attention, but with
            </p>
            <p className="text-center font-[D-DIN]">intention.</p>
          </div>
        </div>

        {/* Bottom centered paragraph */}
        <div className="max-w-3xl mx-auto text-center text-xs leading-relaxed space-y-1 normal-case">
          <p>
            <span className="capitalize font-[D-DIN]">luxury</span>, to us, is
            not gold leaf—it's the soil.
          </p>
          <p className="font-[D-DIN]">
            It's the tremor in a potter's hands as they shape clay. It's the
            confidence to wear a
          </p>
          <p className="font-[D-DIN]">
            threadbare shawl because its stitches hum stories of past winters.
            It's the radical act of
          </p>
          <p className="font-[D-DIN]">
            slowing down to feel the weight of a candleholder carved by a
            90-year-old's hands.
          </p>
          <p className="font-[D-DIN]">
            We exist for those who crave this quiet, who want to be in that
            light again.
          </p>
          <p className="font-[D-DIN]">
            Who want to trade “perfection” for fingerprints, and hashtags for
            handwritten letters.
          </p>
        </div>
      </section>

      {/* Unweighted 3×2 Pic Collage */}
      <section className="pb-16">
        <div className="mt-11 max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          <Image
            src={
              "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922255/collage1_khgtgy.jpg"
            }
            alt="Collage 1"
            width={200}
            height={150}
            className="w-full h-auto object-cover"
            priority
          />
          <Image
            src={
              "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922255/collage2_jp9wpd.jpg"
            }
            alt="Collage 2"
            width={200}
            height={150}
            className="w-full h-auto object-cover"
            priority
          />
          <Image
            src={
              "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922256/collage3_ojssra.jpg"
            }
            alt="Collage 3"
            width={200}
            height={150}
            className="w-full h-auto object-cover"
            priority
          />
          <Image
            src={
              "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922258/collage4_olbvg7.jpg"
            }
            alt="Collage 4"
            width={200}
            height={150}
            className="w-full h-auto object-cover"
            priority
          />
          <Image
            src={
              "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922259/collage5_dcq2gt.jpg"
            }
            alt="Collage 5"
            width={200}
            height={150}
            className="w-full h-auto object-cover"
            priority
          />
          <Image
            src={
              "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922260/collage6_vzkuug.jpg"
            }
            alt="Collage 6"
            width={170}
            height={150}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        <div className="max-w-screen-md mx-auto mt-8 font-serif lowercase text-gray-800">
          <p className="font-[D-DIN] text-sm leading-relaxed text-center">
            For purity over polish. <br />
            For sustainability not as a selling point, but as an ancestral
            truth. <br />
            For luxury that reconnects you with your inner world, not distances
            you from your roots.
          </p>

          <p className="text-sm font-[D-DIN] leading-relaxed mt-6 text-left ml-2">
            We believe in: <br />
            Conversations that mean something <br />
            Craft that lasts longer than trends <br />
            Communities where people share—not perform <br />
            Objects that make you remember who you are
          </p>
        </div>

        <section className="w-full py-12">
          <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 gap-0">
            <div className="flex flex-col items-center gap-10 px-4">
              <Image
                src={
                  "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922261/collage8_jqueey.jpg"
                }
                alt="Collage 1"
                width={275}
                height={280}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="bg-[#94562A] py-20 px-20 shadow-sm">
                <p className="font-[D-DIN] text-sm text-white leading-relaxed lowercase">
                  Gather Around the Flame: <br />
                  This is not a "brand." It's a circle.
                  <br />
                  Here, you'll share monsoon-season poetry at 2 AM. Trade
                  <br />
                  secrets for reviving moth-eaten silk saris. Debate whether
                  jasmine or marigold makes better midnight company.
                  <br /> Every candle you light becomes a signal fire: "I'm
                  here. remember."
                  <br /> Because luxury, done right, is a conversation not a
                  monologue.
                </p>
              </div>
            </div>

            <div className="flex justify-center items-start px-4">
              <Image
                src={
                  "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922262/collage9_rb9ayj.jpg"
                }
                alt="Collage 2"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* “So Tell Us…” section unchanged */}
        <section className="w-full py-16 px-4 bg-[#f5f5eb]">
          <div className="max-w-3xl mx-auto font-serif text-gray-800 lowercase">
            <h2 className="font-[D-DIN]text-2xl sm:text-3xl font-semibold tracking-wide text-center mb-6">
              So Tell Us…
            </h2>

            {/* First paragraph: left aligned */}
            <p className="font-[D-DIN] text-base leading-relaxed text-left mb-12">
              Have you been missing yourself lately? <br />
              Light one of our candles, and you're not igniting wax—you're
              summoning a village. <br />
              The hum of a 16th-century loom. The laughter of a chai-seller who
              knows your name. <br />
              The silence of a temple where time pools like honey. <br />
              This is luxury as your great-great-grandmother knew it.
            </p>

            {/* Second block: center aligned */}
            <div className="font-[D-DIN] text-center space-y-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              <p>Join us if:</p>
              <p>
                You've ever felt homesick for a place you've never been. <br />
                You crave elegance that doesn't demand you shrink.
              </p>
              <p>
                You believe “sustainability” isn't a trend, but a covenant with
                the earth.
              </p>

              <p className="pt-4 underline italic font-[D-DIN]">
                <Link href="https://substack.com/@samaacircle">
                  Come as You Are
                </Link>
              </p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default AboutPage;
