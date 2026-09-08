import { jsPDF } from "jspdf";

/**
 * Remove Markdown formatting so the PDF contains clean readable text.
 */
function cleanMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Create and download a PDF.
 *
 * @param {string} content - Content to put inside the PDF
 * @param {string} filename - Name of the downloaded PDF
 */
function createPdf(content, filename) {
  if (!content || !String(content).trim()) {
    console.warn("No content available for download.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  // --------------------------------------------------
  // PDF title
  // --------------------------------------------------

  let pdfTitle = filename
    .replace(".pdf", "")
    .replace(/-/g, " ");

  pdfTitle = pdfTitle
    .replace(/\b\w/g, (char) => char.toUpperCase());

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);

  doc.text(
    pdfTitle,
    margin,
    y
  );

  y += 12;

  // --------------------------------------------------
  // Horizontal line
  // --------------------------------------------------

  doc.setLineWidth(0.5);

  doc.line(
    margin,
    y,
    pageWidth - margin,
    y
  );

  y += 10;

  // --------------------------------------------------
  // Process content
  // --------------------------------------------------

  const lines = String(content).split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Empty line
    if (!trimmedLine) {
      y += 5;
      continue;
    }

    // --------------------------------------------------
    // Markdown heading
    // --------------------------------------------------

    if (/^#{1,6}\s+/.test(trimmedLine)) {
      const heading = trimmedLine
        .replace(/^#{1,6}\s+/, "")
        .replace(/\*\*/g, "");

      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);

      const headingLines = doc.splitTextToSize(
        heading,
        contentWidth
      );

      doc.text(
        headingLines,
        margin,
        y
      );

      y += headingLines.length * 7 + 4;

      continue;
    }

    // --------------------------------------------------
    // Normal paragraph
    // --------------------------------------------------

    const cleanedLine = cleanMarkdown(trimmedLine);

    if (!cleanedLine) {
      continue;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const wrappedLines = doc.splitTextToSize(
      cleanedLine,
      contentWidth
    );

    const requiredHeight = wrappedLines.length * 5.5;

    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }

    doc.text(
      wrappedLines,
      margin,
      y
    );

    y += requiredHeight + 4;
  }

  // --------------------------------------------------
  // Page numbers
  // --------------------------------------------------

  const totalPages = doc.internal.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Page ${page} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      {
        align: "center",
      }
    );
  }

  // --------------------------------------------------
  // Download
  // --------------------------------------------------

  doc.save(filename);
}

/**
 * Download the generated video summary.
 */
export function downloadSummaryPdf(summary) {
  createPdf(
    summary,
    "video-summary.pdf"
  );
}

/**
 * Download Key Notes.
 */
export function downloadNotesPdf(notes) {
  if (!notes || !notes.length) {
    console.warn("No notes available for download.");
    return;
  }

  const text = notes
    .map((note) => {
      if (typeof note === "string") {
        return note;
      }

      return Object.entries(note)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
    })
    .join("\n\n");

  createPdf(
    text,
    "notes.pdf"
  );
}

/**
 * Download MCQs.
 */
export function downloadMcqPdf(mcqs) {
  if (!mcqs || !mcqs.length) {
    console.warn("No MCQs available for download.");
    return;
  }

  const text = mcqs
    .map((mcq, index) => {
      if (typeof mcq === "string") {
        return `${index + 1}. ${mcq}`;
      }

      return `${index + 1}. ${
        Object.entries(mcq)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")
      }`;
    })
    .join("\n\n");

  createPdf(
    text,
    "mcq.pdf"
  );
}