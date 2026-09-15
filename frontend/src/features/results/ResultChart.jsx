import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ResultChart({ results }) {
  // Basic validation
  if (
    !results ||
    !Array.isArray(results.columns) ||
    !Array.isArray(results.rows) ||
    results.columns.length < 2 ||
    results.rows.length === 0
  ) {
    return (
      <p className="chart-panel__text">
        No suitable chart can be generated for these results.
      </p>
    );
  }

  const { columns, rows } = results;

  // Find a numeric column
  const numericIndex = columns.findIndex((_, columnIndex) =>
    rows.some((row) => {
      const value = row[columnIndex];

      if (value === null || value === undefined || value === "") {
        return false;
      }

      return Number.isFinite(Number(value));
    }),
  );

  // No numeric column = no useful bar chart
  if (numericIndex === -1) {
    return (
      <p className="chart-panel__text">
        No suitable chart can be generated for these results.
      </p>
    );
  }

  // Find a categorical column different from the numeric column
  const labelIndex = columns.findIndex(
    (_, columnIndex) => columnIndex !== numericIndex,
  );

  if (labelIndex === -1) {
    return (
      <p className="chart-panel__text">
        No suitable chart can be generated for these results.
      </p>
    );
  }

  const valueKey = columns[numericIndex];

  // Build chart data and remove invalid values
  const chartData = rows
    .map((row) => {
      const label = row[labelIndex];
      const value = Number(row[numericIndex]);

      if (label === null || label === undefined || !Number.isFinite(value)) {
        return null;
      }

      return {
        name: String(label),
        value,
      };
    })
    .filter(Boolean);

  // Nothing valid to display
  if (chartData.length === 0) {
    return (
      <p className="chart-panel__text">
        No suitable chart can be generated for these results.
      </p>
    );
  }

  return (
    <div className="chart-panel">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={80}
          />

          <YAxis />

          <Tooltip />

          <Bar dataKey="value" name={valueKey} fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ResultChart;
