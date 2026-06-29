import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import s from "./AuthPages.module.css";

/* ── Shared gradient background + white card shell ─────────── */
function AuthShell({ title, children, footerText, footerLinkTo, footerLinkLabel }) {
  return (
    <div className={s.page}>
      {/* Animated blobs */}
      <div className={s.blob1} aria-hidden />
      <div className={s.blob2} aria-hidden />
      <div className={s.blob3} aria-hidden />

      <div className={s.card}>
        {/* Brand at top of card */}
        <div className={s.brand}>
          <div className={s.brandMark}>R</div>
          <span className={s.brandName}>ResumeIQ</span>
        </div>

        <h1 className={s.title}>{title}</h1>

        {children}

        {footerLinkTo && (
          <p className={s.footer}>
            {footerText}{" "}
            <Link to={footerLinkTo} className={s.footerLink}>
              {footerLinkLabel}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Underline input with leading icon ──────────────────────── */
function AuthInput({ icon, type = "text", placeholder, value, onChange, error, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={s.fieldWrap}>
      <div className={`${s.inputRow} ${focused ? s.inputRowFocused : ""} ${error ? s.inputRowError : ""}`}>
        <span className={s.inputIcon} aria-hidden>{icon}</span>
        <input
          className={s.input}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      {error && <span className={s.fieldError}>{error}</span>}
    </div>
  );
}

/* ── Gradient CTA button (matching screenshot) ──────────────── */
function GradientButton({ children, loading, type = "button", onClick }) {
  return (
    <button
      type={type}
      className={s.gradBtn}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? (
        <span className={s.btnSpinner} aria-hidden />
      ) : null}
      <span style={loading ? { opacity: 0.7 } : {}}>{children}</span>
    </button>
  );
}

/* ── Error alert ────────────────────────────────────────────── */
function AuthAlert({ message }) {
  if (!message) return null;
  return <div className={s.alert}>{message}</div>;
}

/* ══════════════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════════════ */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [apiErr, setApiErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setApiErr(""); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/app");
    } catch (err) {
      setApiErr(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Login"
      footerText="Don't have an account?"
      footerLinkTo="/register"
      footerLinkLabel="Sign up free"
    >
      <form onSubmit={submit} className={s.form}>
        <AuthAlert message={apiErr} />

        <div className={s.fieldGroup}>
          <label className={s.label}>Username</label>
          <AuthInput
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            }
            type="email"
            placeholder="Type your username"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </div>

        <div className={s.fieldGroup}>
          <label className={s.label}>Password</label>
          <AuthInput
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
            type="password"
            placeholder="Type your password"
            value={form.password}
            onChange={set("password")}
            autoComplete="current-password"
          />
        </div>

        <div className={s.forgotRow}>
          <span className={s.forgotLink}>Forgot password?</span>
        </div>

        <GradientButton type="submit" loading={loading}>
          LOGIN
        </GradientButton>
      </form>
    </AuthShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   REGISTER PAGE
══════════════════════════════════════════════════════════════ */
export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", profession: "" });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.profession.trim()) e.profession = "Profession is required.";
    if (!form.email.includes("@")) e.email = "Enter a valid email.";
    if (form.password.length < 8) e.password = "Minimum 8 characters.";
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setApiErr(""); setLoading(true);
    try {
      await register(form.email, form.password, form.profession);
      navigate("/app");
    } catch (err) {
      setApiErr(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create Account"
      footerText="Already have an account?"
      footerLinkTo="/login"
      footerLinkLabel="Log in"
    >
      <form onSubmit={submit} className={s.form}>
        <AuthAlert message={apiErr} />

        <div className={s.fieldGroup}>
          <label className={s.label}>Profession</label>
          <AuthInput
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            }
            type="text"
            placeholder="e.g. Software Engineer"
            value={form.profession}
            onChange={set("profession")}
            error={errors.profession}
          />
        </div>

        <div className={s.fieldGroup}>
          <label className={s.label}>Email</label>
          <AuthInput
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            }
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
          />
        </div>

        <div className={s.fieldGroup}>
          <label className={s.label}>Password</label>
          <AuthInput
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            autoComplete="new-password"
          />
        </div>

        <GradientButton type="submit" loading={loading}>
          CREATE ACCOUNT
        </GradientButton>
      </form>
    </AuthShell>
  );
}
