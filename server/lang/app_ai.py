from langchain_core.messages import HumanMessage
from agent import agent

USER_ID = "demo_user"

print("LangGraph Agent Running. Type 'exit' to quit.\n")

while True:
    raw_input = input("You (prefix 'email:' for data): ")
    if raw_input.lower() == "exit":
        break
    
    user_input = raw_input
    
    # If it's an email, format it so the agent knows it's data
    if raw_input.lower().startswith("email:"):
        content = raw_input[6:].strip()
        user_input = f"Incoming Data (Email): {content}"

    result = agent.invoke(
        {"user_id": USER_ID, "messages": [HumanMessage(content=user_input)]},
        config={"configurable": {"thread_id": "1"}}
    )

    # Get the last message
    last_msg = result["messages"][-1]
    print("Agent:", last_msg.content)
