import { useEffect, useState } from "react";
import Header from "../components/Header";

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

export default function Profile() {
  const [name, setName] = useState<string>("Student");
  const [email, setEmail] = useState<string>("");
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

  const initials = (value: string) => {
    const parts = value
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return "SB";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? (JSON.parse(raw) as StoredUser) : null;
      const nextName = parsed?.displayName || parsed?.name || "Student";
      const nextEmail = parsed?.email || "";
      setName(nextName);
      setEmail(nextEmail);

      const profileRaw = localStorage.getItem("userProfile");
      const parsedProfile = profileRaw
        ? (JSON.parse(profileRaw) as StoredUserProfile)
        : null;

      setProfile({
        fullName: parsedProfile?.fullName || nextName || "",
        age: parsedProfile?.age || "",
        gender: parsedProfile?.gender || "",
        username: parsedProfile?.username || "",
        mobile: parsedProfile?.mobile || "",
        bio: parsedProfile?.bio || "",
      });
      setDraft({
        fullName: parsedProfile?.fullName || nextName || "",
        age: parsedProfile?.age || "",
        gender: parsedProfile?.gender || "",
        username: parsedProfile?.username || "",
        mobile: parsedProfile?.mobile || "",
        bio: parsedProfile?.bio || "",
      });
    } catch {
      setName("Student");
      setEmail("");
      setProfile({
        fullName: "",
        age: "",
        gender: "",
        username: "",
        mobile: "",
        bio: "",
      });
      setDraft({
        fullName: "",
        age: "",
        gender: "",
        username: "",
        mobile: "",
        bio: "",
      });
    }
  }, []);

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage your account details
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left column: summary */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 pt-1">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {profile.fullName || name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {email}
                  </div>
                </div>
                <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-[#7a4bf4] to-[#9a6bff] flex items-center justify-center text-white font-black">
                  {initials(profile.fullName || name)}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Username
                  </div>
                  <div className="mt-1 text-slate-900 dark:text-white font-semibold truncate">
                    {profile.username || "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Mobile
                  </div>
                  <div className="mt-1 text-slate-900 dark:text-white font-semibold truncate">
                    {profile.mobile || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: details */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">User details</h2>
                {saved && (
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Saved</span>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                  {!isEditing ? (
                    <div className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                      {profile.bio || "—"}
                    </div>
                  ) : (
                    <textarea
                      value={draft.bio || ""}
                      onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
                      placeholder="Tell something about you"
                      rows={4}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#7a4bf4]/30"
                    />
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="px-5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white text-sm font-semibold hover:shadow-lg hover:scale-105 transition"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
