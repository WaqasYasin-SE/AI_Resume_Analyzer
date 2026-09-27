from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import (
    auth,
    resume,
    jobs,
    applications,
    dashboard,
)
from app.core.config import settings
from app.core.exception_handlers import register_exception_handlers
from app.database.init_db import init_db
from app.api.routers.redis_test import router as redis_test_router
from app.api.routers import notifications
from app.api.routers import gmail


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


register_exception_handlers(app)


@app.on_event("startup")
def startup():
    init_db()

app.include_router(notifications.router)
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(dashboard.router)
app.include_router(redis_test_router)
app.include_router(gmail.router)


@app.get("/")
def root():
    return {
        "message": f"{settings.APP_NAME} is running 🚀",
    }