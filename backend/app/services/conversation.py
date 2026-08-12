conversations = {}


def get_history(conversation_id: str):
    return conversations.get(conversation_id, [])


def add_message(
    conversation_id: str,
    question: str,
    sql: str,
    answer: str
):
    if conversation_id not in conversations:
        conversations[conversation_id] = []

    conversations[conversation_id].append({
        "question": question,
        "sql": sql,
        "answer": answer
    })