import torch.nn.functional as F
from sentence_transformers import SentenceTransformer
from api.models.models import JobSearchRequest

model = SentenceTransformer("all-mpnet-base-v2")

def calculate_match_score(cv_data: JobSearchRequest, saved_job: dict) -> int:
    try:
        cv_role = f"Role: {cv_data.role.lower()}."
        cv_location = f"Location: {cv_data.location.lower()}."
        cv_skills = f"Skills: {' '.join(cv_data.skills).lower()}."

        job_role = f"Role: {saved_job['role'].lower()}."
        job_location = f"Location: {saved_job['location'].lower()}."
        job_skills = f"Skills: {' '.join(saved_job.get('requirements', [])).lower()}."

        if saved_job["years_experience"] is not None:
            experience_diff = abs(cv_data.years_experience - saved_job["years_experience"])
            experience_similarity = max(0, 1 - (experience_diff / 10))
        else:
            experience_similarity = 0

        role_weight = 0.25 if saved_job["years_experience"] is not None else 0.30
        skills_weight = 0.50
        location_weight = 0.15 if saved_job["years_experience"] is not None else 0.20
        experience_weight = 0.10 if saved_job["years_experience"] is not None else 0

        cv_role_vector = model.encode(cv_role, convert_to_tensor=True)
        job_role_vector = model.encode(job_role, convert_to_tensor=True)
        cv_skills_vector = model.encode(cv_skills, convert_to_tensor=True)
        job_skills_vector = model.encode(job_skills, convert_to_tensor=True)
        cv_location_vector = model.encode(cv_location, convert_to_tensor=True)
        job_location_vector = model.encode(job_location, convert_to_tensor=True)

        role_similarity = float(F.cosine_similarity(cv_role_vector, job_role_vector, dim=0))
        skills_similarity = float(F.cosine_similarity(cv_skills_vector, job_skills_vector, dim=0))
        location_similarity = float(F.cosine_similarity(cv_location_vector, job_location_vector, dim=0))

        weighted_similarity = (
            (role_similarity * role_weight) +
            (skills_similarity * skills_weight) +
            (location_similarity * location_weight) +
            (experience_similarity * experience_weight)
        )

        if weighted_similarity >= 0.7:
            boosted_similarity = 0.75 + (weighted_similarity - 0.7) * (0.98 - 0.75) / 0.3
            match_score = round(boosted_similarity * 100)
        else:
            match_score = round(weighted_similarity * 100)

        return min(100, max(0, match_score))

    except Exception as e:
        print(f"Error calculating match score: {str(e)}")
        return 50  
