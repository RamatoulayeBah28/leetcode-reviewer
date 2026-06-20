from fastapi import FastAPI, Depends

from db import get_db
from schemas import ProblemCreate

app = FastAPI()


@app.post("/problems", status_code=201)
def create_problem(payload: ProblemCreate, db=Depends(get_db)):
    cur = db.cursor()

    # 1. INSERT into problems using payload.title, payload.difficulty, payload.note
    #    use RETURNING id, then cur.fetchone() to get the new problem's id
    cur.execute("INSERT INTO problems (title, difficulty, note) VALUES (%s, %s, %s) RETURNING id", (payload.title, payload.difficulty, payload.note))
    res = cur.fetchone()
    problem_id = res[0]

    # 2. loop over payload.topic_ids, INSERT into problem_topics for each one
    for topic_id in payload.topic_ids:
        cur.execute("INSERT INTO problem_topics (problem_id, topic_id) VALUES (%s, %s)", (problem_id, topic_id))

    # 3. loop over payload.pattern_ids, INSERT into problem_patterns for each one
    for pattern_id in payload.pattern_ids:
        cur.execute("INSERT INTO problem_patterns (problem_id, pattern_id) VALUES (%s, %s)", (problem_id, pattern_id))

    # 4. db.commit() once everything succeeded
    db.commit()

    # 5. return something useful to the client (e.g. the new problem's id)
    return { "id": problem_id, **payload.model_dump()}
