import React from "react";

/**
 * Top-level error boundary.
 *
 * Without this, any unhandled render error (a bad import, a crash in
 * AuthContext, a missing env var used incorrectly, etc.) causes React to
 * unmount the entire tree — which is exactly what produces a blank white
 * page in production with zero on-screen indication of what went wrong.
 *
 * With this in place, the same crash instead renders a visible, readable
 * error message so you (or a user) can actually diagnose it instead of
 * staring at a blank screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Still log to the console / your error tracker of choice
    console.error("ResumeIQ crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 32,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            background: "#f8f9fc",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #22d3ee, #818cf8, #e879f9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", maxWidth: 440, margin: 0 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8", maxWidth: 440 }}>
            Open your browser console (F12) for the full error and stack trace.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              padding: "10px 24px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontFamily: "inherit",
              color: "#fff",
              background: "linear-gradient(90deg, #22d3ee, #818cf8, #e879f9)",
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}