import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ReactivatePage({ params }: Props) {
  const { slug } = await params;
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Account Suspended</h2>
        <p className="text-[#64748B] text-sm mb-6">
          Your account has been suspended due to a payment failure. Your data is safe and will be retained.
          Subscribe to a plan to reactivate your account immediately.
        </p>
        <Link
          href={`/app/${slug}/billing/subscribe`}
          className="block w-full bg-[#E94560] text-white py-3 rounded-xl font-semibold hover:bg-[#d63d57] transition"
        >
          Reactivate Account
        </Link>
      </div>
    </div>
  );
}
