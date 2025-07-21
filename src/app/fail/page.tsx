// app/fail/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function FailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-light)] px-6">
      <div className="bg-[#f5f5eb] p-8 rounded shadow max-w-md text-center space-y-5">
        <Image
          src={
            "https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922264/crossmark_hq8vqe.svg"
          }
          alt="Payment Failed"
          width={64}
          height={64}
          className="w-16 mx-auto"
        />
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>

        <p className="text-sm text-gray-700">
          Something went wrong while processing your payment.
          <br />
          This could be due to a network error or the payment being cancelled.
        </p>

        <p className="text-xs text-gray-500">
          If you were charged and still see this page, please reach out to us at{" "}
          <a
            href="mailto:samaabysiblings@gmail.com"
            className="underline text-blue-600 hover:text-blue-800"
          >
            samaabysiblings@gmail.com
          </a>
        </p>

        <Link
          href="/checkout"
          className="inline-block bg-red-600 text-white px-6 py-2 text-sm rounded hover:bg-red-700 transition duration-200"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
