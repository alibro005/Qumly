function Preview() {
  return (
    <section className="preview-strip" id="preview">
      <div className="preview-strip__copy">
        <p className="eyebrow">Explainable by design</p>

        <h2 className="section-heading">
          Never a black box.
        </h2>

        <p className="preview-strip__text">
          Every table Qumly returns is backed by a real query, and every query
          comes with a plain-language walkthrough of what it does so the
          answer is something you can trust, not just something you're handed.
        </p>

        <a
          href="https://app.qumly.me"
          className="btn btn--ghost"
        >
          Open the query editor
        </a>
      </div>

      <div className="preview-strip__panel">
        <div className="sql-panel">
          <div className="sql-panel__head">
            <span>Explain SQL</span>
          </div>

          <div
            className="explain-panel"
            style={{
              margin: 0,
              border: "none",
              borderRadius: 0,
            }}
          >
            <p className="explain-panel__text">
              Qumly selects the student's name, department, and marks, sorts
              the records by marks from highest to lowest, and returns the
              first five records.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Preview;