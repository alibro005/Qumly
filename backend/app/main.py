from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title="Qumly",
    description="AI-powered natural language SQL assistant",
    version="0.1.0",
)

app.include_router(router)
