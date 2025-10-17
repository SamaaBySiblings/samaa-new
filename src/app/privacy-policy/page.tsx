import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy | SAMAA Candles",
  description:
    "Read how SAMAA protects your data and privacy during your journey with us.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[var(--brand-light)] text-[var(--brand-dark)] font-[D-DIN] min-h-screen">
      {/* Hero Image - Full Width */}
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src={
            "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922297/payment_shipping_oh2mcu.jpg"
          }
          alt="Privacy Policy"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Content: heading left, text right */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Heading */}
        <h1 className="text-2xl font-[D-DIN] md:text-3xl  tracking-wide">
          Privacy Policy
        </h1>

        {/* Right: Paragraphs */}
        <div className="text-xs md:text-sm leading-relaxed space-y-6 max-w-prose">
          <p>
            By using this Website or the Services, or by uploading or providing
            any personal information to SAMAA, you agree to the terms of our
            Privacy Policy, which explains how SAMAA treats your personal
            information and protects your privacy when you use the Website and
            the Services. Please read the Privacy Policy carefully.
          </p>

          <p>
            SAMAA cares about your privacy and data protection. We are committed
            to offering the highest standards of products and services and
            hence, we value each of our Users and existing or prospective
            clients/customer and aim at maintaining appropriate protection of
            your personal data/personal information ("Data").
          </p>

          <p>
            This Privacy Policy does not apply to Websites maintained by other
            companies or organizations which are linked to the third-party links
            or hyperlinks available in this Website and we are not responsible
            for any personal information you submit to such third parties via
            such links or hyperlinks appearing on our Website. Please ensure
            that you read the Privacy Policy of such other companies or
            organizations before submitting your details.
          </p>

          <h2 className="font-semibold mt-6">1. Information We Collect</h2>
          <p>
            In general, you can browse the Website without revealing any
            personal information about yourself. To fully use our Website, you
            may need to register using our online registration form, where you
            may be required to provide us with your name, date of birth, contact
            number, email id, user id, password, and other personal information
            as indicated on the forms on the Website. You always have the option
            to not provide information by choosing not to use a particular
            service or feature on the Website.
          </p>
          <p>
            We may automatically track certain information about you based upon
            your activities on our Website. We use this information to do
            internal research on our Users' demographics, interests, and
            behavior to better understand, protect, and serve our Users. This
            information is compiled and analyzed on an aggregated basis. This
            information may include the URL that you just came from (whether
            this URL is on our website or not), which URL you next go to
            (whether this URL is on our Website or not), your computer browser
            information, and your IP address.
          </p>

          <h2 className="font-semibold mt-6">2. Cookies and Data Collection</h2>
          <p>
            We use data collection devices such as "cookies" on certain pages of
            the Website to help analyze our web page flow and measure
            promotional effectiveness. A cookie is a piece of information that
            is stored on your computer's hard drive by your web browser which
            tracks your movements within Websites. Our Website uses cookies to
            keep track of how often you visit our Website, your
            queries/information you provide, to deliver content specific to your
            interests, etc. Most browsers are automatically set to accept
            cookies, but usually, you can alter the settings of your browser to
            prevent automatic acceptance. If you choose not to receive cookies,
            you may still use most of the features of our Website.
          </p>

          <h2 className="font-semibold mt-6">3. User-Generated Content</h2>
          <p>
            If you choose to post messages on our message boards, chat rooms, or
            other message areas or leave feedback for other Users, we will
            collect that information you provide to us. We retain this
            information as necessary to resolve disputes, provide user/customer
            support, and troubleshoot problems as permitted by law.
          </p>
          <p>
            If you send us personal correspondence, such as emails or letters,
            or if other Users or third parties send us correspondence about your
            activities or postings on the Website, we may collect such
            information into a file specific to you.
          </p>

          <h2 className="font-semibold mt-6">4. Sharing of Your Information</h2>
          <p>
            We may share personal information with our other corporate entities
            and affiliates. These entities and affiliates may market to you as a
            result of such sharing unless you explicitly opt-out.
          </p>
          <p>
            We may use various outside agencies (third-party service providers)
            to make our Website operate, and some of these third parties may
            need access to your information in order to make the services
            provided through our Website. Information will only be disclosed to
            these service providers on a need-to-know basis, and they will only
            be permitted to use such information for the purpose of providing
            the particular services provided by such entities in connection with
            our Website.
          </p>
          <p>
            We cooperate with law enforcement and regulatory inquiries, as well
            as other third parties to enforce laws, such as intellectual
            property rights, fraud, and other rights, to help protect you and
            other Users. Therefore, in response to a verified request by law
            enforcement or other government officials relating to a criminal
            investigation or alleged illegal activity, we can (and you authorize
            us to) disclose your name, city, state, telephone number, email
            address, User ID history, fraud complaints, and other details
            without notice. Without limiting the above, in an effort to respect
            your privacy, we will not otherwise disclose your personal
            information to law enforcement or other government officials without
            a subpoena, court order, or substantially similar legal procedure,
            except when we believe in good faith that the disclosure of
            information is necessary to prevent imminent physical harm or
            financial loss; or report suspected illegal activity.
          </p>
          <p>
            Further, we can (and you authorize us to) disclose your name, street
            address, city, state, zip code, country, phone number, email, and
            company name to Intellectual Property right's owners under
            confidentiality agreement, as we in our sole discretion believe
            necessary or appropriate in connection with an investigation of
            fraud, intellectual property infringement, piracy, or other unlawful
            activity.
          </p>

          <h2 className="font-semibold mt-6">5. Data Security</h2>
          <p>
            Due to the existing regulatory environment, we cannot ensure that
            all of your private communications and other personal information
            will never be disclosed in ways not otherwise described in this
            Privacy Policy. By way of example (without limiting the foregoing),
            we may be forced to disclose personal information to the government
            or third parties under certain circumstances, third parties may
            unlawfully intercept or access transmissions or private
            communications, or Users may abuse or misuse your personal
            information that they collect from the Website. Therefore, although
            we use industry-standard practices to protect your privacy, we do
            not promise, and you should not expect, that your personal
            information or private communications will always remain private.
          </p>

          <h2 className="font-semibold mt-6">6. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, contact us at{" "}
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
