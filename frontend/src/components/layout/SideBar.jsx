import SchemaExplorer from "./SchemaExplorer";
import mysqlLogo from "../../assets/mysql.svg";
import postgresqlLogo from "../../assets/postgresql.svg";

function Sidebar({
  onNewQuery,
  recentQueries,
  onAddDatabase,
  schema,
  databaseType,
}) {
  const normalizedDatabaseType = databaseType?.toLowerCase();

  const databaseLogos = {
    mysql: mysqlLogo,
    postgresql: postgresqlLogo,
  };
  const databaseLogo = databaseLogos[normalizedDatabaseType];
  return (
    <aside className="sidebar">
      {/* New Query */}
      <div className="sidebar__section">
        <button className="btn btn--primary btn--block" onClick={onNewQuery}>
          + New query
        </button>
        <button
          type="button"
          className="btn btn--primary btn--block dbt"
          onClick={onAddDatabase}
        >
          + Add database
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <a href="#" className="nav-link is-active">
          New query
        </a>
      </nav>

      {/* Recent Queries */}
      <div className="sidebar__section sidebar__section--recent">
        <h2 className="sidebar__label">Recent queries</h2>

        <ul className="recent-list ">
          {recentQueries.map((query) => (
            <li
              key={query.id}
              className="recent-list__item recent-item recent-item:hover"
              title={query.question}
            >
              {query.question}
            </li>
          ))}
        </ul>
      </div>

      {/* Dynamic Schema */}
      <SchemaExplorer schema={schema} databaseType={databaseType} />

      {/* Database Status */}
      <div className="sidebar__footer">
        <div className="db-status">
          <span
            className={`db-status__dot ${
              databaseType ? "is-connected" : "is-disconnected"
            }`}
          />

          <div className="db-status__info">
            <div className="db-status__state">
              {databaseType ? "Connected" : "Not connected"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
