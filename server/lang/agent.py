import os
import base64
import datetime
from typing import TypedDict, List, Annotated
from email.message import EmailMessage

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage, AIMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

load_dotenv()

# ==========================================
# 1. STATE & MEMORY
# ==========================================

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_id: str
    memory: List[str]

# Simple in-memory storage
USER_MEMORY = {}

def store_memory(user_id: str, key: str, value: str):
    if user_id not in USER_MEMORY:
        USER_MEMORY[user_id] = []
    USER_MEMORY[user_id].append(f"{key.upper()}: {value}")

def retrieve_memory(user_id: str):
    return USER_MEMORY.get(user_id, [])

# ==========================================
# 2. GOOGLE AUTH & TOOLS
# ==========================================

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
]

def authenticate_google():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists('credentials.json'):
                raise FileNotFoundError("credentials.json not found.")
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def get_services():
    creds = authenticate_google()
    return build('gmail', 'v1', credentials=creds), build('calendar', 'v3', credentials=creds)

@tool
def read_inbox(count: int = 5):
    """Reads the latest unread emails from the inbox."""
    service, _ = get_services()
    results = service.users().messages().list(userId='me', labelIds=['INBOX', 'UNREAD'], maxResults=count).execute()
    messages = results.get('messages', [])
    if not messages: return "No unread messages found."
    
    summary = []
    for msg in messages:
        txt = service.users().messages().get(userId='me', id=msg['id']).execute()
        headers = txt['payload']['headers']
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), "No Subject")
        sender = next((h['value'] for h in headers if h['name'] == 'From'), "Unknown")
        summary.append(f"From: {sender} | Subject: {subject} | Snippet: {txt.get('snippet', '')}")
    return "\n".join(summary)

@tool
def send_email(to: str, subject: str, body: str):
    """Sends an email to the specified recipient."""
    service, _ = get_services()
    message = EmailMessage()
    message.set_content(body)
    message['To'], message['From'], message['Subject'] = to, 'me', subject
    encoded = base64.urlsafe_b64encode(message.as_bytes()).decode()
    try:
        service.users().messages().send(userId='me', body={'raw': encoded}).execute()
        return f"Email sent to {to}"
    except Exception as e:
        return f"Error: {str(e)}"

@tool
def list_calendar_events(count: int = 5):
    """Lists upcoming calendar events."""
    _, service = get_services()
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    events_result = service.events().list(calendarId='primary', timeMin=now, maxResults=count, singleEvents=True, orderBy='startTime').execute()
    events = events_result.get('items', [])
    if not events: return "No events found."
    return "\n".join([f"{e['start'].get('dateTime', e['start'].get('date'))}: {e['summary']}" for e in events])

# ==========================================
# 3. GRAPH LOGIC
# ==========================================

tools = [read_inbox, send_email, list_calendar_events]
llm = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)

def agent_node(state: AgentState):
    memories = retrieve_memory(state["user_id"])
    memory_str = "\n".join(memories) if memories else "No relevant memories."
    system_prompt = f"You are a Chief of Staff AI.\nUser Memory:\n{memory_str}\nUse memory to personalize responses."
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    return {"messages": [llm.invoke(messages)]}

def update_memory_node(state: AgentState):
    if not state["messages"]: return {}
    last_msg = state["messages"][-1]
    content = last_msg.content if isinstance(last_msg, (HumanMessage, ToolMessage)) else ""
    if not content: return {}

    extractor = ChatOpenAI(model="gpt-4o-mini")
    prompt = f"Extract preferences/facts from: {content}\nReturn ONLY 'KEY: Value'. 'None' if nothing."
    try:
        extraction = extractor.invoke(prompt).content
        if "None" not in extraction:
            for line in extraction.split('\n'):
                if ":" in line:
                    k, v = line.split(":", 1)
                    store_memory(state["user_id"], k.strip(), v.strip())
    except: pass
    return {}

def should_continue(state: AgentState):
    return "tools" if state["messages"][-1].tool_calls else END

# Compile Graph
workflow = StateGraph(AgentState)
workflow.add_node("agent", agent_node)
workflow.add_node("tools", ToolNode(tools))
workflow.add_node("update_memory", update_memory_node)

workflow.set_entry_point("update_memory")
workflow.add_edge("update_memory", "agent")
workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
workflow.add_edge("tools", "update_memory")

agent = workflow.compile(checkpointer=MemorySaver())
