from app.database import get_schema
from app.prompt import build_sql_prompt
from app.llm import generate_sql

schema = get_schema()

questions = [
    "Show the top 5 students with the highest marks.",
    "Show the best students."
]

for question in questions:
    print("\n" + "=" * 60)
    print("QUESTION:")
    print(question)

    prompt = build_sql_prompt(schema=schema, question=question)

    result = generate_sql(prompt)

    print("\nLLM Response:\n")
    print(result)
