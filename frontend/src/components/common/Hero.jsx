function Hero() {
  return (
    <section className="hero-land" id="top">
      <div className="hero-land__copy">
        <p className="eyebrow">AI-powered Database assistant</p>

        <h1 className="hero-land__heading">
          Ask your database anything.
        </h1>

        <p className="hero-land__sub">
          Qumly turns plain-English questions into SQL, runs it against your
          database, and hands back an answer you can actually read with the
          query behind it, in case you want to check its work.
        </p>

        <div className="hero-land__actions">
          <a
            href="https://app.qumly.me"
            className="btn btn--primary"
          >
            Try Qumly

            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a href="#preview" className="btn btn--ghost">
            See how it answers
          </a>
        </div>

        <div className="hero-land__meta">
          <span className="status-chip">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 1.2c2.7 0 4.9.9 4.9 2v7.6c0 1.1-2.2 2-4.9 2s-4.9-.9-4.9-2V3.2c0-1.1 2.2-2 4.9-2Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />

              <path
                d="M11.9 3.2c0 1.1-2.2 2-4.9 2s-4.9-.9-4.9-2"
                stroke="currentColor"
                strokeWidth="1.2"
              />

              <path
                d="M11.9 7c0 1.1-2.2 2-4.9 2s-4.9-.9-4.9-2"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>

            Works with your existing database
          </span>
        </div>
      </div>

      <div className="hero-land__preview" aria-hidden="true">
        <div className="device-frame">

          <div className="device-frame__bar">
            <span className="device-dot"></span>
            <span className="device-dot"></span>
            <span className="device-dot"></span>

            <span className="device-frame__url">
              app.qumly.me
            </span>
          </div>

          <div className="device-frame__body">

            <div className="msg msg--user">
              <p className="msg__text">
                Show me the top 5 students by marks.
              </p>
            </div>

            <div className="msg msg--ai">
              <div className="answer-card">

                <div className="answer-card__head">
                  <span className="answer-card__mark">Q</span>

                  <span className="answer-card__name">
                    Qumly
                  </span>
                </div>

                <p className="answer-card__text">
                  The top 5 students based on marks are shown below.
                </p>

                <div className="result-table-wrap">
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Marks</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>Ali Raza</td>
                        <td>CS</td>
                        <td className="is-numeric">95</td>
                      </tr>

                      <tr>
                        <td>Ahmed Khan</td>
                        <td>CS</td>
                        <td className="is-numeric">91</td>
                      </tr>

                      <tr>
                        <td>Sara Malik</td>
                        <td>SE</td>
                        <td className="is-numeric">89</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sql-block">
                  <div className="sql-panel">

                    <div className="sql-panel__head">
                      <span>Generated SQL</span>
                    </div>

                    <pre className="sql-code">
                      <code>
                        <span className="sql-kw">SELECT</span>{" "}
                        name, department, marks{"\n"}

                        <span className="sql-kw">FROM</span>{" "}
                        students{"\n"}

                        <span className="sql-kw">ORDER BY</span>{" "}
                        marks{" "}
                        <span className="sql-kw">DESC</span>{"\n"}

                        <span className="sql-kw">LIMIT</span>{" "}
                        5;
                      </code>
                    </pre>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;