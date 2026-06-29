import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Alert, Button, Input } from "../ui/index.jsx";
import styles from "./AuthForm.module.css";

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Name is required.";
    if (!form.email.includes("@")) e.email = "Enter a valid email.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      await register(form.email, form.password, form.full_name);
      navigate("/analyze");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
    error: errors[key],
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start scoring your resume in seconds"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {apiError && <Alert>{apiError}</Alert>}
        <Input label="Full name" type="text" placeholder="Jane Doe" {...field("full_name")} />
        <Input label="Email" type="email" placeholder="jane@example.com" autoComplete="email" {...field("email")} />
        <Input label="Password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" {...field("password")} />
        <Button type="submit" variant="accent" size="lg" loading={loading} className={styles.submitBtn}>
          Create account
        </Button>
        <p className={styles.switch}>
          Already have an account?{" "}
          <Link to="/login" className={styles.switchLink}>Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/analyze");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue analyzing">
      <form onSubmit={handleSubmit} className={styles.form}>
        {apiError && <Alert>{apiError}</Alert>}
        <Input label="Email" type="email" placeholder="jane@example.com" autoComplete="email" {...field("email")} />
        <Input label="Password" type="password" placeholder="Your password" autoComplete="current-password" {...field("password")} />
        <Button type="submit" variant="accent" size="lg" loading={loading} className={styles.submitBtn}>
          Log in
        </Button>
        <p className={styles.switch}>
          No account yet?{" "}
          <Link to="/register" className={styles.switchLink}>Sign up free</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.card}>
        <div className={styles.brandRow}>
          <div className={styles.brandMark}><Sparkles size={20} /></div>
          <span className={styles.brandName}>ResumeAI</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
