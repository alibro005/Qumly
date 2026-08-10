def build_sql_prompt(schema: dict, question: str) -> str:
    schema_text = ""

    for table_name, columns in schema.items():
        schema_text += f"\nTable: {table_name}\n"

        for column in columns:
            schema_text += f"- {column['name']} ({column['type']})\n"

    prompt = f"""
You are QueryAI, an AI assistant that converts natural language
questions into SQLite SQL queries.

DATABASE SCHEMA:
{schema_text}

RULES:
1. Generate SQLite-compatible SQL.
2. Only generate SELECT queries.
3. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE.
4. Use only tables and columns that exist in the provided schema.
5. Do not invent table names or column names.
6. Return ONLY the SQL query.
7. Do not use markdown code blocks.
8. Do not include explanations.

USER QUESTION:
{question}

SQL:
"""

    return prompt.strip()