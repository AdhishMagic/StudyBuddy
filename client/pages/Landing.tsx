import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { BookOpen, BarChart3, Lightbulb } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f4f6ff]">
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
                <span className="text-[#7a4bf4]">StudyBuddy</span> Is A
                <br />
                <span className="text-[#7a4bf4]">Personalized Study</span> Planner
                <br />
                Organize Schedules,{" "}
                <span className="text-[#7a4bf4]">Track Progress</span>, And Stay
                <br />
                Motivated.
              </h1>
              <p className="text-slate-600 text-lg mb-8">
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
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold">2K+</div>
                    <div className="text-sm text-white text-opacity-90">
                      Video Courses
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold">5K+</div>
                    <div className="text-sm text-white text-opacity-90">
                      Online Courses
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 text-center col-span-2">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Why Choose StudyBuddy?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything you need to succeed in your studies, all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#f8f9ff] border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#7a4bf4]/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-[#7a4bf4]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Smart Planning</h3>
              <p className="text-slate-600">
                Organize your tasks with smart categorization and priority levels
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f8f9ff] border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#7a4bf4]/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-[#7a4bf4]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Track Progress</h3>
              <p className="text-slate-600">
                Monitor your learning journey with detailed analytics and reports
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#f8f9ff] border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 bg-[#7a4bf4]/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="text-[#7a4bf4]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AI Assistance</h3>
              <p className="text-slate-600">
                Get personalized study plans and AI-powered learning recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Books Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fafbff]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center text-slate-900">Suggested books</h2>
          <p className="text-center text-slate-600 mb-12">
            Find out the best books to read when you don't even know what to search
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {/* Sample book cards */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((book) => (
              <div key={book} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
                  <div className="text-white text-center">
                    <BookOpen size={48} />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">Sample Book</h3>
                  <p className="text-xs text-gray-600 truncate">Author Name</p>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((star) => (
                      <span key={star} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative waves */}
          <div className="relative h-32 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
            <svg
              className="absolute bottom-0 left-0 w-full h-full"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
            >
              <path
                fill="rgb(147, 51, 234)"
                d="M0,64L120,69.3C240,75,480,85,720,80C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
              ></path>
            </svg>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-slate-900">Ready to start learning?</h2>
          <p className="text-xl text-slate-600 mb-8">
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
              <div className="w-8 h-8 bg-pink-300 rounded-full flex items-center justify-center text-xs font-bold">
                SB
              </div>
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
