from fastapi import APIRouter

router = APIRouter(
    prefix="/assets",
    tags=["assets"]
)