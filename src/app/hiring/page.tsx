import HiringPage from '@/app/hiring/hiringPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Work With SAMAA - Careers in Candle Luxury",
  description:
    "Join our team and help shape conscious, heritage-rooted candle luxury for the global stage.",
};

export default function Contact() {
  return (
    <main>
      <HiringPage />
    </main>
  );
}
