import React from "react";

/** React equivalent of st.checkbox(). */
export default function Checkbox({ checked, onChange, label, id }) {
  const checkId = id || `ed-checkbox-${label ? label.replace(/\s+/g, "-").toLowerCase() : "field"}`;
  return (
    <label htmlFor={checkId} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
      <input id={checkId} type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
