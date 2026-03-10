from transformers import pipeline
import logging

logger = logging.getLogger(__name__)

class EmotionDetector:
    def __init__(self):
        self.model_name = "j-hartmann/emotion-english-distilroberta-base"
        self.classifier = None

    def load_model(self):
        if self.classifier is None:
            logger.info(f"Loading emotion model: {self.model_name}")
            try:
                # Use pipeline for text classification
                self.classifier = pipeline("text-classification", model=self.model_name, top_k=1, framework="pt")
                logger.info("Emotion model loaded successfully.")
            except Exception as e:
                logger.error(f"Error loading emotion model: {e}")
                raise e

    def detect_emotion(self, text: str) -> str:
        if self.classifier is None:
            self.load_model()
        
        # Get top 3 emotions to capture mixed sentiments
        results = self.classifier(text, top_k=3)
        
        if isinstance(results[0], list):
            predictions = results[0]
        else:
            predictions = results
        
        # Filter emotions with a confidence score above a threshold (e.g., 0.25)
        threshold = 0.25
        significant_emotions = [p['label'].capitalize() for p in predictions if p['score'] >= threshold]
        
        # If no emotion passes the threshold (unlikely but possible), just return the top 1
        if not significant_emotions:
            significant_emotions = [predictions[0]['label'].capitalize()]
            
        return ", ".join(significant_emotions)

emotion_detector = EmotionDetector()
