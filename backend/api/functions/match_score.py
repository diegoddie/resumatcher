import torch.nn.functional as F
from sentence_transformers import SentenceTransformer
from api.models.models import JobSearchRequest

model = SentenceTransformer("all-mpnet-base-v2")

def encode_texts(texts, max_length=128):
    """ Encode multiple texts in batch to improve performance. 
    Limit text length to reduce processing time. """
    # Tronca i testi per ridurre il carico
    truncated_texts = [text[:max_length] for text in texts]
    # Encoding in batch
    return model.encode(truncated_texts, convert_to_tensor=True, batch_size=len(truncated_texts))

def calculate_match_scores_batch(cv_vectors: dict, jobs: list) -> list:
    """Calculate match scores for multiple jobs in batch"""
    try:
        # Prepara tutti i testi dei job in batch
        all_job_texts = []
        for job in jobs:
            job_texts = [
                f"Role: {job['role'].lower()}",
                f"Location: {job['location'].lower()}",
                f"Skills: {' '.join(job.get('requirements', [])).lower()}"
            ]
            all_job_texts.extend(job_texts)
        
        # Encoding di tutti i job in un'unica chiamata
        all_job_vectors = encode_texts(all_job_texts)
        
        match_scores = []
        # Processa i risultati per ogni job
        for i in range(0, len(all_job_vectors), 3):
            job = jobs[i // 3]
            job_role_vector = all_job_vectors[i]
            job_location_vector = all_job_vectors[i + 1]
            job_skills_vector = all_job_vectors[i + 2]
            
            # Calcola similarità
            role_similarity = float(F.cosine_similarity(cv_vectors['role'], job_role_vector, dim=0))
            location_similarity = float(F.cosine_similarity(cv_vectors['location'], job_location_vector, dim=0))
            skills_similarity = float(F.cosine_similarity(cv_vectors['skills'], job_skills_vector, dim=0))

            # Calcola similarità esperienza
            if job.get("years_experience") is not None and cv_vectors['years_experience'] is not None:
                experience_diff = abs(cv_vectors['years_experience'] - job["years_experience"])
                experience_similarity = max(0, 1 - (experience_diff / 10))
            else:
                experience_similarity = 0

            # Pesi
            role_weight = 0.25 if job.get("years_experience") is not None else 0.30
            skills_weight = 0.50
            location_weight = 0.15 if job.get("years_experience") is not None else 0.20
            experience_weight = 0.10 if job.get("years_experience") is not None else 0

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

            match_scores.append(min(100, max(0, match_score)))

        return match_scores

    except Exception as e:
        print(f"Error calculating batch match scores: {str(e)}")
        return [50] * len(jobs)

def calculate_match_score(cv_vectors: dict, saved_job: dict) -> int:
    """Wrapper for single job match score calculation"""
    try:
        scores = calculate_match_scores_batch(cv_vectors, [saved_job])
        return scores[0]
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
