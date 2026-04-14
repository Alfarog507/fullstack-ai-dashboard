# Fullstack AI Dashboard — Fullstack App with LLM Streaming

A fullstack web application that fetches user comment data, groups and ranks it, then analyzes it using Google Gemini with real-time streaming responses via Server-Sent Events (SSE).

Built as a demonstration of a production-ready fullstack architecture: layered Node.js backend, React frontend, Docker deployment, Zod validation at every boundary, and 20 tests across 4 suites.

---

## What it does

1. Fetches comments from an external API and groups them by user, ranked by volume
2. Displays results in a paginated, searchable table
3. Lets you select a user and analyze their comments with Gemini AI
4. Streams the AI response token-by-token to the UI in real time (SSE)
5. Returns structured output: summary, sentiment (positive/neutral/negative), and topic categories

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| AI | Google Gemini `gemini-2.5-flash` via `@google/generative-ai` |
| Validation | Zod (inputs + LLM outputs) |
| Testing | Jest + Supertest (20 tests, 4 suites) |
| Frontend | React 18 + Vite + TailwindCSS |
| Streaming | Server-Sent Events (SSE) |
| Deployment | Docker + Docker Compose (multi-stage build) |

---

## Key technical decisions

**Layered architecture (routes → controllers → services → clients → schemas)**
Each layer has a single responsibility. Controllers handle only HTTP. Business logic lives in services. External API calls are encapsulated in clients. This separation makes dependencies mockable in tests without touching production code.

**Two-level Zod validation**
User inputs are validated before reaching the service layer. LLM responses also pass through a Zod schema (`aiResponseSchema`) — if Gemini omits `categories`, Zod applies `.default([])` instead of throwing. This makes the AI integration resilient to model inconsistencies.

**SSE over WebSockets for streaming**
LLM streaming is unidirectional (server → client), so WebSockets would be over-engineered. SSE works over standard HTTP with no additional libraries. The backend uses an async generator that accumulates the full text while emitting chunks — JSON is only parsed once the stream completes, never on partial output.

**Docker multi-stage build**
The frontend Dockerfile compiles with Vite in a build stage and copies only the static output to a final Nginx image. The production image contains no Node.js or dev dependencies.

**Nginx reverse proxy**
The compiled frontend runs on Nginx, which proxies `/posts` and `/ai` to the backend using the Docker Compose service name (`http://backend:3001`). This mirrors what Vite's dev proxy does in development — same mental model across environments.

**Healthcheck-aware startup**
Docker Compose waits for the backend to pass its healthcheck before starting Nginx, preventing "connection refused" errors on the first requests.

---

## Project structure

```
├── backend/
│   └── src/
│       ├── clients/       # External HTTP clients (JSONPlaceholder, Gemini)
│       ├── controllers/   # HTTP request/response handling
│       ├── routes/        # Express route definitions
│       ├── schemas/       # Zod validation schemas
│       ├── services/      # Business logic
│       └── __tests__/     # Unit + integration tests
├── frontend/
│   └── src/
│       ├── api/           # Backend communication functions
│       ├── components/    # Reusable React components
│       └── App.jsx        # Root component + global state
├── docker-compose.yml
└── .env.example
```

---

## API reference

### `GET /posts`
Fetches comments from JSONPlaceholder, groups by `name`, counts per user, returns sorted descending.

```json
[{ "name": "Leanne Graham", "postCount": 5, "bodies": ["..."] }]
```

### `POST /ai/analyze-comments`
Analyzes a list of comment texts with Gemini. Returns structured output.

**Body:** `{ "comments": ["text1", "text2"] }` (1–20 items)

```json
{
  "summary": "Users mostly discuss system experience and support.",
  "sentiment": "neutral",
  "categories": ["support", "user experience"]
}
```

### `POST /ai/analyze-comments/stream`
Same input as above, but streams the response as SSE:

```
data: {"type":"chunk","text":"Users mostly"}
data: {"type":"done","result":{"summary":"...","sentiment":"positive","categories":["support"]}}
```

---

## Tests

```bash
cd backend && npm test
```

| Suite | What's covered |
|---|---|
| `postsService.test.js` | Grouping, sorting, body accumulation, error propagation |
| `aiService.test.js` | LLM parsing, JSON extraction, Zod defaults, streaming async generator |
| `posts.route.test.js` | `GET /posts` — 200 and 500 responses |
| `ai.route.test.js` | `POST /ai/analyze-comments` — 200, 400, and 500 responses |

---

## Local setup

### With Docker (recommended)

```bash
git clone https://github.com/Alfarog507/prueba-fullstack-ai
cd prueba-fullstack-ai
cp .env.example .env   # add your Gemini API key
docker compose up --build
```

App available at `http://localhost:5173`.

### Without Docker

```bash
# Terminal 1 — backend
cd backend && cp .env.example .env && npm install && npm start

# Terminal 2 — frontend
cd frontend && npm install && npm run dev
```

**Environment variables**

| Variable | Description | Default |
|---|---|---|
| `LLM_API_KEY` | Google Gemini API key (required) | — |
| `PORT` | Backend port | `3001` |
| `VITE_API_URL` | Leave empty in dev (uses Vite proxy) | `""` |
