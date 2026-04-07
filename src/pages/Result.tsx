// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useRef } from "react";
// import { saveInterview } from "../utils/db";
// import { useAuth } from "../hooks/useAuth";

// const Result = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const user = useAuth();

//   const hasSaved = useRef(false); // ✅ prevent double save

//   // ✅ localStorage fallback
//   const stored = localStorage.getItem("interviewData");
//   const parsed = stored ? JSON.parse(stored) : {};

//   const questions = state?.questions || parsed.questions || [];
//   const answers = state?.answers || parsed.answers || [];
//   const role = state?.role || parsed.role || "unknown";

//   // ✅ Save to localStorage (refresh safe)
//   useEffect(() => {
//     if (state) {
//       localStorage.setItem(
//         "interviewData",
//         JSON.stringify({
//           questions,
//           answers,
//           role,
//         })
//       );
//     }
//   }, [state]);

//   // 🔥 SAVE TO FIREBASE (FINAL FIXED)
//   useEffect(() => {
//     if (hasSaved.current) return;

//     console.log("🔥 Firebase useEffect triggered");

//     if (questions.length === 0) {
//       console.log("❌ No questions");
//       return;
//     }

//     const uid = user?.uid || "testUser123";

//     console.log("✅ Saving with UID:", uid);

//     saveInterview(uid, {
//       role,
//       questions,
//       answers,
//     });

//     hasSaved.current = true; // ✅ stop duplicate save
//   }, [user, questions]);

//   return (
//     <div className="min-h-screen bg-linear-to-br from-[#0f0f0f] via-[#111827] to-[#020617] text-white px-4 py-10 flex justify-center">

//       {/* Glow Background */}
//       <div className="absolute w-125 h-125 bg-purple-600/20 blur-[120px] rounded-full top-10 left-10"></div>
//       <div className="absolute w-100 h-100 bg-blue-600/20 blur-[100px] rounded-full bottom-10 right-10"></div>

//       {/* Card */}
//       <div className="relative w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] space-y-8">

//         {/* Header */}
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
//             🎉 Interview Completed
//           </h1>
//           <p className="text-gray-400 text-sm">
//             Here are your responses
//           </p>
//         </div>

//         {/* Empty State */}
//         {questions.length === 0 ? (
//           <div className="text-center text-gray-400">
//             No interview data found 😢
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {questions.map((q: string, i: number) => (
//               <div
//                 key={i}
//                 className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-5 shadow-inner hover:scale-[1.01] transition-all duration-300"
//               >
//                 <p className="text-sm text-gray-400 mb-2">
//                   Question {i + 1}
//                 </p>

//                 <p className="text-lg font-medium text-gray-100 mb-3">
//                   {q}
//                 </p>

//                 <div className="bg-black/40 border border-gray-700 rounded-xl p-3">
//                   <p className="text-gray-300 text-sm leading-relaxed">
//                     {answers[i] || "No answer provided"}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex gap-4">
//           <button
//             onClick={() => navigate("/")}
//             className="flex-1 bg-gray-800 hover:bg-gray-700 transition-all duration-300 py-3 rounded-2xl"
//           >
//             🔄 Retake Interview
//           </button>

//           <button
//             onClick={() => alert("AI Feedback coming soon 🚀")}
//             className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all duration-300 py-3 rounded-2xl"
//           >
//             🤖 Get AI Feedback
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Result;

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { saveInterview } from "../utils/db";
import { useAuth } from "../hooks/useAuth";
import { analyzeAnswerNLP } from "../utils/nlp";

const scoreColor = (n: number) =>
  n >= 75 ? "text-emerald-400" : n >= 50 ? "text-amber-400" : "text-red-400";

const scoreBg = (n: number) =>
  n >= 75 ? "bg-emerald-500/10 border-emerald-500/30" :
  n >= 50 ? "bg-amber-500/10  border-amber-500/30"  :
            "bg-red-500/10    border-red-500/30";

const Result = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const user      = useAuth();
  const hasSaved  = useRef(false);

  // ── Restore from localStorage on refresh ────────────────────────────────
  const stored = localStorage.getItem("interviewData");
  const parsed = stored ? JSON.parse(stored) : {};

  const questions: string[] = state?.questions || parsed.questions || [];
  const answers:   string[] = state?.answers   || parsed.answers   || [];
  const role:      string   = state?.role      || parsed.role      || "unknown";

  // ── Persist to localStorage ──────────────────────────────────────────────
  useEffect(() => {
    if (state) localStorage.setItem("interviewData", JSON.stringify({ questions, answers, role }));
  }, [state]);

  // ── Save to Firebase ─────────────────────────────────────────────────────
  useEffect(() => {
    if (hasSaved.current || questions.length === 0) return;
    hasSaved.current = true;
    const uid = user?.uid || "guest";
    saveInterview(uid, { role, questions, answers });
  }, [user, questions]);

  // ── NLP analysis ─────────────────────────────────────────────────────────
  const nlp = analyzeAnswerNLP(answers, questions, role);

  const NLP_SCORES = [
    { label: "Overall",    val: nlp.overallScore,    icon: "🎯" },
    { label: "Clarity",    val: nlp.clarityScore,    icon: "💡" },
    { label: "Fluency",    val: nlp.fluencyScore,    icon: "🌊" },
    { label: "Confidence", val: nlp.confidenceScore, icon: "💪" },
    { label: "Relevance",  val: nlp.relevanceScore,  icon: "🎯" },
    { label: "Depth",      val: nlp.depthScore,      icon: "🔍" },
  ];

  const answeredCount = answers.filter(a => a && a !== "SKIPPED").length;

  return (
    <div className="min-h-screen bg-[#060610] text-white font-['Syne',sans-serif] px-4 py-10 relative">

      {/* Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 text-3xl mb-4">
            🎉
          </div>
          <h1 className="text-3xl font-bold mb-1">Interview Complete!</h1>
          <p className="text-gray-400 text-sm capitalize">
            {role} · {answeredCount}/{questions.length} answered
            {nlp.skippedCount > 0 && ` · ${nlp.skippedCount} skipped`}
          </p>
        </div>

        {/* ── NLP Score cards ── */}
        <div className="grid grid-cols-3 gap-3">
          {NLP_SCORES.map(s => (
            <div key={s.label} className={`rounded-2xl border p-4 text-center ${scoreBg(s.val)} animate-fade-in`}>
              <p className="text-xs text-gray-500 mb-1">{s.icon} {s.label}</p>
              <p className={`text-3xl font-bold tabular-nums ${scoreColor(s.val)}`}>{s.val}</p>
              <p className="text-gray-600 text-xs">/ 100</p>
              {/* Mini bar */}
              <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${s.val}%`,
                    background: s.val >= 75 ? "#10b981" : s.val >= 50 ? "#f59e0b" : "#ef4444"
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Filler words ── */}
        {nlp.topFillerWords.length > 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm font-semibold text-amber-300 mb-3">⚠️ Filler Words Detected</p>
            <div className="flex flex-wrap gap-2">
              {nlp.topFillerWords.map(fw => (
                <span key={fw} className="text-xs px-3 py-1 rounded-lg bg-amber-900/30 border border-amber-700/40 text-amber-300 font-mono">
                  "{fw}"
                </span>
              ))}
            </div>
            <p className="text-xs text-amber-600/70 mt-2">Try to reduce these in your next interview</p>
          </div>
        )}

        {/* ── Sentiment ── */}
        <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
          nlp.sentiment === "positive" ? "border-emerald-500/20 bg-emerald-500/5" :
          nlp.sentiment === "negative" ? "border-red-500/20 bg-red-500/5" :
          "border-gray-500/20 bg-gray-500/5"
        }`}>
          <span className="text-2xl">
            {nlp.sentiment === "positive" ? "😊" : nlp.sentiment === "negative" ? "😟" : "😐"}
          </span>
          <div>
            <p className="text-sm font-medium capitalize">
              {nlp.sentiment === "positive" ? "Positive tone detected!" : nlp.sentiment === "negative" ? "Tone felt negative" : "Neutral tone"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Avg word count per answer: {nlp.avgWordCount} words
            </p>
          </div>
        </div>

        {/* ── Q&A List ── */}
        {questions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Your Answers</h2>
            {questions.map((q, i) => (
              <div key={i} className="rounded-2xl border border-white/8 bg-white/3 p-5 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <p className="text-xs text-gray-500 mb-1 font-medium">Q{i + 1}</p>
                <p className="text-sm font-semibold text-gray-200 mb-3">{q}</p>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {answers[i] === "SKIPPED"
                      ? <span className="text-yellow-600 italic">Skipped</span>
                      : answers[i] || <span className="italic text-gray-600">No answer given</span>
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA Buttons ── */}
        <div className="grid grid-cols-2 gap-4 pb-8">
          <button
            onClick={() => navigate("/")}
            className="py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all text-sm font-medium"
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="py-3 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600
                       hover:opacity-90 transition-all text-sm font-semibold
                       shadow-lg shadow-violet-900/40"
          >
            📊 View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;