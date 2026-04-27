import Link from "next/link";
import { ArrowRight, Map, CheckCircle2, MapPin, Sparkles, Camera } from "lucide-react";

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

      {/* Floating UI Elements (Desktop only) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none max-w-7xl mx-auto z-0">
        {/* Floating Card 1: AI Suggestion (Top Left) */}
        <div className="absolute top-32 left-10 xl:left-0 animate-[float_6s_ease-in-out_infinite]">
          <div className="bg-stone-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-64 transform -rotate-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-medium">AI Prediction</p>
                <p className="text-sm text-white font-bold leading-tight">White Wagtail</p>
              </div>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[98%]" />
            </div>
            <p className="text-xs text-emerald-400 mt-2 text-right">98% Confidence</p>
          </div>
        </div>

        {/* Floating Card 2: Location (Bottom Left) */}
        <div className="absolute bottom-32 left-20 xl:left-12 animate-[float-reverse_5s_ease-in-out_infinite]">
          <div className="bg-stone-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-56 transform rotate-3">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center border border-white/5 shrink-0">
                <MapPin className="text-rose-400 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white font-bold leading-tight">Emirgan Park, Istanbul</p>
                <p className="text-xs text-stone-400 mt-0.5">Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Card 3: Observation Image (Top Right) */}
        <div className="absolute top-40 right-10 xl:-right-4 animate-[float_7s_ease-in-out_infinite]">
          <div className="bg-stone-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl w-48 transform rotate-6">
             <div className="aspect-[4/3] bg-stone-800 rounded-xl mb-2 flex items-center justify-center overflow-hidden relative">
                <Camera className="text-stone-600 w-8 h-8 absolute" />
                {/* Fake image gradient to look like a photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-stone-900/50 mix-blend-overlay"></div>
             </div>
             <div className="px-2 pb-1 flex items-center justify-between">
                <div className="w-20 h-2 bg-stone-800 rounded-full"></div>
                <CheckCircle2 className="text-emerald-500 w-4 h-4" />
             </div>
          </div>
        </div>
        
        {/* Floating Card 4: Verified Badge (Bottom Right) */}
        <div className="absolute bottom-40 right-20 xl:right-10 animate-[float-reverse_6s_ease-in-out_infinite]">
          <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 px-5 py-3 rounded-full shadow-2xl shadow-emerald-900/20 transform -rotate-3">
             <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                <p className="text-sm text-emerald-100 font-medium">Research Grade</p>
             </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 pt-32 pb-16">



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
