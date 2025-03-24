import torch.nn.functional as F
from sentence_transformers import SentenceTransformer
from api.models.models import JobSearchRequest

model = SentenceTransformer("all-mpnet-base-v2")

def encode_texts(texts):
    """ Encode multiple texts in batch to improve performance. """
    return model.encode(texts, convert_to_tensor=True)

def calculate_match_score(cv_vectors: dict, saved_job: dict) -> int:
    try:
        # Prepara i testi del job
        job_texts = [
            f"Role: {saved_job['role'].lower()}",
            f"Location: {saved_job['location'].lower()}",
            f"Skills: {' '.join(saved_job.get('requirements', [])).lower()}"
        ]
        
        # Codifica i testi del job
        job_vectors = encode_texts(job_texts)
        
        # Calcola le similarità
        role_similarity = float(F.cosine_similarity(cv_vectors['role'], job_vectors[0], dim=0))
        location_similarity = float(F.cosine_similarity(cv_vectors['location'], job_vectors[1], dim=0))
        skills_similarity = float(F.cosine_similarity(cv_vectors['skills'], job_vectors[2], dim=0))

        # Calcola similarità esperienza
        if saved_job.get("years_experience") is not None and cv_vectors['years_experience'] is not None:
            experience_diff = abs(cv_vectors['years_experience'] - saved_job["years_experience"])
            experience_similarity = max(0, 1 - (experience_diff / 10))
        else:
            experience_similarity = 0

        # Pesi
        role_weight = 0.25 if saved_job.get("years_experience") is not None else 0.30
        skills_weight = 0.50
        location_weight = 0.15 if saved_job.get("years_experience") is not None else 0.20
        experience_weight = 0.10 if saved_job.get("years_experience") is not None else 0

        # Calcola similarità pesata
        weighted_similarity = (
            (role_similarity * role_weight) +
            (skills_similarity * skills_weight) +
            (location_similarity * location_weight) +
            (experience_similarity * experience_weight)
        )

        # Boost per match alti
        if weighted_similarity >= 0.7:
            boosted_similarity = 0.75 + (weighted_similarity - 0.7) * (0.98 - 0.75) / 0.3
            match_score = round(boosted_similarity * 100)
        else:
            match_score = round(weighted_similarity * 100)

        return min(100, max(0, match_score))

    except Exception as e:
        print(f"Error calculating match score: {str(e)}")
        return 50

def preprocess_cv(cv_data: JobSearchRequest) -> dict:
    """ Pre-compute CV vectors to avoid redundant encoding. """
    cv_texts = [
        f"Role: {cv_data.role.lower()}",
        f"Location: {cv_data.location.lower()}",
        f"Skills: {' '.join(cv_data.skills).lower()}"
    ]
    
    role_vector, location_vector, skills_vector = encode_texts(cv_texts)

    return {
        'role': role_vector,
        'location': location_vector,
        'skills': skills_vector,
        'years_experience': cv_data.years_experience
    }
