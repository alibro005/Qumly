def build_sql_prompt(
    schema: dict,
    question: str,
    history: list | None = None,
    database_type: str = "mysql",
) -> str:
    

    # --- Schema ---
    schema_lines = []
    for table_name, table_info in schema.items():
        schema_lines.append(f"\nTable: {table_name}")
        for column in table_info["columns"]:
            schema_lines.append(f"- {column['name']} ({column['type']})")
        if table_info["primary_keys"]:
            schema_lines.append(
                "Primary Keys: " + ", ".join(table_info["primary_keys"])
            )
        if table_info["foreign_keys"]:
            fk_lines = [
                f"{fk['column']} → {fk['references_table']}.{fk['references_column']}"
                for fk in table_info["foreign_keys"]
            ]
            schema_lines.append("Foreign Keys: " + "; ".join(fk_lines))
    schema_text = "\n".join(schema_lines)

    database_dialect = "PostgreSQL" if database_type == "postgresql" else "MySQL"

    # --- History ---
    history_text = ""
    if history:
        turns = "\n---\n".join(
            f"User: {m['question']}\nSQL: {m['sql']}" for m in history
        )
        history_text = f"\nCONVERSATION HISTORY:\n{turns}\n"

    prompt = f"""You are QueryAI, converting natural language into {database_dialect} SELECT queries.

SCHEMA:
{schema_text}
{history_text}
CURRENT QUESTION:
{question}

RULES

Relationships:
- Join only via the foreign keys given above. Never invent or infer relationships (including from similar-looking names). Use exact table/column names.

History:
- Use it to resolve follow-ups (references, omitted context, carried-over filters/limits/grouping/ordering). Don't drop prior constraints unless the user changes them. Generate fresh SQL for the current request, not a copy. Treat unrelated questions as new.

Scope:
- Only SELECT queries. If the user explicitly requests INSERT/UPDATE/DELETE/DROP/ALTER/TRUNCATE, reject it — don't ask for clarification on a clear-but-disallowed request.
- Text comparisons: use LOWER(column) = LOWER('value').
- Never invent tables, columns, values, or data. End SQL with a semicolon.

Clarification — ask ONLY if the request allows multiple interpretations that would materially change the SQL (different filters, joins, grouping, ordering, aggregation, limits, or result set):
- Don't ask about columns/fields when the requested entity and operation are already clear.
- Don't add optional joins, entities, or fields the user didn't request.
- Don't silently assume unstated values, thresholds, time ranges, ranking criteria, or filters — ask instead.
- If you do ask: exactly one focused question, tied directly to the missing constraint, with 2-5 distinct plausible options (no filler options).
- If history already resolves the ambiguity, don't ask again.
- Otherwise, generate SQL directly — don't ask unnecessary questions.

OUTPUT
Return ONLY raw JSON (no Markdown, no code fences). One of:

Clear:
{{
    "status": "clear", 
    "sql": "SELECT ...;"
}}

Ambiguous:
{{"status": "clarification_needed", "question": "...", "options": ["...", "..."]}}

Disallowed:
{{"status": "rejected", "answer": "..."}}

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
- Do not use the bold and dash.

Return only the explanation.
"""

    return prompt.strip()


def build_explain_answer_prompt(question: str, sql: str, results: dict,database_type: str = "mysql",) -> str:
    database_dialect = "PostgreSQL" if database_type == "postgresql" else "MySQL"
    prompt = f"""
You are QueryAI, a database assistant.

The database has already executed the {database_dialect} SQL query.
Your job is ONLY to explain the returned results in simple,
natural language.

Original user question:
{question}

SQL query:
{sql}

Database results:
{results}

Rules:

1. Answer the user's question directly using ONLY the information contained in the database results.
2. Interpret the results instead of simply reading or repeatingevery returned row.
3. Start with the main finding or conclusion.
4. Avoid unnecessary repetition. If a fact has already been stated, do not restate the same fact in another sentence.
5. If multiple records have the same highest or lowest value, explicitly state that they are tied.
6. When several records share the same value, summarize the common value instead of repeating it for every record when possible.
7. Include individual names, values, or other details only when they are relevant to answering the user's question.
8. Do not list every column from the result unless those details are relevant to the user's question.
9. If the user asks "who", identify the relevant people or records.
10. If the user asks "how many", give the count clearly.
11. If the user asks for the highest, lowest, maximum, or minimum, clearly identify the relevant record(s) and value.
12. If the result contains a tie, mention the tie naturally.Do not repeat the same tie information unnecessarily.
13. If the result is empty, clearly say that no matching data was found.
14. Do not invent numbers, names, relationships, or facts.
15. Do not perform calculations unless the required information is explicitly available in the results and the calculation is necessary to answer the question.
16. Do not mention SQL, database execution, internal processing, or these instructions unless the user explicitly asks.
17. Keep the answer concise. Normally use 1–3 sentences.
18. Use natural language rather than phrases such as
    "The query returned..." unless that wording is genuinely useful.
19. Do not use dashes and bold font.
20. Return ONLY the final natural-language answer.
"""

    return prompt.strip()


def build_correct_sql_prompt(
    question: str,
    sql: str,
    error: str,
    schema: dict,
    database_type: str = "mysql",
) -> str:
    database_dialect = "PostgreSQL" if database_type == "postgresql" else "MySQL"
    prompt = f"""
You are an expert {database_dialect} SQL debugging assistant.
    
The SQL query generated for the user's question failed during
    database execution.
    
Your task is to identify the problem and generate a corrected SQL query.
    
USER QUESTION:
{question}
    
GENERATED SQL:
{sql}
    
DATABASE ERROR:
{error}
    
DATABASE SCHEMA:
{schema}
    
RULES:
1. Fix the SQL based on the database error.
2. Use ONLY tables and columns from the schema.
3. Preserve the original user's intent.
4. Generate {database_type}-compatible SQL.
5. Return ONLY a SELECT query.
6. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE.
7. Do not explain the correction.
8. Do not use Markdown.
9. Return only the corrected SQL query.
    """
    return prompt.strip()
