import React from "react";
import MaterialIcon from "../common/MaterialIcon.jsx";

/**
 * React equivalent of st.spinner(): shows a spinning loader with a
 * status message beneath it, matching the Streamlit inline spinner
 * used while polling the Groq API or ChromaDB.
 */
export default function Spinner({ label = "Loading..." }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--text-dim)", padding: "0.6rem 0" }}>
      <span
        className="msi"
        style={{
          fontSize: "20px",
          display: "inline-block",
          animation: "ed-spin 0.9s linear infinite",
        }}
      >
        progress_activity
      </span>
      <span>{label}</span>
      <style>{`@keyframes ed-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}
