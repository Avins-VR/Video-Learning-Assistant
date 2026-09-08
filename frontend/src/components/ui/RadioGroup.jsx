import React from "react";

/**
 * React equivalent of st.radio(). `options` is an array of
 * { value, label }.
 */
export default function RadioGroup({ name, value, onChange, options, hideLabel = false }) {
  return (
    <div role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.4rem",
            cursor: "pointer",
            color: "var(--text)",
          }}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <span className={hideLabel ? "sr-only" : undefined}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
