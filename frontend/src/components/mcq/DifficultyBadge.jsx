import React from "react";

/**
 * React equivalent of ui_theme.py's render_difficulty_badge().
 */
export default function DifficultyBadge({ difficulty }) {
  const cssClass = ["easy", "medium", "hard"].includes((difficulty || "").toLowerCase())
    ? difficulty.toLowerCase()
    : "";
  return (
    <span className={`ed-difficulty-badge ${cssClass}`}>
      <span className="ed-diff-dot" />
      {difficulty}
    </span>
  );
}
