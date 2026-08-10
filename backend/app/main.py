from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.database import get_connection, get_schema, execute_query
from app.prompt import build_sql_prompt
from app.llm import generate_sql
from app.sql_validator import validate_sql


app = FastAPI(
    title="QueryAI",
    description="AI-powered natural language SQL assistant",
    version="0.1.0"
)


class QueryRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {
        "message": "QueryAI API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/database-test")
def database_test():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type='table'
        AND name NOT LIKE 'sqlite_%';
    """)

    tables = cursor.fetchall()
    connection.close()

    return {
        "database": "connected",
        "tables": [table[0] for table in tables]
    }


@app.get("/schema")
def database_schema():
    return get_schema()


@app.post("/query")
def query_database(request: QueryRequest):

    # 1. Get database schema
    schema = get_schema()

    # 2. Build AI prompt
    prompt = build_sql_prompt(
        schema=schema,
        question=request.question
    )

    # 3. Generate SQL using Llama
    sql = generate_sql(prompt)

    # 4. Validate generated SQL
    is_valid, message = validate_sql(sql)

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail={
                "message": message,
                "generated_sql": sql
            }
        )

    # 5. Execute SQL
    try:
        results = execute_query(sql)

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "SQL execution failed.",
                "error": str(error),
                "generated_sql": sql
            }
        )

    # 6. Return everything
    return {
        "question": request.question,
        "sql": sql,
        "results": results
    }