FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# --reload is intentionally left out here. This Dockerfile is for
# consistent runs (CI, deployment). For local hot-reload development,
# run `uvicorn app.main:app --reload` directly on your machine, or use
# docker-compose.yml which mounts the code as a volume.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
