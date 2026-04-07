import { useState } from "react";
export const DemoSection = () => {
  const [activeQ, setActiveQ] = useState(0);

  const demoFlow = [
    {
      role: "Frontend",
      question: "Explain the difference between useMemo and useCallback in React, and when would you prefer one over the other?",
      answer: "useMemo memoizes the return value of a function — useful for expensive calculations. useCallback memoizes the function reference itself — useful when passing callbacks to child components to prevent unnecessary re-renders. I'd use useMemo for computed values and useCallback for event handlers passed as props.",
      scores: { clarity: 88, fluency: 82, depth: 79 },
    },
    {
      role: "DSA",
      question: "Walk me through how you'd find the longest palindromic substring in a string. What's the time complexity?",
      answer: "I'd use the expand-around-center approach. For each character, I expand outward checking if characters match. This handles both odd and even length palindromes. Time: O(n²), Space: O(1). Manacher's algorithm achieves O(n) but is more complex to implement.",
      scores: { clarity: 91, fluency: 85, depth: 88 },
    },
    {
      role: "HR",
      question: "Describe a situation where you had to work with a difficult team member. How did you handle it?",
      answer: "In my previous project, a teammate often missed deadlines. I scheduled a private 1:1 to understand their blockers — turned out they were overwhelmed. We redistributed tasks and I offered daily check-ins. We delivered on time. I learned that conflict is often a communication gap.",
      scores: { clarity: 85, fluency: 90, depth: 75 },
    },
  ];

  const current = demoFlow[activeQ];

  return (
    <section className="bg-[#06060f] py-24 relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 bg-fuchsia-700/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-['Syne',sans-serif]">Live Demo</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 font-['Syne',sans-serif]">
            See MockAI in{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">Action</span>
          </h2>
          <p className="text-gray-500 mt-3 text-sm">Interactive preview of a real interview session</p>
        </div>

        {/* Role tabs */}
        <div className="flex gap-2 mb-6 justify-center">
          {demoFlow.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveQ(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium font-['Syne',sans-serif] transition-all ${
                activeQ === i
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/8"
              }`}
            >
              {d.role}
            </button>
          ))}
        </div>

        {/* Interview window */}
        <div className="rounded-3xl border border-white/8 bg-[#0a0a16] overflow-hidden shadow-2xl">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/30">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs text-gray-600 ml-3 font-mono">MockAI Interview Session — {current.role}</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="p-6 space-y-4">
            {/* AI question */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white shrink-0">AI</div>
              <div className="flex-1 rounded-2xl rounded-tl-none bg-violet-500/10 border border-violet-500/20 p-4">
                <p className="text-sm text-gray-200 leading-relaxed">{current.question}</p>
              </div>
            </div>

            {/* User answer */}
            <div className="flex gap-3 justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-white/5 border border-white/8 p-4">
                <p className="text-sm text-gray-300 leading-relaxed">{current.answer}</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs font-bold text-white shrink-0">U</div>
            </div>

            {/* NLP scores */}
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs text-emerald-400 mb-3 font-['Syne',sans-serif] font-semibold">🧠 NLP Analysis Complete</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(current.scores).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <p className="text-xl font-black text-white font-['Syne',sans-serif]">{val}%</p>
                    <p className="text-xs text-gray-500 capitalize">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};