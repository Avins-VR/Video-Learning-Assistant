import React from "react";

/**
 * React equivalent of the ".ed-card" glass panel used throughout the
 * Streamlit app for st.markdown-based custom cards.
 */
export default function Card({ children, className = "", style = {} }) {
  return (
    <div className={`ed-card ${className}`} style={style}>
      {children}
    </div>
  );
}
