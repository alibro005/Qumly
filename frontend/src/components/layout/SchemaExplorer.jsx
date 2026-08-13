import { useEffect, useState } from "react";
import { getSchema } from "../../services/api";

function SchemaExplorer() {
    const [schema, setSchema] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadSchema() {
            try {
                const data = await getSchema();
                setSchema(data);
            } catch (err) {
                setError("Unable to load schema");
            } finally {
                setLoading(false);
            }
        }

        loadSchema();
    }, []);

    if (loading) {
        return (
            <div className="sidebar__section sidebar__section--schema">
                <h2 className="sidebar__label">Schema</h2>
                <div className="schema-db">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sidebar__section sidebar__section--schema">
                <h2 className="sidebar__label">Schema</h2>
                <div className="schema-db">{error}</div>
            </div>
        );
    }

    return (
        <div className="sidebar__section sidebar__section--schema">
            <h2 className="sidebar__label">Schema</h2>

            <div className="schema-db">
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M7 1.2c2.7 0 4.9.9 4.9 2v7.6c0 1.1-2.2 2-4.9 2s-4.9-.9-4.9-2V3.2c0-1.1 2.2-2 4.9-2Z"
                        stroke="currentColor"
                        strokeWidth="1.1"
                    />
                </svg>

                SQLite
            </div>

            <ul className="schema-tree">
                {Object.entries(schema).map(([tableName, table]) => (
                    <li key={tableName}>
                        <details>
                            <summary>{tableName}</summary>

                            <ul>
                                {table.columns.map((column) => (
                                    <li key={column.name}>
                                        {column.name}
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SchemaExplorer;