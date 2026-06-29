import React from "react";
import styles from "./ui.module.css";

/* ── Button ──────────────────────────────────────────────────── */
export function Button({ children, variant = "primary", size = "md", loading = false, className = "", ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn-${variant}`]} ${styles[`btn-${size}`]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden />}
      <span className={loading ? styles.loadingText : ""}>{children}</span>
    </button>
  );
}

/* ── Input ───────────────────────────────────────────────────── */
export function Input({ label, error, className = "", ...props }) {
  return (
    <div className={styles.inputWrap}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${error ? styles.inputError : ""} ${className}`} {...props} />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

/* ── Textarea ────────────────────────────────────────────────── */
export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className={styles.inputWrap}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea className={`${styles.textarea} ${error ? styles.inputError : ""} ${className}`} {...props} />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────── */
export function Badge({ children, variant = "default" }) {
  return <span className={`${styles.badge} ${styles[`badge-${variant}`]}`}>{children}</span>;
}

/* ── Card ────────────────────────────────────────────────────── */
export function Card({ children, className = "", glass = false, ...props }) {
  return (
    <div className={`${styles.card} ${glass ? styles.cardGlass : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}

/* ── Spinner ─────────────────────────────────────────────────── */
export function Spinner({ size = 24, className = "" }) {
  return (
    <span
      className={`${styles.spinnerStandalone} ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}

/* ── Alert ───────────────────────────────────────────────────── */
export function Alert({ children, variant = "danger" }) {
  return <div className={`${styles.alert} ${styles[`alert-${variant}`]}`}>{children}</div>;
}
