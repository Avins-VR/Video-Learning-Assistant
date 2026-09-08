import React from "react";
import { Routes, Route } from "react-router-dom";
import LearnPage from "../pages/LearnPage.jsx";
import NotesPage from "../pages/NotesPage.jsx";
import ChatPage from "../pages/ChatPage.jsx";
import MCQPage from "../pages/MCQPage.jsx";
import RecommendationsPage from "../pages/RecommendationsPage.jsx";
import ConceptMapPage from "../pages/ConceptMapPage.jsx";

/**
 * Route table mirroring the six Streamlit st.Page stages registered
 * in app.py's main(): learn, notes, doubt, mcq, path, concept_map.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LearnPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/mcq" element={<MCQPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/concept-map" element={<ConceptMapPage />} />
    </Routes>
  );
}
