import os
from fastapi import HTTPException
import requests

def fetch_jobs_from_api(role: str, location: str):
    try:
        url = "https://jsearch.p.rapidapi.com/search"
        querystring = {"query": f"{role} in {location}", "page": "1", "num_pages": "1", "country": "it"}
        
        headers = {
            "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        if response.status_code == 200:
            return response.json().get("data", [])
        else:
            raise HTTPException(status_code=500, detail=f"Error searching jobs: {response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching jobs: {e}")