from fastapi import APIRouter, HTTPException, Header
import logging


from app.services.prompts.prompt import (
    build_sql_prompt,
    build_explain_sql_prompt,
    build_explain_answer_prompt,
    build_correct_sql_prompt,
)
from app.services.llm import (
    generate_sql,
    generate_answer,
    correct_sql,
    generate_sql_explanation,
)
from app.services.validators.sql_validator import validate_sql
from app.services.database.manager import database_manager
from app.services.clarification_store import (
    pending_clarifications,
)

from app.schema.schema import (
    QueryRequest,
    QueryResponse,
    ExplainSQLRequest,
    DatabaseConnectionRequest,
)
from app.services.history.conversation import get_history, add_message

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/")
def root():
    return {"message": "Qumly API is running"}


@router.get("/health")
def health_check():
    return {"status": "healthy"}


@router.post("/demo")
def connect_demo(x_session_id: str = Header(...)):
    try:
        database_manager.configure_demo(x_session_id)

        schema = database_manager.get_schema(x_session_id)

        return {
            "status": "success",
            "database": "mysql",
            "schema": schema,
        }
    except Exception as error:
        logger.exception("Failed to connect to demo database")
        raise HTTPException(
            status_code=503,
            detail={
                "status": "failed",
                "message": "Unable to connect to the database. Please try again in a few seconds.",
            },
        )


@router.post("/database/connect")
def connect_database(
    request: DatabaseConnectionRequest,
    x_session_id: str = Header(...),
):
    try:
        if request.database_type == "postgresql":
            database_manager.configure_postgresql(
                session_id=x_session_id,
                host=request.host,
                port=request.port,
                database=request.database,
                username=request.username,
                password=request.password,
            )
        else:
            database_manager.configure_mysql(
                session_id=x_session_id,
                host=request.host,
                port=request.port,
                database=request.database,
                username=request.username,
                password=request.password,
            )

        schema = database_manager.get_schema(x_session_id)

        # return schema
        return {
            "status": "success",
            "database": request.database_type,
            "schema": schema,
        }

    except Exception as error:
        logger.exception(
            "Failed to connect to %s database",
            request.database_type,
        )

        if "connection refused" in str(error).lower() and request.host in (
            "localhost",
            "127.0.0.1",
            "::1",
        ):
            message = (
                "Connection failed. `localhost` is not accessible "
                "from the deployed application."
            )
        else:
            message = (
                "Connection failed. Please check your host, port, "
                "and database credentials."
            )

        raise HTTPException(
            status_code=400,
            detail={
                "status": "failed",
                "message": message,
            },
        )


@router.post("/database/disconnect")
def disconnect_database(
    x_session_id: str = Header(...),
):
    try:
        database_manager.disconnect(x_session_id)

        return {"message": "Database disconnected successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/database/status")
def database_status(
    x_session_id: str = Header(...),
):
    connected = database_manager.is_connected(x_session_id)
    database_type = database_manager.get_database_type(x_session_id)

    return {
        "connected": connected,
        "database": (database_type if connected else None),
    }


@router.get("/database-test")
def database_test(
    x_session_id: str = Header(...),
):
    try:
        schema = database_manager.get_schema(x_session_id)
        database_type = database_manager.get_database_type(x_session_id)

        return {
            "database": database_type,
            "tables": list(schema.keys()),
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get("/schema")
def database_schema(
    x_session_id: str = Header(...),
):
    try:
        return database_manager.get_schema(x_session_id)
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail={
                "status": "failed",
                "message": str(error),
            },
        )


@router.post("/query", response_model=QueryResponse)
def query_database(request: QueryRequest, x_session_id: str = Header(...)):

    schema = database_manager.get_schema(x_session_id)
    database_type = database_manager.get_database_type(x_session_id)
    conversation_id = request.conversation_id

    # Handle clarifications if provided

    if request.clarification:
        state = pending_clarifications.get(conversation_id)
        if state is None:
            # fallback if server restarted / state lost: treat as fresh
            state = {"original": request.question, "answers": []}

        state["answers"].append(request.clarification)
        qa_text = "\n".join(
            f"Clarification {index + 1}: {answer}"
            for index, answer in enumerate(state["answers"])
        )

        question = f"""The user's original request was:

{state["original"]}

The user then clarified their request with the following selections:

{qa_text}

Use the clarifications to determine the user's final intent.
Do not ask for information that has already been provided.
"""
    else:
        # fresh question — reset any old clarification state for this conversation
        pending_clarifications[conversation_id] = {
            "original": request.question,
            "answers": [],
        }
        question = request.question

    # Get the last 8 messages from the conversation history for context

    history = get_history(conversation_id)[-8:] if conversation_id else []

    # Build the prompt for the LLM to generate SQL

    prompt = build_sql_prompt(
        schema=schema, question=question, history=history, database_type=database_type
    )

    # Call the LLM to generate SQL
    result = generate_sql(prompt)

    print("LLM RESULT:", result)

    if result.get("status") == "clarification_needed":
        # Store the clarification state for this conversation
        return {
            "status": "clarification_needed",
            "question": result.get("question"),
            "options": result.get("options", []),
        }

   # Handle rejected responses from the LLM
    if result.get("status") == "rejected":
        pending_clarifications.pop(conversation_id, None)
        return {
            "status": "rejected",
            "question": request.question,
            "answer": result.get("answer"),
        }

    # Handle unexpected responses from the LLM
    if result.get("status") != "clear":
        raise HTTPException(
            status_code=400,
            detail={"message": "Invalid response from AI.", "result": result},
        )

    sql = result.get("sql")
    if not sql:
        raise HTTPException(status_code=400, detail="AI did not return a SQL query.")

    is_valid, message = validate_sql(sql)
    if not is_valid:
        raise HTTPException(
            status_code=400, detail={"message": message, "generated_sql": sql}
        )

    try:
        results = database_manager.execute_query(x_session_id, sql)
    except Exception as error:
        corrected_prompt = build_correct_sql_prompt(
            question=question,
            sql=sql,
            error=str(error),
            schema=schema,
            database_type=database_type,
        )

        corrected_sql = correct_sql(corrected_prompt)

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

        try:
            results = database_manager.execute_query(x_session_id, corrected_sql)
            sql = corrected_sql

        except Exception as correction_error:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "SQL correction failed.",
                    "error": str(correction_error),
                    "generated_sql": corrected_sql,
                    "database_type": database_type,
                },
            )

    MAX_ROWS_FOR_ANSWER = 20

    answer_results = {
        "columns": results.get("columns", []),
        "rows": results.get("rows", [])[:MAX_ROWS_FOR_ANSWER],
        "total_rows": len(results.get("rows", [])),
    }

    answer_prompt = build_explain_answer_prompt(
        question=question,
        sql=sql,
        results=answer_results,
    )

    answer = generate_answer(answer_prompt)

    if conversation_id:
        add_message(
            conversation_id=conversation_id,
            question=question,
            sql=sql,
            answer=answer,
            database_type=database_type,
        )
        pending_clarifications.pop(conversation_id, None)

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

    # Call Llm function
    explanation = generate_sql_explanation(prompt)

    return {"status": "success", "sql": data.sql, "explanation": explanation}
