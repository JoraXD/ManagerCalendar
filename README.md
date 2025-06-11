# Tour Guide Manager

Веб-приложение для управления экскурсиями. Состоит из backend на Python (Flask) и frontend на React. Данные хранятся в PostgreSQL.

## Запуск backend

```
cd server
pip install -r requirements.txt
python -m app.app
```

По умолчанию используется база `postgresql://user:password@localhost:5432/manager`. Измените переменную `DATABASE_URI` при необходимости.

## Запуск frontend

```
cd client
npm install
npm start
```

Приложение откроется на `http://localhost:3000`.
