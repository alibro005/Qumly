import json
import os
import time

from groq import Groq, APIConnectionError
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_sql(prompt: str) -> dict:
    max_retries = 3

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert SQL assistant. "
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
                return json.loads(content)
            except json.JSONDecodeError:
                raise ValueError(f"LLM returned invalid JSON:\n{content}")

        except APIConnectionError:
            if attempt == max_retries - 1:
                raise RuntimeError(
                    "Unable to connect to the Groq API. " "Please try again later."
                )

            time.sleep(2**attempt)


def generate_sql_explanation(prompt):
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content


def generate_answer(prompt) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You explain database query results accurately and concisely. Do not use Markdown, bold, italics, asterisks,em dashes, or en dashes.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()


def correct_sql(prompt) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are an expert  SQL debugging assistant.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()
