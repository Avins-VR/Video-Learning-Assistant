"""
models/

Present for parity with the required backend structure. This project
has no relational/ORM models: video processing state lives in
ChromaDB (via services/embedding_service.py) and generated content
(summaries, notes, MCQs, recommendations, concept maps) is returned
directly to the React frontend, which now owns state that used to
live in st.session_state. No SQLAlchemy/Django-style models were part
of the original Streamlit app, so none were introduced here.
"""
