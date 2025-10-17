import InternationalPage from '@/app/international/internationalPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Worldwide Delivery - Luxury Candles by SAMAA",
  description:
    "SAMAA ships globally with eco-packaging and full tracking. Discover how we bring soulful light to every corner.",
};

export default function International() {
  return (
    <main>
      <InternationalPage />
    </main>
  );
}
