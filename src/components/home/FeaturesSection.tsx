
export const FeaturesSection = () => {
  const features = [
    {
      icon: "🧠",
      title: "NLP Behavioral Analysis",
      desc: "Real-time analysis of fluency, clarity, confidence, relevance and depth using advanced natural language processing.",
      tag: "Core",
      color: "#8b5cf6",
    },
    {
      icon: "🎙️",
      title: "Filler Word Detection",
      desc: "Identifies overused filler words like 'um', 'uh', 'like', 'basically' so you can eliminate them before the real interview.",
      tag: "NLP",
      color: "#ec4899",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      desc: "Score trend charts across all sessions. See how your fluency, clarity and depth improve over time.",
      tag: "Analytics",
      color: "#10b981",
    },
    {
      icon: "🎯",
      title: "Role-Specific Questions",
      desc: "AI generates questions tailored to your role — from React hooks for Frontend to CAP theorem for System Design.",
      tag: "AI",
      color: "#f59e0b",
    },
    {
      icon: "🔥",
      title: "Streak & Performance",
      desc: "Track your daily practice streaks and maintain consistency. The platform rewards disciplined preparation.",
      tag: "Gamification",
      color: "#ef4444",
    },
    {
      icon: "💾",
      title: "Firebase-Backed History",
      desc: "Every answer, every question, every score — stored securely in Firebase and accessible from any device.",
      tag: "Storage",
      color: "#06b6d4",
    },
  ];

  return (
    <section className="bg-[#06060f] py-24 relative">
      <div className="absolute right-0 top-0 w-96 h-96 bg-fuchsia-700/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-['Syne',sans-serif]">Platform Features</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 font-['Syne',sans-serif]">
            Everything You Need to<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-400 to-pink-400">Ace Any Interview</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-white/6 bg-white/2 p-6 hover:border-white/15 hover:bg-white/4 transition-all duration-300 cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
                >
                  {f.icon}
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider font-['Syne',sans-serif]"
                  style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }}
                >
                  {f.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-['Syne',sans-serif]">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>

              {/* Hover indicator bar */}
              <div className="mt-4 h-0.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full w-0 group-hover:w-full transition-all duration-700"
                  style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};