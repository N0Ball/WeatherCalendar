FROM python:3.9

WORKDIR /app

COPY app /app
ADD .env /app

RUN python3 -m pip install --no-cache-dir --upgrade -r requirements.txt

CMD ["flask", "run", "--host", "0.0.0.0", "--port", "8080"]