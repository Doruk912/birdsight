import Image from "next/image";
import { HOW_IT_WORKS_STEPS } from "@/app/constants/howItWorks";

export default function HowItWorks() {
  return (
    <section className="bg-stone-50 py-12 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full">
            How it works
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-[1.1]">
            From sighting to science
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
              in five steps
            </span>
          </h2>
          <p className="mt-5 text-stone-500 text-base leading-relaxed">
            Every observation you log becomes part of a global, living record of
            bird life, verified by AI and community experts.
          </p>
        </div>

        {/* Steps - Zig Zag Layout */}
        <div className="flex flex-col gap-10 lg:gap-12 relative">
          {/* Vertical connecting line (mobile only) */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-stone-200 lg:hidden" />

          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 1; // 0-indexed, so 1 is even step 2

            return (
              <div
                key={step.step}
                className={`relative flex flex-col ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-16`}
              >
                {/* Content Side */}
                <div className="flex-1 w-full lg:w-1/2 relative z-10 pl-16 lg:pl-0">
                  {/* Mobile step dot */}
                  <div
                    className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-stone-50 bg-emerald-500 flex items-center justify-center lg:hidden`}
                  >
                    <span className="text-white text-xs font-bold">
                      {step.step}
                    </span>
                  </div>

                  <div
                    className={`flex flex-col gap-4 max-w-sm ${isEven ? "lg:ml-auto" : ""}`}
                  >
                    {/* Icon & Step Badge */}
                    <div className="hidden lg:flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${step.accent} shadow-sm`}
                      >
                        <Icon size={22} strokeWidth={1.8} />
                      </div>
                      <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">
                        Step {step.step}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold text-stone-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-stone-500 text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className="flex-1 w-full lg:w-1/2">
                  <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-white border border-stone-100 shadow-lg shadow-stone-200/50">
                    {step.image && (
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {/* Subtle gradient overlay to make it blend well */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
