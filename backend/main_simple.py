# Импорт необходимых библиотек
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean, ForeignKey, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
import uvicorn
import requests

# Database setup
# Читаем строку подключения из переменной окружения DATABASE_URL.
# Если переменная не задана, используется тестовый URL Neon.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require",
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
# Создаём соединение с БД и фабрику сессий

# FastAPI app
app = FastAPI(title="Tour Guide Manager API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_info = Column(Text)
    tg_alias = Column(String)
    black_list = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Guide(Base):
    __tablename__ = "guides"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    tg_alias = Column(String)
    contact_info = Column(Text)
    total_earnings = Column(DECIMAL(10, 2), default=0)
    total_tours = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Tour(Base):
    __tablename__ = "tours"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    date = Column(DateTime, nullable=False)
    venue = Column(String, nullable=False)
    group_size = Column(Integer, nullable=False)
    duration = Column(DECIMAL(3, 1), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String, default="pending")
    assigned_guide_id = Column(Integer, ForeignKey("guides.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class ClientBase(BaseModel):
    name: str
    contact_info: Optional[str] = None
    tg_alias: Optional[str] = None
    black_list: bool = False

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class GuideBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    tg_alias: Optional[str] = None
    contact_info: Optional[str] = None
    is_active: bool = True

class GuideCreate(GuideBase):
    pass

class GuideResponse(GuideBase):
    id: int
    total_earnings: Optional[float] = 0
    total_tours: Optional[int] = 0
    created_at: datetime
    
    class Config:
        from_attributes = True

class TourBase(BaseModel):
    name: str
    description: Optional[str] = None
    date: datetime
    venue: str
    group_size: int
    duration: float
    client_id: int
    price: float
    status: str = "pending"

class TourCreate(TourBase):
    pass

class TourResponse(TourBase):
    id: int
    assigned_guide_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dependency
# Зависимость FastAPI, выдающая сессию БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Telegram notification function
async def send_telegram_notification(chat_id: str, message: str) -> bool:
    """Send notification via Telegram Bot API"""
    try:
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        if not bot_token:
            print("Telegram bot token not configured")
            return False
            
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "HTML"
        }
        
        response = requests.post(url, json=payload)
        return response.status_code == 200
    except Exception as e:
        print(f"Error sending Telegram notification: {e}")
        return False

# ------- Работа с заказчиками -------
# API Routes
@app.get("/clients", response_model=List[ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    clients = db.query(Client).all()
    return clients

@app.post("/clients", response_model=ClientResponse)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

# ------- Работа с гидами -------
@app.get("/guides", response_model=List[GuideResponse])
def get_guides(db: Session = Depends(get_db)):
    guides = db.query(Guide).all()
    return guides

@app.post("/guides", response_model=GuideResponse)
def create_guide(guide: GuideCreate, db: Session = Depends(get_db)):
    db_guide = Guide(**guide.dict())
    db.add(db_guide)
    return db_guide

# ------- Работа с турами -------
@app.get("/tours", response_model=List[TourResponse])
def get_tours(db: Session = Depends(get_db)):
    tours = db.query(Tour).all()
    return tours

@app.get("/tours/{tour_id}", response_model=TourResponse)
def get_tour(tour_id: int, db: Session = Depends(get_db)):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    return tour

@app.post("/tours", response_model=TourResponse)
async def create_tour(tour: TourCreate, db: Session = Depends(get_db)):
    db_tour = Tour(**tour.dict())
    db.add(db_tour)
    db.commit()
    db.refresh(db_tour)
    
    # Send notification to all active guides
    guides = db.query(Guide).filter(Guide.is_active == True).all()
    for guide in guides:
        if guide.tg_alias is not None:
            await send_telegram_notification(
                str(guide.tg_alias),
                f"🚨 New Tour Available!\n\n📍 {db_tour.name}\n📅 {db_tour.date.strftime('%Y-%m-%d %H:%M')}\n🏛️ {db_tour.venue}\n👥 {db_tour.group_size} participants\n💰 ${db_tour.price}\n\nApply now through the Tour Guide Manager!"
            )
    
    return db_tour

@app.put("/tours/{tour_id}", response_model=TourResponse)
def update_tour(tour_id: int, tour: TourCreate, db: Session = Depends(get_db)):
    db_tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not db_tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    for key, value in tour.dict().items():
        setattr(db_tour, key, value)
    
    db.commit()
    db.refresh(db_tour)
    return db_tour

@app.delete("/tours/{tour_id}")
def delete_tour(tour_id: int, db: Session = Depends(get_db)):
    db_tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not db_tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    db.delete(db_tour)
    db.commit()
    return {"message": "Tour deleted successfully"}

@app.post("/tours/{tour_id}/assign-guide")
async def assign_guide_to_tour(tour_id: int, guide_data: dict, db: Session = Depends(get_db)):
    guide_id = guide_data.get("guideId")
    if not guide_id:
        raise HTTPException(status_code=400, detail="Guide ID is required")
    
    db_tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not db_tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    db_tour.assigned_guide_id = guide_id
    db_tour.status = "confirmed"
    db.commit()
    db.refresh(db_tour)
    
    # Send notification to guide
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if guide and guide.tg_alias is not None:
        await send_telegram_notification(
            str(guide.tg_alias),
            f"🎉 Congratulations!\n\nYou have been assigned to:\n📍 {db_tour.name}\n📅 {db_tour.date.strftime('%Y-%m-%d %H:%M')}\n🏛️ {db_tour.venue}\n\nPlease confirm your availability!"
        )
    
    return db_tour

# При запуске приложения создаём таблицы и наполняем тестовыми данными
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    
    # Add sample data if tables are empty
    db = SessionLocal()
    try:
        if db.query(Client).count() == 0:
            sample_clients = [
                Client(name="Московский Музей", contact_info="info@moscowmuseum.ru, +7 495 123-4567", tg_alias="@moscow_museum"),
                Client(name="Туристическая Компания \"Север\"", contact_info="booking@sever-tours.com, +7 812 987-6543", tg_alias="@severtours"),
                Client(name="Отель \"Метрополь\"", contact_info="concierge@metropol.ru, +7 495 501-7800", tg_alias="@metropol_hotel"),
            ]
            db.add_all(sample_clients)
            
        if db.query(Guide).count() == 0:
            sample_guides = [
                Guide(name="Анна Петрова", email="anna.petrova@guides.ru", phone="+7 925 123-4567", tg_alias="@anna_guide"),
                Guide(name="Михаил Сидоров", email="mikhail.sidorov@guides.ru", phone="+7 926 234-5678", tg_alias="@mikhail_guide"),
                Guide(name="Елена Васильева", email="elena.vasileva@guides.ru", phone="+7 927 345-6789", tg_alias="@elena_guide"),
            ]
            db.add_all(sample_guides)
            
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
