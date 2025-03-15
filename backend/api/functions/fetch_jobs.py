import os
from fastapi import HTTPException
import requests

def fetch_jobs_from_api(role: str, location: str):
    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {"query": f"{role} in {location}", "page": "1", "num_pages": "1"}
    
    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    
    if response.status_code == 200:
        return response.json().get("data", [])
    
    raise HTTPException(status_code=500, detail=f"Error searching jobs: {response.status_code}")