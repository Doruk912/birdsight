import { CITIZEN_SCIENCE_PILLARS } from "@/app/constants/citizenSciencePillars";

export default function CitizenScience() {
  return (
    <section className="bg-stone-950 py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full bg-emerald-900/25 blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full bg-teal-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Citizen science
          </span>
          <h2 className="mt-3 text-4xl font-bold text-white tracking-tight leading-tight">
            Science powered by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              everyday people
            </span>
          </h2>
          <p className="mt-4 text-stone-400 text-lg leading-relaxed">
            You don&apos;t need a laboratory. When birdwatchers like you log
            what they see, that data becomes part of the world&apos;s largest
            living record of wildlife, and real science happens as a result.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIZEN_SCIENCE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col gap-4 hover:bg-white/[0.08] transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-800/60 flex items-center justify-center shrink-0">
                  <Icon
                    size={20}
                    className="text-emerald-400"
                    strokeWidth={1.7}
                  />
                </div>
                <h3 className="font-semibold text-white text-base leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
