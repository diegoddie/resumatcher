import io
import re
from fastapi import UploadFile
import PyPDF2
import docx
from fastapi import HTTPException

def extract_text_from_pdf(file: UploadFile) -> str:
    reader = PyPDF2.PdfReader(file.file)
    text = "".join(page.extract_text() or "" for page in reader.pages)
    return text.strip()

def extract_text_from_docx(file: UploadFile) -> str:
    doc = docx.Document(io.BytesIO(file.file.read()))
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text.strip()

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = ''.join(c for c in text if c.isprintable() or c.isspace())
    text = re.sub(r'Page \d+ of \d+', '', text)
    text = text.replace('\r', '\n')
    return text.strip()

async def process_cv(file: UploadFile) -> str:
    if not file.filename:
        raise HTTPException(status_code=400, detail="File not valid or not provided")

    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in ['pdf', 'docx']:
        raise HTTPException(status_code=400, detail="Only PDF or DOCX files are supported")

    try:
        if file.content_type == "application/pdf":
            text = extract_text_from_pdf(file)
        else:
            text = extract_text_from_docx(file)
        return clean_text(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CV: {e}")
    
def get_job_experience(description: str) -> int | None:
    if not description:
        return 0
    
    description = description.lower()
    
    patterns = [
        r"(\d+)\+?\s*years?\s*(?:of)?\s*experience",
        r"experience\s*(?:of|:)?\s*(\d+)\+?\s*years?",
        r"at\s*least\s*(\d+)\s*years?\s*(?:of)?\s*experience",
        r"minimum\s*(?:of)?\s*(\d+)\s*years?\s*experience",
        r"(\d+)\+?\s*anni\s*(?:di)?\s*esperienza",
        r"esperienza\s*(?:di|:)?\s*(\d+)\+?\s*anni"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, description)
        if match:
            return int(match.group(1))
    
    return None