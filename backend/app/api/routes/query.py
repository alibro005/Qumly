from fastapi import APIRouter, Header

from app.schema.schema import QueryRequest, QueryResponse
from app.services.query_service import process_query

router = APIRouter()


@router.post("/query", response_model=QueryResponse)
def query_database(
    request: QueryRequest,
    x_session_id: str = Header(...),
):
    return process_query(
        request=request,
        session_id=x_session_id,
    )