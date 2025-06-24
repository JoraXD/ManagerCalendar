from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import uvicorn
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore
load_dotenv()  # Загружает переменные из .env

# Try to locate the Firebase service account JSON file. Users can provide the
# path via environment variables. If not set, fall back to `.venv/google-services.json`
# relative to the project root to make local development easier.
cred_path = os.getenv("FIREBASE_CREDENTIALS") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not cred_path:
    # Look for `.venv/google-services.json` next to the repository root
    default_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".venv", "google-services.json"))
    if os.path.exists(default_path):
        cred_path = default_path
    else:
        raise RuntimeError(
            "Firebase credentials not found. Set FIREBASE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS environment variables or place google-services.json in .venv/"
        )

try:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
except ValueError as exc:
    raise RuntimeError(
        "Invalid Firebase credentials file. Please download a service account key JSON file from the Firebase console and provide its path via the FIREBASE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS environment variable."
    ) from exc

db = firestore.client()

app = FastAPI(title="Tour Guide Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

excursions_ref = db.collection("excursions")
users_ref = db.collection("users")


class Excursion(BaseModel):
    assignedTo: str
    date: str
    lunch: bool
    masterClass: bool
    meetingPlace: str
    people: int
    route: str
    time: str
    type: str


class User(BaseModel):
    name: str
    telegram: str
    excursionsDone: int


class ExcursionOut(Excursion):
    id: str


class UserOut(User):
    id: str


@app.get("/users", response_model=List[UserOut])
def list_users():
    docs = users_ref.stream()
    return [UserOut(id=doc.id, **doc.to_dict()) for doc in docs]


@app.post("/users", response_model=UserOut)
def create_user(user: User):
    data = user.dict()
    doc_ref = users_ref.document()
    doc_ref.set(data)
    return UserOut(id=doc_ref.id, **data)


@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: str):
    doc = users_ref.document(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(id=doc.id, **doc.to_dict())


@app.put("/users/{user_id}", response_model=UserOut)
def update_user(user_id: str, user: User):
    doc_ref = users_ref.document(user_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    doc_ref.update(user.dict())
    data = doc_ref.get().to_dict()
    return UserOut(id=doc_ref.id, **data)


@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    doc_ref = users_ref.document(user_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    doc_ref.delete()
    return {"message": "User deleted"}


@app.get("/excursions", response_model=List[ExcursionOut])
def list_excursions():
    docs = excursions_ref.stream()
    return [ExcursionOut(id=doc.id, **doc.to_dict()) for doc in docs]


@app.post("/excursions", response_model=ExcursionOut)
def create_excursion(excursion: Excursion):
    data = excursion.dict()
    doc_ref = excursions_ref.document()
    doc_ref.set(data)
    return ExcursionOut(id=doc_ref.id, **data)


@app.get("/excursions/{excursion_id}", response_model=ExcursionOut)
def get_excursion(excursion_id: str):
    doc = excursions_ref.document(excursion_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Excursion not found")
    return ExcursionOut(id=doc.id, **doc.to_dict())


@app.put("/excursions/{excursion_id}", response_model=ExcursionOut)
def update_excursion(excursion_id: str, excursion: Excursion):
    doc_ref = excursions_ref.document(excursion_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Excursion not found")
    doc_ref.update(excursion.dict())
    data = doc_ref.get().to_dict()
    return ExcursionOut(id=doc_ref.id, **data)


@app.delete("/excursions/{excursion_id}")
def delete_excursion(excursion_id: str):
    doc_ref = excursions_ref.document(excursion_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Excursion not found")
    doc_ref.delete()
    return {"message": "Excursion deleted"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
