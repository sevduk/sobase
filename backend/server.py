from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import hmac
import jwt
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
JWT_ALGORITHM = "HS256"

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactInquiry(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    project_type: str = Field(min_length=2, max_length=80)
    message: str = Field(min_length=5, max_length=3000)

    @field_validator("name", "project_type", "message")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Bu alan boş bırakılamaz")
        return cleaned

class ContactInquiryResponse(BaseModel):
    success: bool
    message: str

class AdminLogin(BaseModel):
    password: str = Field(min_length=4, max_length=120)

class ProjectIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=120)
    image: str = Field(min_length=8, max_length=1000)
    gallery: List[str] = []
    summary: str = Field(min_length=10, max_length=2000)
    year: str = Field(min_length=4, max_length=12)
    client: str = Field(min_length=2, max_length=120)
    order: int = 0
    published: bool = True

    @field_validator("name", "category", "summary", "year", "client")
    @classmethod
    def clean_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Bu alan boş bırakılamaz")
        return cleaned

class ProjectOut(ProjectIn):
    id: str

DEFAULT_PROJECTS = [
    {"name": "AURA", "category": "Logo & Marka Tasarımı", "image": "https://images.unsplash.com/photo-1760804876161-ba0337e998fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", "gallery": ["https://images.unsplash.com/photo-1760804876161-ba0337e998fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85"], "summary": "AURA için amaç; güven veren klinik duruşunu sade bir işaret ve uygulanabilir kimlik sistemine dönüştürmekti.", "year": "2026", "client": "Klinik / Sağlık", "order": 1, "published": True},
    {"name": "NORTH / 01", "category": "Dijital Çözümler & Web Teknolojileri", "image": "https://images.unsplash.com/photo-1775510984733-8748e90a985e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", "gallery": ["https://images.unsplash.com/photo-1775510984733-8748e90a985e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85"], "summary": "NORTH / 01'de cephe tipografisi, ambalaj ve dijital temas noktaları aynı gridde buluştu.", "year": "2025", "client": "Perakende / Yapı", "order": 2, "published": True},
    {"name": "NOIRÉ", "category": "E-Ticaret Danışmanlığı", "image": "https://images.unsplash.com/photo-1782857690704-c4341b240487?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", "gallery": ["https://images.unsplash.com/photo-1782857690704-c4341b240487?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85"], "summary": "NOIRÉ için karanlık premium kimlik; satış operasyonu ve pazaryeri akışlarıyla birlikte ele alındı.", "year": "2026", "client": "Fintech / Operasyon", "order": 3, "published": True},
]

def create_admin_token() -> str:
    payload = {"sub": "admin", "type": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)

async def get_admin(request: Request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Yetkisiz erişim")
    try:
        payload = jwt.decode(auth_header[7:], os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "admin":
            raise HTTPException(status_code=401, detail="Geçersiz token")
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Geçersiz veya süresi dolmuş oturum")

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/contact", response_model=ContactInquiryResponse)
async def create_contact_inquiry(input: ContactInquiry):
    inquiry = input.model_dump()
    inquiry["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contact_inquiries.insert_one(inquiry)
    return ContactInquiryResponse(success=True, message="Mesajınız için teşekkürler. En kısa sürede size döneceğiz.")

@api_router.post("/admin/login")
async def admin_login(input: AdminLogin, request: Request):
    identifier = f"admin:{request.client.host if request.client else 'unknown'}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_until = attempts.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Çok fazla deneme. 15 dakika sonra tekrar deneyin.")
    if not hmac.compare_digest(input.password, os.environ.get("ADMIN_PASSWORD", "")):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Parola hatalı")
    await db.login_attempts.delete_one({"identifier": identifier})
    return {"access_token": create_admin_token(), "token_type": "bearer"}

@api_router.get("/projects", response_model=List[ProjectOut])
async def public_projects():
    return await db.projects.find({"published": True}, {"_id": 0}).sort("order", 1).to_list(200)

@api_router.get("/admin/projects", response_model=List[ProjectOut])
async def admin_projects(_: dict = Depends(get_admin)):
    return await db.projects.find({}, {"_id": 0}).sort("order", 1).to_list(500)

@api_router.post("/admin/projects", response_model=ProjectOut)
async def create_project(input: ProjectIn, _: dict = Depends(get_admin)):
    doc = input.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.projects.insert_one(doc)
    doc.pop("_id", None)
    doc.pop("created_at", None)
    return ProjectOut(**doc)

@api_router.put("/admin/projects/{project_id}", response_model=ProjectOut)
async def update_project(project_id: str, input: ProjectIn, _: dict = Depends(get_admin)):
    existing = await db.projects.find_one({"id": project_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    doc = input.model_dump()
    await db.projects.update_one({"id": project_id}, {"$set": doc})
    return ProjectOut(**doc, id=project_id)

@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, _: dict = Depends(get_admin)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    return {"success": True}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db():
    await db.projects.create_index([("published", 1), ("order", 1)])
    await db.projects.create_index("id", unique=True)
    await db.login_attempts.create_index("identifier")
    if await db.projects.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.projects.insert_many([{**project, "id": str(uuid.uuid4()), "created_at": now} for project in DEFAULT_PROJECTS])

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
