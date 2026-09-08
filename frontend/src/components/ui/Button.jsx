import React from "react";
import MaterialIcon from "../common/MaterialIcon.jsx";

/**
 * React equivalent of st.button() / st.form_submit_button() /
 * st.download_button(). `variant="primary"` matches the gradient
 * .stButton styling; `variant="secondary"` matches .stDownloadButton.
 */
export default function Button({
  children,
  icon,
  variant = "primary",
  fullWidth = false,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  const base = variant === "secondary" ? "ed-btn-secondary" : "ed-btn-primary";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
      style={fullWidth ? { width: "100%" } : undefined}
    >
      {icon && <MaterialIcon name={icon} size="18px" />}
      {children}
    </button>
  );
}
