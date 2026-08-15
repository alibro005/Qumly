import json
import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_sql(prompt: str) -> dict:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert SQLite SQL assistant."
                    "Always return valid JSON according to the "
                    "requested response format."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0,
    )

    content = response.choices[0].message.content.strip()

    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        raise ValueError(f"LLM returned invalid JSON:\n{content}")

    return result


def generate_sql_explanation(prompt):
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content


def generate_answer(question: str, sql: str, results: dict) -> str:
    prompt = f"""
You are QueryAI, a database assistant.

The database has already executed the SQL query.
Your job is ONLY to explain the returned results in simple,
natural language.

Original user question:
{question}

SQL query:
{sql}

Database results:
{results}

Rules:
1. Use ONLY the information present in the database results.
2. Do not invent numbers, names, or facts.
3. Do not perform calculations that are not supported by the results.
4. If there are no results, clearly tell the user that no matching data was found.
5. Keep the answer concise and easy to understand.
6. Do not mention that you are an AI.
7. Do not include SQL unless specifically asked.
8. Return only the natural-language answer.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You explain database query results accurately and concisely.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()


def correct_sql(question: str, sql: str, error: str, schema: dict) -> str:

    prompt = f"""
You are an expert SQLite SQL debugging assistant.

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
4. Generate SQLite-compatible SQL.
5. Return ONLY a SELECT query.
6. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE.
7. Do not explain the correction.
8. Do not use Markdown.
9. Return only the corrected SQL query.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an expert SQLite SQL debugging assistant.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()
