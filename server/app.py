import os
import sys
import json
from flask import Flask, request, jsonify, redirect, session, url_for
from flask_cors import CORS
from langchain_core.messages import HumanMessage
import base64
import io
from pypdf import PdfReader
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
            
        user_input = data.get("message", "")
        file_data = data.get("file") # {name, type, data: base64}
        
        content_parts = []
        
        # 1. Handle User Text
        if user_input:
            content_parts.append({"type": "text", "text": user_input})
            
        # 2. Handle File Attachment
        if file_data:
            try:
                fname = file_data.get('name', 'file')
                ftype = file_data.get('type', '')
                b64_data = file_data.get('data', '')
                
                # Strip header if present
                if ',' in b64_data:
                    header, encoded = b64_data.split(',', 1)
                else:
                    encoded = b64_data
                    # Reconstruct header for OpenAI if missing but needed? 
                    # Actually OpenAI image_url needs the data URI scheme usually e.g. "data:image/jpeg;base64,..."
                    # If incoming data HAS header, we keep it for OpenAI URL, but strip it for decoding bytes.
                
                file_bytes = base64.b64decode(encoded)
                
                if ftype.startswith('image/'):
                     # Pass full data uri to LLM
                     content_parts.append({
                        "type": "image_url",
                        "image_url": {"url": b64_data}
                     })
                elif ftype == 'application/pdf':
                    reader = PdfReader(io.BytesIO(file_bytes))
                    pdf_text = ""
                    for page in reader.pages:
                        pdf_text += page.extract_text() + "\n"
                    content_parts.append({"type": "text", "text": f"\n\n[Attached PDF: {fname}]\n{pdf_text}"})
                elif ftype.startswith('text/'):
                    text_content = file_bytes.decode('utf-8')
                    content_parts.append({"type": "text", "text": f"\n\n[Attached File: {fname}]\n{text_content}"})
            except Exception as e:
                print(f"Error processing file: {e}")
                content_parts.append({"type": "text", "text": f"[System: Failed to process attached file {fname}: {str(e)}]"})

        if not content_parts:
             return jsonify({"error": "Empty message"}), 400

        # Use authenticated user email if available
        user_info = get_current_user_info()
        user_id = user_info.get('email') if user_info else "demo_user"

        response = agent.invoke(
            {"messages": [HumanMessage(content=content_parts)], "user_id": user_id},
            config={"configurable": {"thread_id": user_id}}
        )
        
        last_msg = response["messages"][-1]
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
