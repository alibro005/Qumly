from pydantic import BaseModel


class QueryRequest(BaseModel):
    question: str
    clarification: str | None = None
    conversation_id: str | None = None


class QueryResponse(BaseModel):
    status: str
    question: str | None = None
    sql: str | None = None
    results: dict | None = None
    answer: str | None = None
    clarification_question: str | None = None
    options: list[str] | None = None


class ExplainSQLRequest(BaseModel):
    sql: str
