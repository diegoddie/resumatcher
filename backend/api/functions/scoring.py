from api.models.models import JobMatch

# The LLM rates each dimension, the final score is a fixed weighted sum
WEIGHTS = {
    "skills_fit": 0.50,
    "role_fit": 0.25,
    "seniority_fit": 0.15,
    "location_fit": 0.10,
}

def final_score(assessment: JobMatch) -> int:
    score = sum(max(0, min(100, getattr(assessment, field))) * weight for field, weight in WEIGHTS.items())
    return round(score)
