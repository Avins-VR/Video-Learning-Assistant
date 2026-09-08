import React from "react";

/** React equivalent of st.toggle(), used for MCQ "Quiz mode". */
export default function Toggle({ checked, onChange, label }) {
  return (
    <div
      className="ed-toggle"
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <div className={`ed-toggle-track ${checked ? "on" : ""}`}>
        <div className="ed-toggle-thumb" />
      </div>
      <span>{label}</span>
    </div>
  );
}
