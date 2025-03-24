import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from api.models.models import CvSummary, JobSearchRequest
from api.functions.file_processing import process_cv
from api.functions.match_score import calculate_match_score
from api.functions.fetch_jobs import fetch_jobs_from_api
from api.functions.openai import generate_summary_with_openai
from api.functions.supabase import user_has_credits, update_credits, save_job_report, save_job_post, create_report_post_association, save_match_score
from dotenv import load_dotenv

load_dotenv()   

app = FastAPI(title="Resumatcher")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://resumatcher.vercel.app", "https://resumatcher.xyz", "https://www.resumatcher.xyz"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summarize", response_model=CvSummary)
async def summarize_cv(user_id: str = Form(...), file: UploadFile = File(...)):
    if not user_has_credits(user_id):
        raise HTTPException(status_code=400, detail="Insufficient credits")
    
    cleaned_text = await process_cv(file)

    try:
        summary = generate_summary_with_openai(cleaned_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {e}")

    return summary

@app.post("/search")
async def search_jobs_and_create_reports(request: JobSearchRequest):
    if not user_has_credits(request.user_id):
        raise HTTPException(status_code=400, detail="Insufficient credits")
    
    try:
        jobs = fetch_jobs_from_api(request.role, request.location)

        if not jobs:
            raise HTTPException(status_code=404, detail="No jobs found for the given role and location")

        job_report_id = save_job_report(request)

        for job in jobs:
            try:
                saved_job = save_job_post(job)

                if saved_job:
                    match_score = calculate_match_score(request, saved_job)
                    match_score_id = save_match_score(request.user_id, saved_job["id"], job_report_id, match_score)
                
                    if match_score_id:
                        create_report_post_association(job_report_id, saved_job["id"])
            except Exception as e:
                print(f"Error processing job: {e}")

        update_credits(request.user_id)
        return {"message": "Job search and report creation completed successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching jobs: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, timeout_keep_alive=660)
