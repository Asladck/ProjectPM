Чистка дублирующихся папок завершена!

УДАЛЕНЫ папки из корня проекта:
- C:\Users\DWA\GolandProjects\Pjpro\css\
- C:\Users\DWA\GolandProjects\Pjpro\js\
- C:\Users\DWA\GolandProjects\Pjpro\public\ (если была)

ВСЕ фронтенд файлы теперь находятся ТОЛЬКО в папке web/:
✅ C:\Users\DWA\GolandProjects\Pjpro\web\css\
✅ C:\Users\DWA\GolandProjects\Pjpro\web\js\
✅ C:\Users\DWA\GolandProjects\Pjpro\web\public\

Структура проекта после очистки:

Pjpro/
├── cmd/                    # Go backend
├── configs/                # Конфиги
├── internal/               # Go код
├── java/                   # Java сервисы
├── migrations/             # DB migrations
├── proto/                  # Protobuf
├── web/                    # 🎯 ФРОНТЕНД (всё здесь!)
│   ├── css/
│   │   ├── animations.css
│   │   └── main.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── assignments.js
│   │   ├── attendance.js
│   │   ├── chat.js
│   │   ├── config.js
│   │   ├── dashboard.js
│   │   └── utils.js
│   ├── public/
│   │   ├── login.html
│   │   ├── teacher-dashboard.html
│   │   ├── student-dashboard.html
│   │   ├── assignment-teacher.html
│   │   ├── assignment-student.html
│   │   ├── attendance-teacher.html
│   │   ├── attendance-student.html
│   │   └── chat.html
│   └── README.md
├── docker-compose.yml
├── Dockerfile
├── go.mod
├── go.sum
└── start-frontend-only.bat

Запуск фронтенда:
1. Запустите: start-frontend-only.bat
2. ИЛИ вручную:
   cd web
   python -m http.server 8000
3. Откройте: http://localhost:8000/public/login.html

Теперь всё организовано правильно! 🎉

