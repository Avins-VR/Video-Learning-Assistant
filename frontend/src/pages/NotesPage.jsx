import React, { useState } from "react";
import SectionLabel from "../components/common/SectionLabel.jsx";
import Card from "../components/common/Card.jsx";
import MaterialIcon from "../components/common/MaterialIcon.jsx";
import NoVideoNotice from "../components/common/NoVideoNotice.jsx";
import NoteCard from "../components/notes/NoteCard.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";
import useAppContext from "../hooks/useAppContext.js";
import { generateKeyNotes } from "../services/api/notes.js";
import { downloadNotesPdf } from "../utils/pdf.js";
import { LLMGenerationError } from "../utils/exceptions.js";

/**
 * React port of pages/notes_page.py: displays the key notes generated
 * during video processing, with a Regenerate action and PDF download,
 * matching the [5, 1, 0.6] column layout of the original.
 */
export default function NotesPage() {
  const { videoProcessed, notes, currentVideoId, setFields } = useAppContext();
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleRegenerate() {
    setRegenerating(true);
    setError(null);
    try {
      const newNotes = (await generateKeyNotes(currentVideoId)).data?.notes ?? [];
      setFields({ notes: newNotes, notesGenerated: true });
    } catch (exc) {
      if (exc instanceof LLMGenerationError) {
        setError(exc.message);
      } else {
        setError(`An unexpected error occurred: ${exc.message || exc}`);
      }
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div>
      <SectionLabel label="Key Notes" icon="sticky_note_2" />

      {!videoProcessed ? (
        <NoVideoNotice pageName="Key Notes" />
      ) : (
        <>
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
            <p style={{ color: "var(--text-dim)", margin: 0, flex: "5 1 260px" }}>
              Concise, exam-ready takeaways extracted from this video&apos;s transcript.
            </p>
            <div style={{ flex: "1 1 140px" }}>
              <Button icon="refresh" fullWidth onClick={handleRegenerate} disabled={regenerating}>
                Regenerate
              </Button>
            </div>
            {notes && notes.length > 0 && (
              <div style={{ flex: "0.6 1 60px" }}>
                <Button variant="secondary" icon="download" fullWidth onClick={() => downloadNotesPdf(notes)}>
                  {""}
                </Button>
              </div>
            )}
          </div>

          {regenerating && <Spinner label="Regenerating key notes..." />}
          {error && <Alert type="error">{error}</Alert>}

          {!notes || notes.length === 0 ? (
            <Card>
              <p style={{ margin: 0, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <MaterialIcon name="info" size="20px" />
                No notes available yet for this video.
              </p>
            </Card>
          ) : (
            <div style={{ marginTop: "0.9rem" }}>
              {notes.map((note, idx) => (
                <NoteCard key={idx} note={note} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
