/**
 * React port of utils/exceptions.py's custom exception hierarchy.
 * Used by the mocked API services / pages to model the same error
 * categories the Streamlit app switched on to pick an error message
 * and icon.
 */
export class VideoAssistantError extends Error {
  constructor(message) {
    super(message);
    this.name = "VideoAssistantError";
  }
}

export class InvalidYouTubeURLError extends VideoAssistantError {
  constructor(message) {
    super(message);
    this.name = "InvalidYouTubeURLError";
  }
}

export class TranscriptNotFoundError extends VideoAssistantError {
  constructor(message) {
    super(message);
    this.name = "TranscriptNotFoundError";
  }
}

export class TranscriptFetchError extends VideoAssistantError {
  constructor(message) {
    super(message);
    this.name = "TranscriptFetchError";
  }
}

export class EmbeddingGenerationError extends VideoAssistantError {
  constructor(message) {
    super(message);
    this.name = "EmbeddingGenerationError";
  }
}

export class VectorStoreError extends VideoAssistantError {
  constructor(message) {
    super(message);
    this.name = "VectorStoreError";
  }
}

export class LLMGenerationError extends VideoAssistantError {
  constructor(message) {
    super(message);
    this.name = "LLMGenerationError";
  }
}

export class EmptyQuestionError extends VideoAssistantError {
  constructor(message) {
    super(message);
    this.name = "EmptyQuestionError";
  }
}
