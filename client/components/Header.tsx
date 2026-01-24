import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
  showNav?: boolean;
}

export default function Header({ isLoggedIn = false, showNav = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="w-full bg-white border-b border-slate-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 relative z-50">
            <div className="w-10 h-10 bg-[#7a4bf4] rounded-full flex items-center justify-center text-sm font-bold text-white">
              SB
            </div>
            <div className="text-xl font-bold">
              <span className="text-slate-900">Study</span>
              <span className="text-[#7a4bf4]">Buddy</span>
            </div>
          </Link>

          {/* Navigation */}
          {showNav && isLoggedIn && (
            <>
              <nav className="hidden md:flex items-center gap-3">
                <Link to="/dashboard" className={`text-sm font-medium transition px-4 py-2 rounded-lg ${location.pathname === "/dashboard" ? "bg-[#7a4bf4] text-white" : "text-[#7a4bf4] hover:bg-[#f3ebff]"}`}>
                  To-do list
                </Link>
                <Link to="/assessment" className={`text-sm font-medium transition px-4 py-2 rounded-lg ${location.pathname === "/assessment" ? "bg-[#7a4bf4] text-white" : "text-[#7a4bf4] hover:bg-[#f3ebff]"}`}>
                  Assessment
                </Link>
                <Link to="/elink" className={`text-sm font-medium transition px-4 py-2 rounded-lg ${location.pathname === "/elink" ? "bg-[#7a4bf4] text-white" : "text-[#7a4bf4] hover:bg-[#f3ebff]"}`}>
                  E-link
                </Link>
                <Link to="/refbook" className={`text-sm font-medium transition px-4 py-2 rounded-lg ${location.pathname === "/refbook" ? "bg-[#7a4bf4] text-white" : "text-[#7a4bf4] hover:bg-[#f3ebff]"}`}>
                  Ref-Book
                </Link>
              </nav>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 relative z-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </>
          )}

          {/* Auth buttons */}
          {!isLoggedIn && (
            <div className="flex items-center gap-3 relative z-50">
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
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && isLoggedIn && (
          <nav className="md:hidden pb-4 border-t border-slate-200">
            <Link to="/dashboard" className={`block py-2 transition ${location.pathname === "/dashboard" ? "text-[#7a4bf4] font-medium" : "text-slate-700 hover:text-[#7a4bf4]"}`}>
              To-do list
            </Link>
            <Link to="/assessment" className={`block py-2 transition ${location.pathname === "/assessment" ? "text-[#7a4bf4] font-medium" : "text-slate-700 hover:text-[#7a4bf4]"}`}>
              Assessment
            </Link>
            <Link to="/elink" className={`block py-2 transition ${location.pathname === "/elink" ? "text-[#7a4bf4] font-medium" : "text-slate-700 hover:text-[#7a4bf4]"}`}>
              E-link
            </Link>
            <Link to="/refbook" className={`block py-2 transition ${location.pathname === "/refbook" ? "text-[#7a4bf4] font-medium" : "text-slate-700 hover:text-[#7a4bf4]"}`}>
              Ref-Book
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
