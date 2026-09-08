import React from "react";
import DifficultyBadge from "./DifficultyBadge.jsx";

/**
 * A single MCQ card. Handles three rendering modes, matching
 * mcq_page.py exactly:
 *  - "review": every option shown, correct one highlighted, explanation visible.
 *  - "quiz": radio-style selectable options, nothing revealed yet.
 *  - "result": after quiz submission, correct/incorrect highlighted plus explanation.
 */
export default function MCQCard({ qnum, item, mode, selected, onSelect }) {
  const correctChoice = item.correct_answer;

  return (
    <div className="ed-mcq-card">
      <div className="ed-mcq-qnum">Question {qnum}</div>
      <div className="ed-mcq-question">{item.question}</div>
      <DifficultyBadge difficulty={item.difficulty} />

      {mode === "quiz" ? (
        <div role="radiogroup" aria-label={`Question ${qnum} options`} style={{ marginTop: "0.6rem" }}>
          {Object.entries(item.options).map(([key, text]) => (
            <label
              key={key}
              className={`ed-mcq-option ${selected === key ? "selected" : ""}`}
            >
              <input
                type="radio"
                name={`mcq_${qnum}`}
                value={key}
                checked={selected === key}
                onChange={() => onSelect(key)}
              />
              {key}. {text}
            </label>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: "0.6rem" }}>
          {Object.entries(item.options).map(([key, text]) => {
            let stateClass = "";
            if (mode === "review" && key === correctChoice) stateClass = "correct";
            if (mode === "result") {
              if (key === correctChoice) stateClass = "correct";
              else if (key === selected && key !== correctChoice) stateClass = "incorrect";
            }
            return (
              <div className={`ed-mcq-option ${stateClass}`} key={key}>
                {key}. {text}
              </div>
            );
          })}
          <div className="ed-mcq-explanation">
            <strong>Explanation:</strong> {item.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
