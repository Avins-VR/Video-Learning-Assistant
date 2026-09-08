import React from "react";
import MaterialIcon from "../common/MaterialIcon.jsx";

/**
 * React equivalent of app.py's `with st.status("Processing video...",
 * expanded=True) as status:` block — an expandable panel that logs
 * each pipeline step (`st.write(...)` calls) and ends in a
 * complete/error state.
 */
export default function ProcessingStatus({ label, state, steps, expanded = true }) {
  const icon = state === "error" ? "error" : state === "complete" ? "check_circle" : "progress_activity";
  const color = state === "error" ? "var(--rose)" : state === "complete" ? "var(--sage)" : "var(--cyan)";

  return (
    <details className="ed-status-widget" open={expanded} style={{ marginBottom: "0.9rem" }}>
      <summary style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 1.1rem", cursor: "pointer", color: "var(--text)", fontWeight: 600 }}>
        <MaterialIcon
            name={icon}
            size="18px"
            style={{
                color,
                display: "inline-block",
                animation:
                    state === "running"
                        ? "ed-spin 0.9s linear infinite"
                        : "none",
            }}
        />
        {label}
      </summary>
      <div style={{ padding: "0 1.1rem 0.9rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {steps.map((step, idx) => (
          <p key={idx} style={{ margin: 0, color: "var(--text-dim)", fontSize: "0.9rem" }}>
            {step}
          </p>
        ))}
      </div>
      <style>{`@keyframes ed-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </details>
  );
}
