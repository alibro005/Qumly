export function exportToCsv(columns, rows, filename = "qumly-results.csv") {
  if (!columns?.length || !Array.isArray(rows)) {
    return;
  }

  const escapeCsvValue = (value) => {
    if (value === null) {
      return "NULL";
    }

    if (value === undefined) {
      return "";
    }

    let stringValue = String(value);

    // Mitigate CSV/Excel formula injection for string cells
    if (typeof value === "string" && /^[\t\r\n ]*[=+\-@]/.test(stringValue)) {
      stringValue = "'" + stringValue;
    }

    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n") ||
      stringValue.includes("\r")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  const header = columns.map(escapeCsvValue).join(",");

  const body = rows
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\r\n");

  const csvContent = "\uFEFF" + header + "\r\n" + body;

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 0);
}
