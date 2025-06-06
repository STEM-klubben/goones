FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:0.6.17 /uv /uvx /bin/

EXPOSE 80

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY . .

RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

CMD ["uv", "run", "gunicorn", "--bind", "0.0.0.0:80", "main:app"]
