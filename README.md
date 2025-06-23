# Tour Guide Manager

This project provides a small FastAPI backend and React frontend for managing tours and guides.

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

The backend now uses Firebase Firestore instead of PostgreSQL. Provide a Firebase service account JSON file and set the `FIREBASE_CREDENTIALS` environment variable to its path.

Example:

```
export FIREBASE_CREDENTIALS=/path/to/serviceAccount.json
```

Firestore collections named `excursions` and `guides` will be created automatically.
