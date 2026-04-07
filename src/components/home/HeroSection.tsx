import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuickStartCard } from "./QuickStartCard"; // adjust import path as needed

const ROLES = [
  "Frontend Dev",
  "Backend Eng",
  "Full Stack",
  "System Design",
  "DSA",
  "HR Round",
];
const TYPING_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE = 1500;

const HeroSection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quickStartRef = useRef<HTMLDivElement>(null); // 👈 ref for scroll target
  const [typed, setTyped] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const handleStartInterview = () => {
    quickStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Typewriter ───────────────────────────────────────────────────────────
  useEffect(() => {
    const current = ROLES[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && typed === current) {
      timeout = setTimeout(() => setDeleting(true), PAUSE);
    } else if (deleting && typed === "") {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    } else {
      timeout = setTimeout(
        () => {
          setTyped(
            deleting
              ? current.slice(0, typed.length - 1)
              : current.slice(0, typed.length + 1),
          );
        },
        deleting ? DELETE_SPEED : TYPING_SPEED,
      );
    }
    return () => clearTimeout(timeout);
  }, [typed, deleting, roleIdx]);

  // ── Particle canvas ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const stats = [
    { val: "50K+", label: "Interviews Done" },
    { val: "94%", label: "Success Rate" },
    { val: "200+", label: "Companies Prep" },
    { val: "4.9★", label: "User Rating" },
  ];

  return (
    <>
      <section className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden bg-[#06060f]">
        {/* ── Particle canvas background ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-60"
        />

        {/* ── Gradient orbs ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-200 h-200 bg-violet-600/10 rounded-full blur-[150px]" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-700/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-700/8 rounded-full blur-[100px]" />
        </div>

        {/* ── Subtle grid ── */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* ── Main content ── */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 pt-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/25 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs text-violet-300 font-medium tracking-wide font-['Syne',sans-serif]">
              AI-Powered Interview Preparation Platform
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight font-['Syne',sans-serif] leading-none">
              <span className="text-white">Master Your</span>
              <br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                  {typed}
                </span>
                <span className="inline-block w-0.5 h-[0.85em] bg-violet-400 ml-1 animate-blink align-middle" />
              </span>
              <br />
              <span className="text-white">Interview</span>
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-['DM_Sans',sans-serif] mt-6">
              Practice with our NLP-driven AI interviewer. Get real-time
              behavioral analysis, filler-word detection, and actionable feedback
              — before the real deal.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartInterview} // 👈 updated
              className="group relative px-8 py-4 rounded-2xl text-white font-bold text-base overflow-hidden font-['Syne',sans-serif]"
            >
              <span className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600 transition-all duration-300" />
              <span className="absolute inset-0 bg-linear-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute -inset-1 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Start Interview
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="group px-8 py-4 rounded-2xl text-gray-300 hover:text-white font-semibold text-base border border-white/10 hover:border-white/25 bg-white/3 hover:bg-white/6 backdrop-blur-sm transition-all duration-300 font-['Syne',sans-serif]"
            >
              <span className="flex items-center gap-2">
                View Dashboard
                <span className="text-lg">📊</span>
              </span>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 flex-wrap pt-2">
            {["No credit card", "Free to start", "AI-powered"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.83l-3.54-3.54 1.41-1.41L11 13.99l5.13-5.13 1.41 1.41L11 16.83z" />
                </svg>
                {t}
              </span>
            ))}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-4 border-t border-white/5">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-white font-['Syne',sans-serif]">
                  {s.val}
                </p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <span className="text-xs text-gray-500 tracking-widest uppercase font-['Syne',sans-serif]">
            Scroll
          </span>
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <style>{`
          @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
          .animate-blink { animation: blink 1s step-end infinite; }
        `}</style>
      </section>

      {/* ── QuickStartCard scroll target ── */}
      <div ref={quickStartRef}>
        <QuickStartCard />
      </div>
    </>
  );
};

export default HeroSection;