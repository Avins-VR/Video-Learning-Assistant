import React from "react";

/** React equivalent of st.progress(). `value` is 0-100. */
export default function Progress({ value = 0 }) {
  return (
    <div
      style={{
        width: "100%",
        height: "8px",
        borderRadius: "999px",
        background: "var(--glass-strong)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          background: "var(--grad)",
          transition: "width 0.25s ease",
        }}
      />
    </div>
  );
}
