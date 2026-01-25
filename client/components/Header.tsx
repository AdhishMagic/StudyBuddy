import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, User, LogOut, ChevronDown, LayoutDashboard, ClipboardList, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
  showNav?: boolean;
}

export default function Header({ isLoggedIn = false, showNav = true }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Student");
  const [userEmail, setUserEmail] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return "SB";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const deriveNameFromEmail = (email: string) => {
    const local = email.split("@")[0] || "Student";
    const spaced = local.replace(/[._-]+/g, " ").trim();
    if (!spaced) return "Student";
    return spaced
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Initialize theme on mount - check localStorage once
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      // Default to light mode
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);

  // Apply theme when isDarkMode state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load user details for profile menu
  useEffect(() => {
    if (!isLoggedIn) return;
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? (JSON.parse(raw) as { email?: string; displayName?: string; name?: string }) : null;
      const email = parsed?.email || "";
      const displayName = parsed?.displayName || parsed?.name || (email ? deriveNameFromEmail(email) : "Student");
      setUserEmail(email);
      setUserName(displayName);
    } catch {
      setUserEmail("");
      setUserName("Student");
    }
  }, [isLoggedIn]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-profile-menu]")) return;
      setProfileOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [profileOpen]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      // Force immediate DOM update
      if (newMode) {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#020617';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
      }
      
      return newMode;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 relative z-50 hover:opacity-80 transition-opacity">
            <img 
              src="/logo-small.ico" 
              alt="StudyBuddy Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="text-xl font-bold">
              <span className="text-slate-900 dark:text-white">StudyBuddy</span>
            </div>
          </Link>

          {/* Spacer - takes up middle space */}
          <div className="flex-1" />

          {/* Auth buttons and theme toggle */}
          <div className="flex items-center gap-3 relative z-50">
            {/* Auth buttons */}
            {!isLoggedIn && (
              <>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all text-sm shadow-md"
                >
                  Create free account
                </Link>
                <Link
                  to="/login"
                  className="bg-[#7a4bf4] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#6a3be4] transition-all text-sm hover:shadow-lg"
                >
                  Log in
                </Link>
              </>
            )}

            {/* To-do list icon (logged in) */}
            {isLoggedIn && (
              <Link
                to="/dashboard"
                onClick={() => setProfileOpen(false)}
                className={`p-2 rounded-lg transition ${
                  location.pathname === "/dashboard"
                    ? "bg-[#7a4bf4] text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
                aria-label="To-do list"
                title="To-do list"
              >
                <LayoutDashboard size={20} />
              </Link>
            )}

            {/* Theme toggle (logged in: keep in header near To-do list icon) */}
            {isLoggedIn && (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
                aria-label="Toggle dark mode"
                title={isDarkMode ? "Light mode" : "Dark mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            {/* Profile (only when logged in) */}
            {isLoggedIn && (
              <div className="relative" data-profile-menu>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200"
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold">
                    {getInitials(userName)}
                  </span>
                  <ChevronDown size={16} className="opacity-70" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden">
                    <div className="p-4 flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#7a4bf4]/15 flex items-center justify-center text-[#7a4bf4]">
                        <User size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{userName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{userEmail || ""}</p>
                      </div>
                    </div>

                    {/* Navigation items moved into dropdown */}
                    {showNav && (
                      <>
                        <div className="border-t border-slate-200 dark:border-slate-800" />
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className={`w-full px-4 py-3 text-sm font-medium transition flex items-center gap-2 ${
                            location.pathname === "/profile"
                              ? "bg-[#7a4bf4] text-white"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <Link
                          to="/assessment"
                          onClick={() => setProfileOpen(false)}
                          className={`w-full px-4 py-3 text-sm font-medium transition flex items-center gap-2 ${
                            location.pathname === "/assessment"
                              ? "bg-[#7a4bf4] text-white"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <ClipboardList size={16} />
                          Assessment
                        </Link>
                        <Link
                          to="/elink"
                          onClick={() => setProfileOpen(false)}
                          className={`w-full px-4 py-3 text-sm font-medium transition flex items-center gap-2 ${
                            location.pathname === "/elink"
                              ? "bg-[#7a4bf4] text-white"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <Link2 size={16} />
                          E-link
                        </Link>
                        <Link
                          to="/refbook"
                          onClick={() => setProfileOpen(false)}
                          className={`w-full px-4 py-3 text-sm font-medium transition flex items-center gap-2 ${
                            location.pathname === "/refbook"
                              ? "bg-[#7a4bf4] text-white"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <span className="inline-flex h-4 w-4 items-center justify-center text-xs font-bold">📚</span>
                          Ref-Book
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-200 dark:border-slate-800" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Theme toggle (logged out) */}
            {!isLoggedIn && (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
