import React from "react";

/**
 * React equivalent of ui_theme.py's render_path_node(): one node of
 * the Learning Path timeline.
 */
export default function PathNode({ num, topic, reason }) {
  return (
    <div className="ed-path-node">
      <div className="ed-path-num">{String(num).padStart(2, "0")}</div>
      <div className="ed-path-content">
        <div className="ed-path-topic">{topic}</div>
        <div className="ed-path-reason">{reason}</div>
      </div>
    </div>
  );
}
