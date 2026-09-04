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

          {/* Loading */}
          {message.status === "loading" && (
            <div className="query-loading" aria-live="polite">
              <div className="query-loading__dots">
                <span />
                <span />
                <span />
              </div>

              <span>Generating your answer...</span>
            </div>
          )}

          {message.status === "success" && (
            <AnswerCard
              answer={message.answer}
              results={message.results}
              sql={message.sql}
              showActions={true}
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
              showActions={false}
              onShowSql={null}
              onExplainSql={null}
              databaseType={null}
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
