import requests
import json
import sys

def test_server():
    base_url = "http://localhost:5000"
    
    # 1. Test Home Endpoint
    try:
        print("Testing GET / ...")
        resp = requests.get(f"{base_url}/")
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")
    except Exception as e:
        print(f"GET / failed: {e}")
        return

    # 2. Test Chat Endpoint
    print("\nTesting POST /chat ...")
    payload = {
        "message": "Hello, this is a test.",
        "user_id": "test_user"
    }
    
    try:
        resp = requests.post(f"{base_url}/chat", json=payload)
        print(f"Status: {resp.status_code}")
        try:
            print(f"Response: {resp.json()}")
        except:
            print(f"Response Text: {resp.text}")
    except Exception as e:
        print(f"POST /chat failed: {e}")

if __name__ == "__main__":
    test_server()
