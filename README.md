# Sentellent

**Sentellent** is an advanced intelligent agent designed to act as your personal **Chief of Staff**. It combines a modern React frontend with a powerful Flask-based backend, enabling agentic reasoning, long-term memory, and deep integration with Google Workspace (Gmail and Calendar).

---

## ✨ Overview

Sentellent helps you manage communication, schedules, and information through an AI-powered assistant that understands context, remembers preferences, and executes actions securely.

---

## 🚀 Key Features

* **Intelligent AI Agent**
  Built using **LangChain** and **LangGraph** for agentic workflows, contextual understanding, and complex task handling.

* **Google Workspace Integration**

  * **Gmail**: Read, compose, and send emails securely
  * **Google Calendar**: View and manage calendar events

* **Long-Term Memory**
  Persistent memory using **ChromaDB** to store preferences, constraints, and past interactions.

* **Document Analysis**
  Upload and analyze PDF and text files for summaries and insights.

* **Secure Authentication**
  Google OAuth 2.0 for secure login and session management.

* **Modern User Interface**
  Responsive dashboard built with **React** and **Tailwind CSS**.

---

## 🛠 Tech Stack

### Frontend (`/senti`)

* **Framework**: React (v19)
* **Styling**: Tailwind CSS
* **Routing**: React Router DOM
* **Icons**: Lucide React
* **HTTP Client**: Axios

### Backend (`/server`)

* **Server**: Flask
* **AI & Orchestration**: LangChain, LangGraph
* **Vector Memory**: ChromaDB
* **Authentication**: Google OAuth (OAuthLib)
* **Document Processing**: PyPDF

---

## 📦 Installation & Setup

### Prerequisites

* Node.js & npm
* Python 3.10+
* Google Cloud Console project with Gmail and Calendar APIs enabled

---

### 1️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd server
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `server` directory:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_REDIRECT_URIS=http://localhost:5000/auth/google/callback
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=sk-...
```

Run the backend server:

```bash
python application.py
```

Backend will be available at:

```
http://localhost:5000
```

---

### 2️⃣ Frontend Setup

Navigate to the frontend directory:

```bash
cd senti
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Frontend will be available at:

```
http://localhost:3000
```

---

## 🔧 Google OAuth Configuration

Ensure the following scopes are enabled in your Google Cloud project:

```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/gmail.compose
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/calendar.events
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/userinfo.email
openid
```

---

## 🧠 Architecture Highlights

* **Agentic Flow**: LangGraph orchestrates multi-step reasoning and tool usage
* **Memory Layer**: ChromaDB enables semantic recall and preference learning
* **Security**: OAuth-based access with scoped permissions
* **Scalable Design**: Frontend and backend decoupled for independent scaling

---

## 🤝 Contributing

Contributions are welcome and encouraged.

1. Fork the repository
2. Create your feature branch

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. Push to the branch

   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you find this project useful, consider starring the repository and sharing feedback to help improve Sentellent.
