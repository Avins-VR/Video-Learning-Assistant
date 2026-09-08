/**
 * Small formatting helpers shared across pages (transcript length,
 * chunk counts, etc. — mirrors the inline f-string formatting used in
 * app.py's render_transcript_stats()).
 */
export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

export function formatDuration(durationSeconds) {
  const totalMinutes = Math.floor((durationSeconds || 0) / 60);
  const totalSeconds = (durationSeconds || 0) % 60;
  return `${String(totalMinutes).padStart(2, "0")}:${String(totalSeconds).padStart(2, "0")}`;
}
