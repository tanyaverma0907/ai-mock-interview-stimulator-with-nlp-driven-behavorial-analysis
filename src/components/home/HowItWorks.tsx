// ─── HowItWorks.tsx ───────────────────────────────────────────────────────────
export const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Choose Your Role",
      desc: "Select from Frontend, Backend, DSA, System Design, HR, or Full Stack to get role-specific questions.",
      icon: "🎯",
      color: "from-violet-500 to-violet-700",
    },
    {
      num: "02",
      title: "AI Interviews You",
      desc: "Our LLM-powered AI asks contextually relevant questions, adapting difficulty based on your responses.",
      icon: "🤖",
      color: "from-fuchsia-500 to-fuchsia-700",
    },
    {
      num: "03",
      title: "Answer & Record",
      desc: "Type or speak your answers. Each response is saved to your profile for NLP behavioral analysis.",
      icon: "🎙️",
      color: "from-pink-500 to-pink-700",
    },
    {
      num: "04",
      title: "Get Deep Insights",
      desc: "Receive clarity, fluency, confidence, and depth scores with actionable improvement tips.",
      icon: "📊",
      color: "from-cyan-500 to-cyan-700",
    },
  ];

  return (
    <section id="about" className="bg-[#06060f] py-24 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-['Syne',sans-serif]">How It Works</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 font-['Syne',sans-serif] leading-tight">
            Four Steps to<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">Interview Mastery</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            From role selection to detailed behavioral analytics — the entire pipeline is automated and AI-driven.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative group"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="rounded-3xl border border-white/8 bg-white/2 backdrop-blur-sm p-6 h-full hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-400 group-hover:-translate-y-1">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center text-xl shadow-lg`}>
                      {step.icon}
                    </div>
                    <span className="text-3xl font-black text-white/5 font-['Syne',sans-serif]">{step.num}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 font-['Syne',sans-serif]">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};