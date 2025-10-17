import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shipping & Payments - SAMAA Candle Orders",
  description:
    "Learn about shipping, payments, and delivery timelines for your handcrafted SAMAA candles worldwide.",
};

export default function HomePage() {
  return (
    <div className="bg-[var(--brand-light)] text-[var(--brand-dark)] font-[D-DIN] min-h-screen">
      {/* Hero Image - Full Width */}
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src={
            "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922297/payment_shipping_oh2mcu.jpg"
          }
          alt="Payments and Shipping"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Content: heading left, text right */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Heading */}
        <h1 className="text-3xl md:text-4xl font-[var(--font-logo)] tracking-wide">
          Payments &amp; Shipping
        </h1>

        {/* Right: Paragraphs */}
        <div className="text-xs md:text-sm leading-relaxed space-y-6">
          <p>
            Namaste, Welcome to the world of SAMAA. At SAMAA, we accept all
            major credit and debit cards, UPI, Razorpay, and PayPal
            (international). All transactions are secured and encrypted.
          </p>

          <p>
            Once your order is placed, you'll receive a confirmation email.
            Orders are processed within 1–3 business days. Tracking information
            will be emailed once dispatched.
          </p>

          <p>
            We offer free shipping in India. We strive to deliver your order at
            the earliest. At SAMAA we understand how important it is to receive
            your purchased products in the finest condition, and on time. You
            will generally receive your orders within 5 to 10 days from the date
            of dispatch.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">SHIPPING DURATION</h2>
          <p>
            Depending on the products, customization, and the weight, your
            shipment may be split into two packages and shipping dates may vary.
          </p>
          <p>
            Though we use the best logistics partners, during festivals,
            national holidays, etc., the delivery of your shipment might get
            further delayed. For outlier locations, if your address is not
            serviceable by our partners, we will contact you to find an
            alternative solution to ensure your package reaches you. We do not
            provide refunds on any order.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            SHIPPING OUTSIDE INDIA
          </h2>
          <p>
            We offer international shipping through our shipping partners
            (DHL/UPS/FedEx) at a nominal fee. Once your order is placed, it will
            reach you within 10–20 working days from the date of dispatch. We do
            not provide exchanges & refunds on international orders. Any custom
            charges, brokerage fees, or taxes applicable by the destination
            country will be borne by the customer, and we will not be
            responsible for them.
          </p>

          <p>
            For any urgent concerns, reach out to{" "}
            <a className="underline" href="mailto:samaa@samaabysiblings.com">
              samaa@samaabysiblings.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
