# FastAPI + Postgres Docker & docker-compose 실전 정리

## 1. 폴더 구조 예시
```
mychu/
├── client/
├── server/
│   ├── main.py
├── Dockerfile
├── docker-compose.yml
```

## 2. Dockerfile (루트)
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 3. docker-compose.yml
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
      POSTGRES_DB: welllist
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  fastapi:
    build:
      context: .
    command: uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./server:/app/server
      - ./client:/app/client
    environment:
      DB_USER: postgres
      DB_PASSWORD: root
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: welllist
    ports:
      - "8000:8000"
    depends_on:
      - db

volumes:
  postgres_data:
```

## 4. 실행
```sh
docker-compose up --build
```
- 중지: `Ctrl + C`
- 컨테이너/볼륨 삭제: `docker-compose down -v`

## 5. 주요 개념
- 컨테이너 Postgres는 로컬 DB와 별개
- DB 비밀번호는 컨테이너 내부에서만 사용, 로컬과 달라도 됨
- Dockerfile은 루트에 두고, build context를 맞춰야 함
- 볼륨(postgres_data) 삭제 시 DB 데이터도 삭제됨

## 6. 트러블슈팅
- Dockerfile not found: build context와 Dockerfile 위치 확인
- DB 접속 오류: 환경변수(DB_HOST, DB_USER, DB_PASSWORD) 확인
- 포트 충돌: docker-compose.yml에서 포트 변경