import os
from dotenv import load_dotenv
from openai import OpenAI
import json
from api.models.models import CvSummary
from typing import List

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_summary_with_openai(cleaned_text: str) -> CvSummary:
    prompt = f"""Analyze the following CV and extract the key information in JSON format.
    
    Curriculum Vitae:
    {cleaned_text}
    
    Extract the following information in JSON format:
    - role: The person's primary role (e.g., "Frontend Developer", "Data Scientist")
    - years_experience: Estimated years of professional experience (integer)
    - location: The person's current or preferred location
    - skills: Technical and personal skills. Structure them as a simple list of strings and not as a list of objects. See the example below:
       * A simple list of strings: ["JavaScript", "Python"]
    - summary: A brief professional summary (2-3 sentences)
    
    Respond ONLY with JSON, without additional comments. If any information is missing, leave the field as an empty array or null."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are an expert assistant in CV analysis."},
                      {"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        
        result = response.choices[0].message.content
        analysis_data = json.loads(result)

        return CvSummary.model_validate(analysis_data)
    except Exception as e:
        print(f"Error in OpenAI API call: {e}")
        return CvSummary(role="", experience_years=None, location=None, skills=[], education=[], summary="")

def get_job_requirements(description: str) -> List[str]:
    prompt = f"""Extract the key requirements from the following job description in a list of strings:
    
    Job Description:
    {description}

    Return ONLY a JSON array of max 8 strings representing the key hard skills, languages and technologies. If the job description has more than 8 skills, return only the most important ones. Very important: Do not include qualifications, degrees or soft skills like "efficiency", "effectiveness", "english fluency" and other similar words or soft skills.
    For example: ["JavaScript", "Typescript", "React"]

    Do not include explanations or other text, just the JSON array. Do not include something like "proficiency in react, typescript, react and other technologies" or "familiar with ...", report just the skills, each skill should be a string, so in this example ["JavaScript", "React", "Typescript"].
    Report only skills mentioned in the job description, for example if the position is for a Java Developer and in the job description it mentions "Java", "PHP", "CSS", the response should be ["Java", "PHP", "CSS"] and not something not mentioned like Python or Data Analysis.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are an expert at analyzing job descriptions."},
                      {"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        
        result = response.choices[0].message.content
        requirements_data = json.loads(result)

        if isinstance(requirements_data, list):
            return requirements_data
        
        elif isinstance(requirements_data, dict):
            possible_keys = ["key_requirements", "skills", "hard_skills", "requirements", "technologies"]
            
            for key in possible_keys:
                if key in requirements_data and isinstance(requirements_data[key], list):
                    return requirements_data[key]
            
            if all(isinstance(k, str) and isinstance(v, str) for k, v in requirements_data.items()):
                return list(requirements_data.values())
            
            if len(requirements_data) == 1:
                value = next(iter(requirements_data.values()))
                if isinstance(value, list):
                    return value

            skills = []
            for value in requirements_data.values():
                if isinstance(value, str):
                    skills.append(value)
                elif isinstance(value, list):
                    skills.extend([item for item in value if isinstance(item, str)])
            
            if skills:
                return skills
        
        print(f"Could not extract requirements from response: {requirements_data}")
        return []
        
    except Exception as e:
        print(f"Error extracting job requirements: {e}")
        return []



