import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Refunds & Returns - SAMAA Candles",
  description:
    "Easy return and refund process for all SAMAA candle orders. We're here to make it right.",
};


export default function RefundPolicyPage() {
  return (
    <div className="bg-[var(--brand-light)] text-[var(--brand-dark)] font-[D-DIN] min-h-screen">
      {/* Hero Image - Full Width */}
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src={
            "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922297/payment_shipping_oh2mcu.jpg"
          }
          alt="Refund Policy"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Content: heading left, text right */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Heading */}
        <h1 className="text-2xl md:text-3xl font-[var(--font-logo)] tracking-wide">
          Refund Policy
        </h1>

        {/* Right: Paragraphs */}
        <div className="text-xs md:text-sm leading-relaxed space-y-6 max-w-prose">
          <p>
            At SAMAA, we adhere to a strict no return and no exchange policy due
            to the handcrafted nature of our products.
          </p>

          <h2 className="font-semibold mt-6">1. Non-Returnable Items</h2>
          <p>
            We do not accept returns or offer exchanges on any products,
            including discounted gift boxes. Specifically, we will not accept
            products:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li>If they have been damaged by you</li>
            <li>
              If they have been altered as per specifications shared by you
            </li>
            <li>If they have been burned</li>
          </ul>

          <h2 className="font-semibold mt-6">2. Cancellation Window</h2>
          <p>
            We allow a 2.5 hour cancellation window from the time your order is
            placed. If you change your mind within this period, your payment
            will be refunded in full. After this window closes, the order is
            processed and cannot be canceled.
          </p>

          <h2 className="font-semibold mt-6">3. Contact</h2>
          <p>
            Questions about our refund policy? Reach out to us at{" "}
            <a href="mailto:samaa@samaabysiblings.com" className="underline">
              support@samaabysiblings.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
