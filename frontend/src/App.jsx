import { useState } from "react";

import Topbar from "./components/layout/Topbar";
import Sidebar from "./components/layout/Sidebar";
import QueryInput from "./components/query/QueryInput";
import ConversationFeed from "./components/conversation/ConversationFeed";

import { sendQuery, explainSql } from "./services/api";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentQueries, setRecentQueries] = useState([]);

  const handleExplainSql = async (sql) => {
    return await explainSql(sql);
  };

  // handle query
  const handleQuery = async (question) => {
    try {
      setLoading(true);

      const response = await sendQuery(question);

      const newMessage = {
        id: Date.now(),
        question: question,
        status: response.status,
        answer: response.answer,
        sql: response.sql,
        results: response.results,
        options: response.options,
      };

      setMessages((previousMessages) => [...previousMessages, newMessage]);
      setRecentQueries((previous) => {
        const updated = [
          {
            id: newMessage.id,
            question: newMessage.question,
          },
          ...previous.filter((item) => item.question !== newMessage.question),
        ];

        return updated.slice(0, 5);
      });
    } catch (error) {
      console.error("Query error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Clarification

  const handleClarification = async (message, clarification) => {
    console.log("Original question:", message.question);
    console.log("Selected clarification:", clarification);

    try {
      setLoading(true);

      const response = await sendQuery(message.question, clarification);

      console.log("Clarification response:", response);

      const newMessage = {
        id: Date.now(),
        question: `${message.question} based on ${clarification}`,
        status: response.status,
        answer: response.answer,
        sql: response.sql,
        results: response.results,
        options: response.options,
      };

      setMessages((previousMessages) => [...previousMessages, newMessage]);
    } catch (error) {
      console.error("Clarification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuery = () => {
    setMessages([]);
    setLoading(false);
  };

  return (
    <div className="app">
      <Topbar
        onToggleSidebar={() => setSidebarOpen((previous) => !previous)}
        sidebarOpen={sidebarOpen}
      />

      <div className={`app-shell ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        <Sidebar onNewQuery={handleNewQuery} recentQueries={recentQueries} />

        <main className="workspace">
          <ConversationFeed
            messages={messages}
            onClarification={handleClarification}
            onExplainSql={handleExplainSql}
          />
          <QueryInput onSubmit={handleQuery} loading={loading} />
        </main>
      </div>
    </div>
  );
}

export default App;
