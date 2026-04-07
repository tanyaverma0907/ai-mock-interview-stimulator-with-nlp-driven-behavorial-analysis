import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

const Navbar = () => {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
    setUserDropdown(false);
  };

  const navLinks = [
    { label: "Home",      href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "About",     href: "/#about" },
    { label: "Contact",   href: "/#contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href.replace("/#", ""));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#06060f]/90 backdrop-blur-2xl border-b border-white/8 shadow-2xl shadow-black/50"
            : "bg-[#06060f]/89 backdrop-blur-2xl border-b border-white/8 shadow-2xl shadow-black/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 group"
            >
              {/* Icon */}
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-violet-500 via-fuchsia-500 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-violet-500 via-fuchsia-500 to-pink-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
                <div className="relative flex items-center justify-center w-full h-full">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {/* Wordmark */}
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-lg tracking-tight font-['Syne',sans-serif]">
                  Mock<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">AI</span>
                </span>
                <span className="text-[10px] text-gray-500 tracking-widest uppercase font-medium">Interview Simulator</span>
              </div>
            </button>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={e => {
                    if (!link.href.includes("#")) {
                      e.preventDefault();
                      navigate(link.href);
                    }
                  }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-['Syne',sans-serif] group ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isActive(link.href) && (
                    <span className="absolute inset-0 rounded-lg bg-white/8 border border-white/10" />
                  )}
                  <span className="relative">{link.label}</span>
                  {/* Hover underline */}
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-linear-to-r from-violet-500 to-fuchsia-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              ))}
            </div>

            {/* ── CTA / User section ── */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(d => !d)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group"
                  >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 max-w-30 truncate font-['Syne',sans-serif]">
                      {user.displayName || user.email?.split("@")[0]}
                    </span>
                    <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${userDropdown ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {userDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[#0d0d1a] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <button onClick={() => { navigate("/dashboard"); setUserDropdown(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left">
                          <span>📊</span> Dashboard
                        </button>
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left">
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors font-['Syne',sans-serif]"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="relative px-5 py-2 rounded-lg text-sm font-semibold text-white overflow-hidden group font-['Syne',sans-serif]"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600" />
                    <span className="absolute inset-0 bg-linear-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute inset-0 rounded-lg ring-1 ring-white/20" />
                    <span className="relative">Get Started →</span>
                  </button>
                </>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-105 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 pb-4 pt-2 bg-[#06060f]/95 backdrop-blur-2xl border-t border-white/5 space-y-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => {
                  if (!link.href.includes("#")) {
                    e.preventDefault();
                    navigate(link.href);
                  }
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium font-['Syne',sans-serif]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/5 mt-2">
              {user ? (
                <button onClick={handleSignOut}
                  className="w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm text-left transition-colors">
                  Sign Out
                </button>
              ) : (
                <button onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold font-['Syne',sans-serif]">
                  Get Started →
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      {/* Click-outside overlay */}
      {userDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setUserDropdown(false)} />
      )}
    </>
  );
};

export default Navbar;