const API_URL = "http://127.0.0.1:8000";

// get Schema
export async function getSchema() {
  const response = await fetch(`${API_URL}/schema`);

  if (!response.ok) {
    throw new Error(`Schema request failed: ${response.status}`);
  }

  return response.json();
}

// Send Query
export async function sendQuery(question, clarification = null) {
  const response = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      clarification,
    }),
  });

  if (!response.ok) {
    throw new Error(`Query request failed: ${response.status}`);
  }

  return response.json();
}

// Explain SQL
export async function explainSql(sql) {
  const response = await fetch(`${API_URL}/explain-sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql: sql,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to explain SQL");
  }

  return await response.json();
}

// Connect My SQL
export async function connectMySQL(credentials) {
  const response = await fetch("http://127.0.0.1:8000/database/connect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail?.message || data.detail || "Failed to connect to MySQL",
    );
  }

  return data;
}

// Get Status
export async function getDatabaseStatus() {
  const response = await fetch("http://127.0.0.1:8000/database/status");

  if (!response.ok) {
    throw new Error("Failed to get database status");
  }

  return response.json();
}
