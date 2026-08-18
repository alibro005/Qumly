from fastapi import FastAPI
from app.routes.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Qumly",
    description="AI-powered natural language SQL assistant",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://qumly.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)
