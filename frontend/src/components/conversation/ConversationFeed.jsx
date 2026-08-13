import UserMessage from "./UserMessage";
import AnswerCard from "./AnswerCard";
import ClarificationCard from "./ClarificationCard";

function ConversationFeed({
  messages,
  onClarification,
  onShowSql,
  onExplainSql,
}) {
  return (
    <section className="feed">
      {messages.map((message) => (
        <div
          className="conversation-item"
          key={message.id}
        >
          <UserMessage
            question={message.question}
          />

          {message.status === "success" && (
            <AnswerCard
              answer={message.answer}
              results={message.results}
              sql={message.sql}
              onShowSql={onShowSql}
              onExplainSql={onExplainSql}
            />
          )}

          {message.status === "clarification_needed" && (
            <ClarificationCard
              question={message.question}
              options={message.options}
              onSelect={(option) =>
                onClarification(message, option)
              }
            />
          )}
        </div>
      ))}
    </section>
  );
}

export default ConversationFeed;