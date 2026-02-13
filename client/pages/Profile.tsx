import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import { Pencil } from "lucide-react";
import { apiGetMe, apiGetUserData, apiPutUserData, getAuthToken } from "@/services/api";

type StoredUser = {
  displayName?: string;
  name?: string;
  email?: string;
};

type StoredUserProfile = {
  fullName?: string;
  age?: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say" | "";
  username?: string;
  mobile?: string;
  bio?: string;
};

type StoredTaskForStats = {
  date: string;
  progress?: number;
};

type StoredAssessmentForStats = {
  date: string;
};

type StatsSnapshot = {
  todoPercent: number;
  totalTasks: number;
  completedTasks: number;
  assessmentPercent: number;
  totalAssessments: number;
  completedAssessments: number;
  currentStreak: number;
  previousStreak: number;
  bestStreak: number;
  contributionsByDay: Record<string, number>;
};

type InterestedBook = {
  id: string;
  title: string;
};

export default function Profile() {
  const [name, setName] = useState<string>("Student");
  const [email, setEmail] = useState<string>("");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("");
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [interestedBooks, setInterestedBooks] = useState<InterestedBook[]>([]);
  const [newBookTitle, setNewBookTitle] = useState<string>("");
  const [profile, setProfile] = useState<StoredUserProfile>({
    fullName: "",
    age: "",
    gender: "",
    username: "",
    mobile: "",
    bio: "",
  });
  const [draft, setDraft] = useState<StoredUserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [stats, setStats] = useState<StatsSnapshot>({
    todoPercent: 0,
    totalTasks: 0,
    completedTasks: 0,
    assessmentPercent: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    currentStreak: 0,
    previousStreak: 0,
    bestStreak: 0,
    contributionsByDay: {},
  });

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const initials = (value: string) => {
    const parts = value
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return "SB";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const countWords = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  const clampToWordLimit = (value: string, limit: number) => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= limit) return value;
    return words.slice(0, limit).join(" ");
  };

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();

      if (token) {
        try {
          const me = await apiGetMe();
          const nextName = me.name || "Student";
          const nextEmail = me.email || "";
          setName(nextName);
          setEmail(nextEmail);

          try {
            const avatar = await apiGetUserData<string>("userAvatar");
            setAvatarDataUrl(typeof avatar === "string" ? avatar : "");
          } catch {
            setAvatarDataUrl("");
          }

          try {
            const books = await apiGetUserData<InterestedBook[]>("interestedBooks");
            if (Array.isArray(books)) setInterestedBooks(books);
          } catch {
            setInterestedBooks([]);
          }

          let remoteProfile: StoredUserProfile | null = null;
          try {
            remoteProfile = await apiGetUserData<StoredUserProfile>("userProfile");
          } catch {
            remoteProfile = null;
          }

          const nextProfile: StoredUserProfile = {
            fullName: remoteProfile?.fullName || nextName || "",
            age: remoteProfile?.age || "",
            gender: remoteProfile?.gender || "",
            username: remoteProfile?.username || "",
            mobile: remoteProfile?.mobile || "",
            bio: remoteProfile?.bio || "",
          };

          setProfile(nextProfile);
          setDraft(nextProfile);
          return;
        } catch {
          // fall back to local
        }
      }

      try {
        const raw = localStorage.getItem("user");
        const parsed = raw ? (JSON.parse(raw) as StoredUser) : null;
        const nextName = parsed?.displayName || parsed?.name || "Student";
        const nextEmail = parsed?.email || "";
        setName(nextName);
        setEmail(nextEmail);

        const savedAvatar = localStorage.getItem("userAvatar");
        setAvatarDataUrl(savedAvatar || "");

        const savedBooks = localStorage.getItem("interestedBooks");
        if (savedBooks) {
          const parsedBooks = JSON.parse(savedBooks) as InterestedBook[];
          if (Array.isArray(parsedBooks)) setInterestedBooks(parsedBooks);
        }

        const profileRaw = localStorage.getItem("userProfile");
        const parsedProfile = profileRaw ? (JSON.parse(profileRaw) as StoredUserProfile) : null;

        const nextProfile: StoredUserProfile = {
          fullName: parsedProfile?.fullName || nextName || "",
          age: parsedProfile?.age || "",
          gender: parsedProfile?.gender || "",
          username: parsedProfile?.username || "",
          mobile: parsedProfile?.mobile || "",
          bio: parsedProfile?.bio || "",
        };
        setProfile(nextProfile);
        setDraft(nextProfile);
      } catch {
        setName("Student");
        setEmail("");
        setAvatarDataUrl("");
        setInterestedBooks([]);
        const empty: StoredUserProfile = {
          fullName: "",
          age: "",
          gender: "",
          username: "",
          mobile: "",
          bio: "",
        };
        setProfile(empty);
        setDraft(empty);
      }
    };

    load();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("interestedBooks", JSON.stringify(interestedBooks));
    } catch {
      // ignore
    }

    const token = getAuthToken();
    if (!token) return;
    apiPutUserData("interestedBooks", interestedBooks).catch(() => {
      // ignore
    });
  }, [interestedBooks]);

  const handleAddBook = () => {
    const title = newBookTitle.trim();
    if (!title) return;
    setInterestedBooks((prev) => [{ id: Date.now().toString(), title }, ...prev]);
    setNewBookTitle("");
  };

  const handleRemoveBook = (id: string) => {
    setInterestedBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const openAvatarPicker = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const next = typeof reader.result === "string" ? reader.result : "";
      if (!next) return;
      setAvatarDataUrl(next);
      try {
        localStorage.setItem("userAvatar", next);
      } catch {
        // ignore
      }

      const token = getAuthToken();
      if (token) {
        apiPutUserData("userAvatar", next).catch(() => {
          // ignore
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toYmd = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const parseYmdToDate = (ymd: string) => new Date(`${ymd}T00:00:00`);

  const computeStreaksInRange = (activeDaySet: Set<string>, start: Date, end: Date) => {
    const isActive = (d: Date) => activeDaySet.has(toYmd(d));

    const inRange = (d: Date) => d >= start && d <= end;

    let current = 0;
    {
      const cursor = new Date(end);
      while (inRange(cursor) && isActive(cursor)) {
        current += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
    }

    let previous = 0;
    {
      const cursor = new Date(end);
      cursor.setDate(cursor.getDate() - current);
      while (inRange(cursor) && !isActive(cursor)) {
        cursor.setDate(cursor.getDate() - 1);
      }
      while (inRange(cursor) && isActive(cursor)) {
        previous += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
    }

    let best = 0;
    {
      let run = 0;
      const cursor = new Date(end);
      while (inRange(cursor)) {
        if (isActive(cursor)) {
          run += 1;
          best = Math.max(best, run);
        } else {
          run = 0;
        }
        cursor.setDate(cursor.getDate() - 1);
      }
    }

    return { current, previous, best };
  };

  const refreshStats = () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayYmd = toYmd(startOfToday);

    let tasks: StoredTaskForStats[] = [];
    let assessments: StoredAssessmentForStats[] = [];

    try {
      const rawTasks = localStorage.getItem("tasks");
      if (rawTasks) {
        const parsed = JSON.parse(rawTasks) as StoredTaskForStats[];
        if (Array.isArray(parsed)) tasks = parsed;
      }
    } catch {
      // ignore
    }

    try {
      const rawAssessments = localStorage.getItem("assessments");
      if (rawAssessments) {
        const parsed = JSON.parse(rawAssessments) as StoredAssessmentForStats[];
        if (Array.isArray(parsed)) assessments = parsed;
      }
    } catch {
      // ignore
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => (t.progress ?? 0) >= 100).length;
    const todoPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalAssessments = assessments.length;
    const completedAssessments = assessments.filter((a) => {
      if (!a.date) return false;
      const d = a.date.includes("T") ? new Date(a.date) : parseYmdToDate(a.date);
      return d < startOfToday;
    }).length;
    const assessmentPercent =
      totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0;

    // Contributions are based on completed tasks per day
    const contributionsByDay: Record<string, number> = {};
    for (const t of tasks) {
      if ((t.progress ?? 0) < 100) continue;
      const ymd = t.date?.includes("T") ? toYmd(new Date(t.date)) : t.date;
      if (!ymd) continue;
      contributionsByDay[ymd] = (contributionsByDay[ymd] ?? 0) + 1;
    }
    const activeDaySet = new Set(Object.keys(contributionsByDay).filter((k) => (contributionsByDay[k] ?? 0) > 0));
    const startOfYear = new Date(startOfToday.getFullYear(), 0, 1);
    const { current, previous, best } = computeStreaksInRange(activeDaySet, startOfYear, startOfToday);

    setStats({
      todoPercent,
      totalTasks,
      completedTasks,
      assessmentPercent,
      totalAssessments,
      completedAssessments,
      currentStreak: current,
      previousStreak: previous,
      bestStreak: best,
      contributionsByDay,
    });
  };

  useEffect(() => {
    refreshStats();

    const onStatsUpdated = () => refreshStats();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tasks" || e.key === "assessments") refreshStats();
    };

    window.addEventListener("studybuddy:stats-updated", onStatsUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("studybuddy:stats-updated", onStatsUpdated);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableYears = useMemo(() => {
    // Show a full year list on the Profile page (not data-dependent)
    const currentYear = new Date().getFullYear();
    const minYear = 2000;
    const maxYear = currentYear + 5;
    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y -= 1) years.push(y);
    return years;
  }, []);

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(new Date().getFullYear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableYears]);

  // Year navigation is done via dropdown only.

  const yearStreak = useMemo(() => {
    const activeDaySet = new Set(Object.keys(stats.contributionsByDay).filter((k) => (stats.contributionsByDay[k] ?? 0) > 0));

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const isCurrentYear = selectedYear === now.getFullYear();

    const start = new Date(selectedYear, 0, 1);
    const end = isCurrentYear ? now : new Date(selectedYear, 11, 31);
    end.setHours(0, 0, 0, 0);

    return computeStreaksInRange(activeDaySet, start, end);
  }, [selectedYear, stats.contributionsByDay]);

  const heatmap = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const isCurrentYear = selectedYear === now.getFullYear();

    const yearStart = new Date(selectedYear, 0, 1);
    yearStart.setHours(0, 0, 0, 0);
    const yearEnd = isCurrentYear ? now : new Date(selectedYear, 11, 31);
    yearEnd.setHours(0, 0, 0, 0);

    const start = new Date(yearStart);
    // Align to Monday
    const day = start.getDay();
    const mondayOffset = (day + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);

    const weeks: Array<{
      label: string;
      days: Array<{ ymd: string; date: Date; count: number; future: boolean; outOfYear: boolean }>;
    }> = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let prevLabeledMonth = -1;
    for (let w = 0; w < 53; w += 1) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + w * 7);

      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const ymd = toYmd(d);
        const count = stats.contributionsByDay[ymd] ?? 0;
        const future = d > yearEnd;
        const outOfYear = d.getFullYear() !== selectedYear;
        return { ymd, date: d, count, future, outOfYear };
      });

      // Month label should reflect the first in-year day in this week.
      const firstInYearDay = days.find((x) => x.date.getFullYear() === selectedYear);
      const monthForLabel = firstInYearDay ? firstInYearDay.date.getMonth() : null;
      const label =
        monthForLabel !== null && monthForLabel !== prevLabeledMonth
          ? monthNames[monthForLabel]
          : "";
      if (monthForLabel !== null) prevLabeledMonth = monthForLabel;

      weeks.push({ label, days });
    }

    return weeks;
  }, [selectedYear, stats.contributionsByDay]);

  const monthLabelPositions = useMemo(() => {
    // Match the grid sizing: each week column is w-3 (12px) with gap-1 (4px) => 16px step.
    const weekStepPx = 16;
    // Grid starts after the day-label column (w-7 => 28px) plus the flex gap-3 (12px).
    const leftPadPx = 40;

    const raw = heatmap
      .map((w, idx) => ({ label: w.label, left: leftPadPx + idx * weekStepPx }))
      .filter((x) => x.label);

    // Prevent overlap by skipping labels that would collide.
    const result: Array<{ label: string; left: number }> = [];
    let lastRight = -Infinity;
    for (const item of raw) {
      // Rough width estimate: ~6.5px per char + 6px padding.
      const estimatedWidth = item.label.length * 6.5 + 6;
      if (item.left < lastRight + 6) continue;
      result.push(item);
      lastRight = item.left + estimatedWidth;
    }
    return result;
  }, [heatmap]);

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
    setSaved(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(draft));
    setProfile(draft);
    setSaved(true);
    setIsEditing(false);
    window.setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#f4f6ff] dark:bg-slate-950 transition-colors">
      <Header isLoggedIn={true} showNav={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-10">
          {/* Left 30%: profile details */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="h-[88px] w-[88px] rounded-full bg-gradient-to-br from-[#7a4bf4] to-[#9a6bff] flex items-center justify-center text-white font-black overflow-hidden">
                    {avatarDataUrl ? (
                      <img
                        src={avatarDataUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">{initials(profile.fullName || name)}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={openAvatarPicker}
                    aria-label="Change profile photo"
                    className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg border border-white/20 flex items-center justify-center transition"
                  >
                    <Pencil size={16} />
                  </button>

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="mt-1 font-bold text-slate-900 dark:text-white truncate">
                    {profile.fullName || name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {email}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="w-full flex items-center justify-center">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-6 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white text-sm font-semibold hover:shadow-lg hover:scale-105 transition"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {saved && (
                <div className="mt-3 text-center text-sm font-semibold text-green-600 dark:text-green-400">
                  Saved
                </div>
              )}

              <div className="mt-6 grid gap-4">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                  {!isEditing ? (
                    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-slate-900 dark:text-white font-semibold">
                      {profile.fullName || "—"}
                    </div>
                  ) : (
                    <input
                      value={draft.fullName || ""}
                      onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                    />
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Profile username</label>
                  {!isEditing ? (
                    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-slate-900 dark:text-white font-semibold">
                      {profile.username || "—"}
                    </div>
                  ) : (
                    <input
                      value={draft.username || ""}
                      onChange={(e) => setDraft((p) => ({ ...p, username: e.target.value }))}
                      placeholder="username"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                    />
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Age</label>
                  {!isEditing ? (
                    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-slate-900 dark:text-white font-semibold">
                      {profile.age || "—"}
                    </div>
                  ) : (
                    <input
                      value={draft.age || ""}
                      onChange={(e) => setDraft((p) => ({ ...p, age: e.target.value }))}
                      placeholder="Age"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                    />
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                  {!isEditing ? (
                    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-slate-900 dark:text-white font-semibold">
                      {profile.gender || "—"}
                    </div>
                  ) : (
                    <select
                      value={draft.gender || ""}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          gender: e.target.value as StoredUserProfile["gender"],
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Mobile number</label>
                  {!isEditing ? (
                    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-slate-900 dark:text-white font-semibold">
                      {profile.mobile || "—"}
                    </div>
                  ) : (
                    <input
                      value={draft.mobile || ""}
                      onChange={(e) => setDraft((p) => ({ ...p, mobile: e.target.value }))}
                      placeholder="Mobile"
                      inputMode="tel"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                    />
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Mail id</label>
                  <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold">
                    {email || "—"}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                  {!isEditing ? (
                    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                      {profile.bio || "—"}
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={draft.bio || ""}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            bio: clampToWordLimit(e.target.value, 200),
                          }))
                        }
                        placeholder="Tell something about you"
                        rows={4}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                      />
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {countWords(draft.bio || "")} / 200 words
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-2" />
            </div>
          </div>

          {/* Right 70%: percentages + streak */}
          <div className="md:col-span-7 min-w-0">
            <div className="grid gap-4 sm:gap-6">
              {/* Percent cards */}
              <div className="grid gap-6 sm:grid-cols-2 items-stretch">
                <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">To-do score</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {stats.completedTasks}/{stats.totalTasks} completed
                    </div>
                  </div>
                  <div className="mt-4 text-4xl font-black text-slate-900 dark:text-white">
                    {stats.todoPercent}%
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff]"
                      style={{ width: `${Math.min(100, Math.max(0, stats.todoPercent))}%` }}
                    />
                  </div>
                </div>

                <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">Assessment</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {stats.completedAssessments}/{stats.totalAssessments} completed
                    </div>
                  </div>
                  <div className="mt-4 text-4xl font-black text-slate-900 dark:text-white">
                    {stats.assessmentPercent}%
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff]"
                      style={{ width: `${Math.min(100, Math.max(0, stats.assessmentPercent))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div className="min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">Streak</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Based on days with at least one completed to-do
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                      aria-label="Select year"
                    >
                      {availableYears.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current streak</div>
                    <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                      {yearStreak.current}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Previous streak</div>
                    <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                      {yearStreak.previous}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Highest streak</div>
                    <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                      {yearStreak.best}
                    </div>
                  </div>
                </div>

                <div className="mt-4 max-w-full min-w-0 overflow-x-auto">
                  <div className="w-max min-w-[520px] sm:min-w-[640px] lg:min-w-[760px] mx-auto">
                    {/* Month labels */}
                    <div className="relative h-4 mb-2">
                      {monthLabelPositions.map((m) => (
                        <div
                          key={`${m.label}-${m.left}`}
                          className="absolute top-0 text-[10px] text-slate-500 dark:text-slate-400 select-none"
                          style={{ left: m.left }}
                        >
                          {m.label}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {/* Day labels */}
                      <div className="w-7 pt-0.5">
                        <div className="h-3" />
                        <div className="h-3 text-[10px] text-slate-500 dark:text-slate-400">Mon</div>
                        <div className="h-3" />
                        <div className="h-3 text-[10px] text-slate-500 dark:text-slate-400">Wed</div>
                        <div className="h-3" />
                        <div className="h-3 text-[10px] text-slate-500 dark:text-slate-400">Fri</div>
                      </div>

                      {/* Grid */}
                      <div className="flex gap-1">
                        {heatmap.map((week, wi) => (
                          <div key={wi} className="flex flex-col gap-1">
                            {week.days.map((d, di) => {
                              const level = d.count <= 0 ? 0 : d.count === 1 ? 1 : d.count === 2 ? 2 : d.count <= 4 ? 3 : 4;
                              const bg =
                                level === 0
                                  ? "bg-slate-200 dark:bg-slate-800"
                                  : level === 1
                                  ? "bg-green-200 dark:bg-green-900"
                                  : level === 2
                                  ? "bg-green-300 dark:bg-green-800"
                                  : level === 3
                                  ? "bg-green-400 dark:bg-green-700"
                                  : "bg-green-500 dark:bg-green-600";

                              return (
                                <div
                                  key={di}
                                  title={`${d.ymd}: ${d.count}`}
                                  className={`h-3 w-3 rounded-sm ${d.future ? "opacity-50" : ""} ${d.outOfYear ? "opacity-0" : ""} ${bg}`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Less</span>
                      <div className="h-3 w-3 rounded-sm bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
                      <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-800" />
                      <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
                      <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-600" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interested books */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Interested books
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Add books you want to read
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <input
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddBook();
                    }}
                    placeholder="Type a book name"
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddBook}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-5">
                  {interestedBooks.length === 0 ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      No books added yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {interestedBooks.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {b.title}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBook(b.id)}
                            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
