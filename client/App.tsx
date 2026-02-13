import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Assessment from "@/pages/Assessment";
import ELink from "@/pages/ELink";
import RefBook from "@/pages/RefBook";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { apiGetMe, getAuthToken } from "@/services/api";

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = getAuthToken();
      if (!token) {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
        setLoading(false);
        return;
      }

      try {
        const me = await apiGetMe();
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...me,
            displayName: me.name,
            authProvider: "google",
            lastLogin: new Date().toISOString(),
          })
        );
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      } catch {
        try {
          localStorage.removeItem("authToken");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
        } catch {
          // ignore
        }
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 text-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <Assessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/elink"
        element={
          <ProtectedRoute>
            <ELink />
          </ProtectedRoute>
        }
      />
      <Route
        path="/refbook"
        element={
          <ProtectedRoute>
            <RefBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;
