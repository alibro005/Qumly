from fastapi import APIRouter, HTTPException
from httpx import request


from app.services.prompt import build_sql_prompt, build_explain_sql_prompt
from app.services.llm import (
    generate_sql,
    generate_answer,
    correct_sql,
    generate_sql_explanation,
)
from app.services.sql_validator import validate_sql

from app.services.database.manager import (
    configure_mysql,
    is_connected,
    get_schema,
    execute_query,
)

from app.schema.schema import (
    QueryRequest,
    QueryResponse,
    ExplainSQLRequest,
    MySQLConnectionRequest,
)
from app.services.conversation import get_history, add_message

router = APIRouter()


@router.get("/")
def root():
    return {"message": "Qumly API is running"}


@router.get("/health")
def health_check():
    return {"status": "healthy"}


@router.post("/database/connect")
def connect_mysql(data: MySQLConnectionRequest):

    try:
        configure_mysql(
            host=data.host,
            port=data.port,
            database=data.database,
            username=data.username,
            password=data.password,
        )

        # Test the connection and retrieve schema
        schema = get_schema()

        return schema

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail={
                "status": "failed",
                "message": str(error),
            },
        )


@router.get("/database/status")
def database_status():

    return {
        "connected": is_connected(),
        "database": "mysql" if is_connected() else None,
    }


@router.get("/database-test")
def database_test():
    try:
        schema = get_schema()

        return {
            "database": "mysql",
            "tables": list(schema.keys()),
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get("/schema")
def database_schema():
    try:
        return get_schema()
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail={
                "status": "failed",
                "message": str(error),
            },
        )


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
    conversation_id = request.conversation_id

    history = []

    if conversation_id:
        history = get_history(conversation_id)

    print("CONVERSATION ID:", conversation_id)
    print("HISTORY:", history)

    prompt = build_sql_prompt(schema=schema, question=question, history=history)

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

        # print("Original SQL:", sql)
        # print("Database error:", str(error))

        # Ask Llama to correct the failed SQL
        corrected_sql = correct_sql(
            question=request.question, sql=sql, error=str(error), schema=schema
        )

        # print("Corrected SQL:", corrected_sql)

        # Validate corrected SQL
        is_valid, message = validate_sql(corrected_sql)

        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "AI-generated correction failed validation.",
                    "validation_error": message,
                    "generated_sql": corrected_sql,
                },
            )

        # Execute corrected SQL
        try:
            results = execute_query(corrected_sql)
            sql = corrected_sql

        except Exception as correction_error:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "SQL correction failed.",
                    "error": str(correction_error),
                    "generated_sql": corrected_sql,
                },
            )

    # Generate human-readable answer
    answer = generate_answer(question=request.question, sql=sql, results=results)

    if conversation_id:
        add_message(
            conversation_id=conversation_id,
            question=request.question,
            sql=sql,
            answer=answer,
        )

    # 6. Return everything

    return {
        "status": "success",
        "question": request.question,
        "sql": sql,
        "results": results,
        "answer": answer,
    }


@router.post("/explain-sql")
async def explain_sql(data: ExplainSQLRequest):

    prompt = build_explain_sql_prompt(data.sql)

    # Call your existing LLM function here
    explanation = generate_sql_explanation(prompt)

    return {"status": "success", "sql": data.sql, "explanation": explanation}
