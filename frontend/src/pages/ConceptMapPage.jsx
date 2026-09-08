import React, { useState } from "react";
import SectionLabel from "../components/common/SectionLabel.jsx";
import Card from "../components/common/Card.jsx";
import MaterialIcon from "../components/common/MaterialIcon.jsx";
import NoVideoNotice from "../components/common/NoVideoNotice.jsx";
import StatGrid from "../components/common/StatGrid.jsx";
import MermaidDiagram from "../components/conceptMap/MermaidDiagram.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";
import useAppContext from "../hooks/useAppContext.js";
import { generateConceptMap } from "../services/api/conceptMap.js";
import { LLMGenerationError } from "../utils/exceptions.js";

/**
 * React port of pages/concept_map_page.py: generates a hierarchical
 * concept map (Main Topic -> Major Concepts -> Sub Concepts) built
 * from the video's summary and key notes, rendered as an interactive
 * Mermaid diagram alongside simple concept statistics.
 */
export default function ConceptMapPage() {
  const { videoProcessed, transcript, summary, notes, conceptMap, conceptMapGenerated, setFields } =
    useAppContext();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setNotice(null);
    try {
      const result = (await generateConceptMap(transcript, summary, notes)).data;
      if (!result) {
        setNotice(
          "Not enough processed content yet to build a concept map. Process a video on the Learn stage first."
        );
      } else {
        setFields({ conceptMap: result, conceptMapGenerated: true });
      }
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

  if (!videoProcessed) {
    return (
      <div>
        <SectionLabel label="Concept Map" icon="account_tree" />
        <NoVideoNotice pageName="Concept Map" />
      </div>
    );
  }

  return (
    <div>
      <SectionLabel label="Concept Map" icon="account_tree" />

      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "4 1 260px" }}>
          <Card style={{ padding: "1rem 1.3rem" }}>
            <p style={{ margin: 0, color: "var(--text-dim)", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
              <MaterialIcon name="info" size="20px" />
              <span>
                Generate a hierarchical knowledge map of this video - main topic, major concepts,
                and sub concepts - built from its summary and key notes.
              </span>
            </p>
          </Card>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <Button icon="auto_awesome" fullWidth onClick={handleGenerate} disabled={generating}>
            {conceptMapGenerated ? "Regenerate" : "Generate Map"}
          </Button>
        </div>
      </div>

      {generating && <Spinner label="Building concept map..." />}
      {error && <Alert type="error">{error}</Alert>}
      {notice && <Alert type="warning">{notice}</Alert>}

      {!conceptMapGenerated || !conceptMap ? (
        <div style={{ marginTop: "0.9rem" }}>
          <Card>
            <p style={{ margin: 0, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <MaterialIcon name="info" size="20px" />
              No concept map generated yet. Click <strong style={{ color: "var(--text)" }}>Generate Map</strong> above to build one.
            </p>
          </Card>
        </div>
      ) : (
        <>
          <SectionLabel label="Concept Statistics" icon="bar_chart" />
          <StatGrid
            stats={[
              { icon: "flag", value: "1", label: "Main Topic" },
              { icon: "psychology", value: String(conceptMap.stats.major_concept_count), label: "Major Concepts" },
              { icon: "hub", value: String(conceptMap.stats.subtopic_count), label: "Subtopics" },
              { icon: "bar_chart", value: String(conceptMap.stats.total_concepts), label: "Total Concepts" },
            ]}
          />

          <div className="ed-section-label" style={{ marginTop: "1.6rem" }}>
            <MaterialIcon name="flag" size="15px" />
            Main Topic
          </div>
          <Card style={{ padding: "0.9rem 1.3rem" }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.05rem", color: "var(--text)" }}>
              {conceptMap.stats.main_topic}
            </span>
          </Card>

          <SectionLabel label="Hierarchical Concept Map" icon="account_tree" />
          <MermaidDiagram code={conceptMap.mermaid} />
        </>
      )}
    </div>
  );
}
