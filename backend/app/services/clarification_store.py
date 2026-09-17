from typing import Any

ClarificationState = dict[str, Any]

# Temporary in-memory store for pending clarifications.
# Replace with Redis or a database in production.
_pending_clarifications: dict[str | None, ClarificationState] = {}


def get_clarification(
    conversation_id: str | None,
) -> ClarificationState | None:
    return _pending_clarifications.get(conversation_id)


def start_clarification(
    conversation_id: str | None,
    original_question: str,
) -> ClarificationState:
    state: ClarificationState = {
        "original": original_question,
        "answers": [],
    }

    _pending_clarifications[conversation_id] = state

    return state


def add_clarification(
    conversation_id: str | None,
    answer: str,
) -> ClarificationState:
    state = get_clarification(conversation_id)

    if state is None:
        raise KeyError(
            f"No clarification state found for conversation: {conversation_id}"
        )

    state["answers"].append(answer)

    return state

def get_or_start_clarification(
    conversation_id: str | None,
    original_question: str,
) -> ClarificationState:
    state = get_clarification(conversation_id)

    if state is None:
        state = start_clarification(
            conversation_id=conversation_id,
            original_question=original_question,
        )

    return state

def clear_clarification(conversation_id: str | None) -> None:
    _pending_clarifications.pop(conversation_id, None)