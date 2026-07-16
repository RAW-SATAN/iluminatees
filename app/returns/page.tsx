import { PolicyPage } from "@/components/PolicyPage";

export const metadata = { title: "Returns & Exchange — ILUMINATEES" };

export default function ReturnsPage() {
  return (
    <PolicyPage title="Returns & Exchange" updated="July 17, 2026">
      {[
        ["Size Exchange", "Wrong size? No problem. WhatsApp us at +91 70554 70321 within 7 days of delivery with your order ID and the size you need. The product must be unworn, unwashed and with original packaging. We arrange pickup and ship the new size once the original is received."],
        ["Damaged / Wrong Item", "If your order arrives damaged, defective or different from what you ordered, send us a photo on WhatsApp within 48 hours of delivery. We refund 100% or ship a replacement — your choice, no questions asked."],
        ["Refund Timeline", "Approved refunds are processed within 5–7 business days to the original payment method (UPI). COD orders are refunded via UPI to the number used on the order."],
        ["What's Not Covered", "Items that are worn, washed, altered, or returned without original packaging. Limited vault drops that sold out cannot be exchanged for a different design — only for a different size of the same design, subject to stock."],
        ["How To Start", "WhatsApp +91 70554 70321 or email help@iluminatees.com with your order ID. We reply within a few hours (11 AM – 7 PM, Mon–Sat)."],
      ]}
    </PolicyPage>
  );
}
