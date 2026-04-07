// ─── Testimonials.tsx ─────────────────────────────────────────────────────────
export const Testimonials = () => {
  const testimonials = [
    {
      name: "Aditya Sharma",
      role: "SDE-2 @ Flipkart",
      avatar: "AS",
      color: "#8b5cf6",
      text: "MockAI's filler word detection was a game changer. I didn't even realize I was saying 'basically' every sentence. After 10 sessions my fluency score went from 52 to 81.",
      score: "81% fluency",
    },
    {
      name: "Priya Nair",
      role: "Frontend Dev @ Razorpay",
      avatar: "PN",
      color: "#ec4899",
      text: "The NLP analysis after each answer tells you exactly what to fix. Not just 'good answer' — it scores clarity, depth, relevance separately. I loved the granularity.",
      score: "94% clarity",
    },
    {
      name: "Rohan Mehta",
      role: "Backend Eng @ Zepto",
      avatar: "RM",
      color: "#10b981",
      text: "Practiced DSA interviews for 3 weeks. The adaptive difficulty kept pushing me. By the time I sat for the real interview, nothing felt surprising. Got the offer first attempt.",
      score: "3 offers in 1 month",
    },
    {
      name: "Sneha Kapoor",
      role: "HR @ Swiggy",
      avatar: "SK",
      color: "#f59e0b",
      text: "Even for HR rounds, MockAI generates behavioral questions with STAR method alignment. The sentiment analysis is surprisingly accurate — it flagged my negative framing.",
      score: "Hired in 2 weeks",
    },
  ];

  return (
    <section className="bg-[#06060f] py-24 relative overflow-hidden">
      <div className="absolute left-1/4 bottom-0 w-96 h-64 bg-violet-700/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-['Syne',sans-serif]">Testimonials</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 font-['Syne',sans-serif]">
            What Candidates{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-br from-violet-400 to-fuchsia-400">Are Saying</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/6 bg-white/2 p-6 hover:border-white/12 transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Quote mark */}
              <div className="text-4xl text-violet-500/20 font-serif leading-none mb-4">"</div>

              <p className="text-gray-300 text-sm leading-relaxed mb-5">{t.text}</p>

              {/* Score badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-5"
                style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
                <span className="text-xs font-bold font-['Syne',sans-serif]" style={{ color: t.color }}>📈 {t.score}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white font-['Syne',sans-serif]"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white font-['Syne',sans-serif]">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
                {/* Stars */}
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};