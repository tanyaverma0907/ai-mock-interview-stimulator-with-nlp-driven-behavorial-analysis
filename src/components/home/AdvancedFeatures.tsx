// ─── AdvancedFeatures.tsx ─────────────────────────────────────────────────────
export const AdvancedFeatures = () => {
  const features = [
    {
      icon: "⚡",
      title: "Real-time Scoring",
      desc: "NLP scoring happens instantly after each answer — no waiting, no batch processing.",
      color: "#f59e0b",
    },
    {
      icon: "🔄",
      title: "Adaptive Difficulty",
      desc: "AI escalates question complexity based on how well you're answering in the session.",
      color: "#8b5cf6",
    },
    {
      icon: "📱",
      title: "Cross-device Sync",
      desc: "Your interview history and analytics sync instantly across all your devices via Firebase.",
      color: "#06b6d4",
    },
    {
      icon: "🛡️",
      title: "Secure & Private",
      desc: "All data is stored with Firebase Auth protection. Your interview data is never shared.",
      color: "#10b981",
    },
    {
      icon: "🌐",
      title: "Offline Mode",
      desc: "Practice even without internet. Answers are queued and synced when you reconnect.",
      color: "#ec4899",
    },
    {
      icon: "📤",
      title: "Export Reports",
      desc: "Download your performance reports as PDF to share with mentors or track offline.",
      color: "#ef4444",
    },
  ];

  return (
    <section className="bg-[#06060f] py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-['Syne',sans-serif]">Advanced</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 font-['Syne',sans-serif]">
            Built for Serious
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-violet-400"> Preparation</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#06060f] p-8 hover:bg-white/2 transition-colors group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-xl"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}25` }}>
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-2 font-['Syne',sans-serif] group-hover:text-violet-300 transition-colors">{f.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};