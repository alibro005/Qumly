import { useRef, useState } from "react";

function QueryInput({ onSubmit, loading = false }) {
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setQuestion((prev) => {
        const separator = prev.trim() ? " " : "";
        return prev + separator + transcript;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    await onSubmit(trimmedQuestion);
    setQuestion("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();

      if (!loading) {
        event.currentTarget.form.requestSubmit();
      }
    }
  };

  return (
    <section className="hero" id="hero">
      <p className="eyebrow">Query your database</p>

      <h1 className="hero__heading">Ask your database anything.</h1>

      <p className="hero__sub">
        Turn natural language into SQL and get clear answers from your data.
      </p>

      <form className="query-box" onSubmit={handleSubmit}>
        <textarea
          id="query-input"
          className="query-box__input"
          placeholder="Ask anything about your data..."
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={3}
        />

        <div className="query-box__bar">
          <span className="kbd-hint">
            <kbd>Ctrl</kbd>
            <span>+</span>
            <kbd>Enter</kbd>
            <span>to run</span>
          </span>

          <div className="query-box__actions">
            <button
              type="button"
              className={`btn btn--mic ${isListening ? "btn--mic-active" : ""}`}
              onClick={isListening ? stopListening : startListening}
              disabled={loading}
              title={isListening ? "Stop listening" : "Voice input"}
              aria-label={
                isListening ? "Stop voice input" : "Start voice input"
              }
            >
              {isListening ? (
                <svg
                  className="mic-icon"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="8"
                    y="8"
                    width="8"
                    height="8"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  className="mic-icon"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 15.5c2.21 0 4-1.79 4-4v-5c0-2.21-1.79-4-4-4s-4 1.79-4 4v5c0 2.21 1.79 4 4 4Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M5.5 11.5a6.5 6.5 0 0 0 13 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 18v3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M9 21h6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={!question.trim() || loading}
            >
              {loading ? "Running..." : "Ask Qumly"}

              {!loading && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 7h9M7.5 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default QueryInput;
