import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-emerald-900/35 blur-[130px]" />
        <div className="absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full bg-teal-900/25 blur-[130px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-emerald-800/15 blur-[100px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 pt-32 pb-24">



        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-[72px] font-bold leading-[1.06] tracking-tight text-white">
          Discover &amp; share{" "}
          <br className="hidden sm:block" />
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-[length:200%_auto] animate-shimmer"
          >
            every bird sighting
          </span>
        </h1>

        {/* Sub-text */}
        <p className="max-w-xl text-lg text-stone-400 leading-relaxed">
          BirdSight connects birdwatchers across the globe. Log your
          observations, get AI-powered species suggestions, and build a
          verified life list.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/observations"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 text-sm shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/70 hover:-translate-y-0.5"
          >
            Start exploring <ArrowRight size={16} />
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 text-sm border border-white/15 hover:border-white/25"
          >
            <Map size={16} /> View live map
          </Link>
        </div>


      </div>


    </section>
  );
}
