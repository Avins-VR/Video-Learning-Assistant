import React from "react";
import MaterialIcon from "../common/MaterialIcon.jsx";

const ICONS = {
  info: "info",
  success: "check_circle",
  warning: "warning",
  error: "error",
};

/**
 * React equivalent of st.error() / st.warning() / st.success() /
 * st.info(), all rendered through Streamlit's shared stAlert styling.
 */
export default function Alert({ type = "info", children }) {
  return (
    <div className={`ed-alert ${type}`}>
      <MaterialIcon name={ICONS[type] || "info"} size="18px" />
      <span>{children}</span>
    </div>
  );
}
