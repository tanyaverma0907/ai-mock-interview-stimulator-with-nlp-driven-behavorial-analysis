// ─── AnalyticsPreview.tsx ─────────────────────────────────────────────────────
export const AnalyticsPreview = () => {
  const bars = [
    { label: "Clarity",    val: 82, color: "#8b5cf6" },
    { label: "Fluency",    val: 74, color: "#06b6d4" },
    { label: "Confidence", val: 68, color: "#10b981" },
    { label: "Relevance",  val: 88, color: "#f59e0b" },
    { label: "Depth",      val: 61, color: "#ec4899" },
  ];

  const trend = [45, 52, 48, 61, 67, 72, 74, 82];

  return (
    <section className="bg-[#06060f] py-24 relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-violet-700/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: copy */}
          <div className="space-y-6">
            <span className="text-xs text-violet-400 uppercase tracking-widest font-['Syne',sans-serif]">Analytics Preview</span>
            <h2 className="text-4xl lg:text-5xl font-black text-white font-['Syne',sans-serif] leading-tight">
              Deep Behavioral<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">Metrics Dashboard</span>
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm max-w-md">
              After every interview, our NLP engine breaks down your performance into five key dimensions
              and tracks your trajectory over time. Know exactly where you stand and what to fix.
            </p>
            <ul className="space-y-3">
              {["Per-session NLP score breakdown", "Filler word frequency heatmap", "Role-wise performance ranking", "Score trend over last 8 sessions"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mock dashboard widget */}
          <div className="rounded-3xl border border-white/8 bg-white/2 backdrop-blur-sm p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-['Syne',sans-serif]">Latest Session</p>
                <p className="text-lg font-bold text-white font-['Syne',sans-serif]">Frontend Interview</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-emerald-400 font-['Syne',sans-serif]">82%</p>
                <p className="text-xs text-gray-500">Overall</p>
              </div>
            </div>

            {/* Score bars */}
            <div className="space-y-3">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-['Syne',sans-serif]">{b.label}</span>
                    <span className="font-bold" style={{ color: b.color }}>{b.val}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${b.val}%`, background: b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini trend */}
            <div>
              <p className="text-xs text-gray-500 mb-3 font-['Syne',sans-serif]">Score trend (last 8)</p>
              <div className="flex items-end gap-1 h-16">
                {trend.map((v, i) => (
                  <div key={i} className="flex-1 rounded-t-sm transition-all duration-700"
                    style={{
                      height: `${(v / 100) * 100}%`,
                      background: i === trend.length - 1
                        ? "linear-gradient(to top, #8b5cf6, #d946ef)"
                        : "rgba(139,92,246,0.25)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Filler words */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 w-full font-['Syne',sans-serif]">Filler words detected:</span>
              {["um", "basically", "like", "you know"].map(w => (
                <span key={w} className="text-xs px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300 font-mono">"{w}"</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};