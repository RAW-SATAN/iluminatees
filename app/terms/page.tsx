import { PolicyPage } from "@/components/PolicyPage";

export const metadata = { title: "Terms & Conditions — ILUMINATEES" };

export default function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions" updated="July 17, 2026">
      {[
        ["About Us", "ILUMINATEES is an India-based streetwear brand selling limited-run graphic t-shirts through this website (iluminatees.com). By placing an order you agree to these terms."],
        ["Orders & Pricing", "All prices are in Indian Rupees (INR) and include applicable taxes. An order is confirmed once we verify it with you on WhatsApp or call. We reserve the right to cancel orders in case of pricing errors, stock unavailability or suspected fraud — any amount paid will be fully refunded."],
        ["Payments", "We accept UPI payments (prepaid, with the displayed discount). Prepaid orders are processed after the payment is verified. Payment is made directly to our UPI ID — we never ask for your PIN, OTP or card details."],
        ["Shipping & Delivery", "Orders ship Pan-India within 3–5 business days. Delivery timelines are estimates and may vary with courier delays. See our Shipping Policy for details."],
        ["Returns & Exchange", "Size exchange is available within 7 days of delivery. Damaged or wrong items are refunded 100%. See our Returns & Exchange policy for the full process."],
        ["Intellectual Property", "All designs, artwork and content on this site are the property of ILUMINATEES and may not be reproduced or resold without written permission."],
        ["Contact", "Questions about these terms: help@iluminatees.com or WhatsApp +91 70554 70321."],
      ]}
    </PolicyPage>
  );
}
