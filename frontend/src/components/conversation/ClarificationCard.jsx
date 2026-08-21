import { ChevronRight } from "lucide-react";

function ClarificationCard({ question, options, onSelect }) {
  return (
    <div className="msg msg--ai">
      <div className="clarify-card">
        <div className="clarify-card__head">
          <span className="answer-card__mark">Q</span>
          <span className="clarify-card__title">
            Qumly needs a little clarification
          </span>
        </div>

        <p className="clarify-card__question">{question}</p>

        <div className="clarify-card__options">
          {options?.map((option, index) => (
            <button
              key={index}
              type="button"
              className="clarify-option"
              onClick={() => onSelect(option)}
            >
              <span>{option}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClarificationCard;
