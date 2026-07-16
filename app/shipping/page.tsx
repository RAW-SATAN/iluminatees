import { PolicyPage } from "@/components/PolicyPage";

export const metadata = { title: "Shipping Policy — ILUMINATEES" };

export default function ShippingPage() {
  return (
    <PolicyPage title="Shipping Policy" updated="July 17, 2026">
      {[
        ["Coverage", "We ship Pan-India to all serviceable pincodes via trusted courier partners. Shipping is FREE on every order — no minimum."],
        ["Timelines", "Orders placed before 2 PM ship the same day. Delivery takes 3–5 business days for metros and 4–7 business days for other locations. You'll receive tracking details on WhatsApp once your order ships."],
        ["Order Tracking", "Track your order anytime on our Track Order page using your order ID and phone number, or WhatsApp us for a live update."],
        ["Delays", "Courier delays due to weather, strikes or remote locations are occasionally out of our hands — if your order is taking longer than expected, message us and we'll chase it down."],
        ["Contact", "Shipping questions: help@iluminatees.com or WhatsApp +91 70554 70321."],
      ]}
    </PolicyPage>
  );
}
