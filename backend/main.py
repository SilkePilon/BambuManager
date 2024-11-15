import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

import bambulabs_api as bl

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# JWT settings
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Data models
class User(BaseModel):
    """User model for authentication"""
    username: str
    hashed_password: str

class UserInDB(User):
    """User model with ID for database storage"""
    id: int

class Token(BaseModel):
    """Token model for JWT authentication"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Token data model for JWT payload"""
    username: Optional[str] = None

class Printer(BaseModel):
    """Printer model for storing printer information"""
    id: int
    name: str
    ip: str
    access_code: str
    serial: str

class PrinterStatus(BaseModel):
    """Printer status model for reporting current printer state"""
    name: str
    status: str
    hotend_temp: float
    bed_temp: float
    print_progress: float
    time_remaining: str

class GcodeFile(BaseModel):
    """G-code file model for file management"""
    filename: str
    size: int

# JSON database functions
def load_json(filename: str) -> dict:
    """Load JSON data from a file"""
    import json
    import os
    if not os.path.exists(filename):
        return {}
    with open(filename, 'r') as f:
        return json.load(f)

def save_json(data: dict, filename: str) -> None:
    """Save JSON data to a file"""
    import json
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

# User management
def get_user(username: str) -> Optional[UserInDB]:
    """Retrieve user from the database"""
    users = load_json('users.json')
    if username in users:
        user_dict = users[username]
        return UserInDB(**user_dict)
    return None

def authenticate_user(username: str, password: str) -> Optional[UserInDB]:
    """Authenticate user credentials"""
    user = get_user(username)
    if not user:
        return None
    if not pwd_context.verify(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    """Get the current user from the JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# Printer management
printer_instances: Dict[int, bl.Printer] = {}

def get_printer_instance(printer_id: int) -> bl.Printer:
    """Get or create a printer instance"""
    if printer_id not in printer_instances:
        printers = load_json('printers.json')
        if str(printer_id) not in printers:
            raise HTTPException(status_code=404, detail="Printer not found")
        printer_data = printers[str(printer_id)]
        printer_instances[printer_id] = bl.Printer(printer_data['ip'], printer_data['access_code'], printer_data['serial'])
        printer_instances[printer_id].connect()
    return printer_instances[printer_id]

# API routes
@app.post("/token", response_model=Token)
@limiter.limit("5/minute")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Endpoint for user authentication and token generation"""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/signup")
@limiter.limit("3/minute")
async def signup(username: str, password: str):
    """Endpoint for user registration"""
    users = load_json('users.json')
    if username in users:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = pwd_context.hash(password)
    new_user = UserInDB(id=len(users)+1, username=username, hashed_password=hashed_password)
    users[username] = new_user.dict()
    save_json(users, 'users.json')
    return {"message": "User created successfully"}

@app.get("/printers", response_model=List[Printer])
@limiter.limit("10/minute")
async def get_printers(current_user: User = Depends(get_current_user)):
    """Endpoint to retrieve all registered printers"""
    printers = load_json('printers.json')
    return [Printer(**printer) for printer in printers.values()]

@app.post("/printers")
@limiter.limit("5/minute")
async def add_printer(printer: Printer, current_user: User = Depends(get_current_user)):
    """Endpoint to add a new printer"""
    printers = load_json('printers.json')
    printers[str(printer.id)] = printer.dict()
    save_json(printers, 'printers.json')
    return {"message": "Printer added successfully"}

@app.put("/printers/{printer_id}")
@limiter.limit("5/minute")
async def update_printer(printer_id: int, printer: Printer, current_user: User = Depends(get_current_user)):
    """Endpoint to update an existing printer"""
    printers = load_json('printers.json')
    if str(printer_id) not in printers:
        raise HTTPException(status_code=404, detail="Printer not found")
    printers[str(printer_id)] = printer.dict()
    save_json(printers, 'printers.json')
    if printer_id in printer_instances:
        del printer_instances[printer_id]
    return {"message": "Printer updated successfully"}

@app.delete("/printers/{printer_id}")
@limiter.limit("5/minute")
async def delete_printer(printer_id: int, current_user: User = Depends(get_current_user)):
    """Endpoint to delete a printer"""
    printers = load_json('printers.json')
    if str(printer_id) not in printers:
        raise HTTPException(status_code=404, detail="Printer not found")
    del printers[str(printer_id)]
    save_json(printers, 'printers.json')
    if printer_id in printer_instances:
        printer_instances[printer_id].disconnect()
        del printer_instances[printer_id]
    return {"message": "Printer deleted successfully"}

@app.get("/printers/{printer_id}/status", response_model=PrinterStatus)
@limiter.limit("20/minute")
async def get_printer_status(printer_id: int, current_user: User = Depends(get_current_user)):
    """Endpoint to get the current status of a printer"""
    printer = get_printer_instance(printer_id)
    status = printer.get_state()
    hotend_temp = printer.get_nozzle_temperature() or 0
    bed_temp = printer.get_bed_temperature() or 0
    progress = printer.get_percentage() or 0
    time_remaining = printer.get_time() or "Unknown"
    
    return PrinterStatus(
        name=printer.name,
        status=status,
        hotend_temp=hotend_temp,
        bed_temp=bed_temp,
        print_progress=progress,
        time_remaining=str(time_remaining)
    )

@app.post("/printers/{printer_id}/start_print")
@limiter.limit("5/minute")
async def start_print(printer_id: int, filename: str, current_user: User = Depends(get_current_user)):
    """Endpoint to start a print job"""
    printer = get_printer_instance(printer_id)
    success = printer.start_print(filename, plate_number=1)
    if success:
        return {"message": "Print started successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to start print")

@app.post("/printers/{printer_id}/stop_print")
@limiter.limit("5/minute")
async def stop_print(printer_id: int, current_user: User = Depends(get_current_user)):
    """Endpoint to stop a print job"""
    printer = get_printer_instance(printer_id)
    success = printer.stop_print()
    if success:
        return {"message": "Print stopped successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to stop print")

@app.post("/printers/{printer_id}/pause_print")
@limiter.limit("5/minute")
async def pause_print(printer_id: int, current_user: User = Depends(get_current_user)):
    """Endpoint to pause a print job"""
    printer = get_printer_instance(printer_id)
    success = printer.pause_print()
    if success:
        return {"message": "Print paused successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to pause print")

@app.post("/printers/{printer_id}/resume_print")
@limiter.limit("5/minute")
async def resume_print(printer_id: int, current_user: User = Depends(get_current_user)):
    """Endpoint to resume a paused print job"""
    printer = get_printer_instance(printer_id)
    success = printer.resume_print()
    if success:
        return {"message": "Print resumed successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to resume print")

@app.get("/printers/{printer_id}/files", response_model=List[GcodeFile])
@limiter.limit("10/minute")
async def get_gcode_files(printer_id: int, current_user: User = Depends(get_current_user)):
    """Endpoint to list G-code files (placeholder implementation)"""
    # This is a placeholder. You'll need to implement file listing based on your storage method
    return [
        GcodeFile(filename="example1.gcode", size=1024),
        GcodeFile(filename="example2.gcode", size=2048)
    ]

@app.post("/printers/{printer_id}/upload_gcode")
@limiter.limit("5/minute")
async def upload_gcode(printer_id: int, file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    """Endpoint to upload a G-code file to a printer"""
    printer = get_printer_instance(printer_id)
    contents = await file.read()
    success = printer.upload_file(contents, filename=file.filename)
    if success:
        return {"message": "File uploaded successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to upload file")

@app.post("/printers/{printer_id}/set_temperature")
@limiter.limit("10/minute")
async def set_temperature(printer_id: int, hotend: int, bed: int, current_user: User = Depends(get_current_user)):
    """Endpoint to set the hotend and bed temperatures"""
    printer = get_printer_instance(printer_id)
    hotend_success = printer.set_nozzle_temperature(hotend)
    bed_success = printer.set_bed_temperature(bed)
    if hotend_success and bed_success:
        return {"message": "Temperature set successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to set temperature")

@app.post("/printers/{printer_id}/set_fan_speed")
@limiter.limit("10/minute")
async def set_fan_speed(printer_id: int, speed: int, current_user: User = Depends(get_current_user)):
    """Endpoint to set the fan speed"""
    printer = get_printer_instance(printer_id)
    success = printer.set_part_fan_speed(speed)
    if success:
        return {"message": "Fan speed set successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to set fan speed")

@app.get("/printers/{printer_id}/camera")
@limiter.limit("30/minute")
async def get_camera_frame(printer_id: int, current_user: User = Depends(get_current_user)):
    """Endpoint to get the current camera frame from a printer"""
    printer = get_printer_instance(printer_id)
    frame = printer.get_camera_frame()
    if frame:
        return {"frame": frame}
    else:
        raise HTTPException(status_code=500, detail="Failed to get camera frame")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)