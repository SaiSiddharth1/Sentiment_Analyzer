from rewriter import message_rewriter
import logging

logging.basicConfig(level=logging.INFO)

test_cases = [
    ("Why didn't you finish the work on time?", "anger"),
    ("This is a terrible idea.", "disgust"),
    ("I hate this project.", "anger")
]

try:
    print("Testing message rewriting...")
    for text, emotion in test_cases:
        print(f"\n--- Original ({emotion}): {text}")
        rewritten = message_rewriter.rewrite_message(text, emotion)
        print(f"--- Rewritten: {rewritten}")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
