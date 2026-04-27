import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="bg-stone-950 py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-900/40 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <Image
          src="/icon.svg"
          alt="BirdSight"
          width={72}
          height={72}
          className="w-18 h-18 object-contain drop-shadow-lg"
        />
        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Ready to start your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            birdwatching journey?
          </span>
        </h2>
        <p className="text-stone-400 text-lg max-w-xl leading-relaxed">
          Join thousands of nature lovers already using BirdSight. It&apos;s
          free, open, and built by the community, for the community.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm shadow-lg shadow-emerald-900/50"
          >
            Create free account <ArrowRight size={16} />
          </Link>
          <Link
            href="/observations"
            className="text-sm font-medium text-stone-400 hover:text-white transition-colors"
          >
            Browse without signing up →
          </Link>
        </div>
      </div>
    </section>
  );
}
