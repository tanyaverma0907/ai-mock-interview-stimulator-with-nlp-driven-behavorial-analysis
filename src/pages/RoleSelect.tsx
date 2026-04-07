import { useNavigate } from "react-router-dom";
import { useAuth }     from "../hooks/useAuth";

const roles = [
  { title: "Frontend",      icon: "💻", desc: "React, JavaScript, UI concepts",        path: "/interview/frontend", accent: "#8b5cf6", glow: "hover:shadow-violet-500/20" },
  { title: "Backend",       icon: "🗄️", desc: "Node.js, APIs, Databases",              path: "/interview/backend",  accent: "#10b981", glow: "hover:shadow-emerald-500/20" },
  { title: "Full Stack",    icon: "🚀", desc: "Frontend + Backend combined",            path: "/interview/fullstack",accent: "#f59e0b", glow: "hover:shadow-amber-500/20" },
  { title: "HR",            icon: "🧑‍💼", desc: "Behavioral & communication",           path: "/interview/hr",       accent: "#3b82f6", glow: "hover:shadow-blue-500/20" },
  { title: "DSA",           icon: "🧠", desc: "Problem solving & algorithms",           path: "/interview/dsa",      accent: "#ef4444", glow: "hover:shadow-red-500/20" },
  { title: "System Design", icon: "🏗️", desc: "Scalable systems & architecture",       path: "/interview/system",   accent: "#ec4899", glow: "hover:shadow-pink-500/20" },
];

const RoleSelect = () => {
  const navigate = useNavigate();
  const user     = useAuth();

  return (
    <div className="min-h-screen bg-[#060610] text-white font-['Syne',sans-serif] relative overflow-hidden">

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-125 h-125 bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-700/8 rounded-full blur-[100px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-900/40">
            M
          </div>
          <span className="font-bold text-lg tracking-tight">MockAI</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-gray-400 text-sm hidden sm:block">{user.displayName || user.email}</span>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm px-4 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 transition-all"
              >
                📊 Dashboard
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-sm px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-5xl">

          {/* ── Header ── */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
              AI-Powered Interview Practice
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Ace your next
              <br />
              <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                interview
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
              Practice with AI-driven questions, get NLP feedback, and track your progress over time.
            </p>
          </div>

          {/* ── Role grid ── */}
          <div className="grid md:grid-cols-3 gap-5">
            {roles.map((role, i) => (
              <button
                key={i}
                onClick={() => navigate(role.path)}
                className={`
                  group text-left rounded-2xl p-6 border border-white/8 bg-white/3
                  hover:bg-white/6 backdrop-blur-sm
                  transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                  ${role.glow} shadow-lg
                  animate-fade-in
                `}
                style={{
                  animationDelay: `${i * 80}ms`,
                  borderColor: `${role.accent}22`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${role.accent}22`, border: `1px solid ${role.accent}44` }}
                >
                  {role.icon}
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">
                  {role.title}
                </h2>

                {/* Desc */}
                <p className="text-gray-500 text-sm leading-relaxed">{role.desc}</p>

                {/* Arrow */}
                <div
                  className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
                  style={{ color: role.accent }}
                >
                  Start Interview →
                </div>
              </button>
            ))}
          </div>

          {/* ── Stats row ── */}
          <div className="flex items-center justify-center gap-8 mt-12 text-center">
            {[
              { label: "Interview Roles",  val: "6+" },
              { label: "Questions Each",   val: "10" },
              { label: "NLP Metrics",      val: "5" },
              { label: "Real-time Feedback", val: "✓" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-violet-300">{s.val}</p>
                <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoleSelect;