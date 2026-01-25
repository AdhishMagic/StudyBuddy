import { Link, useLocation } from "react-router-dom";
import { Menu, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
  showNav?: boolean;
}

export default function Header({ isLoggedIn = false, showNav = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
  const location = useLocation();

  // Initialize theme on mount - check localStorage once
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme:', savedTheme);
    
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
    console.log('Theme changed to:', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

          {/* Navigation - Right Side */}
          {showNav && isLoggedIn && (
            <>
              <nav className="hidden md:flex items-center gap-3 mr-6">
                <Link to="/dashboard" className={`text-sm font-medium transition px-4 py-2 rounded-lg ${
                  location.pathname === "/dashboard" 
                    ? "bg-[#7a4bf4] text-white" 
                    : "text-slate-600 dark:text-slate-400 hover:text-[#7a4bf4] dark:hover:text-[#7a4bf4]"
                }`}>
                  To-do list
                </Link>
                <Link to="/assessment" className={`text-sm font-medium transition px-4 py-2 rounded-lg ${
                  location.pathname === "/assessment" 
                    ? "bg-[#7a4bf4] text-white" 
                    : "text-slate-600 dark:text-slate-400 hover:text-[#7a4bf4] dark:hover:text-[#7a4bf4]"
                }`}>
                  Assessment
                </Link>
                <Link to="/elink" className={`text-sm font-medium transition px-4 py-2 rounded-lg ${
                  location.pathname === "/elink" 
                    ? "bg-[#7a4bf4] text-white" 
                    : "text-slate-600 dark:text-slate-400 hover:text-[#7a4bf4] dark:hover:text-[#7a4bf4]"
                }`}>
                  E-link
                </Link>
                <Link to="/refbook" className={`text-sm font-medium transition px-4 py-2 rounded-lg ${
                  location.pathname === "/refbook" 
                    ? "bg-[#7a4bf4] text-white" 
                    : "text-slate-600 dark:text-slate-400 hover:text-[#7a4bf4] dark:hover:text-[#7a4bf4]"
                }`}>
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

          {/* Auth buttons and theme toggle */}
          <div className="flex items-center gap-3 relative z-50">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

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
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && isLoggedIn && (
          <nav className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-800">
            <Link to="/dashboard" className={`block py-2 transition ${location.pathname === "/dashboard" ? "text-[#7a4bf4] font-medium" : "text-slate-600 dark:text-slate-400 hover:text-[#7a4bf4]"}`}>
              To-do list
            </Link>
            <Link to="/assessment" className={`block py-2 transition ${location.pathname === "/assessment" ? "text-[#7a4bf4] font-medium" : "text-slate-600 dark:text-slate-400 hover:text-[#7a4bf4]"}`}>
              Assessment
            </Link>
            <Link to="/elink" className={`block py-2 transition ${location.pathname === "/elink" ? "text-[#7a4bf4] font-medium" : "text-slate-600 dark:text-slate-400 hover:text-[#7a4bf4]"}`}>
              E-link
            </Link>
            <Link to="/refbook" className={`block py-2 transition ${location.pathname === "/refbook" ? "text-[#7a4bf4] font-medium" : "text-slate-600 dark:text-slate-400 hover:text-[#7a4bf4]"}`}>
              Ref-Book
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
