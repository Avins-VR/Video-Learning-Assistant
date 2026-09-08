import React, { createContext, useState, useCallback } from "react";

/**
 * AppContext
 *
 * Mirrors session_utils.py's initialize_session_state(): every key that
 * previously lived in st.session_state now lives here, with the exact
 * same default values, so every page can read/write shared state the
 * same way the Streamlit pages did.
 */

const defaults = {
  currentVideoId: null,
  videoUrl: null,
  transcript: null,
  videoDuration: 0,
  numChunks: 0,
  transcriptLength: 0,
  videoProcessed: false,
  collectionName: null,

  summary: null,
  summaryGenerated: false,

  notes: [],
  notesGenerated: false,

  chatHistory: [],

  lastAnswer: null,
  lastQuestion: null,
  lastRetrievedChunks: [],

  // Phase 3: MCQ Assessment
  mcqs: [],
  mcqsGenerated: false,
  mcqQuizMode: false,
  mcqUserAnswers: {},
  mcqSubmitted: false,

  // Phase 3: Learning Path recommendations
  recommendations: [],
  recommendationsGenerated: false,

  // Phase 4: Concept Map
  conceptMap: null,
  conceptMapGenerated: false,

  // Optional debugging
  lastSummaryChunks: [],
  lastNotesChunks: [],
};

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(defaults);

  // Generic setter mirroring `st.session_state.key = value`
  const setField = useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Batch setter mirroring assigning several session_state keys at once
  const setFields = useCallback((partial) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetForNewVideo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      chatHistory: [],
      lastAnswer: null,
      lastQuestion: null,
      lastRetrievedChunks: [],
      mcqs: [],
      mcqsGenerated: false,
      mcqUserAnswers: {},
      mcqSubmitted: false,
      recommendations: [],
      recommendationsGenerated: false,
      conceptMap: null,
      conceptMapGenerated: false,
    }));
  }, []);

  const value = { ...state, setField, setFields, resetForNewVideo };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
