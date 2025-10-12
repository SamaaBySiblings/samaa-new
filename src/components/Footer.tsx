"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Footer() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const year = new Date().getFullYear();

  
const handleSubscribe = async () => {
  setError("");
  if (!email) {
    setError("Please enter your email.");
    return;
  }
  setLoading(true);
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}api/v1/subscribe`,
      { email }
    );
    if (res.status !== 200) throw new Error("Failed to subscribe");
    setSubscribed(true);
    setEmail("");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || "Error subscribing");
    } else {
      setError("Error subscribing");
    }
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    setSubscribed(false);
    setError("");
  };

  return (
    <footer className="font-[D-DIN] bg-[var(--brand-footer)] text-[var(--brand-light)] px-6 py-16 text-xs md:text-sm tracking-wide">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="mb-10 lg:mb-0 pr-0 lg:pr-10">
          <div className="relative mb-6">
            {subscribed && (
              <div
                className="absolute inset-0 bg-[#172538] bg-opacity-95 text-white p-8 flex flex-col justify-center items-center shadow-lg z-20 animate-slideDown"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <p className="text-center text-xm font-light max-w-sm">
                  You've subscribed. Or as we like to say — joined the calm
                  rebellion.
                </p>
                <button
                  onClick={handleClose}
                  aria-label="Close notification"
                  className="absolute top-0 right-2 text-white text-2xl font-extralight hover:text-gray-300 transition"
                >
                  &times;
                </button>
              </div>
            )}

            <h4 className="text-sm md:text-base font-semibold mb-3 uppercase z-10 relative">
              Join the Samaa Circle
            </h4>

            {error && (
              <p className="text-red-500 mb-2 text-xs md:text-sm z-10 relative">
                {error}
              </p>
            )}

            <input
              type="email"
              placeholder="Your email"
              className="block w-full px-3 py-4 bg-[var(--footer-input)] text-[var(--brand-dark)] mb-3 text-xs md:text-xs"
              disabled={subscribed || loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSubscribe}
              disabled={subscribed || loading}
              className={`w-full py-4 tracking-wide border text-xs md:text-sm transition-colors ${
                subscribed
                  ? "bg-gray-400 border-gray-400 cursor-not-allowed text-white"
                  : "bg-[var(--footer-button)] text-white border-[var(--footer-button)] hover:bg-transparent hover:text-[var(--footer-button)]"
              }`}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          {/* Can We Help Dropdown */}
          <div className="mt-6">
            <button
              className="flex items-center w-full justify-between font-semibold text-sm md:text-base uppercase"
              onClick={() => setHelpOpen(!helpOpen)}
              aria-expanded={helpOpen}
              aria-controls="help-dropdown"
            >
              <span>Can We Help</span>
              <span
                className="text-lg transition-transform"
                style={{
                  transform: helpOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>

            {helpOpen && (
              <ul
                id="help-dropdown"
                className="mt-3 space-y-2 pl-1 text-xs md:text-sm"
              >
                <li>
                  <a href="/contact">Contact Us</a>
                </li>
                <li>
                  <a href="/track-orders">Track Orders</a>
                </li>
                <li>
                  <a href="/hiring">Hiring</a>
                </li>
              </ul>
            )}
          </div>

          {/* Legal Dropdown */}
          <div className="mt-6">
            <button
              className="flex items-center w-full justify-between font-semibold text-sm md:text-base uppercase"
              onClick={() => setLegalOpen(!legalOpen)}
              aria-expanded={legalOpen}
              aria-controls="legal-dropdown"
            >
              <span>Legal</span>
              <span
                className="text-lg transition-transform"
                style={{
                  transform: legalOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>

            {legalOpen && (
              <ul
                id="legal-dropdown"
                className="mt-3 space-y-2 pl-1 text-xs md:text-sm"
              >
                <li>
                  <Link href="/payments-shipping">Payments & Shipping</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/refund-policy">Refund Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms & Conditions</Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="hidden lg:block" />

        {/* Right Column */}
        <div className="mt-10 lg:mt-0 pl-0 lg:-ml-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.5fr_1fr] gap-10">
            <ul className="space-y-6 md:space-y-7">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/stories">Stories</Link>
              </li>
              
            </ul>
            <ul className="space-y-6 md:space-y-7">
              <li>
                <Link href="/care">Care</Link>
              </li>
              <li>
                <a href="mailto:support@samaabysiblings.com">Support</a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/samaacircle"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 text-center">
        <div className="inline-block">
          <div className="h-px bg-white opacity-30 mb-4" />
          <div className="pt-2 text-[10px] sm:text-xs md:text-sm tracking-wide text-white opacity-50">
            © {year} SAMAA by Siblings. All rights reserved.
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease forwards;
        }
      `}</style>
    </footer>
  );
}
