import os
import base64
import datetime
import uuid
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

# ChromaDB imports
import chromadb
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

load_dotenv(override=True)

# Debug: Print API key to verify it's loaded
api_key = os.getenv('OPENAI_API_KEY')
print(f"[DEBUG] Loaded API Key: {api_key[:20]}..." if api_key else "[DEBUG] No API key found!")

# ==========================================
# 0. PERSISTENCE SETUP (ChromaDB)
# ==========================================
# Initialize ChromaDB in persistence directory
PERSIST_DIRECTORY = os.path.join(os.getcwd(), "db")
chroma_client = chromadb.PersistentClient(path=PERSIST_DIRECTORY)

# Initialize Embedding Function (OpenAI)
embedding_function = OpenAIEmbeddings(model="text-embedding-3-small", api_key=api_key)

# Create or Get Collection
collection_name = "user_memory"
db = Chroma(
    client=chroma_client,
    collection_name=collection_name,
    embedding_function=embedding_function,
)

# ==========================================
# 1. STATE & MEMORY FUNCTIONS
# ==========================================

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_id: str
    memory: List[str]

def store_memory_to_db(user_id: str, content: str, source: str = "chat"):
    """Stores a memory snippet into ChromaDB."""
    memory_id = str(uuid.uuid4())
    db.add_texts(
        texts=[content],
        metadatas=[{"user_id": user_id, "source": source, "timestamp": datetime.datetime.now().isoformat()}],
        ids=[memory_id]
    )
    print(f"[Memory] Stored: {content}")

def retrieve_memory_from_db(user_id: str, query: str = "", k: int = 5):
    """Retrieves relevant memories for a user."""
    search_query = query if query else "user preferences and facts"
    try:
        docs = db.similarity_search(
            search_query,
            k=k,
            filter={"user_id": user_id}
        )
        return [doc.page_content for doc in docs]
    except Exception as e:
        print(f"[ERROR] Memory retrieval failed: {e}")
        return []

def get_all_memories(user_id: str):
    """Fetches all memories for a user (manual fetch via client)."""
    # Helper to get raw data for frontend
    try:
        col = chroma_client.get_collection(collection_name)
        results = col.get(where={"user_id": user_id})
        memories = []
        if results and results['documents']:
            for i, doc in enumerate(results['documents']):
                meta = results['metadatas'][i]
                memories.append({
                    "id": results['ids'][i],
                    "content": doc,
                    "time": meta.get("timestamp", "Unknown"),
                    "type": "memory"
                })
        return memories
    except Exception as e:
        print(f"Error fetching all memories: {e}")
        return []

# Re-export for app.py to use
USER_MEMORY = {} # Deprecated, kept for interface compat if needed, but we use get_all_memories now

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
            # Server-side flow usually handled by app.py now
            pass 
    return creds

def get_services():
    creds = authenticate_google()
    if not creds: return None, None
    return build('gmail', 'v1', credentials=creds), build('calendar', 'v3', credentials=creds)

@tool
def read_inbox(count: int = 5):
    """Reads the latest unread emails from the inbox."""
    service, _ = get_services()
    if not service: return "Authentication required."
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
def search_emails(query: str, count: int = 5):
    """Searches emails. Query examples: 'from:john', 'subject:meeting', 'is:unread'."""
    service, _ = get_services()
    if not service: return "Authentication required."
    results = service.users().messages().list(userId='me', q=query, maxResults=count).execute()
    messages = results.get('messages', [])
    if not messages: return "No matching emails found."
    
    summary = []
    for msg in messages:
        try:
            txt = service.users().messages().get(userId='me', id=msg['id']).execute()
            headers = txt['payload']['headers']
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), "No Subject")
            sender = next((h['value'] for h in headers if h['name'] == 'From'), "Unknown")
            summary.append(f"From: {sender} | Subject: {subject} | Snippet: {txt.get('snippet', '')}")
        except:
            continue
    return "\n".join(summary)

@tool
def send_email(to: str, subject: str, body: str):
    """Sends an email to the specified recipient."""
    service, _ = get_services()
    if not service: return "Authentication required."
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
    """Lists upcoming calendar events with IDs."""
    _, service = get_services()
    if not service: return "Authentication required."
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    events_result = service.events().list(calendarId='primary', timeMin=now, maxResults=count, singleEvents=True, orderBy='startTime').execute()
    events = events_result.get('items', [])
    if not events: return "No events found."
    return "\n".join([f"[ID: {e['id']}] {e['start'].get('dateTime', e['start'].get('date'))}: {e['summary']}" for e in events])

@tool
def delete_calendar_event(event_id: str):
    """Deletes a calendar event by its ID."""
    _, service = get_services()
    if not service: return "Authentication required."
    try:
        service.events().delete(calendarId='primary', eventId=event_id).execute()
        return f"Event {event_id} deleted."
    except Exception as e:
        return f"Error deleting event: {e}"

@tool
def create_calendar_event(summary: str, start_time: str, end_time: str, description: str = ""):
    """Creates a calendar event.
    start_time and end_time must be ISO 8601 strings (e.g., '2024-01-20T10:00:00').
    IMPORTANT: Provide the full date and time.
    """
    _, service = get_services()
    if not service: return "Authentication required."
    
    event_body = {
        'summary': summary,
        'description': description,
        'start': {'dateTime': start_time},
        'end': {'dateTime': end_time},
    }
    try:
        e = service.events().insert(calendarId='primary', body=event_body).execute()
        return f"Event created: {e.get('htmlLink')}"
    except Exception as e:
        return f"Error creating event: {e}"

# ==========================================
# 3. GRAPH LOGIC
# ==========================================

tools = [read_inbox, send_email, search_emails, list_calendar_events, create_calendar_event, delete_calendar_event]
# Switch to a different model (gpt-4o-mini) which may have separate quota limits
llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key).bind_tools(tools)

def agent_node(state: AgentState):
    # Retrieve relevant memories from Vector Store
    user_id = state["user_id"]
    last_message = state["messages"][-1].content if state["messages"] else ""
    
    # Handle multimodal content (list of dicts)
    if isinstance(last_message, list):
         text_parts = [block.get("text", "") for block in last_message if block.get("type") == "text"]
         last_message = " ".join(text_parts)
    
    # Retrieve memories relevant to the current context
    memories = retrieve_memory_from_db(user_id, query=last_message)
    memory_str = "\n".join(memories) if memories else "No relevant memories found."
    
    current_time = datetime.datetime.now().astimezone().isoformat()
    system_prompt = f"You are a Chief of Staff AI.\nCurrent DateTime: {current_time}\nRelevant Memories:\n{memory_str}\n\nUse these memories and current time to personalize your response and actions."
    
    messages = [SystemMessage(content=system_prompt)] + state["messages"]
    try:
        response_msg = llm.invoke(messages)
        # If the model returned an empty message (no content and no tool calls), treat it as a failure
        has_content = getattr(response_msg, "content", None)
        has_tool_calls = getattr(response_msg, "tool_calls", None)
        if not has_content and not has_tool_calls:
            raise ValueError("Empty response from LLM")
    except Exception as e:
        # Log the error and provide a graceful fallback with non‑empty content
        print(f"[ERROR] OpenAI request failed: {e}")
        response_msg = AIMessage(content="⚠️ The AI service is currently unavailable (quota exceeded). Please try again later.")
    return {"messages": [response_msg]}

def update_memory_node(state: AgentState):
    if not state["messages"]: return {}
    last_msg = state["messages"][-1]
    content = last_msg.content if isinstance(last_msg, (HumanMessage, ToolMessage)) else ""
    if not content: return {}

    extractor = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)
    prompt = f"Extract important personal preferences, facts, or tasks from this text: '{content}'.\nReturn ONLY the fact/preference as a concise sentence. If nothing worth remembering, return 'None'."
    try:
        extraction = extractor.invoke(prompt).content
        if "None" not in extraction:
            # Store in Vector DB
            store_memory_to_db(state["user_id"], extraction, source="conversation_insight")
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
