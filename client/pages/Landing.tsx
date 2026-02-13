import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { BookOpen, BarChart3, Lightbulb } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f4f6ff] dark:bg-slate-950 transition-colors">
      <Header isLoggedIn={false} showNav={false} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#c8b5ff]/30 blur-3xl" />
        <div className="absolute right-0 -top-16 h-80 w-80 rounded-full bg-[#d2deff]/60 blur-2xl" />
        <div className="absolute left-1/2 bottom-20 h-48 w-48 rounded-full bg-[#e8d5ff]/40 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[500px]">
            {/* Left content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
                <span className="text-[#7a4bf4]">StudyBuddy</span> Is A
                <br />
                <span className="text-[#7a4bf4]">Personalized Study</span> Planner
                <br />
                Organize Schedules,{" "}
                <span className="text-[#7a4bf4]">Track Progress</span>, And Stay
                <br />
                Motivated.
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                Provides you with the latest online learning system and that
                help your knowledge growing.
              </p>
              <Link
                to="/signup"
                className="inline-block bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all text-base shadow-md"
              >
                Get Started
              </Link>
            </div>

            {/* Right content with stats */}
            <div className="relative hidden md:block">
              <div className="bg-gradient-to-br from-[#9a6bff] via-[#8b5cf6] to-[#6c8bff] rounded-3xl p-12 text-white shadow-2xl">
                <div className="text-6xl font-bold mb-4">👨‍🎓</div>
                <p className="text-xl font-semibold mb-8">
                  Thousands of students trust StudyBuddy
                </p>

                {/* Stats boxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 text-center transition-all duration-200 hover:bg-white/30 hover:scale-[1.03] hover:shadow-xl cursor-pointer">
                    <div className="text-3xl font-bold">2K+</div>
                    <div className="text-sm text-white text-opacity-90">
                      Video Courses
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 text-center transition-all duration-200 hover:bg-white/30 hover:scale-[1.03] hover:shadow-xl cursor-pointer">
                    <div className="text-3xl font-bold">5K+</div>
                    <div className="text-sm text-white text-opacity-90">
                      Online Courses
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 text-center col-span-2 transition-all duration-200 hover:bg-white/30 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
                    <div className="text-3xl font-bold">250+</div>
                    <div className="text-sm text-white text-opacity-90">
                      Reference Books
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Why Choose StudyBuddy?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to succeed in your studies, all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#f8f9ff] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 hover:border-[#9a6bff]/70 dark:hover:border-[#9a6bff]/80 hover:bg-white dark:hover:bg-slate-850 transition-all duration-200">
              <div className="w-12 h-12 bg-[#7a4bf4]/10 dark:bg-[#7a4bf4]/20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-[#7a4bf4]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Smart Planning</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Organize your tasks with smart categorization and priority levels
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f8f9ff] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 hover:border-[#9a6bff]/70 dark:hover:border-[#9a6bff]/80 hover:bg-white dark:hover:bg-slate-850 transition-all duration-200">
              <div className="w-12 h-12 bg-[#7a4bf4]/10 dark:bg-[#7a4bf4]/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-[#7a4bf4]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Track Progress</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor your learning journey with detailed analytics and reports
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#f8f9ff] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 hover:border-[#9a6bff]/70 dark:hover:border-[#9a6bff]/80 hover:bg-white dark:hover:bg-slate-850 transition-all duration-200">
              <div className="w-12 h-12 bg-[#7a4bf4]/10 dark:bg-[#7a4bf4]/20 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="text-[#7a4bf4]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">AI Assistance</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get personalized study plans and AI-powered learning recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Ready to start learning?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of students using StudyBuddy to achieve their academic goals
          </p>
          <Link
            to="/signup"
            className="inline-block bg-gradient-to-r from-[#7a4bf4] to-[#9a6bff] text-white px-12 py-4 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all text-lg shadow-lg"
          >
            Create Your Free Account Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img
                src="/logo-small.ico"
                alt="StudyBuddy Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold">StudyBuddy</span>
            </div>
            <p className="text-gray-400">
              © 2024 StudyBuddy. Your personalized study companion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
