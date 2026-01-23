import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
  showNav?: boolean;
}

export default function Header({ isLoggedIn = false, showNav = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-pink-300 rounded-full flex items-center justify-center text-sm font-bold text-primary">
              SB
            </div>
            <div className="text-xl font-bold">
              <span className="text-black">Study</span>
              <span className="text-primary">Buddy</span>
            </div>
          </Link>

          {/* Navigation */}
          {showNav && isLoggedIn && (
            <>
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/dashboard" className="text-foreground hover:text-primary text-sm font-medium transition">
                  To-do list
                </Link>
                <Link to="/assessment" className="text-foreground hover:text-primary text-sm font-medium transition">
                  Assessment
                </Link>
                <Link to="/elink" className="text-foreground hover:text-primary text-sm font-medium transition">
                  E-link
                </Link>
                <Link to="/refbook" className="text-foreground hover:text-primary text-sm font-medium transition">
                  Ref-Book
                </Link>
              </nav>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </>
          )}

          {/* Auth buttons */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-foreground hover:text-primary text-sm font-medium transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition text-sm"
              >
                Create free account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && isLoggedIn && (
          <nav className="md:hidden pb-4 border-t border-border">
            <Link to="/dashboard" className="block py-2 text-foreground hover:text-primary transition">
              To-do list
            </Link>
            <Link to="/assessment" className="block py-2 text-foreground hover:text-primary transition">
              Assessment
            </Link>
            <Link to="/elink" className="block py-2 text-foreground hover:text-primary transition">
              E-link
            </Link>
            <Link to="/refbook" className="block py-2 text-foreground hover:text-primary transition">
              Ref-Book
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
