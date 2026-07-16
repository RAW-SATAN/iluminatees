import { PolicyPage } from "@/components/PolicyPage";

export const metadata = { title: "Privacy Policy — ILUMINATEES" };

export default function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy" updated="July 17, 2026">
      {[
        ["Information We Collect", "When you place an order we collect your name, phone number, delivery address and order details. When you subscribe to our newsletter we collect your email address. We do not collect or store card numbers, UPI PINs or any payment credentials — payments happen directly in your UPI app."],
        ["How We Use It", "Your information is used only to process and deliver your order, contact you about it (via WhatsApp, SMS or call), and — if you subscribed — to send occasional drop announcements. We never sell or share your data with third parties for marketing."],
        ["Data Storage", "Order data is stored securely in our database and is accessible only to the store owner. You can request deletion of your data anytime by contacting help@iluminatees.com."],
        ["Cookies & Analytics", "We use basic analytics and advertising pixels (such as Meta Pixel) to understand site usage and measure our ads. These may set cookies in your browser. No personally identifiable information is shared with these services beyond standard analytics events."],
        ["Contact", "For any privacy question or data-deletion request, email help@iluminatees.com or WhatsApp +91 70554 70321."],
      ]}
    </PolicyPage>
  );
}
