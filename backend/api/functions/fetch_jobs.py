import os
import re
from fastapi import HTTPException
import requests

def fetch_jobs_from_api(role: str, location: str) -> list[dict]:
    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {
        "query": f"{role} in {location}",
        "page": "1",
        "num_pages": "1",
        "country": os.getenv("JOBS_COUNTRY", "it"),
        # Skip stale postings: all, today, 3days, week, month
        "date_posted": os.getenv("JOBS_DATE_POSTED", "month"),
    }

    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=60)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Error searching jobs: {e}")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Error searching jobs: {response.status_code}")

    # Same posting can appear twice in a page: keep the first one
    jobs = {}
    for job in response.json().get("data", []):
        if job.get("job_id") and job["job_id"] not in jobs:
            jobs[job["job_id"]] = job
    return list(jobs.values())

def get_job_location(job: dict) -> str:
    """ job_city is often null: fall back to job_location, e.g. "Milano MI  (+ 1 altra)  •  tramite Indeed" -> "Milano MI" """
    if job.get("job_is_remote"):
        return "Remote"
    if job.get("job_city"):
        return job["job_city"]
    if job.get("job_location"):
        location = job["job_location"].split("•")[0]
        location = re.sub(r"\(\+.*?\)", "", location)
        location = re.sub(r"\s+", " ", location).strip()
        if location:
            return location
    return job.get("job_state") or job.get("job_country") or "N/A"

def get_job_salary(job: dict) -> str | None:
    if job.get("job_salary_string"):
        return job["job_salary_string"]
    if job.get("job_salary"):
        return str(job["job_salary"])
    min_salary, max_salary = job.get("job_min_salary"), job.get("job_max_salary")
    if not min_salary and not max_salary:
        return None
    amount = " - ".join(f"{int(v):,}" for v in (min_salary, max_salary) if v)
    currency = job.get("job_salary_currency") or ""
    period = f"/{job['job_salary_period'].lower()}" if job.get("job_salary_period") else ""
    return f"{amount} {currency}{period}".strip()
