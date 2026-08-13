import SchemaExplorer from "./SchemaExplorer";

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* New Query */}
            <div className="sidebar__section">
                <button className="btn btn--primary btn--block">
                    + New query
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                <a href="#" className="nav-link is-active">
                    New query
                </a>

                <a href="#" className="nav-link">
                    Query history
                </a>

                <a href="#" className="nav-link">
                    Saved queries
                </a>
            </nav>

            {/* Recent Queries */}
            <div className="sidebar__section sidebar__section--recent">
                <h2 className="sidebar__label">Recent queries</h2>

                <ul className="recent-list">
                    {/* I'll connect this to query history later */}
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
                        <div className="db-status__state">
                            Connected
                        </div>
                    </div>
                </div>
            </div>

        </aside>
    );
}

export default Sidebar;