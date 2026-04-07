import { useNavigate } from "react-router-dom";
export const Footer = () => {
  const navigate = useNavigate();

  const links = {
    Product:  ["Features", "Dashboard", "How It Works", "Pricing"],
    Company:  ["About", "Blog", "Careers", "Press"],
    Legal:    ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    Support:  ["Help Center", "Contact Us", "Status", "Community"],
  };

  return (
    <footer className="bg-[#030308] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-black text-white font-['Syne',sans-serif]">
                  Mock<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">AI</span>
                </p>
                <p className="text-[10px] text-gray-600 tracking-widest uppercase">Interview Simulator</p>
              </div>
            </button>
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs">
              AI-powered mock interview platform with NLP behavioral analysis. Built for candidates who are serious about their careers.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: "𝕏", label: "Twitter" },
                { icon: "in", label: "LinkedIn" },
                { icon: "gh", label: "GitHub" },
              ].map(s => (
                <button key={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  aria-label={s.label}>
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4 font-['Syne',sans-serif]">{group}</p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700">© 2025 MockAI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
            <span className="text-xs text-gray-700">Built with ❤️ for interview prep</span>
          </div>
        </div>
      </div>
    </footer>
  );
};