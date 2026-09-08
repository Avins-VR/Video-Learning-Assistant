import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

/**
 * React equivalent of concept_map_page.py's render_mermaid(): renders
 * Mermaid flowchart syntax as an interactive diagram inside a
 * scrollable, glass-styled wrapper, themed to match the app's dark
 * palette (same themeVariables as the original components.html embed).
 */
let mermaidInitialized = false;

export default function MermaidDiagram({ code }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: {
          background: "rgba(255,255,255,0.04)",
          primaryColor: "rgba(255,255,255,0.07)",
          primaryTextColor: "#eef0f6",
          primaryBorderColor: "#6e6bff",
          lineColor: "#4fd1ff",
          secondaryColor: "rgba(255,255,255,0.04)",
          tertiaryColor: "#0a0c12",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: false,
          curve: "basis",
          nodeSpacing: 90,
          rankSpacing: 150,
        },
      });
      mermaidInitialized = true;
    }

    let cancelled = false;
    const renderId = `concept-map-${Date.now()}`;

    mermaid
      .render(renderId, code)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to render concept map.");
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflow: "auto",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "16px",
        padding: "1.4rem",
        boxSizing: "border-box",
        backdropFilter: "blur(8px)",
      }}
    >
      {error ? (
        <p style={{ color: "var(--rose)" }}>{error}</p>
      ) : (
        <div
          style={{ display: "flex", justifyContent: "center" }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}
