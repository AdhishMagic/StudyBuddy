import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store user data in localStorage
      let displayName: string | undefined;
      try {
        const existingRaw = localStorage.getItem("user");
        const existing = existingRaw ? (JSON.parse(existingRaw) as { email?: string; displayName?: string; name?: string }) : null;
        if (existing?.email === email) {
          displayName = existing.displayName || existing.name;
        }
      } catch {
        displayName = undefined;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(displayName ? { displayName } : {}),
          email,
          role: "student",
          lastLogin: new Date().toISOString(),
        })
      );
      localStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const googleEmail = `user${Math.random().toString(36).substr(2, 9)}@gmail.com`;
      localStorage.setItem(
        "user",
        JSON.stringify({
          displayName: "Google User",
          email: googleEmail,
          role: "student",
          authProvider: "google",
          lastLogin: new Date().toISOString(),
        })
      );
      localStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6ff] dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <Header isLoggedIn={false} showNav={false} />

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-10">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#c8b5ff]/30 blur-3xl" />
        <div className="absolute right-0 -top-16 h-80 w-80 rounded-full bg-[#d2deff]/60 blur-2xl" />

        <div className="grid items-stretch gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#9a6bff] via-[#8b5cf6] to-[#6c8bff] p-8 md:p-12 text-white shadow-2xl">
            {/* Floating decorative elements */}
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/15 blur-3xl animate-pulse" />
            <div className="absolute left-12 -bottom-12 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-10 bottom-10 h-16 w-16 rounded-full bg-white/20 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>

            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#7a4bf4] font-bold text-lg shadow-lg">
                  SB
                </div>
                <span className="text-xl font-bold">StudyBuddy</span>
              </div>

              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold leading-tight">
                    Welcome Back,
                    <br />
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Champion!</span>
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                    Your learning journey continues here.
                    <br />
                    <span className="font-semibold">Stay focused. Stay motivated.</span>
                  </p>
                  
                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <span className="text-2xl">🎯</span>
                      <span className="text-sm font-medium">Smart Goals</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <span className="text-2xl">📈</span>
                      <span className="text-sm font-medium">Track Progress</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <span className="text-2xl">✨</span>
                      <span className="text-sm font-medium">AI Powered</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats section */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">10K+</div>
                  <div className="text-xs text-white/70">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">95%</div>
                  <div className="text-xs text-white/70">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">4.9★</div>
                  <div className="text-xs text-white/70">Rating</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -z-10 right-[-40px] -top-16 h-64 w-64 rotate-12 rounded-[45%] bg-gradient-to-br from-white via-[#e8e5ff] to-[#dfe9ff]" />

            <div className="relative rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Log in</h2>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Access your StudyBuddy account to keep learning.</p>

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mb-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#7a4bf4] focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#7a4bf4]/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 pr-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-[#7a4bf4] focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#7a4bf4]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="checkbox" className="h-4 w-4 accent-[#7a4bf4]" />
                    Remember me
                  </label>
                  <Link to="#" className="text-sm font-medium text-[#7a4bf4] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] py-2 font-semibold text-white shadow-md transition hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">Or</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 font-medium text-[#7a4bf4] transition hover:border-[#7a4bf4] hover:bg-[#fafbff] dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-[#7a4bf4] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
