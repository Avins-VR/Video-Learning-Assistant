import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import SectionLabel from "../components/common/SectionLabel.jsx";
import Card from "../components/common/Card.jsx";
import MaterialIcon from "../components/common/MaterialIcon.jsx";
import StatGrid from "../components/common/StatGrid.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import VideoUrlInput from "../components/upload/VideoUrlInput.jsx";
import ProcessingStatus from "../components/upload/ProcessingStatus.jsx";
import useAppContext from "../hooks/useAppContext.js";
import { getProcessedTranscript } from "../services/api/transcript.js";
import { generateSummary } from "../services/api/summary.js";
import { generateKeyNotes } from "../services/api/notes.js";
import { formatNumber } from "../utils/format.js";
import { downloadSummaryPdf } from "../utils/pdf.js";
import {
  InvalidYouTubeURLError,
  TranscriptNotFoundError,
  TranscriptFetchError,
  EmbeddingGenerationError,
  VectorStoreError,
  LLMGenerationError,
} from "../utils/exceptions.js";

/**
 * React port of app.py:
 *  - render_video_input_section()
 *  - render_transcript_stats()
 *  - render_summary_section()
 *  - process_video() (the full ingestion pipeline, orchestrated here
 *    against the mocked API services instead of direct Python calls)
 *
 * The pipeline logic, ordering, and session-state updates mirror the
 * original exactly; only the transport (Axios placeholders instead of
 * direct Python function calls) has changed.
 */
export default function LearnPage() {
  const ctx = useAppContext();
  const {
    videoProcessed,
    transcriptLength,
    numChunks,
    collectionName,
    summary,
    currentVideoId,
    setField,
    setFields,
    resetForNewVideo,
  } = ctx;

  const [processing, setProcessing] = useState(false);
  const [statusState, setStatusState] = useState("idle"); // idle | running | complete | error
  const [statusLabel, setStatusLabel] = useState("Processing video...");
  const [steps, setSteps] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);

  const pushStep = (text) => setSteps((prev) => [...prev, text]);

  async function processVideo(youtubeUrl) {
    setErrorMessage(null);
    setWarningMessage(null);
    setSteps([]);
    setStatusState("running");
    setStatusLabel("Processing video...");
    setProcessing(true);

    try {
      pushStep("Extracting video ID and fetching transcript...");
      const result = (await getProcessedTranscript(youtubeUrl)).data;
      const videoId = result.video_id;
      const cleanedTranscript = result.cleaned_transcript;
      const duration = result.duration || 0;

      pushStep("Cleaning and preparing transcript text...");

      const sameVideoAsBefore = currentVideoId === videoId;

      pushStep("Splitting transcript into semantic chunks...");
      const numChunksResult = result.num_chunks ?? 0;

      pushStep(`Generating embeddings for ${numChunksResult} chunks...`);
      pushStep("Storing embeddings in ChromaDB...");

      let finalSummary = summary;
      if (!(sameVideoAsBefore && summary)) {
        pushStep("Generating AI summary...");
        finalSummary = (await generateSummary(videoId, duration)).data?.summary ?? "";
      }

      let finalNotes = ctx.notes;
      if (!(sameVideoAsBefore && ctx.notes && ctx.notes.length)) {
        pushStep("Extracting key notes...");
        finalNotes = (await generateKeyNotes(videoId)).data?.notes ?? [];
      }

      setFields({
        currentVideoId: videoId,
        videoUrl: youtubeUrl,
        videoDuration: duration,
        transcript: cleanedTranscript,
        numChunks: numChunksResult,
        transcriptLength: cleanedTranscript.length,
        videoProcessed: true,
        collectionName: `video_${videoId}`,
        summary: finalSummary,
        notes: finalNotes,
      });

      if (!sameVideoAsBefore) {
        resetForNewVideo();
      }

      setStatusState("complete");
      setStatusLabel("Video processed successfully!");
    } catch (exc) {
      setStatusState("error");
      if (exc instanceof InvalidYouTubeURLError) {
        setStatusLabel("Invalid URL");
        setErrorMessage(exc.message);
      } else if (exc instanceof TranscriptNotFoundError) {
        setStatusLabel("Transcript unavailable");
        setErrorMessage(exc.message);
      } else if (exc instanceof TranscriptFetchError) {
        setStatusLabel("Transcript fetch failed");
        setErrorMessage(exc.message);
      } else if (exc instanceof EmbeddingGenerationError) {
        setStatusLabel("Embedding generation failed");
        setErrorMessage(exc.message);
      } else if (exc instanceof VectorStoreError) {
        setStatusLabel("Database error");
        setErrorMessage(exc.message);
      } else if (exc instanceof LLMGenerationError) {
        setStatusLabel("AI generation failed");
        setErrorMessage(exc.message);
      } else {
        setStatusLabel("Unexpected error");
        setErrorMessage(`An unexpected error occurred: ${exc.message || exc}`);
      }
      setField("videoProcessed", false);
    } finally {
      setProcessing(false);
    }
  }

  function handleProcess(youtubeUrl) {
    if (!youtubeUrl || !youtubeUrl.trim()) {
      setWarningMessage("Please enter a YouTube URL before processing.");
      return;
    }
    processVideo(youtubeUrl.trim());
  }

  const dbStatus = collectionName ? "Connected" : "Not Connected";

  return (
    <div>
      <SectionLabel label="Process Video" icon="link" />
      <VideoUrlInput onProcess={handleProcess} processing={processing} />

      {warningMessage && <Alert type="warning">{warningMessage}</Alert>}

      {statusState !== "idle" && (
        <div style={{ marginTop: "1rem" }}>
          <ProcessingStatus
            label={statusLabel}
            state={statusState}
            steps={steps}
            expanded={statusState !== "complete"}
          />
          {errorMessage && <Alert type="error">{errorMessage}</Alert>}
        </div>
      )}

      {!videoProcessed ? (
        <div style={{ marginTop: "1rem" }}>
          <Card>
            <p style={{ margin: 0, color: "var(--text-dim)", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
              <MaterialIcon name="info" size="23px" />
              <span
                  style={{
                      fontSize: "14px"
                  }}
              >
                Paste a YouTube lecture or talk URL above and click{" "}
                <strong style={{ color: "var(--text)" }}>Process Video</strong> to get started.
                Once processed, a summary appears below, and you can move through Key Notes,
                Doubt Clarification, MCQ Assessment, Learning Path, and Concept Map using the
                rail above.
              </span>
            </p>
          </Card>
        </div>
      ) : (
        <>
          <SectionLabel label="Transcript Overview" icon="analytics" />
          <StatGrid
            stats={[
              { icon: "description", value: formatNumber(transcriptLength), label: "Transcript Length" },
              { icon: "view_module", value: String(numChunks), label: "Chunks Created" },
              { icon: "check_circle", value: "Yes", label: "Video Processed" },
              { icon: "database", value: dbStatus, label: "Database Status" },
            ]}
          />
        </>
      )}

      {videoProcessed && summary && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <SectionLabel label="Summary" icon="article" />
            <Button variant="secondary" icon="download" onClick={() => downloadSummaryPdf(summary)}>
              {""}
            </Button>
          </div>
          <Card>
            <div className="ed-summary-text">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
