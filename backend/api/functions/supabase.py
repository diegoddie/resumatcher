import os
from datetime import datetime, timezone
from fastapi import HTTPException
from supabase import create_client, Client
from api.models.models import JobSearchRequest, JobReport, JobPost, ReportPostData, MatchScore

# Inizializzazione Supabase
url: str = os.environ.get("SUPABASE_URL")
service_role_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, service_role_key)

def save_job_report(user_id: str, request: JobSearchRequest) -> str:
    try:
        report_data = JobReport(
            user_id=user_id,
            filename=request.filename,
            years_experience=request.years_experience,
            role=request.role,
            location=request.location,
            skills=request.skills,
            created_at=datetime.now().isoformat(),
        )

        result = supabase.table("job_reports").insert(report_data.model_dump()).execute()

        return result.data[0]["id"]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving job report: {str(e)}")

def get_existing_job_posts(job_ids: list[str]) -> dict[str, dict]:
    """ Job posts already analyzed in previous searches, keyed by JSearch job_id. """
    try:
        result = supabase.table("job_posts").select("*").in_("job_id", job_ids).execute()
        return {row["job_id"]: row for row in result.data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading job posts: {str(e)}")

def save_job_posts(job_posts: list[JobPost]) -> list[dict]:
    if not job_posts:
        return []
    try:
        # Upsert: a concurrent search may have inserted the same job_id meanwhile
        result = supabase.table("job_posts").upsert([job_post.model_dump() for job_post in job_posts], on_conflict="job_id").execute()
        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving job posts: {str(e)}")

def save_match_scores(match_scores: list[MatchScore]) -> None:
    try:
        supabase.table("match_scores").insert([match_score.model_dump() for match_score in match_scores]).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving match scores: {str(e)}")

def create_report_post_associations(job_report_id: str, job_post_ids: list[str]) -> None:
    try:
        rows = [ReportPostData(job_report_id=job_report_id, job_post_id=job_post_id).model_dump() for job_post_id in job_post_ids]
        supabase.table("job_report_posts").insert(rows).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating report post associations: {str(e)}")

def get_subscription(user_id: str) -> dict:
    try:
        result = supabase.table("subscriptions").select("id, plan, credits").eq("user_id", user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking credits: {str(e)}")

    if not result.data:
        raise HTTPException(status_code=404, detail="Subscription not found")

    return result.data[0]

def user_has_credits(user_id: str) -> bool:
    subscription = get_subscription(user_id)
    return not (subscription["plan"] == "free" and subscription["credits"] <= 0)

def update_credits(user_id: str) -> bool:
    subscription = get_subscription(user_id)

    if subscription["plan"] == "free":
        if subscription["credits"] <= 0:
            raise HTTPException(status_code=403, detail="No credits left")
        try:
            supabase.table("subscriptions").update(
                {"credits": subscription["credits"] - 1}, returning="minimal"
            ).eq("id", subscription["id"]).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating credits: {str(e)}")

    return True

def count_searches_today() -> int:
    """ Searches (job reports) created today by all users: caps the daily LLM usage on the free tier. """
    today = datetime.now(timezone.utc).date().isoformat()
    try:
        result = supabase.table("job_reports").select("id", count="exact").gte("created_at", today).limit(1).execute()
        return result.count or 0
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking daily searches: {str(e)}")

def ping_database() -> None:
    """ Tiny query: Supabase pauses free projects after a week without activity. """
    supabase.table("job_posts").select("id").limit(1).execute()
