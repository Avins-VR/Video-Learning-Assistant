import React from "react";
import MaterialIcon from "../common/MaterialIcon.jsx";

/**
 * Renders one user/assistant exchange pair, matching the Streamlit
 * chat_page.py render_chat_history() bubble markup exactly (user
 * bubble right-aligned with gradient fill, assistant bubble
 * left-aligned with glass fill).
 */
export default function ChatBubble({ question, answer }) {
  return (
    <>
      <div className="ed-bubble-row user">
        <div className="ed-bubble user">
          <span className="ed-bubble-label">
            <MaterialIcon name="person" size="13px" />
            You
          </span>
          {question}
        </div>
      </div>
      <div className="ed-bubble-row assistant">
        <div className="ed-bubble assistant">
          <span className="ed-bubble-label">
            <MaterialIcon name="smart_toy" size="13px" />
            Tutor
          </span>
          {answer}
        </div>
      </div>
    </>
  );
}
