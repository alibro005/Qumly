import { exportToCsv } from "../../utils/exportCsv";

function ResultTable({ results }) {
  if (!results || !results.columns || !results.rows) {
    return null;
  }

  if (results.rows.length === 0) {
    return(
       <p className="result-empty">No results found.</p>
    );
  }

  const handleExport = () => {
    exportToCsv(
      results.columns,
      results.rows,
      `qumly-results-${Date.now()}.csv`,
    );
  };

  return (
    <>
      <div className="result-table-header">
        <span className="result-count">
          {results.rows.length} {results.rows.length === 1 ? "row" : "rows"}
        </span>

        <button
          type="button"
          className="export-csv-button"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>

      <div className="result-table-scroll">
        <table className="result-table">
          <thead>
            <tr>
              {results.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {results.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, columnIndex) => (
                  <td key={columnIndex}>
                    {value === null
                      ? "NULL"
                      : value === undefined
                        ? ""
                        : String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ResultTable;
