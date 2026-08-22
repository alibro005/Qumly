import React, { useState } from "react";
import ResultTable from "../results/ResultTable";
import ResultChart from "../results/ResultChart";
import { format } from "sql-formatter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function AnswerCard({ answer, results, sql,  onExplainSql }) {

  const [showSql, setShowSql] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [showExplain, setShowExplain] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Format the SQL query for better readability
  const formattedSql = sql
    ? format(sql, {
        language: "mysql",
      })
    : null;

  // Handle the "Explain SQL" button click
  const handleExplain = async () => {
    if (explanation) {
      setShowExplain((prev) => !prev);
      return;
    }

    try {
      setLoadingExplanation(true);

      const data = await onExplainSql(sql);

      // Set the explanation and show it
      setExplanation(data.explanation);
      setShowExplain(true);

    } catch (error) {
      console.error("Explain SQL error:", error);
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <div className="msg msg--ai">
      <div className="answer-card">
        {/* Human-readable answer */}
        <div className="answer-card__head">
          <span className="answer-card__mark">Q</span>
          <span className="answer-card__name">Qumly</span>
        </div>

        <p className="answer-card__text">{answer}</p>

        {/* Query results */}
        {results && (
          <div className="result-table-wrap">
            <ResultTable results={results} />
          </div>
        )}

        <div className="sql-block">
          {/* Action buttons */}
          <div className="sql-block__actions">
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => setShowSql((prev) => !prev)}
            >
              {showSql ? "Hide SQL" : "Show SQL"}
            </button>

            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={handleExplain}
              disabled={loadingExplanation}
            >
              {loadingExplanation
                ? "Generating Explanation..."
                : showExplain
                  ? "Hide Explanation"
                  : "Explain SQL"}
            </button>

            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => setShowChart((prev) => !prev)}
            >
              {showChart ? "Hide Chart" : "Chart"}
            </button>
          </div>

          {/* SQL panel */}
          {showSql && (
            <div className="sql-panel">
              <div className="sql-panel__head">
                <span>Generated SQL</span>

                <button
                  className="btn btn--ghost btn--xs"
                  type="button"
                  onClick={() => navigator.clipboard.writeText(sql)}
                >
                  Copy SQL
                </button>
              </div>

              <SyntaxHighlighter
                language="sql"
                style={vscDarkPlus}
                className="sql-code"
              >
                {formattedSql};
              </SyntaxHighlighter>
            </div>
          )}

          {/* Explanation */}
          {showExplain && explanation && (
            <div className="explain-panel">
              <p className="explain-panel__text">{explanation}</p>
            </div>
          )}

          {showChart && <ResultChart results={results} />}
        </div>
      </div>
    </div>
  );
}

export default AnswerCard;
