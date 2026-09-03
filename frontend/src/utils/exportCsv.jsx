export function exportToCsv(
  columns,
  rows,
  filename = "qumly-results.csv"
) {
  if (!columns?.length || !rows?.length) {
    return;
  }

  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

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

  const header = columns
    .map(escapeCsvValue)
    .join(",");

  const body = rows
    .map((row) =>
      row
        .map(escapeCsvValue)
        .join(",")
    )
    .join("\r\n");

  const csvContent =
    "\uFEFF" +
    header +
    "\r\n" +
    body;

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

  URL.revokeObjectURL(url);
}