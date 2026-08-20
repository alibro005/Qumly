function Features() {
  return (
    <section className="features" id="features">
      <p className="eyebrow eyebrow--center">Features</p>

      <h2 className="section-heading section-heading--center">
        Built for people who work with data, not just query editors.
      </h2>

      <div className="feature-grid">
        <article className="feature-card">
          <div className="feature-card__icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 5.5h12M3 9h12M3 12.5h7"
                stroke="#7F77DD"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h3>Natural language, not syntax</h3>

          <p>
            Ask the way you'd ask a person. Qumly handles the joins, filters,
            and grouping underneath.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-card__icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2.5c3.6 0 6.5 1.4 6.5 3.1v6.8c0 1.7-2.9 3.1-6.5 3.1S2.5 14.1 2.5 12.4V5.6c0-1.7 2.9-3.1 6.5-3.1Z"
                stroke="#7F77DD"
                strokeWidth="1.4"
              />
              <path
                d="M15.5 5.6c0 1.7-2.9 3.1-6.5 3.1s-6.5-1.4-6.5-3.1"
                stroke="#7F77DD"
                strokeWidth="1.4"
              />
            </svg>
          </div>

          <h3>Understands your schema</h3>

          <p>
            Qumly reads your tables and columns first, so it knows what
            "department" or "marks" actually refers to.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-card__icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2.5v13M2.5 9h13"
                stroke="#7F77DD"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform="rotate(45 9 9)"
              />
            </svg>
          </div>

          <h3>Asks when it's not sure</h3>

          <p>
            A vague question like "the best students" gets a clarifying
            follow-up instead of a guess.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-card__icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M6 4.5 2.5 9 6 13.5M12 4.5 15.5 9 12 13.5"
                stroke="#7F77DD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3>Shows its work</h3>

          <p>
            Every answer comes with the exact SQL Qumly ran, plus a
            plain-language explanation of it.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-card__icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 13.5V8M8 13.5V4M13 13.5v-6"
                stroke="#7F77DD"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h3>Follow-up questions</h3>

          <p>
            "Only from the CS department" narrows the last answer instead of
            starting the conversation over.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-card__icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect
                x="3"
                y="3"
                width="12"
                height="12"
                rx="2.5"
                stroke="#7F77DD"
                strokeWidth="1.5"
              />
              <path
                d="M3 7.5h12"
                stroke="#7F77DD"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <h3>Your data stays yours</h3>

          <p>
            Qumly connects to the database you already run nothing is copied
            into a third-party store.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Features;