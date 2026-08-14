import SchemaExplorer from "./SchemaExplorer";

function Sidebar({ onNewQuery, recentQueries }) {
  return (
    <aside className="sidebar">
      {/* New Query */}
      <div className="sidebar__section">
        <button
          className="btn btn--primary btn--block"
          onClick={() => {
            console.log("SIDEBAR BUTTON CLICKED");
            onNewQuery();
          }}
        >
          + New query
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

        <ul className="recent-list recent-item recent-item:hover">
          {recentQueries.map((query) => (
            <li
              key={query.id}
              className="recent-list__item"
              title={query.question}
            >
              {query.question}
            </li>
          ))}
        </ul>
      </div>

      {/* Dynamic Schema */}
      <SchemaExplorer />

      {/* Database Status */}
      <div className="sidebar__footer">
        <div className="db-status">
          <span className="db-status__dot"></span>

          <div>
            <div className="db-status__name">SQLite</div>
            <div className="db-status__state">Connected</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
