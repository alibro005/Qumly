import UserMessage from "./UserMessage";
import AnswerCard from "./AnswerCard";
import ClarificationCard from "./ClarificationCard";

function ConversationFeed({
  messages,
  onClarification,
  onShowSql,
  onExplainSql,
  databaseType,
}) {
  return (
    <section className="feed">
      {messages.map((message) => (
        <div className="conversation-item" key={message.id}>
          <UserMessage question={message.question} />

          {message.status === "success" && (
            <AnswerCard
              answer={message.answer}
              results={message.results}
              sql={message.sql}
              onShowSql={onShowSql}
              onExplainSql={onExplainSql}
              databaseType={databaseType}
            />
          )}

          {/* Rejected */}
          {message.status === "rejected" && (
            <AnswerCard
              answer={message.answer}
              results={null}
              sql={null}
              onShowSql={onShowSql}
              onExplainSql={onExplainSql}
              databaseType={databaseType}
            />
          )}

          {/* Clarification needed */}
          {message.status === "clarification_needed" && (
              <ClarificationCard
                question={message.clarificationQuestion}
                options={message.options}
                onSelect={(option) => onClarification(message, option)}
                databaseType={databaseType}
              />
            )}
        </div>
      ))}
    </section>
  );
}

export default ConversationFeed;
