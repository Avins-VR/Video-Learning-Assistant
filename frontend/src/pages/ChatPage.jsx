import React, { useState } from "react";
import SectionLabel from "../components/common/SectionLabel.jsx";
import NoVideoNotice from "../components/common/NoVideoNotice.jsx";
import ChatHistory from "../components/chat/ChatHistory.jsx";
import ChatInput from "../components/chat/ChatInput.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";
import useAppContext from "../hooks/useAppContext.js";
import { askDoubt } from "../services/api/chat.js";
import {
  EmptyQuestionError,
  EmbeddingGenerationError,
  VectorStoreError,
  LLMGenerationError,
} from "../utils/exceptions.js";

function cleanAnswer(answer) {
  if (!answer) return "";
  return answer.replace(/<[^>]*>/g, "").trim();
}

/**
 * React port of pages/chat_page.py: the Doubt Clarification chat
 * interface — retrieval spinner, "Thinking..." spinner, chat history,
 * and the question input form, all preserved exactly.
 */
export default function ChatPage() {
  const { videoProcessed, currentVideoId, chatHistory, setFields } = useAppContext();
  const [stage, setStage] = useState(null); // null | "retrieving" | "thinking"
  const [alert, setAlert] = useState(null); // { type, message }

  async function handleUserQuestion(question) {
    setAlert(null);
    try {
      if (!question || !question.trim()) {
        throw new EmptyQuestionError("Please enter a question before submitting.");
      }

      setStage("retrieving");
      const response = (await askDoubt(currentVideoId, question)).data;
      const retrievedChunks = response?.retrieved_chunks ?? [];

      setStage("thinking");
      const answer = cleanAnswer(response?.answer ?? "");

      const newHistory = [
        ...chatHistory,
        { role: "user", content: question },
        { role: "assistant", content: answer },
      ];

      setFields({
        chatHistory: newHistory,
        lastQuestion: question,
        lastAnswer: answer,
        lastRetrievedChunks: retrievedChunks,
      });
    } catch (exc) {
      if (exc instanceof EmptyQuestionError) {
        setAlert({ type: "warning", message: exc.message });
      } else if (exc instanceof EmbeddingGenerationError) {
        setAlert({ type: "error", message: exc.message });
      } else if (exc instanceof VectorStoreError) {
        setAlert({ type: "error", message: exc.message });
      } else if (exc instanceof LLMGenerationError) {
        setAlert({ type: "error", message: exc.message });
      } else {
        setAlert({ type: "error", message: `An unexpected error occurred: ${exc.message || exc}` });
      }
    } finally {
      setStage(null);
    }
  }

  function handleClearChat() {
    setFields({ chatHistory: [] });
  }

  if (!videoProcessed || !currentVideoId) {
    return (
      <div>
        <NoVideoNotice pageName="Doubt Clarification" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "0.6rem" }}>
        <Button variant="secondary" icon="delete" onClick={handleClearChat}>
          Clear Chat
        </Button>
      </div>

      <SectionLabel label={`Chat · ${Math.floor(chatHistory.length / 2)} question(s) asked`} icon="forum" />

      <ChatHistory chatHistory={chatHistory} />

      {stage === "retrieving" && <Spinner label="Retrieving relevant transcript sections..." />}
      {stage === "thinking" && <Spinner label="Thinking..." />}
      {alert && <Alert type={alert.type}>{alert.message}</Alert>}

      <div style={{ marginTop: "0.8rem" }}>
        <ChatInput onSubmit={handleUserQuestion} disabled={stage !== null} />
      </div>
    </div>
  );
}
