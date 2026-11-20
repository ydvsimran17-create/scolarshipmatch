# ScholarshipMatch: Backend

REST API for ScholarshipMatch, a platform that helps students discover scholarships they are actually eligible for. It combines hard eligibility rules with AI-based ranking, drafts first-version essays with an LLM, and emails students before deadlines.

## Features

- **Authentication:** signup and login with hashed passwords (bcrypt) and JWT tokens
- **Student profiles:** education, field of study, income, category, state, gender, disability status
- **Two-stage matching:** hard rules (state, category, education level, gender, disability, income limit) remove scholarships the student cannot get; AI embeddings then rank the rest with a 0-100 similarity score
- **AI essay drafting:** generates a first draft with Google Gemini and saves it; students can edit it and mark it submitted
- **Personalized deadline reminders:** a daily job emails each student only the upcoming deadlines they are eligible for
- **Safeguards:** input validation, eligibility check before drafting, rate limiting on essays and login

## Tech stack

- Node.js, Express
- PostgreSQL with Sequelize
- JWT (jsonwebtoken), bcrypt
- `@xenova/transformers` (`all-MiniLM-L6-v2`) for local embeddings, no API cost
- Google Gemini API (free tier) for essay drafting
- node-cron, nodemailer for reminders
- express-rate-limit

## Setup

**Prerequisites:** Node.js 18+ and PostgreSQL installed.

1. Install dependencies:
   ```
   npm install
   ```
2. Create the database (in psql or pgAdmin):
   ```sql
   CREATE DATABASE scholarshipmatch;
   ```
3. Create your environment file and fill in real values:
   ```
   cp .env.example .env
   ```
   (On Windows, copy the file manually and rename it to `.env`.)
   - `DATABASE_URL`: your PostgreSQL connection string
   - `JWT_SECRET`: any long random string
   - `GEMINI_API_KEY`: free key from https://aistudio.google.com/app/apikey
4. Create the tables:
   ```
   node src/config/syncDb.js
   ```
5. Load the scholarship data (the first run downloads the ~90MB embedding model):
   ```
   node src/seed.js
   ```
6. Start the server:
   ```
   npm run dev
   ```
   Check it is running: `http://localhost:5000/health`

## API

Routes marked **Auth** need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Server status |
| POST | `/api/auth/signup` | No | Create account (`email`, `password` of 8-72 characters) |
| POST | `/api/auth/login` | No | Log in, returns a token |
| GET | `/api/profiles/me` | Yes | Get my profile |
| POST | `/api/profiles/me` | Yes | Create or update my profile |
| GET | `/api/scholarships` | No | List all scholarships |
| GET | `/api/scholarships/matches` | Yes | My eligible scholarships, ranked by AI score |
| POST | `/api/essays/draft` | Yes | Draft an essay (`scholarship_id`, optional `essay_prompt`); limited to 5 per 10 minutes |
| GET | `/api/essays` | Yes | List my saved drafts |
| PUT | `/api/essays/:id` | Yes | Edit a draft (`essay_draft`, `status`: `draft` or `submitted`) |

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

A job runs every day at 9:00 AM (server time) and emails each student the scholarships they are eligible for that close within 7 days. Email delivery works as follows:
1. If `SMTP_HOST` is set in `.env`, a real SMTP server is used (for example Gmail).
2. Otherwise the free Ethereal test inbox is used, and a preview link is printed in the terminal.
3. If Ethereal is unreachable, the email is printed in the terminal instead.

To trigger it manually: `node src/testReminders.js`

## Project structure

```
src/
  config/       database connection, table sync script
  controllers/  auth, profile, scholarship and essay logic
  middleware/   JWT check, rate limiters
  models/       User, StudentProfile, Scholarship, Application
  routes/       route definitions
  utils/        embeddings, Gemini client, eligibility rules, mailer, reminders
  seed.js       loads scholarships and computes their embeddings
server.js       entry point
```

## Notes and limitations

- **Scholarship data is sample data.** Income limits and deadlines in `seed.js` are approximate. Verify them on the official portals (for example scholarships.gov.in) before relying on them.
- Match scores are similarity scores for ranking, not a probability of winning.
- Matches are calculated live from the student's profile each time, so there is no stored `matches` table.
- Rate limit counters are kept in memory and reset when the server restarts.
- Essay drafts are first drafts only. Students must review, personalise and verify them.
- Free-tier AI content may be used by Google, so use sample data for demos, not real student details.
- `Minority` is treated as a single category. A student who is both OBC and Minority cannot be represented yet.

## Future scope

Resume builder, OCR for income and caste certificates, real email delivery in production, a mobile app, and automatic scholarship data updates.