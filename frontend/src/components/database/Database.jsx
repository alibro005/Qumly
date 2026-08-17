import { useState } from "react";
import { connectMySQL } from "../../services/api";

function DatabaseModal({ onClose, onDatabaseConnected }) {
  const [mysqlForm, setMysqlForm] = useState({
    host: "localhost",
    port: "3306",
    database: "",
    username: "",
    password: "",
  });

  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const handleMysqlChange = (event) => {
    const { name, value } = event.target;

    setMysqlForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleConnect = async () => {
    if (connecting) {
      return;
    }

    setError("");

    if (!mysqlForm.host) {
      setError("Please enter the MySQL host.");
      return;
    }

    if (!mysqlForm.port) {
      setError("Please enter the MySQL port.");
      return;
    }

    if (!mysqlForm.database) {
      setError("Please enter the database name.");
      return;
    }

    if (!mysqlForm.username) {
      setError("Please enter the MySQL username.");
      return;
    }

    try {
      setConnecting(true);

      console.log("MYSQL FORM BEFORE REQUEST:", {
        host: mysqlForm.host,
        port: mysqlForm.port,
        database: mysqlForm.database,
        username: mysqlForm.username,
      });

      const response = await connectMySQL({
        host: mysqlForm.host,
        port: Number(mysqlForm.port),
        database: mysqlForm.database,
        username: mysqlForm.username,
        password: mysqlForm.password,
      });

      console.log("MySQL connected:", response);

      onDatabaseConnected(response);
      onClose();
    } catch (error) {
      console.error("MySQL connection failed:", error);

      setError(error.message || "Unable to connect to MySQL.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="database-modal__overlay">
      <div className="database-modal">
        {/* Header */}
        <div className="database-modal__header">
          <h2>Add MySQL Database</h2>

          <button
            type="button"
            className="database-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="database-modal__body">
          <div className="database-form">
            {/* Host */}
            <label htmlFor="mysql-host">Host</label>

            <input
              id="mysql-host"
              name="host"
              type="text"
              value={mysqlForm.host}
              onChange={handleMysqlChange}
              placeholder="localhost"
            />

            {/* Port */}
            <label htmlFor="mysql-port">Port</label>

            <input
              id="mysql-port"
              name="port"
              type="number"
              value={mysqlForm.port}
              onChange={handleMysqlChange}
              placeholder="3306"
            />

            {/* Database */}
            <label htmlFor="mysql-database">Database</label>

            <input
              id="mysql-database"
              name="database"
              type="text"
              value={mysqlForm.database}
              onChange={handleMysqlChange}
              placeholder="Database name"
            />

            {/* Username */}
            <label htmlFor="mysql-username">Username</label>

            <input
              id="mysql-username"
              name="username"
              type="text"
              value={mysqlForm.username}
              onChange={handleMysqlChange}
              placeholder="root"
            />

            {/* Password */}
            <label htmlFor="mysql-password">Password</label>

            <input
              id="mysql-password"
              name="password"
              type="password"
              value={mysqlForm.password}
              onChange={handleMysqlChange}
              placeholder="Password"
            />
            {error && (
              <div className="database-error" role="alert">
                {error}
              </div>
            )}
            {/* Connect */}
            <button type="button" onClick={handleConnect} disabled={connecting}>
              {connecting ? "Connecting..." : "Connect"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatabaseModal;
