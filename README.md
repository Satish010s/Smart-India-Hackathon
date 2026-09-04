# Quantum Learning Platform

An interactive platform for learning quantum computing and quantum algorithms, engineered with a modern multi-tier decoupled architecture.

---

## Architecture Overview

The platform is split into three decoupled services:

- **`client/`**: Modern web frontend built with **Next.js 14** (App Router) and **JavaScript**.
- **`server/`**: API gateway and business logic server built with **Node.js**, **Express**, and **Prisma ORM** (PostgreSQL).
- **`ai-engine/`**: High-performance AI assistant and quantum simulation service built with **FastAPI** and **Python 3.13**.

```
Quantum/
├── client/          # Next.js frontend
├── server/          # Express + Prisma backend
├── ai-engine/       # FastAPI AI & simulation service
├── docs/            # Platform documentation & design specs
├── .gitignore       # Root-level ignore rules
└── README.md
```

---

## Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js**: `v18.17.0` or higher (`v20+` recommended)
- **Python**: `3.11` or higher (`3.13` supported)
- **PostgreSQL**: A running local PostgreSQL instance or a free cloud database like [Neon](https://neon.tech/)

---

## Environment Variables Guide

Each service has its own `.env` configuration. Start by copying the example files in each directory:

```bash
# From the project root:
cp client/.env.example client/.env
cp server/.env.example server/.env
cp ai-engine/.env.example ai-engine/.env
```

### 1. Server Configuration (`server/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5001` | Port on which the Express server listens. |
| `NODE_ENV` | `development` | Runtime environment (`development` / `production`). |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string (e.g. Neon connection URL with `?sslmode=require`). |
| `AI_ENGINE_URL` | `http://localhost:8000` | URL for inter-service communication with the FastAPI engine. |

### 2. Client Configuration (`client/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port for the Next.js development server. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5001/api` | Public base URL for the Express backend API. |
| `NEXT_PUBLIC_AI_ENGINE_URL` | `http://localhost:8000` | Public URL for AI and simulation requests. |

### 3. AI Engine Configuration (`ai-engine/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `HOST` | `0.0.0.0` | Host IP for Uvicorn server to bind. |
| `PORT` | `8000` | Port for the FastAPI engine. |
| `ENVIRONMENT` | `development` | Application environment (`development` / `production`). |
| `CORS_ORIGINS` | `["http://localhost:3000","http://localhost:5001"]` | Allowed CORS origins for browser/client requests. |

---

## Running Locally

To run the full stack locally, open 3 terminal tabs (one for each service):

### Step 1: Start the Backend Server (Express + Prisma)

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Generate the Prisma Client and verify DB connection:
   ```bash
   npm run prisma:generate
   ```

3. Start the server with live reload:
   ```bash
   npm run dev
   ```
   *Runs at `http://localhost:5001`.*

---

### Step 2: Start the AI & Quantum Engine (FastAPI)

1. Navigate to the AI engine folder:
   ```bash
   cd ai-engine
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate

   # Windows (PowerShell):
   # .\venv\Scripts\Activate.ps1
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *Runs at `http://localhost:8000`.*

---

### Step 3: Start the Frontend Client (Next.js)

1. Navigate to the client folder and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *Runs at `http://localhost:3000`.*

---

## Service Endpoints & Verification

Once all three services are running, verify them in your browser:

| Service | Local URL | Health / Docs Check |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:3000` | Displays platform landing page |
| **Backend API Gateway** | `http://localhost:5001` | [`http://localhost:5001/api/health`](http://localhost:5001/api/health) |
| **AI & Simulation Engine** | `http://localhost:8000` | Interactive OpenAPI Docs: [`http://localhost:8000/docs`](http://localhost:8000/docs) <br> Health: [`http://localhost:8000/health`](http://localhost:8000/health) |
