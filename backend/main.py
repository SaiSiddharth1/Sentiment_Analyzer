from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from schemas import MessageRequest, EmotionResponse, RewriteResponse
from emotion_model import emotion_detector
from rewriter import message_rewriter
import speech_service
import os
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models on startup to optimize first request
    logger.info("Starting up and loading ML models...")
    try:
        emotion_detector.load_model()
        message_rewriter.load_model()
    except Exception as e:
        logger.error(f"Failed to load models during startup: {e}")
    yield
    # Clean up on shutdown
    logger.info("Shutting down...")

app = FastAPI(title="Sentiment-Based Message Formatter API", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Sentiment-Based Message Formatter API is running"}

@app.post("/detect-emotion", response_model=EmotionResponse)
async def detect_emotion(request: MessageRequest):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
            
        emotion = emotion_detector.detect_emotion(request.text)
        return EmotionResponse(emotion=emotion)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error detecting emotion: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during emotion detection")

@app.post("/rewrite-message", response_model=RewriteResponse)
async def rewrite_message(request: MessageRequest):
    try:
        if not request.text.strip() and not (request.scenario and request.scenario.strip()):
            raise HTTPException(status_code=400, detail="Text or scenario must be provided")
            
        emotion = emotion_detector.detect_emotion(request.text) if request.text.strip() else "Neutral"
        
        target_emotion = request.target_emotion if request.target_emotion else emotion
        
        rewritten_text = message_rewriter.rewrite_message(
            request.text, 
            target_emotion=target_emotion,
            format_tone=request.format,
            scenario=request.scenario
        )
        
        return RewriteResponse(
            original_message=request.text,
            detected_emotion=emotion,
            rewritten_message=rewritten_text
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error rewriting message: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during message rewriting")

def remove_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        logger.error(f"Error removing temp file {path}: {e}")

@app.post("/speak")
async def speak_message(request: MessageRequest, background_tasks: BackgroundTasks):
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
            
        audio_path = speech_service.generate_speech(request.text)
        
        # We add a background task to delete the file after response is sent
        background_tasks.add_task(remove_file, audio_path)
        
        return FileResponse(
            audio_path, 
            media_type="audio/mpeg", 
            filename="speech.mp3"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating speech: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during speech generation")

