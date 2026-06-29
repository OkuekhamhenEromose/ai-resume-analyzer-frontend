import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import { RegisterPage, LoginPage } from "./components/auth/AuthPages.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import s from "./App.module.css";

/* ── Redirect logged-in users away from guest-only pages ───── */
function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

/* ── Require authentication ─────────────────────────────────── */
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className={s.shell}>
      <Navbar />
      <div className={s.main}>{children}</div>
    </div>
  );
}

/* ── Full-page spinner shown while auth state loads ─────────── */
function PageLoader() {
  return (
    <div className={s.loaderWrap}>
      <span className={s.loader} aria-label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Welcome / landing — public ── */}
        <Route path="/welcome" element={<WelcomePage />} />

        {/* ── Auth pages — guests only ── */}
        <Route
          path="/login"
          element={<GuestOnly><LoginPage /></GuestOnly>}
        />
        <Route
          path="/register"
          element={<GuestOnly><RegisterPage /></GuestOnly>}
        />

        {/* ── Main app — protected ── */}
        <Route
          path="/app"
          element={<Protected><HomePage /></Protected>}
        />

        {/* ── Root: send unauthenticated users to welcome page ── */}
        <Route
          path="/"
          element={<RootRedirect />}
        />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </AuthProvider>
  );
}

/* Root redirect: logged-in → /app, guest → /welcome */
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return <Navigate to={user ? "/app" : "/welcome"} replace />;
}
