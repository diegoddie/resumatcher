import os
import uuid
from datetime import datetime
from fastapi import HTTPException
from supabase import create_client, Client
from api.models.models import JobSearchRequest, JobReport, JobPost, ReportPostData, Subscription, MatchScore
from api.functions.openai import get_job_requirements
from api.functions.file_processing import get_job_experience

# Inizializzazione Supabase
url: str = os.environ.get("SUPABASE_URL")
service_role_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, service_role_key)

def save_job_report(request: JobSearchRequest) -> str | None:
    try:
        report_data = JobReport(
            user_id=request.user_id,
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
    

def save_job_post(job: dict) -> JobPost | None:
    try:
        job_id = job.get("job_id")

        existing_job = supabase.table("job_posts").select("*").eq("job_id", job_id).execute()

        if existing_job.data:
            return existing_job.data[0]

        job_post = JobPost(
            job_id=job_id,
            company=job.get("employer_name"),
            role=job.get("job_title"),
            location=job.get("job_city"),
            years_experience=get_job_experience(job.get("job_description")),
            description=job.get("job_description"),
            requirements=get_job_requirements(job.get("job_description")),
            url=job.get("job_apply_link"),
            salary=job.get("job_salary"),
            created_at=datetime.now().isoformat(),
        )

        result = supabase.table("job_posts").insert(job_post.model_dump()).execute()
        return result.data[0]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving job post: {str(e)}")

def create_report_post_association(job_report_id: str, job_post_id: str) -> str | None:
    try:
        report_post_data = ReportPostData(
            job_report_id=job_report_id,
            job_post_id=job_post_id
        )

        result = supabase.table("job_report_posts").insert(report_post_data.model_dump()).execute()
        return result.data[0]["id"]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating report post association: {str(e)}")

def user_has_credits(user_id: str) -> bool:
    try:
        user_subscription = (
            supabase.table("subscriptions")
            .select("plan, credits")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if not user_subscription.data:
            raise HTTPException(status_code=404, detail="Subscription not found")

        subscription = user_subscription.data

        return not (subscription["plan"] == "free" and subscription["credits"] <= 0)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking credits: {str(e)}")
    
def update_credits(user_id: str) -> bool:
    try:
        # Recupera la sottoscrizione
        user_subscription = (
            supabase.table("subscriptions")
            .select("id, credits")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if not user_subscription.data:
            raise HTTPException(status_code=404, detail="Subscription not found")

        subscription = user_subscription.data

        if subscription["credits"] <= 0:
            raise HTTPException(status_code=403, detail="No credits left")

        supabase.table("subscriptions").update(
            {"credits": subscription["credits"] - 1}, returning="minimal"
        ).eq("id", subscription["id"]).execute()

        return True

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating credits: {str(e)}")

def save_match_score(user_id: str, job_post_id: str, job_report_id: str, match_score: float) -> str | None:
    try:
        existing_job = supabase.table("job_posts").select("id").eq("id", job_post_id).execute()
        if not existing_job.data:
            raise HTTPException(status_code=400, detail="Job post not found")
        
        match_score_data = MatchScore(
            user_id=user_id,    
            job_post_id=job_post_id,
            job_report_id=job_report_id,
            score=match_score,
            created_at=datetime.now().isoformat()
        )

        result = supabase.table("match_scores").insert(match_score_data.model_dump()).execute()
        return result.data[0]["id"]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving match score: {str(e)}")
    
