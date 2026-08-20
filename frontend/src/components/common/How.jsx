function HowItWorks() {
  return (
    <section className="how" id="how">
      <p className="eyebrow eyebrow--center">
        How it works
      </p>

      <h2 className="section-heading section-heading--center">
        From a question to an answer, in three steps.
      </h2>

      <ul className="steps">
        <li className="step">
          <span className="step__num">01</span>

          <h3 className="step__title">
            Ask in plain English
          </h3>

          <p className="step__text">
            Type a question the way you'd ask a colleague no SELECT
            statements required.
          </p>
        </li>

        <li className="step">
          <span className="step__num">02</span>

          <h3 className="step__title">
            Qumly writes the SQL
          </h3>

          <p className="step__text">
            It reads your schema, builds the right query, and runs it against
            your database.
          </p>
        </li>

        <li className="step">
          <span className="step__num">03</span>

          <h3 className="step__title">
            Get a clear answer
          </h3>

          <p className="step__text">
            A plain-language answer, a real data table, and the SQL behind it
            if you want to check.
          </p>
        </li>
      </ul>
    </section>
  );
}

export default HowItWorks;