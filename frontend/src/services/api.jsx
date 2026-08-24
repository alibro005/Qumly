import { getSessionId } from "./session";

const API_URL = import.meta.env.VITE_API_URL;

function getSessionHeaders() {
  return {
    "X-Session-ID": getSessionId(),
  };
}

// Connect Demo Database
export async function connectDemo() {
  const response = await fetch(`${API_URL}/demo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getSessionHeaders(),
    },
  });

  const data = await response.json();

  // console.log("DEMO RESPONSE STATUS:", response.status);
  // console.log("DEMO RESPONSE:", data);

  if (!response.ok) {
    const detail = data.detail;

    let message = "Unable to connect to demo database.";

    if (typeof detail === "string") {
      message = detail;
    } else if (detail && typeof detail === "object") {
      message =
        detail.message || detail.error || "Unable to connect to demo database.";
    }

    throw new Error(message);
  }

  return data;
}

// Get Schema
export async function getSchema() {
  const response = await fetch(`${API_URL}/schema`, {
    headers: getSessionHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || `Schema request failed: ${response.status}`);
  }

  return data;
}

// Send Query
export async function sendQuery(question, clarification = null) {
  const response = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      question,
      clarification,
    }),
  });

  const data = await response.json();

  // console.log("QUERY RESPONSE STATUS:", response.status);
  // console.log("QUERY RESPONSE:", data);

  if (!response.ok) {
    throw new Error(data.detail || "Query failed");
  }

  return data;
}

// Explain SQL
export async function explainSql(sql) {
  const response = await fetch(`${API_URL}/explain-sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getSessionHeaders(),
    },
    body: JSON.stringify({
      sql,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to explain SQL");
  }

  return data;
}

// Connect Database
export async function connectDatabase(credentials) {
  const response = await fetch(`${API_URL}/database/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getSessionHeaders(),
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    const detail = data.detail;
    let message = "Unable to connect to database.";

    if (typeof detail === "string") {
      message = detail;
    } else if (detail && typeof detail === "object") {
      message =
        detail.message || detail.error || "Unable to connect to database.";
    }

    throw new Error(message);
  }

  return data;
}

// Disconnect Database
export const disconnectDatabase = async (sessionId) => {
  const response = await fetch(`${API_URL}/database/disconnect`, {
    method: "POST",
    headers: {
      "x-session-id": sessionId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to disconnect");
  }

  return response.json();
};

// Get Database Status
export async function getDatabaseStatus() {
  const response = await fetch(`${API_URL}/database/status`, {
    headers: getSessionHeaders(),
  });

  const data = await response.json();

  // console.log("DATABASE STATUS:", data);

  if (!response.ok) {
    throw new Error(data.detail || "Failed to get database status");
  }

  return data;
}
