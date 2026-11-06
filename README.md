# 🚀 Resumatcher

Resumatcher is an AI-powered job matching platform that helps job seekers find the perfect employment opportunities by analyzing their resumes and matching them with relevant job listings using advanced natural language processing technologies.

Check out the live application at [resumatcher.xyz](https://www.resumatcher.xyz) or watch the development process on [YouTube](https://www.youtube.com/@yoimdiego).

![Resumatcher Banner](https://resumatcher.xyz/og-image.jpg)

## 🔍 What is Resumatcher?

Resumatcher bridges the gap between job seekers and opportunities by going beyond simple keyword matching. Using semantic understanding and advanced AI algorithms, the platform:

- 📄 Analyzes resumes to extract skills, experience, and qualifications
- 🔎 Processes job listings to understand requirements and context
- ⚡ Calculates precise match scores between resumes and job opportunities
- 📊 Provides personalized job recommendations with detailed match analysis

## ✨ Features

- **Smart Resume Analysis**: Upload your CV in PDF or DOCX format and get an AI-powered summary
- **Batch Processing**: Process multiple job matches at once for efficiency
- **Match Scoring**: Get a precise compatibility score (0-100%) for each job opportunity
- **Subscription Model**: Basic free tier and Pro option for unlimited searches
- **Secure Authentication**: User account management via Clerk
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: TailwindCSS with ShadcnUI components
- **State Management**: TanStack Query for server state
- **Animation**: Framer Motion for smooth UI transitions
- **Authentication**: Clerk for user management
- **Payment Processing**: Stripe for subscription management

### Backend
- **API**: Python FastAPI application, authenticated with Clerk session tokens
- **AI Processing**: `gpt-oss-120b` on the Groq free tier (OpenAI-compatible API) with structured outputs, for CV analysis and match assessment
- **Jobs source**: JSearch API (RapidAPI)
- **Database**: PostgreSQL with Supabase
- **Deployment**: Vercel Functions (a Dockerfile is included for running it anywhere else)

## 🔧 Architecture

1. **User Flow**:
   - User uploads resume (PDF or DOCX)
   - AI extracts role, experience, location, skills and a summary, the user reviews them
   - System fetches job listings posted in the last month from JSearch
   - An LLM rates each job against the profile and the backend computes the match score
   - Results are shown sorted by score, with matched/missing skills and a short explanation

2. **Matching Pipeline** (`backend/main.py`):
   - CV analysis: text extracted from PDF (`pypdf`) or DOCX (`python-docx`), then the LLM extracts the profile
   - One LLM call per job post: it extracts the requirements (max 8 hard skills, cached in `job_posts`) and rates `skills_fit`, `role_fit`, `seniority_fit`, `location_fit` (0-100), listing matched/missing skills
   - Final score = weighted sum of the sub-scores (`backend/api/functions/scoring.py`), stored with the details in `match_scores`
   - Free tier limits (tokens per minute): 2 LLM calls in parallel with automatic retries, a search takes 1-2 minutes, max 10 searches per day overall

3. **Sample report**: `/demo` shows a report generated once for a sample CV (`frontend/lib/demo/demo-report.json`), with no login and no AI usage

## 💻 Development Setup

### Backend

Uses [uv](https://docs.astral.sh/uv/): it installs the Python version pinned in `.python-version` and the exact dependencies in `uv.lock`.

```bash
# Install uv (once)
curl -LsSf https://astral.sh/uv/install.sh | sh

cd backend
uv sync

# Run development server on http://localhost:8000
uv run uvicorn main:app --reload
```

Add a dependency with `uv add <package>` (updates `pyproject.toml` and `uv.lock`).

### Frontend

Uses pnpm (via corepack, bundled with Node.js).

```bash
cd frontend
corepack pnpm install

# Run development server on http://localhost:3000
corepack pnpm dev
```

New users are created in Supabase by the Clerk webhook (`/api/clerk/webhooks`), which can't reach localhost: to sign up a new user locally expose port 3000 with a tunnel (e.g. ngrok) and point the Clerk dev webhook to it, or sign in with a user that already exists in the database.

### Database

The schema is in `frontend/utils/sql/snippets.sql`. Migrations to apply on an existing database (Supabase SQL editor) are in `backend/migrations/`.

### Clerk ↔ Supabase

The frontend reads Supabase with the Clerk session token (Supabase third-party auth, no JWT template). For each Clerk instance (development and production):

1. Clerk Dashboard → **Integrations → Supabase** → *Activate Supabase integration*: session tokens get the `role: "authenticated"` claim, and the page shows the Clerk domain.
2. Supabase Dashboard → **Authentication → Sign In / Providers → Third-Party Auth** → *Add provider* → **Clerk**, with that domain. One Supabase project can trust both the development and the production Clerk domains.

RLS policies match `auth.jwt()->>'sub'` (via `requesting_user_id()`) with the Clerk user id.

### Environment Variables

**Frontend (`frontend/.env`)**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_*****
CLERK_SECRET_KEY=sk_*****
SIGNING_SECRET=whsec_*****            # Clerk webhook signing secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=*****        # anon key
SUPABASE_SERVICE_ROLE_KEY=*****
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_*****
STRIPE_SECRET_KEY=sk_*****
STRIPE_WEBHOOK_SECRET=whsec_*****
NEXT_PUBLIC_STRIPE_PRICE_ID=price_*****
```

**Backend (`backend/.env`)**
```
GROQ_API_KEY=gsk_*****
LLM_MODEL=openai/gpt-oss-120b         # optional
MAX_SEARCHES_PER_DAY=10               # optional, all users
RAPIDAPI_KEY=*****
JOBS_COUNTRY=it                       # optional, JSearch country
JOBS_DATE_POSTED=month                # optional: all, today, 3days, week, month
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=*****
CLERK_JWKS_URL=https://<your-clerk-frontend-api>/.well-known/jwks.json
CRON_SECRET=*****                     # production only, set by Vercel cron
```

## 🚢 Deployment

Everything runs on free tiers:

- **Frontend**: Vercel project with root directory `frontend`
- **Backend**: Vercel project with root directory `backend` (FastAPI is detected from `main.py`, dependencies installed from `uv.lock`)
- **Database**: Supabase. A daily Vercel cron (`backend/vercel.json`) calls `/keepalive` so the free project is never paused for inactivity
- **AI**: Groq free tier

For production deployment:

1. Import the repository twice in Vercel, with root directories `frontend` and `backend`
2. Configure the environment variables of both projects (backend: the list above plus `CRON_SECRET`; frontend: `NEXT_PUBLIC_BACKEND_URL` = backend URL)
3. Set up Clerk ↔ Supabase (see above) and apply `backend/migrations/`

---

Built with ❤️ by Diego 