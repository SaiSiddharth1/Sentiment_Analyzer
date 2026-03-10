import pytest
from fastapi.testclient import TestClient
from main import app

# Create a test client
client = TestClient(app)

# Note: Since the models are loaded during the FastAPI `lifespan` event,
# we need to trigger it manually using the TestClient with a context manager hook,
# or we can mock it here if we just want to test API logic. 
# For true integration testing with models, use:

@pytest.fixture(scope="module")
def test_client():
    with TestClient(app) as c:
        yield c

class TestEmotionDetection:
    def test_detect_normal_sentence(self, test_client):
        response = test_client.post("/detect-emotion", json={"text": "I had a fine day at work today."})
        assert response.status_code == 200
        data = response.json()
        assert "emotion" in data
        assert data["emotion"] in ["neutral", "joy", "surprise", "sadness", "fear", "anger"]
        # depending on the model output, it usually detects neutral or joy

    def test_detect_angry_sentence(self, test_client):
        response = test_client.post("/detect-emotion", json={"text": "Why didn't you finish the work on time?!"})
        assert response.status_code == 200
        data = response.json()
        assert "emotion" in data
        assert data["emotion"] == "anger"

    def test_detect_empty_input(self, test_client):
        response = test_client.post("/detect-emotion", json={"text": ""})
        assert response.status_code == 400
        assert response.json() == {"detail": "Text cannot be empty"}
        
    def test_detect_missing_field(self, test_client):
        response = test_client.post("/detect-emotion", json={})
        assert response.status_code == 422 # FastAPI validation error

class TestMessageRewriting:
    def test_rewrite_normal_sentence(self, test_client):
        original_text = "I think we should schedule a meeting for tomorrow."
        response = test_client.post("/rewrite-message", json={"text": original_text})
        assert response.status_code == 200
        data = response.json()
        
        # If it's neutral, it should return the original text directly according to your rewriter logic
        if data["detected_emotion"] in ["neutral", "joy"]:
            assert data["rewritten_message"] == original_text
            
    def test_rewrite_angry_sentence(self, test_client):
        original_text = "This is completely ridiculous and you ruined the project!"
        response = test_client.post("/rewrite-message", json={"text": original_text})
        assert response.status_code == 200
        data = response.json()
        assert data["detected_emotion"] == "anger"
        assert len(data["rewritten_message"]) > 0
        assert original_text != data["rewritten_message"]

    def test_rewrite_empty_input(self, test_client):
        response = test_client.post("/rewrite-message", json={"text": "   "})
        assert response.status_code == 400
        assert response.json() == {"detail": "Text cannot be empty"}
