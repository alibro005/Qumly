import logging

from fastapi import APIRouter, Header, HTTPException

from app.schema.schema import DatabaseConnectionRequest
from app.services.database.manager import database_manager

router = APIRouter()
logger = logging.getLogger(__name__)


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

    except Exception:
        logger.exception("Failed to connect to demo database")

        raise HTTPException(
            status_code=503,
            detail={
                "status": "failed",
                "message": (
                    "Unable to connect to the database. "
                    "Please try again in a few seconds."
                ),
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

        if (
            "connection refused" in str(error).lower()
            and request.host in ("localhost", "127.0.0.1", "::1")
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
def disconnect_database(x_session_id: str = Header(...)):
    try:
        database_manager.disconnect(x_session_id)

        return {
            "message": "Database disconnected successfully"
        }

    except Exception as error:  # noqa: BLE001
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get("/database/status")
def database_status(x_session_id: str = Header(...)):
    connected = database_manager.is_connected(x_session_id)
    database_type = database_manager.get_database_type(x_session_id)

    return {
        "connected": connected,
        "database": database_type if connected else None,
    }


@router.get("/database-test")
def database_test(x_session_id: str = Header(...)):
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
def database_schema(x_session_id: str = Header(...)):
    try:
        return database_manager.get_schema(x_session_id)

    except Exception as error:  # noqa: BLE001
        raise HTTPException(
            status_code=400,
            detail={
                "status": "failed",
                "message": str(error),
            },
        )