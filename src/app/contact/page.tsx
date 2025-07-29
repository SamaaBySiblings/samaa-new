"use client";
import { useEffect } from "react";

// TypeScript declaration for Calendly
declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export default function ContactPage() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  const openCalendlyPopup = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: "https://calendly.com/samaabysiblings/30min", // Replace with your Calendly URL
      });
    }
    return false;
  };

  return (
    <div className="pt-24 px-4 md:px-12 bg-[var(--brand-light)] min-h-screen flex flex-col items-center">
      {/* Contact Us Heading on Left Side */}
      <h1
        className="text-1xl md:text-xm font-[TANTanglon] tracking-widest mb-10"
        style={{
          position: "absolute",
          top: "20%",
          left: "20px",
          transform: "translateY(-50%)",
        }}
      >
        CONTACT US
      </h1>

      {/* Centered Box */}
      <div className="max-w-155 w-full mt-20">
        <div className="border-1 border-[#4d272e] p-6 text-left">
          {/* Phone Section */}
          <div className="mb-4">
            <h3 className="text-sm text-[#4d272e] font-[D-DIN]">
              Phone Us:{" "}
              <span className="font-normal text-sm font-[D-DIN]">
                +91 74960 39329, +91 99971 00445
              </span>
            </h3>
            <p className="text-xs text-gray-600 mt-5 leading-loose font-[D-DIN]">
              Hours of operation: MONDAY to SATURDAY, 10 AM to 7 PM IST. If we
              are
              <br />
              not available, we welcome you to leave us a message.
            </p>

            <hr className="border-t border-[#4d272e] my-4" />
          </div>

          {/* Email Section */}
          <div className="mb-4">
            <h3 className="text-sm text-[#4d272e] font-[D-DIN]">
              Email Us:{" "}
              <a
                href="mailto:support@samaabysiblings.com"
                className="underline font-normal text-sm font-[D-DIN]"
              >
                support@samaabysiblings.com
              </a>
            </h3>
            <p className="text-xs text-gray-600 mt-5 font-[D-DIN] leading-loose">
              We welcome you to send us enquiries through email, we should get
              back in 48 working hours.
            </p>
            <hr className="border-t border-[#4d272e] my-4 font-[D-DIN]" />
          </div>
          {/* Book Appointment Section */}
          <div>
            <h3 className="text-sm font-[D-DIN]  text-[#4d272e]">
              BOOK A VIRTUAL APPOINTMENT
            </h3>
            <p className="text-xs text-gray-600 mt-5 font-[D-DIN] mb-5 leading-loose">
              Schedule a personalized fragrance consultation with our experts.
              Discover your signature scent in a one-on-one session.
            </p>
            <button
              onClick={openCalendlyPopup}
              className="bg-[#4d272e] text-white font-[D-DIN] text-xs px-6 py-6 cursor-pointer w-full mb-4 hover:bg-white/80  hover:text-[#4d272e] transition-all duration-300"
            >
              BOOK AN APPOINTMENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
