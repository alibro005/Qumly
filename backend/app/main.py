from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.database import router as database_router
from app.api.routes.health import router as health_router
from app.api.routes.explanation import router as explanation_router
from app.api.routes.query import router as query_router


app = FastAPI(
    title="Qumly",
    description="AI-first natural language SQL assistant",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://qumly.vercel.app",
        "https://app.qumly.me"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(database_router)
app.include_router(explanation_router)
app.include_router(query_router)