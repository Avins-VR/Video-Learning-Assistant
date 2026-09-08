import React, { useState } from "react";
import SectionLabel from "../components/common/SectionLabel.jsx";
import Card from "../components/common/Card.jsx";
import MaterialIcon from "../components/common/MaterialIcon.jsx";
import NoVideoNotice from "../components/common/NoVideoNotice.jsx";
import PathNode from "../components/recommendations/PathNode.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";
import useAppContext from "../hooks/useAppContext.js";
import { generateRecommendations } from "../services/api/recommendations.js";
import { LLMGenerationError } from "../utils/exceptions.js";

/**
 * React port of pages/recommendations_page.py: the Learning Path
 * stage — generates 5-10 recommended next topics as a progression
 * timeline built from the current video's summary and key notes.
 */
export default function RecommendationsPage() {
  const { videoProcessed, summary, notes, videoDuration, recommendations, setFields } = useAppContext();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const newRecs = (await generateRecommendations(summary, notes, videoDuration)).data?.recommendations ?? [];
      setFields({ recommendations: newRecs, recommendationsGenerated: true });
    } catch (exc) {
      if (exc instanceof LLMGenerationError) {
        setError(exc.message);
      } else {
        setError(`An unexpected error occurred: ${exc.message || exc}`);
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <SectionLabel label="Learning Path" icon="route" />

      {!videoProcessed ? (
        <NoVideoNotice pageName="Learning Path" />
      ) : (
        <>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <p style={{ color: "var(--text-dim)", margin: 0, flex: "4 1 260px" }}>
              Where to go next, based on what this video covered.
            </p>
            <div style={{ flex: "1.4 1 160px" }}>
              <Button icon="auto_awesome" fullWidth onClick={handleGenerate} disabled={generating}>
                {recommendations.length > 0 ? "Regenerate" : "Generate Path"}
              </Button>
            </div>
          </div>

          {generating && <Spinner label="Mapping out a learning path..." />}
          {error && <Alert type="error">{error}</Alert>}

          {recommendations.length === 0 ? (
            <Card>
              <p style={{ margin: 0, color: "var(--text-dim)", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <MaterialIcon name="info" size="20px" />
                <span>
                  No learning path generated yet. Click <strong style={{ color: "var(--text)" }}>Generate Path</strong>{" "}
                  above to get 5-10 recommended next topics based on this video.
                </span>
              </p>
            </Card>
          ) : (
            <Card>
              {recommendations.map((rec, idx) => (
                <PathNode key={idx} num={idx + 1} topic={rec.topic} reason={rec.reason} />
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}
