import React from "react";

/**
 * React equivalent of st.selectbox(). `options` is an array of
 * { value, label }.
 */
export default function Select({ value, onChange, options, label, hideLabel = false, id }) {
  const selectId = id || `ed-select-${label ? label.replace(/\s+/g, "-").toLowerCase() : "field"}`;
  return (
    <div>
      {label && !hideLabel && (
        <label htmlFor={selectId} className="ed-caption" style={{ display: "block", marginBottom: "0.35rem" }}>
          {label}
        </label>
      )}
      <select id={selectId} className="ed-select" value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
