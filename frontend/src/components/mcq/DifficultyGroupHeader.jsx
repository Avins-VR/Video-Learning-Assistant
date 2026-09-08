import React from "react";

/**
 * React equivalent of ui_theme.py's render_difficulty_group_header().
 */
export default function DifficultyGroupHeader({ title, cssClass }) {
  return (
    <div className={`ed-group-header ${cssClass}`}>
      <span className="ed-diff-dot" />
      {title}
    </div>
  );
}
