import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_core.messages import HumanMessage

# Ensure we can import from lang directory
# Assuming app.py is in server/ and agent.py is in server/lang/
# We can import directly if server is the running dir
from lang.agent import agent

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Sentellent Agent API Running"})

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

        # Data ingestion logic from app_ai.py
        if user_input.lower().startswith("email:"):
            content = user_input[6:].strip()
            user_input = f"Incoming Data (Email): {content}"

        # Invoke the LangGraph agent
        # We use user_id as thread_id for conversation persistence in MemorySaver
        result = agent.invoke(
            {"user_id": user_id, "messages": [HumanMessage(content=user_input)]},
            config={"configurable": {"thread_id": user_id}}
        )
        
        # Extract the last message content
        last_msg = result["messages"][-1]
        response_text = last_msg.content
        
        return jsonify({
            "response": response_text,
            "user_id": user_id
        })

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on port 5000
    app.run(debug=True, port=5000)
