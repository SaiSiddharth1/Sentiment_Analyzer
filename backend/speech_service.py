import io
from gtts import gTTS
import tempfile
import os

def generate_speech(text: str) -> str:
    # generate speech and save to a temporary file
    tts = gTTS(text=text, lang='en')
    # Because FastAPI StreamingResponse with gTTS in-memory io stream is sometimes tricky 
    # and requires handling async generator, saving to a temp file and using FileResponse is easier and reliable.
    
    # We create a secure temporary file that won't be deleted immediately if we just close it
    fd, temp_path = tempfile.mkstemp(suffix=".mp3")
    os.close(fd)
    
    tts.save(temp_path)
    return temp_path
