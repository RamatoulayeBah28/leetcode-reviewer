# Lock The Code — Frontend

Next.js 16 frontend for Lock The Code. See the [root README](../README.md) for full project context and setup instructions.

## Dev

```bash
npm install
npm run dev   # http://localhost:3000
```

Requires `.env.local` with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8000
```
