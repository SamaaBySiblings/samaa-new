"use client";
import { useState } from "react";

export default function ContactPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Call your API endpoint
      const response = await fetch("/api/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Appointment booked successfully! You'll receive a Google Meet link via email.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          message: "",
        });
        // Close modal after 3 seconds
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus({ type: null, message: "" });
        }, 3000);
      } else {
        throw new Error(data.error || "Failed to book appointment");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to book appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
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
            <h3 className="text-sm font-[D-DIN] text-[#4d272e]">
              BOOK A VIRTUAL APPOINTMENT
            </h3>
            <p className="text-xs text-gray-600 mt-5 font-[D-DIN] mb-5 leading-loose">
              Schedule a personalized fragrance consultation with our experts.
              Discover your signature scent in a one-on-one session.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#4d272e] text-white font-[D-DIN] text-xs px-6 py-6 cursor-pointer w-full mb-4 hover:bg-white/80 hover:text-[#4d272e] transition-all duration-300"
            >
              BOOK AN APPOINTMENT
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
            >
              ×
            </button>

            <h2 className="text-xl font-[D-DIN] text-[#4d272e] mb-6">
              Book Your Appointment
            </h2>

            {submitStatus.type && (
              <div
                className={`mb-4 p-3 text-sm ${
                  submitStatus.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-[D-DIN] text-[#4d272e] mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-[D-DIN] focus:outline-none focus:border-[#4d272e]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-[D-DIN] text-[#4d272e] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-[D-DIN] focus:outline-none focus:border-[#4d272e]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-[D-DIN] text-[#4d272e] mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-[D-DIN] focus:outline-none focus:border-[#4d272e]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-[D-DIN] text-[#4d272e] mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-[D-DIN] focus:outline-none focus:border-[#4d272e]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-[D-DIN] text-[#4d272e] mb-2">
                  Preferred Time *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-[D-DIN] focus:outline-none focus:border-[#4d272e]"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-[D-DIN] text-[#4d272e] mb-2">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-[D-DIN] focus:outline-none focus:border-[#4d272e]"
                  placeholder="Tell us about your preferences..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4d272e] text-white font-[D-DIN] text-sm px-6 py-3 hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "BOOKING..." : "CONFIRM APPOINTMENT"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}