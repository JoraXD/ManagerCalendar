# Tour Guide Manager

This project provides a small FastAPI backend and React frontend for managing excursions and users.

## Development

1. Install dependencies for the frontend:
   ```bash
   npm install
   ```
2. Run the application using the helper script:
   ```bash
   python start.py
   ```

## Database

The backend now uses Firebase Firestore instead of PostgreSQL. Provide a Firebase service account JSON file. The server looks for the path in the `FIREBASE_CREDENTIALS` (or `GOOGLE_APPLICATION_CREDENTIALS`) environment variable. If those are not set, it will try `.venv/google-services.json` by default.

Example:

```
export FIREBASE_CREDENTIALS=.venv/google-services.json
```

Firestore collections named `excursions` and `users` will be created automatically.
