import React from "react";
import s from "./UI.module.css";

export function Button({ children, variant = "primary", size = "md", loading, className = "", ...p }) {
  return (
    <button className={`${s.btn} ${s[variant]} ${s[size]} ${className}`} disabled={loading || p.disabled} {...p}>
      {loading && <span className={s.spin} aria-hidden />}
      <span style={loading ? { opacity: 0.7 } : {}}>{children}</span>
    </button>
  );
}

export function Input({ label, error, hint, className = "", ...p }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label}>{label}</label>}
      {hint && <p className={s.hint}>{hint}</p>}
      <input className={`${s.input} ${error ? s.inputErr : ""} ${className}`} {...p} />
      {error && <span className={s.err}>{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, className = "", ...p }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label}>{label}</label>}
      <textarea className={`${s.textarea} ${error ? s.inputErr : ""} ${className}`} {...p} />
      {error && <span className={s.err}>{error}</span>}
    </div>
  );
}

export function Alert({ children, variant = "danger" }) {
  return <div className={`${s.alert} ${s["alert_" + variant]}`}>{children}</div>;
}

export function Spinner({ size = 28 }) {
  return <span className={s.spinnerLg} style={{ width: size, height: size }} />;
}

export function Badge({ children, color = "indigo" }) {
  return <span className={`${s.badge} ${s["badge_" + color]}`}>{children}</span>;
}
