import React from "react";

/**
 * React equivalent of st.multiselect(). `options` is an array of
 * { value, label }; `values` / `onChange` behave like a controlled
 * multi-select using the native <select multiple>.
 */
export default function MultiSelect({ values, onChange, options, label }) {
  const handleChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    onChange(selected);
  };
  return (
    <div>
      {label && (
        <label className="ed-caption" style={{ display: "block", marginBottom: "0.35rem" }}>
          {label}
        </label>
      )}
      <select multiple className="ed-select" value={values} onChange={handleChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
