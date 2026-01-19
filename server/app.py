import os
import sys
import json
from flask import Flask, request, jsonify, redirect, session, url_for
from flask_cors import CORS
from langchain_core.messages import HumanMessage
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# Ensure we can import from lang directory
from lang.agent import agent, get_all_memories

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app, supports_credentials=True)

# Google Auth Configuration
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'openid'
]

# When running locally, allow HTTP for OAuth
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

@app.route('/')
def home():
    return jsonify({"message": "Sentellent Agent API Running"})

@app.route('/auth/google')
def login():
    flow = Flow.from_client_secrets_file(
        'credentials.json',
        scopes=SCOPES,
        redirect_uri=url_for('callback', _external=True)
    )
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    session['state'] = state
    return redirect(authorization_url)

@app.route('/auth/google/callback')
def callback():
    try:
        state = session['state']
        flow = Flow.from_client_secrets_file(
            'credentials.json',
            scopes=SCOPES,
            state=state,
            redirect_uri=url_for('callback', _external=True)
        )
        
        authorization_response = request.url
        flow.fetch_token(authorization_response=authorization_response)
        
        credentials = flow.credentials
        
        with open('token.json', 'w') as token:
            token.write(credentials.to_json())
            
        return redirect("http://localhost:3000/dashboard?auth=success")
        
    except Exception as e:
        return f"Authentication failed: {e}", 400

def get_google_service(service_name, version):
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        return build(service_name, version, credentials=creds)
    return None

def get_current_user_info():
    service = get_google_service('oauth2', 'v2')
    if service:
        try:
            return service.userinfo().get().execute()
        except:
            return None
    return None

@app.route('/me')
def get_current_user():
    user_info = get_current_user_info()
    if user_info:
        return jsonify({
            "name": user_info.get('name'),
            "email": user_info.get('email'),
            "picture": user_info.get('picture')
        })
    return jsonify({"error": "Not logged in"}), 401

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400
            
        user_input = data.get("message")
        
        # Determine User ID from authenticated session
        user_info = get_current_user_info()
        user_id = user_info.get('email') if user_info else "demo_user"
        
        if not user_input:
            return jsonify({"error": "Message field is required"}), 400

        if user_input.lower().startswith("email:"):
            content = user_input[6:].strip()
            user_input = f"Incoming Data (Email): {content}"

        result = agent.invoke(
            {"user_id": user_id, "messages": [HumanMessage(content=user_input)]},
            config={"configurable": {"thread_id": user_id}}
        )
        
        last_msg = result["messages"][-1]
        response_text = last_msg.content
        
        return jsonify({
            "response": response_text,
            "user_id": user_id
        })

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/logout')
def logout():
    session.clear()
    if os.path.exists('token.json'):
         os.remove('token.json')
    return jsonify({"message": "Logged out successfully"})

@app.route('/memory', methods=['GET'])
def get_memory():
    # Use authenticated user email if available
    user_info = get_current_user_info()
    if not user_info:
        return jsonify({"memories": []})
        
    user_id = user_info.get('email')
    memories = get_all_memories(user_id)
    return jsonify({"memories": memories})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
