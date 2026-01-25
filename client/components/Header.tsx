import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, User, LogOut, LayoutDashboard, ClipboardList, Link2, Bell, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";

type StoredTaskForNotifications = {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  progress?: number;
};

type StoredAssessmentForNotifications = {
  id: string;
  topic: string;
  date: string;
  startTime?: string;
};

type NotificationItem = {
  key: string;
  kind: "task" | "assessment";
  title: string;
  when: Date;
  subtitle: string;
  href: "/dashboard" | "/assessment";
};

interface HeaderProps {
  isLoggedIn?: boolean;
  showNav?: boolean;
}

export default function Header({ isLoggedIn = false, showNav = true }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
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

  // Close notifications dropdown on outside click
  useEffect(() => {
    if (!notificationsOpen) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-notifications-menu]")) return;
      setNotificationsOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [notificationsOpen]);

  const parseLocalDateTime = (dateYmd: string, time?: string) => {
    // dateYmd is expected like yyyy-mm-dd
    const hhmm = time && /^\d{2}:\d{2}$/.test(time) ? time : "00:00";
    const dt = new Date(`${dateYmd}T${hhmm}:00`);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };

  const formatWhen = (d: Date) => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const d0 = new Date(d);
    d0.setHours(0, 0, 0, 0);
    const diffDays = Math.round((d0.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 0) return `Today • ${time}`;
    if (diffDays === 1) return `Tomorrow • ${time}`;
    if (diffDays === -1) return `Yesterday • ${time}`;
    return `${d.toLocaleDateString([], { month: "short", day: "2-digit" })} • ${time}`;
  };

  const refreshNotifications = () => {
    if (!isLoggedIn) {
      setNotifications([]);
      return;
    }

    const now = new Date();
    const soonUntil = new Date(now);
    soonUntil.setDate(soonUntil.getDate() + 7);

    let tasks: StoredTaskForNotifications[] = [];
    let assessments: StoredAssessmentForNotifications[] = [];

    try {
      const raw = localStorage.getItem("tasks");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredTaskForNotifications[];
        if (Array.isArray(parsed)) tasks = parsed;
      }
    } catch {
      // ignore
    }

    try {
      const raw = localStorage.getItem("assessments");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAssessmentForNotifications[];
        if (Array.isArray(parsed)) assessments = parsed;
      }
    } catch {
      // ignore
    }

    const items: NotificationItem[] = [];

    for (const t of tasks) {
      const progress = t.progress ?? 0;
      if (progress >= 100) continue;
      const when = parseLocalDateTime(t.date, t.startTime);
      if (!when) continue;
      const isOverdue = when.getTime() < now.getTime();
      const isSoon = when.getTime() >= now.getTime() && when.getTime() <= soonUntil.getTime();
      if (!isOverdue && !isSoon) continue;

      items.push({
        key: `task:${t.id}`,
        kind: "task",
        title: t.title || "To-do",
        when,
        subtitle: isOverdue ? `Overdue • ${formatWhen(when)}` : `Due soon • ${formatWhen(when)}`,
        href: "/dashboard",
      });
    }

    for (const a of assessments) {
      const when = parseLocalDateTime(a.date, a.startTime);
      if (!when) continue;
      const isSoon = when.getTime() >= now.getTime() && when.getTime() <= soonUntil.getTime();
      if (!isSoon) continue;

      items.push({
        key: `assessment:${a.id}`,
        kind: "assessment",
        title: a.topic || "Assessment",
        when,
        subtitle: `Upcoming • ${formatWhen(when)}`,
        href: "/assessment",
      });
    }

    items.sort((a, b) => a.when.getTime() - b.when.getTime());
    setNotifications(items.slice(0, 10));
  };

  useEffect(() => {
    refreshNotifications();

    const onStatsUpdated = () => refreshNotifications();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tasks" || e.key === "assessments") refreshNotifications();
    };
    window.addEventListener("studybuddy:stats-updated", onStatsUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("studybuddy:stats-updated", onStatsUpdated);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

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

            {/* Notifications (after dark mode) */}
            {isLoggedIn && (
              <div className="relative" data-notifications-menu>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    setNotificationsOpen((v) => !v);
                    refreshNotifications();
                  }}
                  className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="font-semibold text-slate-900 dark:text-white">Notifications</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Next 7 days
                      </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800" />

                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-slate-600 dark:text-slate-400">
                        No upcoming tasks or assessments.
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                          <button
                            key={n.key}
                            type="button"
                            onClick={() => {
                              setNotificationsOpen(false);
                              navigate(n.href);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-start gap-3"
                          >
                            <div className="mt-0.5 h-9 w-9 rounded-lg bg-[#7a4bf4]/10 text-[#7a4bf4] flex items-center justify-center shrink-0">
                              {n.kind === "assessment" ? <CalendarClock size={18} /> : <LayoutDashboard size={18} />}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 dark:text-white truncate">{n.title}</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.subtitle}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile (only when logged in) */}
            {isLoggedIn && (
              <div className="relative" data-profile-menu>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center rounded-lg px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200"
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold">
                    {getInitials(userName)}
                  </span>
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
