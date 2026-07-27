import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = { title: "Consultation Confirmed — CCS Missions" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ consultation?: string }>;
}) {
  const { consultation } = await searchParams;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="glass-panel p-10 max-w-md w-full space-y-6">
        <CheckCircle2 className="w-16 h-16 text-gold mx-auto" />
        <h1 className="font-cinzel text-3xl gold-shimmer uppercase tracking-widest">Mission Authorized</h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          Your consultation request has been received and your payment is confirmed.
          A CCS Missions coordinator will reach out shortly to finalize your visit.
        </p>
        {consultation && (
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Reference: {consultation}</p>
        )}
        <Link
          href="/"
          className="inline-block border-2 border-gold px-8 py-4 text-gold uppercase text-xs tracking-[0.4em] font-bold hover:bg-gold hover:text-black transition-all rounded-lg"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
