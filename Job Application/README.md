# JobPortal — interns_job_application

This repository contains a simple job portal prototype:

- Backend: Django REST API that uses MongoDB (via `pymongo`) for app data and SQLite for Django internals.
- Frontend: Static HTML/CSS/Vanilla JS pages under the project root.

## Quick start (development)

1. Create and activate a Python virtual environment (Windows PowerShell example):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Create an `.env` file in the `interns_job_application` folder based on `.env.example` and set `MONGO_URI`.

4. Run the Django development server from the `interns_job_application` folder:

```powershell
cd interns_job_application
python manage.py runserver
```

5. Open the frontend pages by opening the HTML files in a browser (for quick UI testing) or serve the root folder with a static server.

## Environment

- `MONGO_URI` — connection string for your MongoDB server. Example for a local MongoDB:

```
MONGO_URI=mongodb://localhost:27017
```

The backend's `db.py` uses `python-dotenv` so an `.env` file is automatically loaded when running the Django server.

## Notes & recommendations

- The project stores app data (jobs, users, applications) in MongoDB collections (`jobs`, `users`, `applications`) via `interns_job_application/db.py`.
- The static frontend currently uses client-side `localStorage` (`auth.js`) for some features. To use server-side auth and persistence, update the frontend fetch calls to call the `/api/users/...` and `/api/...` endpoints and persist tokens in a secure, appropriate place (e.g., `httpOnly` cookies or secure storage in a production setup).
- `settings.py` contains a placeholder `SECRET_KEY` and `DEBUG = True`. Do not use these values in production.

## Useful commands

Run migrations (Django internal DB only):

```powershell
cd interns_job_application
python manage.py migrate
```

Create admin user (optional):

```powershell
python manage.py createsuperuser
```

## Contact
If you want me to wire the frontend to the backend APIs, add token handling in the client, or harden the auth flow, tell me `wire frontend` or `harden auth` and I'll make those changes.
