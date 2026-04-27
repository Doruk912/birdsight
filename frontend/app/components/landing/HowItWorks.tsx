import { HOW_IT_WORKS_STEPS } from "@/app/constants/howItWorks";

export default function HowItWorks() {
  return (
    <section className="bg-stone-50 py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full">
            How it works
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-[1.1]">
            From sighting to science
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              in five steps
            </span>
          </h2>
          <p className="mt-5 text-stone-500 text-lg leading-relaxed">
            Every observation you log becomes part of a global, living record of
            bird life, verified by AI and community experts.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop connector */}
          <div className="hidden lg:block absolute top-[56px] left-0 right-0 z-0 px-[10%]">
            <div className="relative h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent">
              {/* Animated gradient line */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/0 via-emerald-400/60 to-teal-300/0 animate-pulse" />
            </div>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-3 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.step}
                  className="group flex flex-col items-center text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card */}
                  <div className="w-full bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center gap-4">
                    {/* Icon bubble with step number */}
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${step.accent} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon size={26} strokeWidth={1.6} />
                      </div>
                      {/* Step number badge */}
                      <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-stone-50">
                        {step.step}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold text-stone-900 text-base leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-stone-500 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Mobile arrow */}
                  {index < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div className="lg:hidden mt-4 text-stone-300 text-xl select-none">↓</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
