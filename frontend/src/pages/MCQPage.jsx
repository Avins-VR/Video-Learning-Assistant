import React, { useState } from "react";
import SectionLabel from "../components/common/SectionLabel.jsx";
import Card from "../components/common/Card.jsx";
import MaterialIcon from "../components/common/MaterialIcon.jsx";
import NoVideoNotice from "../components/common/NoVideoNotice.jsx";
import MCQCard from "../components/mcq/MCQCard.jsx";
import DifficultyGroupHeader from "../components/mcq/DifficultyGroupHeader.jsx";
import Button from "../components/ui/Button.jsx";
import Toggle from "../components/ui/Toggle.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";
import useAppContext from "../hooks/useAppContext.js";
import { generateMcqs } from "../services/api/mcq.js";
import { downloadMcqPdf } from "../utils/pdf.js";
import { LLMGenerationError } from "../utils/exceptions.js";

/**
 * React port of pages/mcq_page.py: MCQ generation, a "Quiz mode"
 * toggle, a review mode grouped by difficulty (Easy/Medium/Hard, in
 * that order), and a quiz mode with radio selection, submission, and
 * scored results — mirroring the Streamlit form/session-state flow.
 */
export default function MCQPage() {
  const {
    videoProcessed,
    currentVideoId,
    videoDuration,
    mcqs,
    mcqQuizMode,
    mcqUserAnswers,
    mcqSubmitted,
    setFields,
    setField,
  } = useAppContext();

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const newMcqs = (await generateMcqs(currentVideoId, videoDuration)).data?.mcqs ?? [];
      setFields({
        mcqs: newMcqs,
        mcqsGenerated: true,
        mcqUserAnswers: {},
        mcqSubmitted: false,
      });
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

  function handleSelect(qnum, key) {
    setField("mcqUserAnswers", { ...mcqUserAnswers, [String(qnum)]: key });
  }

  function handleSubmitQuiz(e) {
    e.preventDefault();
    setField("mcqSubmitted", true);
  }

  if (!videoProcessed) {
    return (
      <div>
        <SectionLabel label="MCQ Assessment" icon="quiz" />
        <NoVideoNotice pageName="MCQ Assessment" />
      </div>
    );
  }

  const score = mcqs.reduce(
    (acc, item, idx) => (mcqUserAnswers[String(idx + 1)] === item.correct_answer ? acc + 1 : acc),
    0
  );

  const easyMcqs = mcqs.filter((q) => q.difficulty === "Easy");
  const mediumMcqs = mcqs.filter((q) => q.difficulty === "Medium");
  const hardMcqs = mcqs.filter((q) => q.difficulty === "Hard");

  return (
    <div>
      <SectionLabel label="MCQ Assessment" icon="quiz" />

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <p style={{ color: "var(--text-dim)", margin: 0, flex: "3 1 220px" }}>
          Exam-style questions generated from this video&apos;s.
        </p>
        {mcqs.length > 0 && (
          <div style={{ flex: "1 1 120px" }}>
            <Toggle
              checked={mcqQuizMode}
              onChange={(val) => setField("mcqQuizMode", val)}
              label="Quiz mode"
            />
          </div>
        )}
        <div style={{ flex: "1.4 1 160px" }}>
          <Button icon="auto_awesome" fullWidth onClick={handleGenerate} disabled={generating}>
            {mcqs.length > 0 ? "Regenerate MCQs" : "Generate MCQs"}
          </Button>
        </div>
      </div>

      {generating && <Spinner label="Generating MCQs from the transcript..." />}
      {error && <Alert type="error">{error}</Alert>}

      {mcqs.length === 0 ? (
        <Card>
          <p style={{ margin: 0, color: "var(--text-dim)", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
            <MaterialIcon name="info" size="20px" />
            <span>
              No MCQs generated yet. Click <strong style={{ color: "var(--text)" }}>Generate MCQs</strong>{" "}
              above to create a question assessment from this video.
            </span>
          </p>
        </Card>
      ) : mcqQuizMode ? (
        <>
          <div style={{ margin: "0.8rem 0" }}>
            <Button variant="secondary" icon="download" fullWidth onClick={() => downloadMcqPdf(mcqs)}>
              Download MCQ PDF
            </Button>
          </div>

          <form onSubmit={handleSubmitQuiz}>
            {mcqs.map((item, idx) => (
              <MCQCard
                key={idx}
                qnum={idx + 1}
                item={item}
                mode="quiz"
                selected={mcqUserAnswers[String(idx + 1)]}
                onSelect={(key) => handleSelect(idx + 1, key)}
              />
            ))}
            <Button type="submit" icon="send" fullWidth>
              Submit Quiz
            </Button>
          </form>

          {mcqSubmitted && (
            <div style={{ marginTop: "1.4rem" }}>
              <SectionLabel label={`Results — ${score} / ${mcqs.length}`} icon="emoji_events" />
              {mcqs.map((item, idx) => (
                <MCQCard
                  key={idx}
                  qnum={idx + 1}
                  item={item}
                  mode="result"
                  selected={mcqUserAnswers[String(idx + 1)]}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <ReviewMode easyMcqs={easyMcqs} mediumMcqs={mediumMcqs} hardMcqs={hardMcqs} />
      )}
    </div>
  );
}

function ReviewMode({ easyMcqs, mediumMcqs, hardMcqs }) {
  let questionNumber = 1;
  const groups = [
    { title: "Easy Questions", cssClass: "easy", items: easyMcqs },
    { title: "Medium Questions", cssClass: "medium", items: mediumMcqs },
    { title: "Hard Questions", cssClass: "hard", items: hardMcqs },
  ];

  return (
    <div>
      {groups.map(
        (group) =>
          group.items.length > 0 && (
            <div key={group.cssClass}>
              <DifficultyGroupHeader title={group.title} cssClass={group.cssClass} />
              {group.items.map((item) => {
                const qnum = questionNumber;
                questionNumber += 1;
                return <MCQCard key={qnum} qnum={qnum} item={item} mode="review" />;
              })}
            </div>
          )
      )}
    </div>
  );
}
