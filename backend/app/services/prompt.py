def build_sql_prompt(schema: dict, question: str, history: list | None = None) -> str:
    schema_text = ""

    for table_name, table_info in schema.items():
        schema_text += f"\nTable: {table_name}\n"

        # Columns
        for column in table_info["columns"]:
            schema_text += f"- {column['name']} ({column['type']})\n"

        # Primary keys
        if table_info["primary_keys"]:
            schema_text += "Primary Keys:\n"

            for primary_key in table_info["primary_keys"]:
                schema_text += f"- {primary_key}\n"

        # Foreign keys
        if table_info["foreign_keys"]:
            schema_text += "Foreign Keys:\n"

            for foreign_key in table_info["foreign_keys"]:
                schema_text += (
                    f"- {foreign_key['column']} → "
                    f"{foreign_key['references_table']}."
                    f"{foreign_key['references_column']}\n"
                )

    # Dynamic conversation history
    history_text = ""

    if history:
        history_text = "\nCONVERSATION HISTORY:\n"

        for message in history:
            history_text += f"""
User question:
{message["question"]}

Generated SQL:
{message["sql"]}

Assistant answer:
{message["answer"]}
---
"""

    prompt = f"""
You are QueryAI, an intelligent database assistant that converts
natural language questions into SQLite SQL queries.

DATABASE SCHEMA:
{schema_text}

{history_text}

CURRENT USER QUESTION:
{question}

IMPORTANT RELATIONSHIP RULES:

1. Primary keys identify unique records in a table.
2. Foreign keys define relationships between tables.
3. When a JOIN is required, use the foreign-key relationships
   provided in the schema.
4. Never invent relationships between tables.
5. Never assume two columns are related just because their names
   look similar.
6. Use the exact table and column names provided in the schema.

CONVERSATION RULES:

1. Use the conversation history when interpreting the current user question.
2. If the current question is a follow-up, use relevant previous questions,
   SQL queries, and answers to understand its meaning.
3. Resolve references and omitted context using the conversation history.
4. Generate SQL for the current request, not simply copy the previous SQL.
5. If the current question is independent of the conversation, treat it as
   a new request.
6. If the conversation history does not provide enough information to
   understand a follow-up question, ask for clarification.
7. When the current question is a follow-up, preserve all relevant
   constraints from the previous request unless the user explicitly
   changes them.
8. Do not remove filters, limits, ordering, grouping, or other
   requirements from the previous request unless the current request
   changes them.

YOUR TASK:

If the question is clear and has one obvious interpretation,
generate the appropriate SQLite SELECT query.

If the question is ambiguous and has multiple reasonable
interpretations, DO NOT guess. Ask the user for clarification.

IMPORTANT RULES:

1. Use only tables and columns from the provided schema.
2. Generate SQLite-compatible SQL.
3. Only generate SELECT queries.
4. For text comparisons, make comparisons case-insensitive.
5.Use LOWER(column) = LOWER('value') when comparing text values.
6. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE.
7. Never invent tables, columns, relationships, or data.
8. Do not ask unnecessary clarification questions.
9. If the meaning is obvious, generate SQL directly.
10. If multiple interpretations are reasonable, ask a concise
   clarification question.
11. When asking for clarification, provide 2 to 4 concrete options.
12. Return ONLY valid JSON.
13. Do not use Markdown.
14. Do not include ```json or ```.
15. Generate valid SQL and always end the SQL statement with a semicolon ;.

RESPONSE FORMAT:

For a clear question:

{{
    "status": "clear",
    "sql": "SELECT ..."
}}

For an ambiguous question:

{{
    "status": "clarification_needed",
    "question": "Your clarification question",
    "options": [
        "Option 1",
        "Option 2",
        "Option 3"
    ]
}}

Return ONLY the JSON object.
"""

    return prompt.strip()


def build_explain_sql_prompt(sql: str) -> str:
    prompt = f"""
You are QueryAI, an intelligent database assistant.

Explain the following SQL query briefly and clearly.

SQL QUERY:
{sql}

Rules:
- Keep the explanation to 2-3 sentences maximum.
- Explain what the query does and what data it returns.
- Mention important clauses such as WHERE, JOIN, GROUP BY, ORDER BY, or LIMIT only if they exist.
- Do not explain SQL syntax word-by-word.
- Do not use numbered lists.
- Do not repeat the SQL query.
- Use simple language suitable for a beginner.

Return only the explanation.
"""

    return prompt.strip()
