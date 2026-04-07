// ─── QuickStartCard.tsx ───────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = [
  { id: "frontend",  label: "Frontend",     icon: "💻", color: "#8b5cf6", desc: "React, CSS, JS" },
  { id: "backend",   label: "Backend",      icon: "🗄️", color: "#10b981", desc: "APIs, DBs, Node" },
  { id: "fullstack", label: "Full Stack",   icon: "🚀", color: "#f59e0b", desc: "End-to-end Dev" },
  { id: "dsa",       label: "DSA",          icon: "🧠", color: "#ef4444", desc: "Algorithms & DS" },
  { id: "system",    label: "System Design",icon: "🏗️", color: "#ec4899", desc: "Scalability" },
  { id: "hr",        label: "HR Round",     icon: "🧑‍💼", color: "#3b82f6", desc: "Behavioral" },
];

export const QuickStartCard = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section className="bg-[#06060f] py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-white/8 bg-linear-to-br from-white/3 to-violet-500/3 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs text-violet-400 uppercase tracking-widest font-['Syne',sans-serif]">Quick Start</span>
            </div>
            <h2 className="text-2xl font-black text-white font-['Syne',sans-serif]">Choose Your Interview Role</h2>
            <p className="text-gray-500 text-sm mt-1">Select a role and jump straight into your AI-powered mock interview</p>
          </div>

          {/* Role grid */}
          <div className="p-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ROLES.map(role => (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`relative p-4 rounded-2xl text-left transition-all duration-300 border group ${
                  selected === role.id
                    ? "border-transparent scale-[0.98]"
                    : "border-white/8 hover:border-white/15 hover:scale-[0.99]"
                }`}
                style={selected === role.id ? {
                  background: `${role.color}18`,
                  borderColor: `${role.color}60`,
                  boxShadow: `0 0 30px ${role.color}20`,
                } : {}}
              >
                {selected === role.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" style={{ color: role.color }} viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                )}
                <span className="text-2xl mb-2 block">{role.icon}</span>
                <p className="text-sm font-bold text-white font-['Syne',sans-serif]">{role.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
              </button>
            ))}
          </div>

          {/* Start button */}
          <div className="px-8 pb-8">
            <button
              disabled={!selected}
              // onClick={() => selected && navigate(`/interview?role=${selected}`)}
              onClick={() => selected && navigate(`/interview/${selected}`)}
              className={`w-full py-4 rounded-2xl font-bold text-sm font-['Syne',sans-serif] transition-all duration-300 ${
                selected
                  ? "text-white cursor-pointer hover:scale-[1.01]"
                  : "text-gray-600 bg-white/3 border border-white/5 cursor-not-allowed"
              }`}
              style={selected ? {
                background: `linear-gradient(135deg, ${ROLES.find(r => r.id === selected)?.color}, ${ROLES.find(r => r.id === selected)?.color}99)`,
                boxShadow: `0 8px 32px ${ROLES.find(r => r.id === selected)?.color}40`,
              } : {}}
            >
              {selected
                ? `Start ${ROLES.find(r => r.id === selected)?.label} Interview →`
                : "Select a role to continue"
              }
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};





