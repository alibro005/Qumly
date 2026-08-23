import mysql from "../../assets/mysql.svg";
import postgresql from "../../assets/postgresql.svg";
import mariadb from "../../assets/mariadb.svg";

function Compatibility() {
  return (
    <section className="compat" id="compat">
      <p className="eyebrow eyebrow--center">Compatibility</p>

      <h2 className="section-heading section-heading--center">
        Works with the database you already have.
      </h2>

      <div className="compat__pills">
        <a
          className="compat-pill"
          href="https://www.mysql.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={mysql} alt="MySQL" />
          <span>MySQL</span>
        </a>

        <a
          className="compat-pill"
          href="https://mariadb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={mariadb} alt="MariaDB" />
          <span>MariaDB</span>
        </a>

        <a
          className="compat-pill"
          href="https://www.postgresql.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={postgresql} alt="PostgreSQL" />
          <span>PostgreSQL</span>
        </a>
      </div>
    </section>
  );
}

export default Compatibility;
