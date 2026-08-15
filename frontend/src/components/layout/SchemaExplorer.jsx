function SchemaExplorer({ schema = {}, databaseType = null }) {
  console.log("SCHEMA EXPLORER RECEIVED:", schema);
  console.log("DATABASE TYPE:", databaseType);
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

        {databaseType || "No database connected"}
      </div>

      <ul className="schema-tree">
        {Object.entries(schema).map(([tableName, table]) => (
          <li key={tableName}>
            <details>
              <summary>{tableName}</summary>

              <ul>
                {table.columns.map((column) => (
                  <li key={column.name}>{column.name}</li>
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
