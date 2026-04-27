const stats = [
  { value: "1.2M+", label: "Observations" },
  { value: "9,400+", label: "Species logged" },
  { value: "48K+", label: "Community members" },
  { value: "140+", label: "Countries covered" },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-y border-stone-100">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-stone-900 tracking-tight">
              {stat.value}
            </span>
            <span className="text-sm text-stone-500">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
