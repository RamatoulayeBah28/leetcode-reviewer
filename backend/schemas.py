# Pydantic request/response models go here.
from pydantic import BaseModel


class ProblemCreate(BaseModel):
    title: str
    difficulty: str
    note: str | None = None
    topic_ids: list[int]
    pattern_ids: list[int]
