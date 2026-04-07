import { useParams, useNavigate } from "react-router-dom";
import { questions }              from "../data/questions";
import { useInterview }           from "../hooks/useInterview";
import Timer                      from "../components/Timer";
import { useSpeech }              from "../hooks/useSpeech";
// import Navbar from "../components/home/Navbar";

const ROLE_COLORS: Record<string, string> = {
  frontend: "#8b5cf6", backend: "#10b981", fullstack: "#f59e0b",
  hr: "#3b82f6", dsa: "#ef4444", system: "#ec4899",
};

const Interview = () => {
  const { role }    = useParams<{ role: string }>();
  const navigate    = useNavigate();
  const safeRole    = (role ?? "frontend") as keyof typeof questions;
  const questionList = questions[safeRole] ?? questions.frontend;
  const accent       = ROLE_COLORS[safeRole] || "#8b5cf6";

  const { index, answer, setAnswer, next, previous, skip } = useInterview(questionList);
  const { text, setText, startListening, listening }       = useSpeech();

  const currentQuestion = questionList[index];
  const progress        = ((index + 1) / questionList.length) * 100;

  const handleNext = () => {
    const finalAnswer = text || answer;
    const { isLast, updatedAnswers } = next(finalAnswer);
    if (isLast) navigate("/result", { state: { answers: updatedAnswers, questions: questionList, role: safeRole } });
    setText("");
  };

  const handlePrevious = () => { previous(); setText(""); };

  const handleSkip = () => {
    const { isLast, updatedAnswers } = skip();
    if (isLast) navigate("/result", { state: { answers: updatedAnswers, questions: questionList, role: safeRole } });
    setText("");
  };

  return (
    <div className="min-h-screen bg-[#060610] text-white font-['Syne',sans-serif] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      
      {/* Glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px]" style={{ background: `${accent}15` }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-fuchsia-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-2xl">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1.5 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-3 py-1 rounded-full border font-medium capitalize"
              style={{ borderColor: `${accent}60`, color: accent, background: `${accent}15` }}
            >
              {role}
            </span>
            <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Timer onTimeUp={handleNext} />
            </div>
          </div>
        </div>

        {/* ── Card ── */}
        <div className="rounded-3xl border border-white/8 bg-white/3 backdrop-blur-xl p-7 shadow-2xl space-y-6">

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Question {index + 1} of {questionList.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, ${accent}99)` }}
              />
            </div>
          </div>

          {/* Question */}
          <div
            className="rounded-2xl p-5 border"
            style={{ borderColor: `${accent}30`, background: `${accent}08` }}
          >
            <p className="text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: accent }}>
              Question {index + 1}
            </p>
            <h2 className="text-lg font-semibold leading-relaxed text-gray-100">
              {currentQuestion}
            </h2>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              className="w-full h-36 bg-black/30 border border-gray-700/60 rounded-2xl p-4
                         focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30
                         placeholder-gray-600 text-gray-200 text-sm leading-relaxed resize-none
                         transition-all duration-200"
              placeholder="Type your answer here, or click 🎤 to speak..."
              value={text || answer}
              onChange={(e) => { setAnswer(e.target.value); setText(""); }}
            />
            <p className="text-xs text-gray-600 mt-1.5 text-right">
              {(text || answer).trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Listening indicator */}
          {listening && (
            <div className="flex items-center gap-2 text-red-400 text-sm animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Listening... speak now
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrevious}
              disabled={index === 0}
              className="py-3 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-30
                         transition-all duration-150 active:scale-95 text-sm font-medium"
            >
              ← Previous
            </button>

            <button
              onClick={startListening}
              className={`py-3 rounded-xl transition-all duration-150 active:scale-95 text-sm font-medium border
                ${listening
                  ? "bg-red-600/20 border-red-500/40 text-red-300"
                  : "bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/40 text-blue-300"
                }`}
            >
              {listening ? "⏹ Stop" : "🎤 Speak"}
            </button>

            <button
              onClick={handleSkip}
              className="py-3 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 border border-amber-500/30
                         text-amber-300 transition-all duration-150 active:scale-95 text-sm font-medium"
            >
              Skip →
            </button>

            <button
              onClick={handleNext}
              className="py-3 rounded-xl text-white font-semibold text-sm
                         transition-all duration-150 active:scale-95 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 4px 20px ${accent}40` }}
            >
              {index + 1 === questionList.length ? "✅ Finish" : "Next →"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-600">
            💡 Speak clearly with examples for a higher NLP score
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interview;
