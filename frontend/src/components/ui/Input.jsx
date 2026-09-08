import React from "react";

/**
 * React equivalent of st.text_input(). Supports the
 * label_visibility="collapsed" pattern used throughout the app by
 * defaulting to a visually-hidden (but accessible) label.
 */
export default function Input({
  value,
  onChange,
  placeholder = "",
  label,
  hideLabel = false,
  id,
  onKeyDown,
  type = "text",
}) {
  const inputId = id || `ed-input-${label ? label.replace(/\s+/g, "-").toLowerCase() : "field"}`;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className={hideLabel ? "sr-only" : "ed-caption"} style={hideLabel ? { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" } : { display: "block", marginBottom: "0.35rem" }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="ed-text-input"
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
