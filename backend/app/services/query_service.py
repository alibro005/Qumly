import logging

from fastapi import HTTPException

from app.schema.schema import QueryRequest
from app.services.clarification_store import (
    add_clarification,
    clear_clarification,
    get_or_start_clarification,
    start_clarification,
)
from app.services.database.manager import database_manager
from app.services.history.conversation import add_message, get_history
from app.services.llm import (
    correct_sql,
    generate_answer,
    generate_sql,
)
from app.services.prompts.prompt import (
    build_correct_sql_prompt,
    build_explain_answer_prompt,
    build_sql_prompt,
)
from app.services.validators.sql_validator import validate_sql

logger = logging.getLogger(__name__)

MAX_ROWS_FOR_ANSWER = 20


def process_query(
    request: QueryRequest,
    session_id: str,
):
    schema = database_manager.get_schema(session_id)
    database_type = database_manager.get_database_type(session_id)
    conversation_id = request.conversation_id

    if request.clarification:
        state = get_or_start_clarification(
            conversation_id=conversation_id,
            original_question=request.question,
        )

        state = add_clarification(
            conversation_id=conversation_id,
            answer=request.clarification,
        )

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
        start_clarification(
            conversation_id=conversation_id,
            original_question=request.question,
        )

        question = request.question

    # Conversation history
    history = get_history(conversation_id)[-8:] if conversation_id else []

    # Build SQL prompt
    prompt = build_sql_prompt(
        schema=schema,
        question=question,
        history=history,
        database_type=database_type,
    )

    # Generate SQL
    result = generate_sql(prompt)

    logger.debug("LLM result: %s", result)

    # Clarification required
    if result.get("status") == "clarification_needed":
        return {
            "status": "clarification_needed",
            "question": result.get("question"),
            "options": result.get("options", []),
        }

    # Request rejected
    if result.get("status") == "rejected":
        clear_clarification(conversation_id)

        return {
            "status": "rejected",
            "question": request.question,
            "answer": result.get("answer"),
        }

    # Unexpected LLM response
    if result.get("status") != "clear":
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid response from AI.",
                "result": result,
            },
        )

    sql = result.get("sql")

    if not sql:
        raise HTTPException(
            status_code=400,
            detail="AI did not return a SQL query.",
        )

    # Validate SQL
    is_valid, message = validate_sql(sql)

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail={
                "message": message,
                "generated_sql": sql,
            },
        )

    # Execute SQL
    try:
        results = database_manager.execute_query(
            session_id,
            sql,
        )

    except Exception as error:  # noqa: BLE001
        # Ask the LLM to correct failed SQL
        corrected_prompt = build_correct_sql_prompt(
            question=question,
            sql=sql,
            error=str(error),
            schema=schema,
            database_type=database_type,
        )

        corrected_sql = correct_sql(corrected_prompt)

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
            results = database_manager.execute_query(
                session_id,
                corrected_sql,
            )

            sql = corrected_sql

        except Exception as correction_error:   # noqa: BLE001
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "SQL correction failed.",
                    "error": str(correction_error),
                    "generated_sql": corrected_sql,
                    "database_type": database_type,
                },
            )

    # Limit results sent to the answer-generation LLM
    answer_results = {
        "columns": results.get("columns", []),
        "rows": results.get("rows", [])[:MAX_ROWS_FOR_ANSWER],
        "total_rows": len(results.get("rows", [])),
    }

    # Generate natural-language answer
    answer_prompt = build_explain_answer_prompt(
        question=question,
        sql=sql,
        results=answer_results,
        database_type=database_type,
    )

    answer = generate_answer(answer_prompt)

    # Save conversation history
    if conversation_id:
        add_message(
            conversation_id=conversation_id,
            question=question,
            sql=sql,
            answer=answer,
            database_type=database_type,
        )

        clear_clarification(conversation_id)

    return {
        "status": "success",
        "question": request.question,
        "sql": sql,
        "results": results,
        "answer": answer,
    }
