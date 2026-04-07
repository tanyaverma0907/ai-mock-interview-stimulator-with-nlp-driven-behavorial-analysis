import { useNavigate } from "react-router-dom";
// ─── CTASection.tsx ───────────────────────────────────────────────────────────
export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="bg-[#06060f] py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-violet-600/20 via-fuchsia-600/10 to-pink-600/20" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />

          {/* Glow orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/30 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-[80px]" />

          <div className="relative px-8 py-16 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-300 font-['Syne',sans-serif]">Free to start — no credit card needed</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black text-white font-['Syne',sans-serif] leading-tight">
              Ready to Ace Your
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-300 via-fuchsia-300 to-pink-300">
                Next Interview?
              </span>
            </h2>

            <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
              Join thousands of candidates who use MockAI to practice smarter, get real behavioral feedback,
              and walk into interviews with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/interview")}
                className="group relative px-8 py-4 rounded-2xl text-white font-bold text-base overflow-hidden font-['Syne',sans-serif]"
              >
                <span className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600" />
                <span className="absolute inset-0 bg-linear-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  Start Free Interview
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </span>
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 rounded-2xl text-gray-300 hover:text-white font-semibold text-base border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all font-['Syne',sans-serif]"
              >
                View Dashboard →
              </button>
            </div>

            {/* Companies logos placeholder */}
            <div className="pt-8 border-t border-white/5">
              <p className="text-xs text-gray-600 mb-4 uppercase tracking-widest font-['Syne',sans-serif]">Candidates prepared for</p>
              <div className="flex flex-wrap justify-center gap-4 opacity-30">
                {["Google", "Amazon", "Flipkart", "Zepto", "Razorpay", "Swiggy", "CRED", "Meesho"].map(co => (
                  <span key={co} className="text-sm font-bold text-white font-['Syne',sans-serif]">{co}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};