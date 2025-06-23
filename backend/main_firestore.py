from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import uvicorn

import firebase_admin
from firebase_admin import credentials, firestore

cred_path = os.getenv("FIREBASE_CREDENTIALS")
if cred_path:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
else:
    firebase_admin.initialize_app()

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
guides_ref = db.collection("guides")


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


class Guide(BaseModel):
    name: str
    telegram: str
    excursionsDone: int


class ExcursionOut(Excursion):
    id: str


class GuideOut(Guide):
    id: str


@app.get("/guides", response_model=List[GuideOut])
def list_guides():
    docs = guides_ref.stream()
    return [GuideOut(id=doc.id, **doc.to_dict()) for doc in docs]


@app.post("/guides", response_model=GuideOut)
def create_guide(guide: Guide):
    data = guide.dict()
    doc_ref = guides_ref.document()
    doc_ref.set(data)
    return GuideOut(id=doc_ref.id, **data)


@app.get("/guides/{guide_id}", response_model=GuideOut)
def get_guide(guide_id: str):
    doc = guides_ref.document(guide_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Guide not found")
    return GuideOut(id=doc.id, **doc.to_dict())


@app.put("/guides/{guide_id}", response_model=GuideOut)
def update_guide(guide_id: str, guide: Guide):
    doc_ref = guides_ref.document(guide_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Guide not found")
    doc_ref.update(guide.dict())
    data = doc_ref.get().to_dict()
    return GuideOut(id=doc_ref.id, **data)


@app.delete("/guides/{guide_id}")
def delete_guide(guide_id: str):
    doc_ref = guides_ref.document(guide_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Guide not found")
    doc_ref.delete()
    return {"message": "Guide deleted"}


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
