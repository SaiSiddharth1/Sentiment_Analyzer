import sys
import os

# Add the backend directory to the path so pytest can find modules (main, schemas, etc.)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
