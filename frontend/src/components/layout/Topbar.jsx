import logo from "../../assets/logo.svg";
import mysqlLogo from "../../assets/mysql.svg";
import postgresqlLogo from "../../assets/postgresql.svg";

function Topbar({ onToggleSidebar, sidebarOpen = true, databaseType}) {
  const normalizedDatabaseType = databaseType?.toLowerCase();

  const databaseLogos = {
    mysql: mysqlLogo,
    postgresql: postgresqlLogo,
  };
  const databaseLogo = databaseLogos[normalizedDatabaseType];
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <button
          className="icon-btn sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4.5h14M2 9h14M2 13.5h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <a
          href="https://qumly.me"
          className="brand-mark"
          aria-label="Qumly home"
        >
          <img src={logo} alt="Qumly logo" />
          <span className="brand-mark__text">Qumly</span>
        </a>
      </div>

      <div className="db-status">
        <span
          className={`db-status__dot ${
            databaseType ? "is-connected" : "is-disconnected"
          }`}
        />
        <div className="db-status__info">
          <div className="db-status__name">
            {databaseLogo && <img src={databaseLogo} alt={databaseType} />}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
