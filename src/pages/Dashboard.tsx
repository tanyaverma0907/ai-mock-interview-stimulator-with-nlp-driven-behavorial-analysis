import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from "../hooks/useAuth";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell,
} from "recharts";
import { analyzeAnswerNLP, type NLPResult } from "../utils/nlp";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/home/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────
interface InterviewRecord {
  id: string;
  role: string;
  questions: string[];
  answers: string[];
  createdAt: any;
  nlp?: NLPResult;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  frontend:  "#8b5cf6",
  backend:   "#10b981",
  fullstack: "#f59e0b",
  hr:        "#3b82f6",
  dsa:       "#ef4444",
  system:    "#ec4899",
};

const ROLE_ICONS: Record<string, string> = {
  frontend:  "💻", backend: "🗄️", fullstack: "🚀",
  hr: "🧑‍💼", dsa: "🧠", system: "🏗️",
};

function fmtDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function scoreColor(n: number) {
  if (n >= 75) return "text-emerald-400";
  if (n >= 50) return "text-amber-400";
  return "text-red-400";
}
function scoreBorder(n: number) {
  if (n >= 75) return "border-emerald-500/40";
  if (n >= 50) return "border-amber-500/40";
  return "border-red-500/40";
}

// Custom tooltip for charts
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-200 shadow-xl">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "#a78bfa" }}>
          {p.name}: <span className="font-bold">{Math.round(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const user     = useAuth();
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState<"overview" | "history" | "insights">("overview");

  // ── Fetch from Firebase ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const q    = query(
          collection(db, "users", user.uid, "interviews"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const raw  = snap.docs.map(d => ({ id: d.id, ...d.data() } as InterviewRecord));

        // Run NLP on each interview
        const enriched = raw.map(iv => ({
          ...iv,
          nlp: analyzeAnswerNLP(iv.answers, iv.questions),
        }));
        setInterviews(enriched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const total    = interviews.length;
  const avgScore = total
    ? Math.round(interviews.reduce((a, iv) => a + (iv.nlp?.overallScore ?? 0), 0) / total)
    : 0;
  const avgFluency = total
    ? Math.round(interviews.reduce((a, iv) => a + (iv.nlp?.fluencyScore ?? 0), 0) / total)
    : 0;
  const totalAnswered = interviews.reduce((a, iv) =>
    a + iv.answers.filter(x => x && x !== "SKIPPED").length, 0);

  // Role distribution
  const roleDist = interviews.reduce((acc, iv) => {
    acc[iv.role] = (acc[iv.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const roleChartData = Object.entries(roleDist).map(([role, count]) => ({
    role: role.charAt(0).toUpperCase() + role.slice(1), count, color: ROLE_COLORS[role] || "#8b5cf6"
  }));

  // Score trend (last 8)
  const trendData = [...interviews].slice(0, 8).reverse().map((iv, i) => ({
    name:     `#${i + 1}`,
    score:    iv.nlp?.overallScore   ?? 0,
    fluency:  iv.nlp?.fluencyScore   ?? 0,
    clarity:  iv.nlp?.clarityScore   ?? 0,
  }));

  // Radar: avg skill scores
  const radarData = [
    { skill: "Clarity",    val: total ? Math.round(interviews.reduce((a,iv)=>a+(iv.nlp?.clarityScore??0),0)/total) : 0 },
    { skill: "Fluency",    val: total ? Math.round(interviews.reduce((a,iv)=>a+(iv.nlp?.fluencyScore??0),0)/total)  : 0 },
    { skill: "Confidence", val: total ? Math.round(interviews.reduce((a,iv)=>a+(iv.nlp?.confidenceScore??0),0)/total): 0 },
    { skill: "Relevance",  val: total ? Math.round(interviews.reduce((a,iv)=>a+(iv.nlp?.relevanceScore??0),0)/total) : 0 },
    { skill: "Depth",      val: total ? Math.round(interviews.reduce((a,iv)=>a+(iv.nlp?.depthScore??0),0)/total)     : 0 },
  ];

  // Top filler words across all interviews
  const fillerMap: Record<string, number> = {};
  interviews.forEach(iv => {
    iv.nlp?.topFillerWords?.forEach(fw => {
      fillerMap[fw] = (fillerMap[fw] || 0) + 1;
    });
  });
  const fillerData = Object.entries(fillerMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([word, count]) => ({ word, count }));

  // Best & worst roles
  const roleScores: Record<string, number[]> = {};
  interviews.forEach(iv => {
    if (!roleScores[iv.role]) roleScores[iv.role] = [];
    roleScores[iv.role].push(iv.nlp?.overallScore ?? 0);
  });
  const roleAvgScores = Object.entries(roleScores).map(([role, scores]) => ({
    role, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  })).sort((a, b) => b.avg - a.avg);

  // ── Loading / No-user states ──────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060610] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">🔐</div>
          <p className="text-gray-400">Please log in to view your dashboard</p>
          <button onClick={() => navigate("/login")} className="btn-glow">Login</button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#060610] text-white font-['Syne',sans-serif] relative overflow-x-hidden">

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-fuchsia-600/8 rounded-full blur-[100px]" />
      </div>

      {/* ── Navbar ── */}
      {/* <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold">M</div>
          <span className="font-bold text-lg tracking-tight">MockAI</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">{user.displayName || user.email}</span>
          <button
            onClick={() => navigate("/")}
            className="text-sm px-4 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 transition-all"
          >
            + New Interview
          </button>
        </div>
      </nav> */}

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* ── Page header ── */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Performance{" "}
            <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Analytics
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">NLP-driven insights from your interview history</p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Interviews", val: total,         suffix: "",    icon: "🎯", color: "from-violet-500/20 to-violet-600/5",  border: "border-violet-500/20" },
            { label: "Avg NLP Score",    val: avgScore,      suffix: "%",   icon: "🧠", color: "from-emerald-500/20 to-emerald-600/5",border: "border-emerald-500/20" },
            { label: "Avg Fluency",      val: avgFluency,    suffix: "%",   icon: "🎙️", color: "from-cyan-500/20 to-cyan-600/5",      border: "border-cyan-500/20" },
            { label: "Answers Given",    val: totalAnswered, suffix: "",    icon: "✍️", color: "from-amber-500/20 to-amber-600/5",   border: "border-amber-500/20" },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border ${s.border} bg-linear-to-br ${s.color} p-5 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</span>
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className={`text-4xl font-bold tabular-nums ${loading ? "text-gray-700 animate-pulse" : ""}`}>
                {loading ? "—" : s.val}<span className="text-xl text-gray-500">{s.suffix}</span>
              </p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit border border-white/5">
          {(["overview", "history", "insights"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════
            TAB: OVERVIEW
        ═══════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">

            {/* Row 1: Radar + Trend */}
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Skill Radar */}
              <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-1">Skill Radar</h3>
                <p className="text-xs text-gray-600 mb-4">Avg across all interviews</p>
                {total === 0
                  ? <EmptyState />
                  : <ResponsiveContainer width="100%" height={240}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#ffffff10" />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "Syne" }} />
                        <Radar dataKey="val" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2}
                          dot={{ fill: "#8b5cf6", r: 4 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                }
              </div>

              {/* Score Trend */}
              <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-1">Score Trend</h3>
                <p className="text-xs text-gray-600 mb-4">Last {Math.min(8, total)} interviews</p>
                {trendData.length < 2
                  ? <EmptyState msg="Complete 2+ interviews to see trend" />
                  : <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={trendData}>
                        <CartesianGrid stroke="#ffffff08" strokeDasharray="4 4" />
                        <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} />
                        <Tooltip content={<DarkTooltip />} />
                        <Line type="monotone" dataKey="score"   name="Overall"  stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: "#8b5cf6" }} />
                        <Line type="monotone" dataKey="fluency" name="Fluency"  stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: "#06b6d4" }} strokeDasharray="4 2" />
                        <Line type="monotone" dataKey="clarity" name="Clarity"  stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} strokeDasharray="4 2" />
                      </LineChart>
                    </ResponsiveContainer>
                }
              </div>
            </div>

            {/* Row 2: Role distribution + filler words */}
            <div className="grid lg:grid-cols-2 gap-6">

              {/* Role bar chart */}
              <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-1">Interviews by Role</h3>
                <p className="text-xs text-gray-600 mb-4">How many times you practiced each role</p>
                {roleChartData.length === 0
                  ? <EmptyState />
                  : <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={roleChartData} barSize={28}>
                        <XAxis dataKey="role" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} allowDecimals={false} />
                        <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                        <Bar dataKey="count" name="Sessions" radius={[6,6,0,0]}>
                          {roleChartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                }
              </div>

              {/* Filler words */}
              <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-1">Top Filler Words</h3>
                <p className="text-xs text-gray-600 mb-4">Words to avoid in real interviews</p>
                {fillerData.length === 0
                  ? <EmptyState msg="No filler words detected yet" />
                  : <div className="space-y-3 mt-2">
                      {fillerData.map((f, i) => {
                        const maxCount = fillerData[0].count;
                        const pct = Math.round((f.count / maxCount) * 100);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300 font-mono">"{f.word}"</span>
                              <span className="text-amber-400">{f.count}×</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full"
                                style={{ width: `${pct}%`, transition: "width 1s ease" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                }
              </div>
            </div>

            {/* Role performance ranking */}
            {roleAvgScores.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Role Performance Ranking</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {roleAvgScores.map((r, i) => (
                    <div key={r.role} className={`flex items-center gap-3 rounded-xl p-3 border ${scoreBorder(r.avg)} bg-white/3`}>
                      <div className="text-2xl w-8 text-center">{ROLE_ICONS[r.role] || "🎯"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">{r.role}</p>
                        <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${r.avg}%`, background: ROLE_COLORS[r.role] || "#8b5cf6" }}
                          />
                        </div>
                      </div>
                      <span className={`text-sm font-bold tabular-nums ${scoreColor(r.avg)}`}>{r.avg}%</span>
                      {i === 0 && <span className="text-xs">🏆</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB: HISTORY
        ═══════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <div className="space-y-4 animate-fade-in">
            {loading && (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-24 rounded-2xl bg-white/3 animate-pulse border border-white/5" />
                ))}
              </div>
            )}
            {!loading && interviews.length === 0 && (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🎯</p>
                <p className="text-gray-400">No interviews yet. Start your first one!</p>
                <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-medium transition-all">
                  Start Interview
                </button>
              </div>
            )}
            {interviews.map((iv, idx) => (
              <HistoryCard key={iv.id} iv={iv} idx={idx} />
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            TAB: INSIGHTS
        ═══════════════════════════════════════════════ */}
        {activeTab === "insights" && (
          <InsightsTab interviews={interviews} loading={loading} />
        )}

      </main>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ msg = "Complete an interview to see data" }) {
  return (
    <div className="h-40 flex items-center justify-center">
      <p className="text-gray-600 text-sm text-center">{msg}</p>
    </div>
  );
}

function HistoryCard({ iv, idx }: { iv: InterviewRecord; idx: number }) {
  const [open, setOpen] = useState(false);
  const nlp = iv.nlp;
  const color = ROLE_COLORS[iv.role] || "#8b5cf6";

  return (
    <div
      className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm overflow-hidden
                 transition-all duration-300"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: `${color}22`, border: `1px solid ${color}44` }}
        >
          {ROLE_ICONS[iv.role] || "🎯"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold capitalize">{iv.role} Interview</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {iv.questions.length} questions · {iv.answers.filter(a => a && a !== "SKIPPED").length} answered · {fmtDate(iv.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className={`text-xl font-bold tabular-nums ${scoreColor(nlp?.overallScore ?? 0)}`}>
              {nlp?.overallScore ?? "—"}%
            </p>
            <p className="text-xs text-gray-600">NLP Score</p>
          </div>
          <div className="flex gap-1.5">
            {["Clarity","Fluency","Conf"].map((label, i) => {
              const vals = [nlp?.clarityScore, nlp?.fluencyScore, nlp?.confidenceScore];
              const v = vals[i] ?? 0;
              return (
                <div key={label} className="text-center hidden md:block">
                  <div className={`text-xs font-bold tabular-nums ${scoreColor(v)}`}>{v}</div>
                  <div className="text-[10px] text-gray-600">{label}</div>
                </div>
              );
            })}
          </div>
          <span className={`text-gray-600 text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-white/5 px-5 pb-5 pt-4 space-y-4">
          {/* Score pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { l: "Overall",    v: nlp?.overallScore    },
              { l: "Clarity",    v: nlp?.clarityScore    },
              { l: "Fluency",    v: nlp?.fluencyScore    },
              { l: "Confidence", v: nlp?.confidenceScore },
              { l: "Relevance",  v: nlp?.relevanceScore  },
              { l: "Depth",      v: nlp?.depthScore      },
            ].map(s => (
              <span key={s.l} className={`text-xs px-3 py-1 rounded-lg border font-medium ${scoreBorder(s.v??0)} bg-white/3 ${scoreColor(s.v??0)}`}>
                {s.l}: {s.v ?? "—"}%
              </span>
            ))}
          </div>

          {/* Filler words */}
          {(nlp?.topFillerWords?.length ?? 0) > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Filler words:</span>
              {nlp!.topFillerWords.map(fw => (
                <span key={fw} className="text-xs px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono">"{fw}"</span>
              ))}
            </div>
          )}

          {/* Sentiment */}
          {nlp?.sentiment && (
            <p className="text-xs text-gray-500">
              Tone: <span className={`font-medium ${nlp.sentiment === "positive" ? "text-emerald-400" : nlp.sentiment === "negative" ? "text-red-400" : "text-gray-400"}`}>
                {nlp.sentiment}
              </span>
            </p>
          )}

          {/* Q&A list */}
          <div className="space-y-3 mt-2">
            {iv.questions.map((q, i) => (
              <div key={i} className="rounded-xl bg-black/30 border border-white/5 p-4">
                <p className="text-xs text-gray-500 mb-1">Q{i+1}</p>
                <p className="text-sm text-gray-200 font-medium mb-2">{q}</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {iv.answers[i] === "SKIPPED"
                    ? <span className="text-yellow-600 italic">Skipped</span>
                    : iv.answers[i] || <span className="italic text-gray-600">No answer</span>
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InsightsTab({ interviews, loading }: { interviews: InterviewRecord[]; loading: boolean }) {
  if (loading) return (
    <div className="space-y-4">
      {[1,2].map(i => <div key={i} className="h-32 rounded-2xl bg-white/3 animate-pulse border border-white/5" />)}
    </div>
  );
  if (interviews.length === 0) return (
    <div className="text-center py-20 text-gray-500">No data yet. Complete some interviews!</div>
  );

  // Aggregate weak areas
  const total = interviews.length;
  const avg = (k: keyof NLPResult) =>
    Math.round(interviews.reduce((a, iv) => a + ((iv.nlp?.[k] as number) ?? 0), 0) / total);

  const skills = [
    { label: "Clarity",    val: avg("clarityScore"),    tip: "Structure answers with intro-body-conclusion.", color: "#8b5cf6" },
    { label: "Fluency",    val: avg("fluencyScore"),    tip: "Reduce filler words and practice pacing.",       color: "#06b6d4" },
    { label: "Confidence", val: avg("confidenceScore"), tip: "Use assertive language — avoid 'I think maybe'.", color: "#10b981" },
    { label: "Relevance",  val: avg("relevanceScore"),  tip: "Stay on topic; use the STAR method.",            color: "#f59e0b" },
    { label: "Depth",      val: avg("depthScore"),      tip: "Go deeper — add examples, numbers, outcomes.",   color: "#ec4899" },
  ].sort((a, b) => a.val - b.val);

  const weakAreas  = skills.filter(s => s.val < 60);
  const strongAreas = skills.filter(s => s.val >= 70);

  // Most common skipped questions
  const skipMap: Record<string, number> = {};
  interviews.forEach(iv => {
    iv.questions.forEach((q, i) => {
      if (iv.answers[i] === "SKIPPED") skipMap[q] = (skipMap[q] || 0) + 1;
    });
  });
  const skippedQs = Object.entries(skipMap).sort((a,b) => b[1]-a[1]).slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <h3 className="text-sm font-semibold text-red-300 mb-4">⚠️ Areas to Improve</h3>
          <div className="space-y-4">
            {weakAreas.map(s => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300 font-medium">{s.label}</span>
                  <span className={`text-sm font-bold ${scoreColor(s.val)}`}>{s.val}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${s.val}%`, background: s.color }} />
                </div>
                <p className="text-xs text-gray-600">💡 {s.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strong areas */}
      {strongAreas.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h3 className="text-sm font-semibold text-emerald-300 mb-4">✅ Strong Areas</h3>
          <div className="flex flex-wrap gap-3">
            {strongAreas.map(s => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold text-sm">{s.val}%</span>
                <span className="text-gray-300 text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most skipped questions */}
      {skippedQs.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h3 className="text-sm font-semibold text-amber-300 mb-4">🔄 Most Skipped Questions</h3>
          <div className="space-y-2">
            {skippedQs.map(([q, count], i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-black/20 border border-white/5 p-3">
                <span className="text-amber-500 text-xs font-bold mt-0.5 shrink-0">{count}×</span>
                <p className="text-sm text-gray-300">{q}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
        <h3 className="text-sm font-semibold text-violet-300 mb-3">🤖 AI Recommendation</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {weakAreas.length === 0
            ? "Great performance! Focus on consistency across different roles and increase answer depth with real-world examples."
            : `Your biggest opportunity is improving ${weakAreas[0].label}. ${weakAreas[0].tip} Try practicing ${weakAreas[0].label === "Clarity" ? "HR" : weakAreas[0].label === "Depth" ? "System Design" : "Frontend"} interviews to specifically target this skill.`
          }
        </p>
      </div>
    </div>
  );
}

export default Dashboard;