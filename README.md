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

The backend uses PostgreSQL via SQLAlchemy. Set the `DATABASE_URL` environment variable with your connection string. By default the app targets a [Neon](https://neon.tech/) instance:

```
postgresql://user:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Replace the credentials with your Neon database details.
