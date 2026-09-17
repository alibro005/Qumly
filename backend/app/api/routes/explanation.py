from fastapi import APIRouter

from app.schema.schema import ExplainSQLRequest
from app.services.llm import generate_sql_explanation
from app.services.prompts.prompt import build_explain_sql_prompt

router = APIRouter()


@router.post("/explain-sql")
async def explain_sql(data: ExplainSQLRequest):
    prompt = build_explain_sql_prompt(data.sql)
    explanation = generate_sql_explanation(prompt)

    return {
        "status": "success",
        "sql": data.sql,
        "explanation": explanation,
    }