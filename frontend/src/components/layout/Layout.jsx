import React from "react";
import TopNavbar from "./TopNavbar.jsx";

/**
 * Shared page shell: the sticky navbar plus the .block-container
 * equivalent max-width wrapper used by every Streamlit page.
 */
export default function Layout({ children }) {
  return (
    <div className="ed-app-shell">
      <TopNavbar />
      <main>{children}</main>
    </div>
  );
}
