import os
import sys
import json
from flask import Flask, request, jsonify, redirect, session, url_for
from flask_cors import CORS
from langchain_core.messages import HumanMessage
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials

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
        
        # Manually fetch the token since we are in a REST API context
        # Flask's request.url might be http but Google sends https sometimes behind proxies
        # For local dev, http is fine.
        authorization_response = request.url
        flow.fetch_token(authorization_response=authorization_response)
        
        credentials = flow.credentials
        
        # Save credentials to token.json for the agent to use
        # In a multi-user app, store this in a DB keyed by user_id
        with open('token.json', 'w') as token:
            token.write(credentials.to_json())
            
        return redirect("http://localhost:3000/dashboard?auth=success")
        
    except Exception as e:
        return f"Authentication failed: {e}", 400

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400
            
        user_input = data.get("message")
        user_id = data.get("user_id", "demo_user")
        
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
    # Optional: Clear server-side token if single-user mode
    if os.path.exists('token.json'):
         os.remove('token.json')
    return jsonify({"message": "Logged out successfully"})

@app.route('/memory', methods=['GET'])
def get_memory():
    user_id = request.args.get("user_id", "demo_user")
    memories = get_all_memories(user_id)
    return jsonify({"memories": memories})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
