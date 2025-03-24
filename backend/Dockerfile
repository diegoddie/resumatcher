FROM python:3.11-slim

WORKDIR /app

# Copia i file di dipendenze e installali
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia il resto dell'applicazione
COPY . .

# Esponi la porta su cui gira l'applicazione
EXPOSE 8000

# Comando per avviare l'app (assumo che stai usando FastAPI/Uvicorn)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]