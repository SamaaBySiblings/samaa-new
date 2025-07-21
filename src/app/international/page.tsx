"use client";

import { useEffect, useState } from "react";

export default function InternationalPage() {
  const countries = [
    { name: "India", flag: "🇮🇳" },
    { name: "United States", flag: "🇺🇸" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "UAE", flag: "🇦🇪" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "New Zealand", flag: "🇳🇿" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "Sweden", flag: "🇸🇪" },
    { name: "Switzerland", flag: "🇨🇭" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    favoriteProduct: "",
    deliveryService: "",
    customDeliveryService:""
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % countries.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your request! We'll be in touch.");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922251/bg-img_ebqfdo.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 z-0" />

      <div className="relative z-10 pt-24 pb-20 px-6 md:px-20 flex flex-col md:flex-row items-start justify-between gap-10 text-white">
        {/* Left Column: Heading */}
        <div className="w-full md:w-2/5 text-left mt-30 pl-25">
          <h1 className="font-[TANTanglon] text-3xl md:text-4xl  tracking-widest mb-2">
            Bring Samaa
          </h1>
          <h2 className="text-2xl md:text-3xl font-[D-DIN] tracking-widest inline-flex items-center gap-3">
            to {countries[currentIndex].name}
            <span className="text-4xl md:text-5xl font-[D-DIN] ">
              {countries[currentIndex].flag}
            </span>
          </h2>
        </div>

        {/* Right Column: Glassy Form */}
        <div
          className="w-full md:w-2/5 max-w-md p-10 mt-10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={handleSubmit} className="text-white space-y-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full px-4 py-3 font-[D-DIN]  text-sm text-left bg-transparent border-b border-white placeholder-white placeholder:text-left placeholder:opacity-70 focus:outline-none"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-3 font-[D-DIN]  text-sm text-left bg-transparent border-b border-white placeholder-white placeholder:text-left placeholder:opacity-70 focus:outline-none"
            />

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="w-full px-4 py-3 font-[D-DIN]  text-sm text-left bg-transparent border-b border-white placeholder-white placeholder:text-left placeholder:opacity-70 focus:outline-none"
            />

            <input
              type="text"
              name="favoriteProduct"
              value={form.favoriteProduct}
              onChange={handleChange}
              placeholder="Favorite Samaa Product"
              required
              className="w-full px-4 py-3 text-sm font-[D-DIN]  text-left bg-transparent border-b border-white placeholder-white placeholder:text-left placeholder:opacity-70 focus:outline-none"
            />

            <select
              name="deliveryService"
              value={form.deliveryService}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-sm font-[D-DIN]  text-left bg-transparent border-b border-white text-white focus:outline-none"
            >
              <option value="" disabled>
                Preferred Delivery Service
              </option>
              <option value="FedEx" className="font-[D-DIN] ">
                📦 FedEx
              </option>
              <option value="DHL" className="font-[D-DIN] ">
                🚚 DHL
              </option>
              <option value="India Post" className="font-[D-DIN] ">
                📮 India Post
              </option>
              <option value="Delhivery" className="font-[D-DIN] ">
                📫 Delhivery
              </option>
              <option value="Aramex" className="font-[D-DIN] ">
                🌍 Aramex
              </option>
              <option value="Other" className="font-[D-DIN] ">
                ❓ Other
              </option>
            </select>

            {/* Conditionally show input for "Other" option */}
            {form.deliveryService === "Other" && (
              <input
                type="text"
                name="customDeliveryService"
                value={form.customDeliveryService || ""}
                onChange={(e) =>
                  setForm({ ...form, customDeliveryService: e.target.value })
                }
                placeholder="Enter preferred courier"
                className="w-full px-4 py-3 text-sm text-left bg-transparent border-b border-white placeholder-white/70 focus:outline-none"
                required
              />
            )}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-white font-[D-DIN]  text-xs text-black  transition-colors hover:bg-black hover:text-white"
            >
              SUBMIT REQUEST
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
