function ResultTable({ results }) {
  if (!results || !results.columns || !results.rows) {
    return null;
  }

  if (results.rows.length === 0) {
    return (
      <div className="result-table-wrap">
        <p className="result-empty">
          No results found.
        </p>
      </div>
    );
  }

  return (
    <div className="result-table-wrap">
      <table className="result-table">
        <thead>
          <tr>
            {results.columns.map((column) => (
              <th key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {results.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, columnIndex) => (
                <td key={columnIndex}>
                  {value === null ? "NULL" : String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;