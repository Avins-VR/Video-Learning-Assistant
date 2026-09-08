import React from "react";
import Card from "./Card.jsx";
import MaterialIcon from "./MaterialIcon.jsx";

/**
 * React equivalent of ui_theme.py's render_no_video_notice(): the
 * friendly empty-state notice shown on every stage page until a video
 * has been processed on the Learn stage.
 */
export default function NoVideoNotice({ pageName }) {
  return (
    <Card>
      <p style={{ margin: 0, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <MaterialIcon name="info" size="23px" />
          <span
              style={{
              fontSize: "14px"
            }}
          >
          No video has been processed yet. Head to <strong style={{ color: "var(--text)" }}>Learn</strong>,
          paste a YouTube URL, and come back to {pageName} once it&apos;s done.
        </span>
      </p>
    </Card>
  );
}
