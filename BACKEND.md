# Scholarship Match: Backend

REST API for Scholarship Match. It combines hard eligibility rules with AI-based ranking, drafts first-version essays with an LLM, and emails students before deadlines.

## Features

- **Authentication:** signup/register and login with hashed passwords (bcrypt) and JWT tokens
- **Student profiles:** education, field of study, income, category, state, gender, disability status
- **Two-stage matching:** hard rules (state, category, education level, gender, disability, income limit) remove scholarships the student cannot get; AI embeddings then rank the rest with a 0-100 similarity score
- **AI essay drafting:** generates a first draft with Google Gemini and saves it; students can edit it and mark it submitted
- **Personalized deadline reminders:** a daily job emails each student only the upcoming deadlines they are eligible for
- **Safeguards:** input validation, eligibility check before drafting, rate limiting on essays and login

## Tech stack

Node.js, Express, PostgreSQL with Sequelize, JWT, bcrypt, `@xenova/transformers` (`all-MiniLM-L6-v2`, runs locally, no API cost), Google Gemini API (free tier), node-cron, nodemailer, express-rate-limit.

## Setup

**Prerequisites:** Node.js 18+ and PostgreSQL.

1. Install dependencies (frontend and backend share one `package.json`):
   ```
   npm install
   ```
2. Create the database:
   ```sql
   CREATE DATABASE scholarshipmatch;
   ```
3. Create `.env` from `.env.example` and fill in real values (never commit this file):
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: any long random string
   - `GEMINI_API_KEY`: free key from https://aistudio.google.com/app/apikey
   - Optional: `GEMINI_MODEL` (if the default model name stops working), `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
4. Create the tables:
   ```
   node src/config/syncDb.js
   ```
5. Load the scholarships (the first run downloads a ~90MB embedding model):
   ```
   node src/seed.js
   ```
6. Start the backend:
   ```
   npm run server
   ```
   Health check: `http://localhost:5000/health`

The frontend is started separately with `npm run dev` (http://localhost:5173).

## API

Base path: `/api`. Routes marked **Auth** need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` or `/auth/register` | No | Create account (`email`, `password` of 8-72 characters) |
| POST | `/auth/login` | No | Log in, returns `token` and `user` |
| GET | `/auth/me` | Yes | The logged-in user |
| POST | `/auth/logout` | No | Returns OK (tokens are stateless; the client deletes its token) |
| GET | `/profiles/me` | Yes | Get my profile |
| POST | `/profiles/me` | Yes | Create or update my profile |
| GET | `/scholarships` | No | List of scholarships in the frontend's shape. Optional query: `search`, `educationLevel`, `category`, `state`, `incomeRange`, `scholarshipType`, `sort` (`match`, `amount`, `deadline`) |
| GET | `/scholarships/:id` | No | One scholarship |
| GET | `/scholarships/recommended` | Yes | Scholarships I am eligible for, with `eligibilityMatch` (0-100) |
| GET | `/scholarships/matches` | Yes | Same matching in the original format: `{ total_scholarships, eligible_count, matches[] }` with `score` |
| POST | `/essays/draft` | Yes | Draft and save an essay (`scholarship_id`, optional `essay_prompt`); limited to 5 per 10 minutes |
| GET | `/essays` | Yes | List my saved drafts |
| PUT | `/essays/:id` | Yes | Edit a draft (`essay_draft`, `status`: `draft` or `submitted`) |

Auth endpoints are limited to 20 requests per 15 minutes per IP address.

**Profile fields and allowed values**

| Field | Allowed values |
|---|---|
| `education_level` | School, Undergraduate, Postgraduate |
| `category` | General, EWS, OBC, SC, ST, Minority |
| `gender` | Male, Female, Other |
| `family_income` | whole number (rupees per year), 0 or more |
| `has_disability` | true or false |
| `field_of_study`, `income_bracket`, `state` | text, up to 100 characters |

## Deadline reminders

A job runs daily at 9:00 AM (server time) and emails each student the scholarships they are eligible for that close within 7 days. Delivery:
1. A real SMTP server if `SMTP_HOST` is set (for example Gmail).
2. Otherwise a free Ethereal test inbox; a preview link is printed in the terminal.
3. If Ethereal is unreachable, the email is printed in the terminal instead.

Trigger it manually: `node src/testReminders.js`

## Frontend integration status

The frontend (`src/services/*`) calls a larger API than the backend currently provides. Status:

- **Done:** auth (`login`, `register`, `me`, `logout`), scholarship list, detail and recommended
- **Not built yet (the frontend expects these paths):** `/student/profile` (we have `/profiles/me`), `/scholarships/:id/match`, `/scholarships/bookmarked`, `/scholarships/deadlines`, `/applications*`, `/documents*`, `/ai/essay/*` (we have `/essays/*`)
- The frontend runs in demo mode when `VITE_API_BASE_URL` is empty. To use this backend, set `VITE_API_BASE_URL=http://localhost:5000/api` in the frontend `.env` and restart `npm run dev`.
- The frontend pages currently read local demo data, so they must be switched to the services before they show real backend data.

## Project structure (backend)

```
src/
  config/       database connection, table sync script
  controllers/  auth, profile, scholarship and essay logic
  middleware/   JWT check, rate limiters
  models/       User, StudentProfile, Scholarship, Application
  routes/       route definitions
  utils/        embeddings, Gemini client, eligibility rules, scholarship mapper, mailer, reminders
  seed.js       loads scholarships and computes their embeddings
server.js       backend entry point
```

## Notes and limitations

- **Scholarship data is sample data.** Income limits and deadlines in `seed.js` are approximate. Verify them on the official portals (for example scholarships.gov.in) before relying on them.
- Match scores are similarity scores for ranking, not a probability of winning.
- Matches are calculated live from the profile each time, so there is no stored `matches` table.
- Rate limit counters are kept in memory and reset when the server restarts.
- Essay drafts are first drafts only. Students must review, personalise and verify them.
- Free-tier AI content may be used by Google, so use sample data for demos, not real student details.
- `Minority` is treated as a single category, so a student who is both OBC and Minority cannot be represented yet.