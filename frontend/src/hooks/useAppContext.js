import { useContext } from "react";
import AppContext from "../context/AppContext.jsx";

/**
 * Access the shared app state (the React replacement for
 * st.session_state). Throws early if used outside <AppProvider>.
 */
export default function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an <AppProvider>");
  }
  return ctx;
}
