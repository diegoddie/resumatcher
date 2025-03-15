from pydantic import BaseModel, Field
from typing import List, Optional

class CvSummary(BaseModel):
    role: str 
    years_experience: Optional[int] = None
    location: Optional[str] = None
    skills: List[str] = []
    summary: str = Field(default="")

class JobSearchRequest(BaseModel):
    role: str
    location: str
    years_experience: Optional[int] = None
    user_id: str
    filename: str
    skills: List[str] = []

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
    description: str
    years_experience: Optional[int] = None
    requirements: List[str] = []
    url: str
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
    created_at: str

