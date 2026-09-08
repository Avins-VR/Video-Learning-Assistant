# Intelligent YouTube Learn AI — Frontend

React + Vite + Tailwind CSS v3 frontend for the AI-Powered Educational
Video Learning Assistant. This is a **1:1 visual and structural port**
of the original Streamlit application — layout, navigation, copy,
component behavior, spacing, and the dark glassmorphic "Orbital SaaS"
theme are preserved exactly. No backend logic, prompts, or algorithms
were touched; every API call goes through a placeholder Axios service
in `src/services/api/` that will be wired up to the Flask backend in a
later phase.

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Project structure

```
src/
├── assets/              Static assets
├── components/
│   ├── common/           Card, SectionLabel, StatGrid, MaterialIcon, NoVideoNotice
│   ├── layout/            TopNavbar (stage rail), Layout shell
│   ├── ui/                Button, Input, Select, MultiSelect, RadioGroup, Checkbox,
│   │                       Toggle, Spinner, Progress, Alert, Accordion
│   ├── chat/               ChatBubble, ChatHistory, ChatInput
│   ├── notes/              NoteCard
│   ├── mcq/                 MCQCard, DifficultyBadge, DifficultyGroupHeader
│   ├── conceptMap/          MermaidDiagram
│   ├── recommendations/     PathNode
│   └── upload/               VideoUrlInput, ProcessingStatus
├── pages/                LearnPage, NotesPage, ChatPage, MCQPage,
│                          RecommendationsPage, ConceptMapPage
├── context/               AppContext (React replacement for st.session_state)
├── hooks/                  useAppContext
├── services/api/            chat.js, mcq.js, notes.js, recommendations.js,
│                             conceptMap.js, transcript.js, summary.js, axiosClient.js
├── routes/                  AppRoutes (mirrors the six Streamlit st.Page stages)
├── utils/                   exceptions.js, format.js, pdf.js
└── styles/                  theme.css (global design tokens + component classes)
```

## Stage routing

| Streamlit stage       | Route              |
| ---------------------- | ------------------- |
| Learn                  | `/`                  |
| Key Notes              | `/notes`             |
| Doubt Clarification    | `/chat`              |
| MCQ Assessment         | `/mcq`               |
| Learning Path          | `/recommendations`   |
| Concept Map            | `/concept-map`       |

## Backend integration

Every function in `src/services/api/` currently issues an Axios call
against `VITE_API_BASE_URL` (default `/api`). Swap the request bodies
for real Flask endpoints when the backend migration begins — the
call sites in every page already expect the same response shapes the
original Python functions returned (e.g. `generate_concept_map` ->
`{ tree, mermaid, stats }`).
