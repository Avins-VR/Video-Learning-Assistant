import React from "react";
import MaterialIcon from "../common/MaterialIcon.jsx";

/**
 * React equivalent of the ".ed-note-card" markup rendered per note in
 * notes_page.py.
 */
export default function NoteCard({ note }) {
  return (
    <div className="ed-note-card">
      <MaterialIcon name="task_alt" size="17px" />
      <span>{note}</span>
    </div>
  );
}
