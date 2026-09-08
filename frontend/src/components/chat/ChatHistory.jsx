import React from "react";
import Card from "../common/Card.jsx";
import MaterialIcon from "../common/MaterialIcon.jsx";
import ChatBubble from "./ChatBubble.jsx";

/**
 * React equivalent of chat_page.py's render_chat_history(): renders the
 * empty state, or walks chatHistory in user/assistant pairs exactly as
 * the Streamlit version does.
 */
export default function ChatHistory({ chatHistory }) {
  if (!chatHistory || chatHistory.length === 0) {
    return (
      <Card>
        <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <MaterialIcon name="forum" size="20px" />
          No questions yet — ask your first one below.
        </p>
      </Card>
    );
  }

  const pairs = [];
  let currentUser = null;
  for (const message of chatHistory) {
    if (message.role === "user") {
      currentUser = message.content;
    } else if (message.role === "assistant") {
      pairs.push({ question: currentUser, answer: message.content });
    }
  }

  return (
    <div className="ed-chat-scroll">
      {pairs.map((pair, idx) => (
        <ChatBubble key={idx} question={pair.question} answer={pair.answer} />
      ))}
    </div>
  );
}
