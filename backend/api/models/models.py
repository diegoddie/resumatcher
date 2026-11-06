from pydantic import BaseModel, Field
from typing import List, Optional

# --- LLM structured outputs (strict mode: every field required, no defaults) ---

class CvSummary(BaseModel):
    role: str
    years_experience: Optional[int]
    location: Optional[str]
    skills: List[str]
    summary: str

class JobMatch(BaseModel):
    """ One LLM call per job: requirements extraction + match assessment (field order guides the reasoning). """
    requirements: List[str] = Field(description="Max 8 key hard skills, languages or technologies mentioned in the job description")
    min_years_experience: Optional[int] = Field(description="Minimum years of experience required, null if not stated")
    matched_skills: List[str] = Field(description="Requirements the candidate has (exact or equivalent)")
    missing_skills: List[str] = Field(description="Requirements the candidate lacks")
    skills_fit: int = Field(description="0-100: how well the candidate's skills cover the requirements")
    role_fit: int = Field(description="0-100: how well the candidate's role and background fit the job title and responsibilities")
    seniority_fit: int = Field(description="0-100: how well the candidate's experience level fits the required seniority")
    location_fit: int = Field(description="0-100: 100 same city or remote, ~70 commutable, ~30 different area")
    reason: str = Field(description="1-2 sentences in English explaining the score")

# Stored in match_scores.details and shown in the report
ASSESSMENT_FIELDS = {"matched_skills", "missing_skills", "skills_fit", "role_fit", "seniority_fit", "location_fit", "reason"}

# --- API requests / DB rows ---

class JobSearchRequest(BaseModel):
    role: str
    location: str
    years_experience: Optional[int] = None
    filename: str
    skills: List[str] = []
    summary: Optional[str] = None

class JobReport(BaseModel):
    user_id: str
    filename: str
    role: str
    years_experience: Optional[int] = None
    location: str
    skills: List[str] = []
    created_at: str

class JobPost(BaseModel):
    company: str
    role: str
    location: str
    description: Optional[str] = None
    years_experience: Optional[int] = None
    requirements: List[str] = []
    url: Optional[str] = None
    salary: str | None = None
    job_id: str

class ReportPostData(BaseModel):
    job_report_id: str
    job_post_id: str

class Subscription(BaseModel):
    user_id: str
    credits: int
    plan: str
    is_active: bool
    created_at: str
    start_date: str
    end_date: str
    payment_provider: str
    payment_id: str

class MatchScore(BaseModel):
    user_id: str
    job_post_id: str
    job_report_id: str
    score: int
    details: Optional[dict] = None
    created_at: str
