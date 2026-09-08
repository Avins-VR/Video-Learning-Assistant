import React, { useState } from "react";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

/**
 * React equivalent of chat_page.py's st.form-based question input row:
 * a text input plus a "Send" button, clearing on submit.
 */
export default function ChatInput({ onSubmit, disabled = false }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end" }}>
        <div style={{ flex: 5 }}>
          <Input
            label="Ask a question"
            hideLabel
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Can you explain that last concept again?"
          />
        </div>
        <div style={{ flex: 1 }}>
          <Button type="submit" icon="send" fullWidth disabled={disabled}>
            Send
          </Button>
        </div>
      </div>
    </form>
  );
}
