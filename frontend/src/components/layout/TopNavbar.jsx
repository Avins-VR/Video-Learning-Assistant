import React from "react";
import { Link, useLocation } from "react-router-dom";
import MaterialIcon from "../common/MaterialIcon.jsx";
import useAppContext from "../../hooks/useAppContext.js";

/**
 * React equivalent of ui_theme.py's render_top_navbar(): the shared
 * sticky glass "Stage Rail" navigation — brand strip, a decorative
 * numbered progress line, and a row of real links beneath it (the
 * active stage shown as static text, exactly like the Streamlit
 * version's st.page_link layout).
 */
export const STAGES = [
  { key: "learn", num: "01", label: "Learn", icon: "play_circle", path: "/" },
  { key: "notes", num: "02", label: "Key Notes", icon: "sticky_note_2", path: "/notes" },
  { key: "doubt", num: "03", label: "Doubt Clarification", icon: "forum", path: "/chat" },
  { key: "mcq", num: "04", label: "MCQ Assessment", icon: "quiz", path: "/mcq" },
  { key: "path", num: "05", label: "Learning Path", icon: "route", path: "/recommendations" },
  { key: "concept_map", num: "06", label: "Concept Map", icon: "account_tree", path: "/concept-map" },
];

export default function TopNavbar() {
  const location = useLocation();
  const { videoProcessed } = useAppContext();

  const activeIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.path === location.pathname)
  );

  const pillReady = Boolean(videoProcessed);

  return (
    <div className="ed-navbar-shell">
      <div className="ed-brand-row">
        <div>
          <Link to="/" className="ed-brand">
            <span className="ed-brand-icon">
              <MaterialIcon name="auto_awesome" size="27px" style={{ color: "#000000" }} />
            </span>
            Intelligent YouTube Learn AI
          </Link>
          <div className="ed-brand-tagline">AI-Powered Educational Video Learning Assistant</div>
        </div>
        <div className={`ed-status-pill ${pillReady ? "ready" : ""}`}>
          <MaterialIcon name={pillReady ? "check_circle" : "radio_button_unchecked"} size="15px" />
          {pillReady ? "Video ready" : "No video processed yet"}
        </div>
      </div>

      {/* Decorative progress rail (line + numbered nodes) */}
      <div className="ed-rail">
        {STAGES.map((stage, i) => (
          <React.Fragment key={stage.key}>
            {i > 0 && (
              <div className={`ed-rail-connector ${i <= activeIndex ? "filled" : "spacer"}`} />
            )}
            <div
              className={`ed-rail-node ${
                i === activeIndex ? "active" : i < activeIndex ? "done" : ""
              }`}
            >
              {stage.num}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Real clickable labels beneath the rail */}
      <div className="ed-rail-labels-row" style={{ gridTemplateColumns: `repeat(${STAGES.length}, 1fr)` }}>
        {STAGES.map((stage, i) =>
          i === activeIndex ? (
            <span className="ed-rail-label-active" key={stage.key}>
              {stage.label}
            </span>
          ) : (
            <Link className="ed-rail-label-link" to={stage.path} key={stage.key}>
              {stage.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
