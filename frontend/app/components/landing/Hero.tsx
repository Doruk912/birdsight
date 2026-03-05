import { ArrowRight, Map, Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-emerald-900/40 blur-[120px]" />
        <div className="absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full bg-teal-900/30 blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-emerald-800/20 blur-[100px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6 pt-28 pb-20">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight text-white">
          Discover & share <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            every bird sighting
          </span>
        </h1>

        {/* Sub-text */}
        <p className="max-w-xl text-lg text-stone-400 leading-relaxed">
          BirdSight connects birdwatchers across the globe. Log your
          observations, explore the map, and build your life list.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <a
            href="#"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-3.5 rounded-full transition-colors duration-200 text-sm shadow-lg shadow-emerald-900/40"
          >
            Start exploring <ArrowRight size={16} />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-full transition-colors duration-200 text-sm border border-white/10"
          >
            <Map size={16} /> View live map
          </a>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-lg mt-4">
          <div className="flex items-center bg-white/10 border border-white/15 rounded-full px-5 py-3 gap-3 focus-within:border-emerald-500/60 transition-colors">
            <Search size={16} className="text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search species, locations, observers…"
              className="bg-transparent outline-none text-sm text-white placeholder:text-stone-500 w-full"
            />
          </div>
        </div>
      </div>

    </section>
  );
}

