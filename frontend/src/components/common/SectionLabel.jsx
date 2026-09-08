import React from "react";
import MaterialIcon from "./MaterialIcon.jsx";

/**
 * React equivalent of ui_theme.py's render_section_label(): a small
 * uppercase mono label with a Material icon.
 */
export default function SectionLabel({ label, icon = "bolt" }) {
  return (
    <div className="ed-section-label">
      <MaterialIcon name={icon} size="20px" />
      {label}
    </div>
  );
}
