import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Terms & Conditions | SAMAA Candles",
  description:
    "Understand the terms of using SAMAA's website and services before placing your order.",
};


export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[var(--brand-light)] text-[var(--brand-dark)] font-[D-DIN] min-h-screen">
      {/* Hero Image - Full Width */}
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src={
            "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922297/payment_shipping_oh2mcu.jpg"
          }
          alt="Terms and Conditions"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Content: heading left, text right */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Heading */}
        <h1 className="text-2xl md:text-3xl font-[var(--font-logo)] tracking-wide">
          Terms & Conditions
        </h1>

        {/* Right: Paragraphs */}
        <div className="text-xs md:text-sm leading-relaxed space-y-6 max-w-prose">
          <p>
            Namaste. Welcome to the world of SAMAA — where every flame carries a
            story, and every scent holds memory. These Terms of Service govern
            your access to and use of the website (hereinafter referred to as
            the "Website"), and all related content, features, and services
            offered by SAMAA (hereinafter referred to as "we," "us," or "our").
            By using this Website, you acknowledge that you've read, understood,
            and agreed to all the terms stated below. If you do not accept these
            terms, kindly refrain from using the Website.
          </p>

          <h2 className="font-semibold mt-6">
            1. Ownership and Intellectual Property
          </h2>
          <p>
            All content on this Website — including but not limited to visuals,
            text, product names, logos, graphics, packaging designs, scent
            compositions, and layout — is the intellectual property of SAMAA and
            protected under applicable Indian and international IP laws. You may
            not reproduce, modify, republish, distribute, or create derivative
            works from any content on this Website without prior written
            consent. You may, however, use the Website for personal and
            non-commercial purposes only. Any suggestions, submissions, or
            feedback you voluntarily provide to SAMAA shall be deemed to carry a
            royalty-free, perpetual, and irrevocable license for SAMAA to use in
            any way we see fit.
          </p>

          <h2 className="font-semibold mt-6">
            2. Product and Content Accuracy
          </h2>
          <p>
            We strive to ensure that every image, scent description, ingredient
            list, and candle detail is accurate and current. However, slight
            variations may occur due to the handmade nature of our products and
            the limitations of digital displays (e.g., screen color variation).
            All prices and product availability are subject to change without
            prior notice.
          </p>

          <h2 className="font-semibold mt-6">3. Website Usage & Security</h2>
          <p>
            You agree not to:
            <br />
            • Access or use our Website in any way that could damage or impair
            its functionality.
            <br />
            • Attempt to hack, transmit malware, or gain unauthorized access to
            data or systems.
            <br />
            • Engage in fraudulent, abusive, or illegal activity through the
            Website.
            <br />
            We reserve the right to restrict or terminate access at our
            discretion if any misuse is detected.
          </p>

          <h2 className="font-semibold mt-6">4. Third-Party Links</h2>
          <p>
            This Website may occasionally contain links to external websites.
            These are provided for reference only, and SAMAA assumes no
            responsibility for their content, accuracy, or any damage resulting
            from use.
          </p>

          <h2 className="font-semibold mt-6">5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, SAMAA shall not be liable
            for any direct, indirect, incidental, or consequential damages
            resulting from the use or inability to use our Website or products.
            We make no warranties, express or implied, regarding the
            availability, accuracy, or reliability of the Website.
          </p>

          <h2 className="font-semibold mt-6">6. Indemnity</h2>
          <p>
            By using this Website, you agree to indemnify and hold SAMAA and its
            affiliates harmless against any claims, liabilities, or losses
            arising out of your violation of these Terms or use of the Website
            in an unauthorized manner.
          </p>

          <h2 className="font-semibold mt-6">7. Pricing Policy</h2>
          <p>
            All pricing is in Indian Rupees (INR) unless otherwise specified.
            Prices may vary across geographies due to shipping, tax laws, or
            regional costs.
          </p>

          <h2 className="font-semibold mt-6">8. Termination of Access</h2>
          <p>
            We reserve the right to suspend or terminate your access to the
            Website if we believe you've violated these Terms, our Privacy
            Policy, or applicable laws.
          </p>

          <h2 className="font-semibold mt-6">9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes will
            fall under the jurisdiction of the courts of Mumbai, India.
          </p>

          <h2 className="font-semibold mt-6">10. Amendments</h2>
          <p>
            We may revise these Terms at any time. Any changes will be posted
            here, and your continued use of the Website constitutes agreement to
            the updated Terms.
          </p>

          <h2 className="font-semibold mt-6">11. Grievance & Contact</h2>
          <p>
            For any questions, concerns, or complaints regarding our Terms of
            Service or to report infringement, please email us at{" "}
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
