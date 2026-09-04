import { useState, useEffect } from "react";

import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/SideBar";
import QueryInput from "../components/query/QueryInput";
import ConversationFeed from "../components/conversation/ConversationFeed";
import DatabaseModal from "../components/database/Database";
import { getSessionId } from "../services/session";

import {
  sendQuery,
  explainSql,
  getDatabaseStatus,
  getSchema,
  disconnectDatabase,
} from "../services/api";

function App() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(() =>
    crypto.randomUUID(),
  );
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentQueries, setRecentQueries] = useState([]);
  const [databaseModalOpen, setDatabaseModalOpen] = useState(false);

  const [schema, setSchema] = useState({});
  const [databaseType, setDatabaseType] = useState(null);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const status = await getDatabaseStatus();

        if (!status.connected) {
          setDatabaseType(null);
          setSchema({});
          return;
        }

        setDatabaseType(status.database);

        const schema = await getSchema();
        setSchema(schema);
      } catch (error) {
        console.error("Failed to restore database:", error);
        setDatabaseType(null);
        setSchema({});
      }
    };

    loadDatabase();
  }, []);

  const handleAddDatabase = () => {
    setDatabaseModalOpen(true);
  };

  const handleExplainSql = async (sql) => {
    return await explainSql(sql);
  };

  // handle disconnect
  const handleDisconnect = async () => {
    try {
      const sessionId = getSessionId();

      await disconnectDatabase(sessionId);

      setDatabaseType(null);
      setSchema({});
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  // handle query

  const handleQuery = async (question) => {
    const messageId = Date.now();

    const pendingMessage = {
      id: messageId,
      question,
      clarificationQuestion: null,
      status: "loading",
      answer: null,
      sql: null,
      results: null,
      options: null,
    };

    // Show the user's message immediately
    setMessages((previousMessages) => [...previousMessages, pendingMessage]);

    setLoading(true);

    try {
      const response = await sendQuery(question, null, conversationId);

      // Replace the loading message with the actual response
      setMessages((previousMessages) =>
        previousMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                clarificationQuestion: response.question,
                status: response.status,
                answer: response.answer,
                sql: response.sql,
                results: response.results,
                options: response.options,
              }
            : message,
        ),
      );

      setRecentQueries((previous) => {
        const updated = [
          {
            id: messageId,
            question,
          },
          ...previous.filter((item) => item.question !== question),
        ];

        return updated.slice(0, 5);
      });
    } catch (error) {
      console.error("Query error:", error);

      setMessages((previousMessages) =>
        previousMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                status: "error",
                answer:
                  error.message ||
                  "Something went wrong while processing your query.",
              }
            : message,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Clarification

  const handleClarification = async (message, clarification) => {
    if (loading) return;
    const messageId = Date.now();

    // Create a new loading message
    const pendingMessage = {
      id: messageId,
      question: clarification,
      originalQuestion: message.originalQuestion || message.question,
      clarificationQuestion: null,
      status: "loading",
      answer: null,
      sql: null,
      results: null,
      options: null,
    };

    // Keep the old message and add the new loading message
    setMessages((previousMessages) => [...previousMessages, pendingMessage]);

    setLoading(true);

    try {
      const response = await sendQuery(
        message.originalQuestion || message.question,
        clarification,
        conversationId,
      );

      // Replace only the new loading message
      setMessages((previousMessages) =>
        previousMessages.map((item) =>
          item.id === messageId
            ? {
                ...item,
                clarificationQuestion:
                  response.status === "clarification_needed"
                    ? response.question
                    : null,
                status: response.status,
                answer: response.answer,
                sql: response.sql,
                results: response.results,
                options: response.options,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Clarification error:", error);

      setMessages((previousMessages) =>
        previousMessages.map((item) =>
          item.id === messageId
            ? {
                ...item,
                status: "rejected",
                answer:
                  error.message ||
                  "Something went wrong while processing your query.",
              }
            : item,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuery = () => {
    setMessages([]);
    setLoading(false);
    setConversationId(crypto.randomUUID());
  };

  return (
    <div className="app">
      <Topbar
        onToggleSidebar={() => setSidebarOpen((previous) => !previous)}
        sidebarOpen={sidebarOpen}
        databaseType={databaseType}
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`app-shell ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        <Sidebar
          onNewQuery={handleNewQuery}
          recentQueries={recentQueries}
          onAddDatabase={handleAddDatabase}
          schema={schema}
          databaseType={databaseType}
          onDisconnect={handleDisconnect}
        />

        <main className="workspace">
          <ConversationFeed
            messages={messages}
            onClarification={handleClarification}
            onExplainSql={handleExplainSql}
            databaseType={databaseType}
          />
          <QueryInput onSubmit={handleQuery} loading={loading} />
        </main>
      </div>
      {databaseModalOpen && (
        <DatabaseModal
          onClose={() => setDatabaseModalOpen(false)}
          onDatabaseConnected={(data) => {
            setSchema(data?.schema || {});
            setDatabaseType(data?.database || null);
          }}
        />
      )}
    </div>
  );
}

export default App;
