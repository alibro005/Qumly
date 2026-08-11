from fastapi import APIRouter, HTTPException
from httpx import request

from app.database import get_connection, get_schema, execute_query
from app.prompt import build_sql_prompt
from app.llm import generate_sql, generate_answer
from app.sql_validator import validate_sql


from app.schema import QueryRequest, QueryResponse

router = APIRouter()


@router.get("/")
def root():
    return {"message": "Qumly API is running"}


@router.get("/health")
def health_check():
    return {"status": "healthy"}


@router.get("/database-test")
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

    return {"database": "connected", "tables": [table[0] for table in tables]}


@router.get("/schema")
def database_schema():
    return get_schema()


@router.post("/query", response_model=QueryResponse)
def query_database(request: QueryRequest):

    # 1. Get database schema
    schema = get_schema()

    # 2. Build AI prompt

    question = request.question

    if request.clarification:
        question = f"""
    Original question:
    {request.question}

    User clarification:
    {request.clarification}
    """

    prompt = build_sql_prompt(schema=schema, question=question)

    # 3. Generate SQL using Llama
    result = generate_sql(prompt)

    if result["status"] == "clarification_needed":
        return {
            "status": "clarification_needed",
            "question": result["question"],
            "options": result["options"],
        }

    sql = result["sql"]

    # 4. Validate generated SQL
    is_valid, message = validate_sql(sql)

    if not is_valid:
        raise HTTPException(
            status_code=400, detail={"message": message, "generated_sql": sql}
        )

    # 5. Execute SQL
    try:
        results = execute_query(sql)
        answer = generate_answer(question=request.question, sql=sql, results=results)
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "SQL execution failed.",
                "error": str(error),
                "generated_sql": sql,
            },
        )

    # 6. Return everything

    return {"status": "success","question": request.question, "sql": sql, "results": results,"answer": answer}