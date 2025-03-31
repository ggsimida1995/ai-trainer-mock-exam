FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY dist/ dist/
COPY app.py .

EXPOSE 7860

CMD ["python", "app.py"] 