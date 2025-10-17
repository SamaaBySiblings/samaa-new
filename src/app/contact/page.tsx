import ContactPage from '@/app/contact/conatctPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact SAMAA - Global Candle Support",
  description:
    "Reach out for help, collaborations, or inquiries. SAMAA offers worldwide support for your candle experience.",
};

export default function Contact() {
  return (
    <main>
      <ContactPage />
    </main>
  );
}
