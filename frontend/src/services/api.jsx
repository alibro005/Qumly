const API_URL = "http://127.0.0.1:8000";

export async function getSchema() {
  const response = await fetch(`${API_URL}/schema`);

  if (!response.ok) {
    throw new Error(`Schema request failed: ${response.status}`);
  }

  return response.json();
}

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
