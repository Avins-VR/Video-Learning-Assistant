import React from "react";

/**
 * React equivalent of st.expander(). Native <details>/<summary> gives
 * accessible keyboard toggling for free.
 */
export default function Accordion({ title, children, defaultOpen = false }) {
  return (
    <details className="ed-expander" open={defaultOpen}>
      <summary>{title}</summary>
      <div className="ed-expander-body">{children}</div>
    </details>
  );
}
