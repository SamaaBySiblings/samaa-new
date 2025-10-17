import TrackOrderPage from '@/app/track-orders/trackPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Track Your Order - SAMAA Candle Delivery",
  description:
    "Track your order from SAMAA—real-time updates on your handcrafted candles, beautifully packed and shipped with care.",
};

export default function Contact() {
  return (
    <main>
      <TrackOrderPage />
    </main>
  );
}
