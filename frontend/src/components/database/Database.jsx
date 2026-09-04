import { useState } from "react";
import { connectDatabase, connectDemo } from "../../services/api";
import mysqlLogo from "../../assets/mysql.svg";
import postgresqlLogo from "../../assets/postgresql.svg";

function DatabaseModal({ onClose, onDatabaseConnected }) {
  const [databaseForm, setDatabaseForm] = useState({
    host: "",
    port: "3306",
    database: "",
    username: "",
    password: "",
  });

  const [connecting, setConnecting] = useState(false);
  const [connectionMode, setConnectionMode] = useState("demo");
  const [error, setError] = useState("");

  const handleDatabaseChange = (event) => {
    const { name, value } = event.target;

    setDatabaseForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleDatabaseTypeChange = (type) => {
    setConnectionMode(type);
    setError("");

    setDatabaseForm((previous) => ({
      ...previous,
      port: type === "mysql" ? "3306" : "5433",
    }));
  };

  const handleDemoConnect = async () => {
    if (connecting) {
      return;
    }

    setError("");

    try {
      setConnecting(true);

      const response = await connectDemo();

      onDatabaseConnected(response);
      onClose();
    } catch (error) {
      console.error("Demo database connection failed:", error);
      setError(error.message || "Unable to connect to demo database.");
    } finally {
      setConnecting(false);
    }
  };

  const handleConnect = async () => {
    if (connecting) {
      return;
    }

    setError("");

    if (!databaseForm.host) {
      setError("Please enter the database host.");
      return;
    }

    if (!databaseForm.port) {
      setError("Please enter the database port.");
      return;
    }

    if (!databaseForm.database) {
      setError("Please enter the database name.");
      return;
    }

    if (!databaseForm.username) {
      setError("Please enter the database username.");
      return;
    }

    try {
      setConnecting(true);

      const response = await connectDatabase({
        database_type: connectionMode,
        host: databaseForm.host,
        port: Number(databaseForm.port),
        database: databaseForm.database,
        username: databaseForm.username,
        password: databaseForm.password,
      });

      onDatabaseConnected(response);

      onClose();
    } catch (error) {
      console.error(`${connectionMode} connection failed:`, error);

      setError(error.message || `Unable to connect to ${connectionMode}.`);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="database-modal__overlay">
      <div className="database-modal">
        {/* Header */}
        <div className="database-modal__header">
          <h2>Add Database</h2>

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
          <div className="database-mode">
            <button
              type="button"
              className={connectionMode === "demo" ? "active" : ""}
              onClick={() => {
                setConnectionMode("demo");
                setError("");
              }}
            >
              Demo
            </button>

            <button
              type="button"
              className={connectionMode === "mysql" ? "active" : ""}
              onClick={() => handleDatabaseTypeChange("mysql")}
            >
              <img src={mysqlLogo} alt="MySQL" className="database-logo" />
            </button>

            <button
              type="button"
              className={connectionMode === "postgresql" ? "active" : ""}
              onClick={() => handleDatabaseTypeChange("postgresql")}
            >
              <img
                src={postgresqlLogo}
                alt="PostgreSQL"
                className="database-logo"
              />
            </button>
          </div>

          {/* Demo Database */}
          {connectionMode === "demo" && (
            <div className="database-demo">
              <h3>Qumly Demo Database</h3>

              <p>Try Qumly with the built-in demo database.</p>

              {error && (
                <div className="database-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleDemoConnect}
                disabled={connecting}
                className="database-modal__submit"
                aria-busy={connecting}
              >
                {connecting && <span className="button-spinner" />}
                {connecting ? "Connecting..." : "Connect Demo Database"}
              </button>
            </div>
          )}

          {/* MySQL / PostgreSQL */}
          {(connectionMode === "mysql" || connectionMode === "postgresql") && (
            <div className="database-form">
              <label htmlFor="database-host">Host</label>

              <input
                id="database-host"
                name="host"
                type="text"
                value={databaseForm.host}
                onChange={handleDatabaseChange}
                placeholder="Host name"
              />

              <label htmlFor="database-port">Port</label>

              <input
                id="database-port"
                name="port"
                type="number"
                value={databaseForm.port}
                onChange={handleDatabaseChange}
                placeholder="Port"
              />

              <label htmlFor="database-name">Database</label>

              <input
                id="database-name"
                name="database"
                type="text"
                value={databaseForm.database}
                onChange={handleDatabaseChange}
                placeholder="Database name"
              />

              <label htmlFor="database-username">Username</label>

              <input
                id="database-username"
                name="username"
                type="text"
                value={databaseForm.username}
                onChange={handleDatabaseChange}
                placeholder="Username"
              />

              <label htmlFor="database-password">Password</label>

              <input
                id="database-password"
                name="password"
                type="password"
                value={databaseForm.password}
                onChange={handleDatabaseChange}
                placeholder="Password"
              />

              {error && (
                <div className="database-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleConnect}
                disabled={connecting}
                className="database-modal__submit btn btn--primary btn--block"
                aria-busy={connecting}
              >
                {connecting && <span className="button-spinner" />}
                {connecting
                  ? "Connecting..."
                  : `Connect ${
                      connectionMode === "mysql" ? "MySQL" : "PostgreSQL"
                    }`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DatabaseModal;
