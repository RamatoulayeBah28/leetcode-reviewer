# Lock The Code

The only free technical interview study plan you need. Lock The Code uses SM-2 spaced repetition to surface the right LeetCode problem at the right time — so you actually remember patterns, not just grind and forget.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | FastAPI, Python, psycopg2 (raw SQL) |
| Database | PostgreSQL |
| Auth | Clerk |
| Icons | lucide-react |

## Features

- **Add problems** — title, difficulty, topics, patterns, note, URL
- **SM-2 spaced repetition** — confidence ratings (Forgot → Mastered) drive next-review scheduling with per-problem easiness factor
- **Review queue** — daily calendar card surfacing your most overdue problem
- **Edit & delete** — full CRUD on your problem library
- **Auth** — Clerk-powered sign-up/sign-in with per-user data isolation

## Local development

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in CLERK_SECRET_KEY, DATABASE_URL, etc.
uvicorn main:app --reload --port 8000
```

Run migrations in order:

```bash
psql $DATABASE_URL < db/migrations/001_initial_schema.sql
psql $DATABASE_URL < db/migrations/002_add_spaced_repetition.sql
psql $DATABASE_URL < db/migrations/003_add_users.sql
psql $DATABASE_URL < db/migrations/004_add_problem_url.sql
psql $DATABASE_URL < db/migrations/005_add_sm2_columns.sql
psql $DATABASE_URL < db/seed.sql
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local  # fill in NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_API_URL
npm run dev
```

## Roadmap

- [x] Problem CRUD
- [x] SM-2 spaced repetition
- [x] Review queue
- [x] Clerk auth
- [ ] Stripe billing (Pro tier)
- [ ] AI chatbot — Tutor mode + Technical Interviewer mode (Pro)
- [ ] Flashcards
- [ ] Deploy
