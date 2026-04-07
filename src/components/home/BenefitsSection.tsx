// ─── BenefitsSection.tsx ──────────────────────────────────────────────────────
export const BenefitsSection = () => {
  const benefits = [
    {
      metric: "3×",
      label: "More confident",
      desc: "Users report 3x more confidence in real interviews after 5 MockAI sessions.",
      icon: "💪",
    },
    {
      metric: "68%",
      label: "Offer rate",
      desc: "68% of regular MockAI users reported receiving job offers within 3 months.",
      icon: "🎉",
    },
    {
      metric: "∞",
      label: "Practice rounds",
      desc: "No interview limits. Practice until you feel fully ready, anytime.",
      icon: "🔁",
    },
    {
      metric: "5min",
      label: "Setup time",
      desc: "Zero configuration. Select a role, start answering — insights delivered immediately.",
      icon: "⚡",
    },
  ];

  return (
    <section className="bg-[#06060f] py-24 relative overflow-hidden">
      <div className="absolute right-0 top-1/4 w-80 h-80 bg-emerald-700/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-['Syne',sans-serif]">Results</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 font-['Syne',sans-serif]">
            Why Candidates{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">Choose MockAI</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/6 bg-white/2 p-8 text-center hover:border-white/15 transition-all hover:-translate-y-1 duration-300 group"
            >
              <div className="text-3xl mb-4">{b.icon}</div>
              <p className="text-5xl font-black text-white font-['Syne',sans-serif] mb-1 group-hover:text-violet-300 transition-colors">{b.metric}</p>
              <p className="text-sm font-semibold text-gray-300 mb-3 font-['Syne',sans-serif]">{b.label}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
