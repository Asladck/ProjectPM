# 🚀 SDU Educational Platform — Microservices System

Полноценная микросервисная платформа для управления:
- ✅ Посещаемостью студентов
- ✅ Заданиями и загрузкой файлов
- ✅ Аутентификацией пользователей
- ✅ WebSocket-чатом
- ✅ gRPC взаимодействием

Проект реализован с использованием **Go + Java Spring Boot + PostgreSQL + MongoDB + Docker Compose**.

---

## 🧱 Архитектура проекта

```text
Pjpro/
 ┣ 📦 app (Go)
 ┃ ┣ auth (JWT)
 ┃ ┣ websocket chat
 ┃ ┣ gRPC
 ┃ ┗ frontend (HTML / CSS / JS)
 ┃
 ┣ 📦 attendance-service (Java / Spring Boot / PostgreSQL)
 ┃ ┗ управление посещаемостью
 ┃
 ┣ 📦 file-service (Java / Spring Boot / MongoDB GridFS)
 ┃ ┗ задания и загрузка файлов
 ┃
 ┣ 📦 postgres
 ┣ 📦 mongodb
 ┣ 📦 migrate
 ┗ 📄 docker-compose.yml
```

⚙️ Используемые технологии
Область	Технологии
Backend	Go (Gin, JWT, gRPC, WebSocket)
Backend	Java Spring Boot
База данных	PostgreSQL
Файлы	MongoDB + GridFS
Контейнеризация	Docker, Docker Compose
Frontend	HTML + CSS + Vanilla JS

🔌 Сервисы и порты
Сервис	Порт
Go API (Auth, Frontend)	9090
WebSocket Chat	8085
gRPC	50051
Attendance Service	4061
Assignment / File Service	4062
PostgreSQL	5432
MongoDB	27017

🚀 Быстрый старт (одной командой)
```bash
docker compose up --build
```

После запуска будут доступны:

✅ Frontend: http://localhost:9090

✅ Attendance: http://localhost:4061

✅ Assignments: http://localhost:4062

✅ WebSocket: ws://localhost:8085/ws

✅ API: Аутентификация (Go)
🔐 Регистрация
```bash
curl -X POST http://localhost:9090/auth/sign-up \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Aibar\",\"surname\":\"Student\",\"email\":\"aibar@test.com\",\"password_hash\":\"123456\",\"role\":\"Student\"}"
```
🔑 Вход
```bash
curl -X POST http://localhost:9090/auth/sign-in \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"aibar@test.com\",\"password_hash\":\"123456\",\"role\":\"Student\"}"
```
✅ Attendance Service (4061)
📚 Получить курс
```bash
curl http://localhost:4061/attendance/getCourse/{courseId}
```
✅ Отметить студента
```bash
  curl -X POST http://localhost:4061/attendance \
  -H "Content-Type: application/json" \
  -d "{\"studentId\":\"UUID\",\"sessionId\":\"UUID\",\"status\":\"PRESENT\"}"
```
✅ Assignment + File Service (4062)
📝 Создать задание (Teacher)
```bash
curl -X POST "http://localhost:4062/uploadAssignment/create?teacherId=UUID" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"HW1\",\"description\":\"Test\",\"dueDate\":\"2025-12-20T23:59:59\",\"studentIds\":[\"UUID\"]}"
```
📤 Загрузить файл (Student)
```bash
curl -X POST http://localhost:4062/submit/assignment \
  -F "studentId=UUID" \
  -F "assignmentId=UUID" \
  -F "file=@solution.pdf"
```
✅ WebSocket Chat
```
ws://localhost:8085/ws?token=JWT_TOKEN
```
✅ Проверка баз данных
PostgreSQL
```bash
docker exec -it pjpro-postgres-1 psql -U postgres -d ws
```
```
SELECT * FROM users;
SELECT * FROM attendance;
```
MongoDB
```bash
docker exec -it pjpro-mongodb-1 mongosh -u user -p user
```
use mydb
show collections
db.submissions.find()

✅ Роли пользователей
Роль	Возможности
Student	Сдача заданий, чат, посещаемость
Teacher	Создание заданий, просмотр посещаемости
🛡 Безопасность

✅ JWT аутентификация

✅ Ролевая система

✅ MongoDB GridFS

✅ PostgreSQL

✅ Ограничения по дедлайну

✅ Защита WebSocket через токен

🧪 Тестирование

CURL

Postman

Браузер

WebSocket клиент

📌 Roadmap

✅ Docker

✅ WebSocket Chat

✅ JWT

✅ PostgreSQL

✅ MongoDB GridFS

⏳ Swagger

⏳ API Gateway

⏳ Redis

⏳ Monitoring (Grafana + Prometheus)

👤 Автор

Разработчик: Aibar Tlekbay
Проект: SDU Platform / INF451

✅ Проект готов к защите и масштабированию.
