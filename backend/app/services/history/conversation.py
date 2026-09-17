conversations: dict[str, list[dict[str, str]]] = {}


def get_history(conversation_id: str) -> list[dict[str, str]]:
    return conversations.get(conversation_id, [])


def add_message(
    conversation_id: str,
    question: str,
    sql: str,
    answer: str,
    database_type: str,
) -> None:
    if conversation_id not in conversations:
        conversations[conversation_id] = []

    conversations[conversation_id].append({
        "question": question,
        "sql": sql,
        "answer": answer,
        "database_type": database_type,
    })