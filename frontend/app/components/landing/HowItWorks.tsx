import { HOW_IT_WORKS_STEPS } from "@/app/constants/howItWorks";

export default function HowItWorks() {
  return (
    <section className="bg-stone-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            How it works
          </span>
          <h2 className="mt-3 text-4xl font-bold text-stone-900 tracking-tight">
            From sighting to science in five steps
          </h2>
          <p className="mt-4 text-stone-500 text-lg leading-relaxed">
            Every observation you log becomes part of a global, living record of
            bird life — verified by AI and community experts.
          </p>
        </div>

        {/* Step flow */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(10%+28px)] right-[calc(10%+28px)] h-px bg-stone-200 z-0" />

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.step} className="flex flex-col items-center text-center gap-4">
                  {/* Icon bubble */}
                  <div
                    className={`relative w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${step.accent} shadow-sm bg-white`}
                  >
                    <Icon size={24} strokeWidth={1.7} />
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-semibold text-stone-900 text-base">
                      {step.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Mobile arrow connector */}
                  {index < HOW_IT_WORKS_STEPS.length - 1 && (
                    <span className="lg:hidden text-stone-300 text-2xl leading-none select-none">
                      ↓
                    </span>
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

