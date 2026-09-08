import React, { useState } from "react";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

/**
 * React equivalent of app.py's render_video_input_section(): the
 * YouTube URL text field plus "Process Video" trigger button, laid
 * out in the same 4:1 column ratio as the Streamlit st.columns call.
 */
export default function VideoUrlInput({ onProcess, processing }) {
  const [url, setUrl] = useState("");

  const handleClick = () => {
    onProcess(url);
  };

  return (
    <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end", flexWrap: "wrap" }}>
      <div style={{ flex: "4 1 260px" }}>
        <Input
          label="YouTube video URL"
          hideLabel
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      <div style={{ flex: "1 1 160px" }}>
        <Button icon="play_arrow" fullWidth onClick={handleClick} disabled={processing}>
          Process Video
        </Button>
      </div>
    </div>
  );
}
