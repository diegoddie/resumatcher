import io
import re
from fastapi import UploadFile
import docx
from pypdf import PdfReader
from fastapi import HTTPException

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB, same limit as the frontend

def extract_text_from_pdf(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    return text.strip()

def extract_text_from_docx(content: bytes) -> str:
    doc = docx.Document(io.BytesIO(content))
    paragraphs = [paragraph.text for paragraph in doc.paragraphs]
    # Many CV templates lay out the content in tables
    cells = [cell.text for table in doc.tables for row in table.rows for cell in row.cells]
    return "\n".join(paragraphs + cells).strip()

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = ''.join(c for c in text if c.isprintable() or c.isspace())
    text = re.sub(r'Page \d+ of \d+', '', text)
    return text.strip()

def process_cv(file: UploadFile) -> str:
    if not file.filename:
        raise HTTPException(status_code=400, detail="File not valid or not provided")

    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in ['pdf', 'docx']:
        raise HTTPException(status_code=400, detail="Only PDF or DOCX files are supported")

    content = file.file.read(MAX_FILE_SIZE + 1)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File must be smaller than 5MB")

    try:
        text = extract_text_from_pdf(content) if file_extension == "pdf" else extract_text_from_docx(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CV: {e}")

    text = clean_text(text)
    if not text:
        raise HTTPException(status_code=400, detail="No text found in the CV (scanned PDFs are not supported)")
    return text
