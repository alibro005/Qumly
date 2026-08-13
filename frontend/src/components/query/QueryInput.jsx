import { useState } from "react";

function QueryInput({ onSubmit, loading = false }) {
  const [question, setQuestion] = useState("");

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
        {/* <label htmlFor="query-input" className="sr-only">
        Ask a question about your database
      </label> */}

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
      </form>
    </section>
    
  );
}

export default QueryInput;
