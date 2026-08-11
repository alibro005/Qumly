from app.database import get_schema
from app.prompt import build_sql_prompt
from app.llm import generate_sql


schema = get_schema()

question = "Show the top 5 students with the highest marks."

prompt = build_sql_prompt(schema, question)

sql = generate_sql(prompt)

print("\nGenerated SQL:\n")
print(sql)