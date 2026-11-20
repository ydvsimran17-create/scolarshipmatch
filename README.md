# Scholarship Match – Frontend & Backend Integration Guide

**Platform:** Scholarship Match – Automated Financial Aid Discovery for Students  
**Frontend Stack:** React 19, Vite 8, JavaScript (ESM), CSS3 Design System, React Router DOM 7, Lucide React  
**Active Test Identity:** Anvaya Sharma (`AS`), Delhi Technological University (DTU)  
**Finalized Palette:** Currant (`#912930`), Midnight Indigo (`#233E65`), Antique Brass (`#C49F6D`), Raw Linen (`#DDD1BC`), Plaster (`#F0EFEA`)

---

## 1. Frontend Architecture

The frontend is built as a single-page application (SPA) structured around a full-height Currant sidebar, a light Plaster workspace, and high-contrast Midnight Indigo / Antique Brass components.

```
scholarship-match/
├── .env.example                       # Central environment variable template
├── index.html                         # Entry HTML with Playfair & Inter font imports
├── vite.config.js                     # Vite build configuration with chunk splitting
├── src/
│   ├── assets/                        # Static brand illustrations (AI assistant graphic)
│   ├── styles/                        # Design tokens, variables, typography, reset
│   │   ├── variables.css              # Currant, Midnight, Brass, Linen, Plaster tokens
│   │   ├── typography.css             # Playfair Display & Inter font scales
│   │   └── global.css                 # Buttons, cards, badges, modal backdrops
│   ├── components/
│   │   ├── layout/                    # Sidebar, DashboardLayout, Header
│   │   ├── dashboard/                 # WelcomeBanner, StatsGrid, Deadlines, Recommendations
│   │   ├── discovery/                 # FilterPanel, DiscoveryScholarshipCard
│   │   ├── detail/                    # Header, EligibilityMatch, Checklist, ApplyModal
│   │   ├── applications/              # ApplicationTable, FilterTabs, DetailDrawer, Timeline
│   │   ├── documents/                 # DocumentTable, CategoryTabs, UploadModal, PreviewModal
│   │   ├── profile/                   # ProfileCompletionCard, Strength meter
│   │   ├── essay/                     # EssayConfigPanel, EssayEditor, SavedDraftsModal
│   │   └── common/                    # Reusable API states (LoadingSpinner, ErrorMessage, EmptyState)
│   ├── data/                          # Standalone demo data modules (illustrative samples)
│   │   ├── dashboardData.js           # Quick actions, stats, recommended programs
│   │   ├── scholarshipsDiscoveryData.js # 8 detailed scholarships, filter options, checklists
│   │   ├── applicationsData.js        # 8 tracking records, stage definitions
│   │   ├── documentsData.js           # 8 document records, category definitions
│   │   ├── profileData.js             # Initial profile defaults, completion calculator
│   │   └── essayData.js               # Essay prompts, tones, dynamic template generators
│   ├── services/                      # Centralized API service layer (Backend integration ready)
│   │   ├── api.js                     # Core HTTP fetch client, token management, ApiError
│   │   ├── authService.js             # Student login, registration, session validation
│   │   ├── studentService.js          # Profile retrieval, updates, strength calculation
│   │   ├── scholarshipService.js      # Search, filter, details, match evaluation, bookmarks
│   │   ├── applicationService.js      # Application creation, timeline tracking, overview stats
│   │   ├── documentService.js         # File upload (multipart), document listing, deletion
│   │   └── essayService.js            # AI essay draft generation, rewrite actions, drafts
│   ├── pages/                         # Route entry pages
│   │   ├── Dashboard.jsx              # Student dashboard
│   │   ├── FindScholarships.jsx       # Scholarship search & multi-filter discovery
│   │   ├── ScholarshipDetail.jsx      # Dynamic scholarship detail & application receipt
│   │   ├── MyApplications.jsx         # Application tracking & drawer
│   │   ├── Documents.jsx              # Document management & file preview
│   │   ├── StudentProfile.jsx         # 5-section student profile builder
│   │   └── AiEssayAssistant.jsx       # AI essay generation & smart rewrite
│   ├── App.jsx                        # Route table & catch-all navigation
│   └── main.jsx                       # Application bootstrap
```

---

## 2. API Service Layer Architecture

All remote communication is organized under `src/services/`. Each service module is structured to support both **Live Backend Mode** (when `VITE_API_BASE_URL` is set) and **Standalone Demo Mode** (when running locally without a backend).

```mermaid
flowchart TD
    UI["React UI Pages & Components"] --> Service["API Service Layer (src/services/*)"]
    Service --> Check{"Is VITE_API_BASE_URL set?"}
    Check -- Yes --> HTTP["apiClient (src/services/api.js)"]
    HTTP --> Backend[("Backend REST API / LLM Service")]
    Check -- No --> Demo["Demo Data & localStorage (Zero Errors)"]
```

### Service Module Overview

1. **`api.js` (Core HTTP Client):**
   - Configures base URL from `import.meta.env.VITE_API_BASE_URL`.
   - Handles request timeout using `AbortController` (default: 15,000ms via `VITE_API_TIMEOUT_MS`).
   - Automatically injects `Authorization: Bearer <token>` from `localStorage.getItem('scholarship_auth_token')`.
   - Formats query parameters using `URLSearchParams`.
   - Handles `application/json` serialization and `multipart/form-data` uploads.
   - Throws standardized `ApiError` objects containing `status`, `data`, and `url`.

2. **`authService.js`:**
   - `login(credentials)`: Authenticates student; saves returned JWT token.
   - `register(userData)`: Registers a new student account.
   - `getCurrentUser()`: Fetches session profile for active student.
   - `logout()`: Clears local tokens and calls backend logout endpoint.
   - `isAuthenticated()`: Synchronous check for stored JWT token.

3. **`studentService.js`:**
   - `getProfile()`: Retrieves student profile (personal, academic, financial, eligibility, interests).
   - `updateProfile(profileData)`: Saves updated profile fields to the backend database.
   - `resetProfile()`: Resets student profile to default baseline.
   - `getProfileCompletion(profileData)`: Pure calculation of completion percentage (0–100%).

4. **`scholarshipService.js`:**
   - `getScholarships(filters, sort)`: Retrieves scholarship listings with search, category, level, state, income, and type filters.
   - `getScholarshipById(id)`: Fetches full details, criteria, benefits, and checklists for a scholarship.
   - `getRecommendedScholarships()`: Curated high-match opportunities for the dashboard.
   - `matchScholarship(id, profile)`: Dispatches student profile to the matching engine.
   - `getBookmarkedIds()` / `toggleBookmark(id)`: Manages saved/bookmarked scholarships.
   - `getUpcomingDeadlines()`: Retrieves programs with approaching deadlines.

5. **`applicationService.js`:**
   - `getApplications(filters)`: Retrieves student applications with status filtering (`submitted`, `under-review`, `action-required`, `approved`).
   - `getApplicationById(id)`: Fetches detailed status history and stage milestones.
   - `createApplication(data)`: Submits new application and generates tracking number.
   - `updateApplication(id, updates)`: Updates internal application status or notes.
   - `getApplicationStats()`: Summary metrics for dashboard and application cards.

6. **`documentService.js`:**
   - `getDocuments(category)`: Retrieves uploaded documents with category filtering.
   - `uploadDocument(file, metadata)`: Uploads a physical file via `multipart/form-data`.
   - `deleteDocument(id)`: Removes a document record.
   - `getDocumentStats()`: Counters for verified, pending, and missing documents.

7. **`essayService.js`:**
   - `generateEssayDraft(config)`: Calls backend AI/LLM service with prompt, target word count, and tone.
   - `rewriteEssay(text, action)`: Dispatches refinement requests (`improve`, `shorten`, `expand`).
   - `getSavedDrafts()` / `saveDraft(draft)` / `deleteDraft(id)`: Manages saved student drafts.

---

## 3. Environment Configuration

Central configuration is managed via environment variables.

### Setup Instructions
1. Copy the provided `.env.example` file to create a local `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Configure your backend URL:
   ```env
   # Backend REST API Base URL (do not include trailing slash)
   VITE_API_BASE_URL=http://localhost:5000/api

   # Optional: Request timeout in milliseconds
   VITE_API_TIMEOUT_MS=15000
   ```
3. Restart the development server (`npm run dev`) for changes to take effect.

> [!NOTE]
> **Demo Mode vs. Live Backend Mode:**  
> When `VITE_API_BASE_URL` is empty or unset, the frontend automatically runs in **Standalone Demo Mode**. No real HTTP requests are made, preventing broken page errors during frontend-only development.

---

## 4. Reusable Feedback Components (`src/components/common/`)

To support asynchronous API loading and error handling, the project includes reusable UI state components styled according to the design system:

| Component | Props | Purpose |
| :--- | :--- | :--- |
| `LoadingSpinner` | `message`, `size` (`sm`\|`md`\|`lg`), `fullHeight` | Animated spinner with accessible ARIA live region |
| `ErrorMessage` | `title`, `message`, `onRetry`, `retryLabel` | High-visibility Currant alert with optional retry action |
| `EmptyState` | `icon`, `title`, `description`, `actionLabel`, `onAction` | Subtle Plaster container for zero-match query results |

---

## 5. Backend Developer Integration Requirements

When developing the backend service, please adhere to the following specifications to ensure seamless communication with this frontend:

### 1. Cross-Origin Resource Sharing (CORS)
The backend must allow CORS requests from the frontend development server and production domain:
- **Allowed Origins:** `http://localhost:5173`, `http://localhost:3000`, or production origin.
- **Allowed Methods:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
- **Allowed Headers:** `Content-Type`, `Authorization`, `Accept`.

### 2. Authentication Standard
- Standard Bearer token authentication:
  ```http
  Authorization: Bearer <jwt_token_here>
  ```
- Login and registration endpoints should return the token in a JSON payload:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "std_101",
      "name": "Anvaya Sharma",
      "email": "anvaya.sharma@dtu.ac.in",
      "role": "Student"
    }
  }
  ```

### 3. Proposed REST Endpoints Reference

| Service | Method | Proposed Path | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/login` | Email & password login |
| | `POST` | `/auth/register` | New student account signup |
| | `GET` | `/auth/me` | Fetch active authenticated profile |
| | `POST` | `/auth/logout` | Invalidate current session |
| **Student** | `GET` | `/student/profile` | Full student profile object |
| | `PUT` | `/student/profile` | Update profile fields |
| **Scholarships** | `GET` | `/scholarships` | Search & filter scholarships |
| | `GET` | `/scholarships/:id` | Full details, eligibility & checklists |
| | `GET` | `/scholarships/recommended` | High-match curated list |
| | `POST` | `/scholarships/:id/match` | Dynamic eligibility scoring |
| | `GET` | `/scholarships/bookmarked` | List of bookmarked IDs |
| | `POST` | `/scholarships/bookmarked` | Toggle bookmark |
| | `GET` | `/scholarships/deadlines` | Upcoming deadline alerts |
| **Applications**| `GET` | `/applications` | List student applications |
| | `GET` | `/applications/:id` | Application history & stages |
| | `POST` | `/applications` | Submit application |
| | `GET` | `/applications/stats` | Summary counts (submitted, review, etc.) |
| **Documents** | `GET` | `/documents` | List uploaded student documents |
| | `POST` | `/documents/upload` | Multipart file upload (`FormData`) |
| | `DELETE`| `/documents/:id` | Delete document record |
| | `GET` | `/documents/stats` | Document counts (verified, pending, missing) |
| **AI Essay** | `POST` | `/ai/essay/generate` | Generate essay draft via LLM |
| | `POST` | `/ai/essay/rewrite` | Rewrite/shorten/expand draft |
| | `GET` | `/ai/essay/drafts` | Fetch saved drafts |
| | `POST` | `/ai/essay/drafts` | Save draft |
| | `DELETE`| `/ai/essay/drafts/:id` | Remove saved draft |

### 4. Error Response Format
When returning HTTP 4xx or 5xx errors, provide a JSON body with a descriptive message:
```json
{
  "error": "InvalidCredentials",
  "message": "The email or password entered is incorrect."
}
```

---

## 6. Build and Verification Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run ESLint quality checks
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Backend Server & Database Setup

The backend service runs Node.js, Express, PostgreSQL with Sequelize, JWT authentication, and Google Gemini AI integration.

### Setup Instructions
1. Install backend dependencies (if running server):
   ```bash
   node server.js
   ```
2. Configure database credentials in `.env`:
   - `DATABASE_URL`: PostgreSQL connection string (`postgres://user:password@localhost:5432/scholarshipmatch`)
   - `JWT_SECRET`: Random secure string
   - `GEMINI_API_KEY`: API key from Google AI Studio
3. Initialize tables:
   ```bash
   node src/config/syncDb.js
   ```
4. Seed scholarship programs and embeddings:
   ```bash
   node src/seed.js
   ```
5. Health check endpoint: `http://localhost:5000/health`
