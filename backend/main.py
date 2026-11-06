from dotenv import load_dotenv

# Load env before the api modules read it at import time
load_dotenv()

import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from api.models.models import CvSummary, JobSearchRequest, JobPost, MatchScore, JobMatch, ASSESSMENT_FIELDS
from api.functions.auth import ALLOWED_ORIGINS, get_current_user_id
from api.functions.file_processing import process_cv
from api.functions.fetch_jobs import fetch_jobs_from_api, get_job_location, get_job_salary
from api.functions.llm import generate_summary, analyze_match
from api.functions.scoring import final_score
from api.functions.supabase import user_has_credits, update_credits, save_job_report, get_existing_job_posts, save_job_posts, save_match_scores, create_report_post_associations, count_searches_today, ping_database

# Groq free tier: few parallel calls (tokens per minute limit) and a global daily cap on searches
MAX_LLM_WORKERS = int(os.getenv("LLM_MAX_WORKERS", "2"))
MAX_SEARCHES_PER_DAY = int(os.getenv("MAX_SEARCHES_PER_DAY", "10"))

app = FastAPI(title="Resumatcher")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summarize", response_model=CvSummary)
def summarize_cv(file: UploadFile = File(...), user_id: str = Depends(get_current_user_id)):
    if not user_has_credits(user_id):
        raise HTTPException(status_code=400, detail="Insufficient credits")

    cv = process_cv(file)

    try:
        return generate_summary(cv)
    except Exception as e:
        print(f"Error generating summary: {e}")
        raise HTTPException(status_code=502, detail="Error analyzing the CV, please try again later")

def analyze_job(cv: JobSearchRequest, job: dict, existing_post: dict | None) -> tuple[JobPost | None, dict, JobMatch] | None:
    """ One LLM call for one job (runs in a worker thread, no DB access).
    Returns the new job post to save (None if already saved), the job post data and the match. """
    try:
        if existing_post:
            match = analyze_match(cv, existing_post)
            return None, existing_post, match

        new_post = JobPost(
            job_id=job["job_id"],
            company=job.get("employer_name") or "N/A",
            role=job.get("job_title") or "N/A",
            location=get_job_location(job),
            description=job.get("job_description") or "",
            url=job.get("job_apply_link"),
            salary=get_job_salary(job),
        )
        match = analyze_match(cv, new_post.model_dump())
        new_post.requirements = match.requirements
        new_post.years_experience = match.min_years_experience
        return new_post, new_post.model_dump(), match

    except Exception as e:
        print(f"Error analyzing job {job.get('job_id')}: {e}")
        return None

@app.post("/search")
def search_jobs_and_create_reports(request: JobSearchRequest, user_id: str = Depends(get_current_user_id)):
    if not user_has_credits(user_id):
        raise HTTPException(status_code=400, detail="Insufficient credits")

    if count_searches_today() >= MAX_SEARCHES_PER_DAY:
        raise HTTPException(status_code=429, detail="The daily demo limit has been reached, please try again tomorrow")

    jobs = fetch_jobs_from_api(request.role, request.location)

    if not jobs:
        raise HTTPException(status_code=404, detail="No jobs found for the given role and location")

    existing_posts = get_existing_job_posts([job["job_id"] for job in jobs])

    # One LLM call per job, a few in parallel
    with ThreadPoolExecutor(max_workers=MAX_LLM_WORKERS) as executor:
        results = list(executor.map(lambda job: analyze_job(request, job, existing_posts.get(job["job_id"])), jobs))
    results = [result for result in results if result]

    if not results:
        raise HTTPException(status_code=502, detail="Error analyzing the job posts, please try again later")

    saved_posts = save_job_posts([new_post for new_post, _, _ in results if new_post])
    post_ids = {row["job_id"]: row["id"] for row in [*existing_posts.values(), *saved_posts]}

    job_report_id = save_job_report(user_id, request)

    created_at = datetime.now().isoformat()
    match_scores = [
        MatchScore(
            user_id=user_id,
            job_post_id=post_ids[post_data["job_id"]],
            job_report_id=job_report_id,
            score=final_score(assessment),
            details=assessment.model_dump(include=ASSESSMENT_FIELDS),
            created_at=created_at,
        )
        for _, post_data, assessment in results
    ]
    save_match_scores(match_scores)
    create_report_post_associations(job_report_id, [match_score.job_post_id for match_score in match_scores])

    update_credits(user_id)
    return {"message": "Job search and report creation completed successfully", "job_report_id": job_report_id}

@app.get("/keepalive")
def keepalive(authorization: str | None = Header(default=None)):
    """ Daily Vercel cron: keeps the free Supabase project from being paused for inactivity. """
    cron_secret = os.getenv("CRON_SECRET")
    if cron_secret and authorization != f"Bearer {cron_secret}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    ping_database()
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, timeout_keep_alive=660)
