import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import ELink from "./pages/ELink";
import RefBook from "./pages/RefBook";
import NotFound from "./pages/NotFound";

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setLoading(false);
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

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;
