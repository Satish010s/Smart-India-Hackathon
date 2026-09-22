# Quantum Learning Platform — System Architecture Design

## 1. Executive Summary

The **Quantum Learning Platform** is a distributed, cloud-ready educational and research ecosystem designed to bridge theoretical quantum computing, interactive simulation, autonomous AI-assisted learning, and laboratory experimentation.

The platform is structured into four decoupled, specialized tiers:
1. **Presentation & Interactive Client (`client/` — Next.js 14 App Router on `:3000`)**
2. **Core API Gateway & LMS Backend (`server/` — Express + Prisma on `:5001`)**
3. **Generative AI & Multimedia Storyboard Service (`ai-engine/` — FastAPI on `:8000`)**
4. **Autonomous Multi-Agent Quantum Execution Engine (`agentic-engine/` — LangGraph + MCP on `:8001`)**

Data persistence is consolidated via **PostgreSQL (Neon DB)** with SSL connection pooling, alongside a vector database index for quantum literature RAG.

---

## 2. High-Level System Architecture Diagram

```mermaid
flowchart TD
    %% Styling Classes
    classDef client fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef gateway fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef ai fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef agentic fill:#4a044e,stroke:#f472b6,stroke-width:2px,color:#f8fafc;
    classDef sandbox fill:#451a03,stroke:#fb923c,stroke-width:2px,color:#f8fafc;
    classDef data fill:#1e293b,stroke:#94a3b8,stroke-width:2px,stroke-dasharray: 4 4,color:#f8fafc;

    %% 1. PRESENTATION TIER
    subgraph TIER1 ["1. Presentation Layer (client/ — Next.js 14 App Router @ Port 3000)"]
        direction LR
        UI_LEARNER["Learner Studio & Circuit Canvas"]:::client
        UI_INSTRUCTOR["Instructor Authoring & Grading"]:::client
        UI_ADMIN["Admin Governance & Audit"]:::client
        UI_STUDIO["Quantum Agent Studio"]:::client
    end

    %% 2. GATEWAY TIER
    subgraph TIER2 ["2. API Gateway & LMS Core (server/ — Express.js + Prisma @ Port 5001)"]
        direction LR
        AUTH_CORE["Auth & RBAC Core\n(Argon2id · JWT Token Family Rotation)"]:::gateway
        LMS_CORE["LMS Curriculum Engine\n(Courses · Modules · Quizzes · Challenges)"]:::gateway
        EXP_CORE["Experiment & Simulation Hub\n(Saved Circuits · Run Telemetry)"]:::gateway
    end

    %% 3. INTELLIGENCE TIER
    subgraph TIER3 ["3. AI & Multi-Agent Intelligence Services"]
        direction LR
        subgraph AI_BOX ["ai-engine (FastAPI @ Port 8000)"]
            TUTOR_API["Context-Grounded Tutor\n(Playground · Debug · Theory)"]:::ai
            STORY_API["Video Storyboard Generator\n(Scenes · Narration · Quizzes)"]:::ai
        end
        subgraph AGENT_BOX ["agentic-engine (LangGraph + FastAPI @ Port 8001)"]
            GUARD_API["Input Guardrail\n(Deterministic Filter)"]:::agentic
            SUPER_API["Supervisor Coordinator\n(Intent Classifier)"]:::agentic
            SQUAD_API["Specialist Agent Squad\n(Teacher · Coder · Assessor · Researcher)"]:::agentic
        end
    end

    %% 4. EXECUTION & TOOLING TIER
    subgraph TIER4 ["4. Execution Sandbox & Hardware Tooling"]
        direction LR
        SANDBOX["Quantum Subprocess Sandbox\n(15s Limit · Agg Headless Plots)"]:::sandbox
        MCP_SERVERS["Qiskit MCP Tool Servers\n(Documentation & Circuit Tools)"]:::sandbox
        SIMULATORS["Quantum Simulation Backends\n(Qiskit Aer · Cirq · PennyLane)"]:::sandbox
    end

    %% 5. PERSISTENCE TIER
    subgraph TIER5 ["5. Persistence & Cloud Infrastructure Layer"]
        direction LR
        DB_POSTGRES[("PostgreSQL Database (Neon Serverless)\n(Users · Auth Tokens · LMS · Experiments · Chat History)")]:::data
        CLOUD_GEMINI["Google Gemini Cloud LLM\n(gemini-2.5-flash)"]:::data
        CLOUD_RESEND["Resend Email Service\n(Transactional OTP)"]:::data
    end

    %% CLEAN VERTICAL CONNECTORS
    TIER1 ==>|"HTTPS / Credentials Include (HttpOnly Cookie)"| TIER2
    TIER1 -->|"REST API / Video Storyboards"| AI_BOX
    TIER1 -->|"REST API / Multi-Agent Studio Workflows"| AGENT_BOX

    TIER2 ==>|"Prisma ORM (Connection Pool)"| DB_POSTGRES
    TIER2 -->|"Transactional OTP Emails"| CLOUD_RESEND

    AI_BOX -->|"Direct SQLAlchemy Sync"| DB_POSTGRES
    AI_BOX -->|"Prompt Engineering"| CLOUD_GEMINI

    AGENT_BOX -->|"Reasoning & Synthesis"| CLOUD_GEMINI
    AGENT_BOX ==>|"Subprocess Execution"| SANDBOX
    AGENT_BOX -->|"Stdio JSON-RPC"| MCP_SERVERS
    SANDBOX ==>|"Statevector / Counts"| SIMULATORS
```

---

## 3. Subsystem Deep-Dive

### 3.1. Frontend Architecture (`client/`)
- **Framework**: Next.js 14 App Router with React 18, Tailwind CSS, Lucide icons (`react-icons/lu`), and Zustand.
- **Role Portals**:
  - **Learner**: `/dashboard`, `/learn` (courses/modules), `/playground` (interactive drag-and-drop circuit canvas & live transpiler), `/challenges` (quantum code challenges), `/ai-tutor` (Quantum Agent Studio), `/progress` & `/profile`.
  - **Instructor**: `/instructor` (curriculum authoring, quiz/challenge builder, automated submission grading queue, student analytics).
  - **Admin**: `/admin` (user lifecycle management, role elevation, moderation, backend diagnostics, platform audit logs).
- **Session Transport & Token Lifecycle**:
  - HttpOnly cookie transport via `credentials: 'include'`.
  - `apiFetch` wrapper handles transparent 401 interception: whenever an access token expires, it silently requests `/api/auth/refresh`, deduplicating parallel refreshes via a single active promise before replaying failed requests.

---

### 3.2. Backend API Gateway (`server/`)
- **Runtime**: Node.js in strict ES Modules mode (`"type": "module"`).
- **Core Responsibilities**:
  - **Authentication & Security**: Argon2id hashing for passwords and OTP codes; JWT signing for short-lived access tokens (15m) and persistent refresh tokens (7d).
  - **Token Rotation & Replay Protection**: Refresh tokens are grouped by `familyId`. If a revoked or previously used token is presented, the entire family is revoked, neutralizing token theft.
  - **Role-Based Access Control (RBAC)**: Enforced through `authenticateUser` and `authorizeRoles('LEARNER', 'INSTRUCTOR', 'ADMIN')` middleware.
  - **LMS Engine**: Courses, modules, interactive lessons, starter code distribution, and challenge submissions.
  - **Gamification Subsystem**: XP accrual, level computation, daily challenge streak counters, and badge unlocks.
  - **Experiment Persistence**: Manages `Experiment` and `SimulationRun` records capturing circuit JSON, noise profiles, shot counts, execution times, depth, gate counts, and statevectors.

---

### 3.3. AI Engine (`ai-engine/`)
- **Runtime**: FastAPI with Python 3.11+, Uvicorn ASGI server on port `8000`.
- **LLM Integration**: Google GenAI SDK (`gemini-2.5-flash` with graceful fallback to `gemini-1.5-flash`).
- **Capabilities**:
  - **Context-Grounded Tutor**: Handles pedagogical quantum queries tailored to active workspace contexts (`general`, `playground`, `debugging`, `algorithm`).
  - **Automated Video Storyboard Generator**: Converts quantum computing topics into full multimedia lesson blueprints containing slide-by-slide visual layout specs, script narration, visual prompt cues, and embedded checkpoints.
  - **Direct Telemetry Persistence**: Uses SQLAlchemy to write directly to the shared PostgreSQL schema (`AiChatHistory`, `AiGeneratedVideo`).

---

### 3.4. Agentic Quantum Engine (`agentic-engine/`)
- **Runtime**: FastAPI + LangGraph state machine on port `8001`.
- **Closed-Loop Paradigm**:
  $$\text{Input Guardrail} \rightarrow \text{Supervisor} \rightarrow \text{Code/Teach/Research} \rightarrow \text{Execution Sandbox} \rightarrow \text{Self-Healing Debugger} \rightarrow \text{Assessment}$$

```mermaid
stateDiagram-v2
    [*] --> GuardrailCheck
    GuardrailCheck --> Rejected: Off-topic query detected
    Rejected --> [*]
    
    GuardrailCheck --> Supervisor: Quantum/Math/Physics validated
    Supervisor --> TeachingAgent: Concept Explanation
    Supervisor --> CodingAgent: Quantum Circuit Request
    Supervisor --> ResearchAgent: Paper Analysis / Extraction
    Supervisor --> AssessmentAgent: Student Knowledge Check
    
    TeachingAgent --> RAGRetrieval
    RAGRetrieval --> LLMReasoning
    
    CodingAgent --> MCP_Or_Template: Generate Qiskit / Cirq
    MCP_Or_Template --> ExecutionSandbox: Execute Subprocess
    
    state ExecutionSandbox {
        [*] --> RunCode
        RunCode --> Success: Exit Code 0
        RunCode --> Error: Traceback / Timeout
    }
    
    Error --> SelfHealingLoop: Iteration < 5
    SelfHealingLoop --> CodingAgent: Refine & Fix Code
    
    Success --> MatplotlibVisualizer: Generate Plots
    MatplotlibVisualizer --> AssessmentAgent: Generate Concept MCQ
    AssessmentAgent --> FinalResponse: Return State & Visuals
    FinalResponse --> [*]
```

- **Specialized Agent Roster**:
  1. **Input Guardrail** (`core/guardrails.py`): Zero-LLM deterministic filter blocking non-quantum inquiries (weather, sports, politics) with zero latency and zero token burn.
  2. **Supervisor** (`agents/supervisor.py`): LangGraph coordinator evaluating user intent, student proficiency (`Beginner`, `Intermediate`, `Advanced`), and dynamic task routing.
  3. **Teaching Agent** (`agents/teacher.py`): Grounded explanations leveraging local vector search and live Tavily web search.
  4. **Coding Agent with Self-Healing Loop** (`agents/coder.py`): Emits executable Qiskit or Cirq Python code, executes it in a sandboxed subprocess (`EXECUTION_TIMEOUT_SECONDS=15`), inspects `stderr`, and autonomously refines code up to `MAX_DEBUG_ITERATIONS=5`.
  5. **Assessment Agent** (`agents/assessor.py`): Diagnoses conceptual traps and misconceptions based on student MCQ interactions.
  6. **Research Agent** (`agents/researcher.py`): Ingests PDF research papers using `pypdf`, builds section embeddings, and synthesizes circuit implementations from published literature.
- **Model Context Protocol (MCP)**: Communicates with local Qiskit MCP servers via stdio for direct circuit manipulation, quantum volume benchmarks, and API documentation lookup.

---

## 4. Comprehensive Database Entity Relationship Model

```mermaid
erDiagram
    User ||--o{ RefreshToken : has
    User ||--o{ Otp : receives
    User ||--o| LearnerProfile : owns
    User ||--o{ DailyGoal : tracks
    User ||--o{ UserBadge : earns
    Badge ||--o{ UserBadge : awards
    User ||--o{ Course : creates
    User ||--o{ Enrollment : participates
    User ||--o{ Submission : submits
    User ||--o{ Experiment : designs
    User ||--o{ SimulationRun : runs
    User ||--o{ SavedCircuit : saves
    User ||--o{ AiChatHistory : records
    User ||--o{ AiGeneratedVideo : generates

    Course ||--o{ Module : contains
    Module ||--o{ Lesson : contains
    Course ||--o{ Quiz : includes
    Course ||--o{ Challenge : includes
    Course ||--o{ Enrollment : enrolls
    
    Quiz ||--o{ Submission : grades
    Challenge ||--o{ Submission : tests
    Experiment ||--o{ SimulationRun : executes

    User {
        string id PK
        string email UK
        string name
        string passwordHash
        enum role "LEARNER | INSTRUCTOR | ADMIN"
        boolean isEmailVerified
        boolean isSuspended
        datetime createdAt
    }

    LearnerProfile {
        string id PK
        string userId FK
        int xp
        int level
        int streak
        int longestStreak
        float learningHours
        int rank
    }

    Experiment {
        string id PK
        string userId FK
        string name
        json circuit
        string circuitCode
        string backend
        string framework
        json noiseConfig
        enum status "DRAFT | QUEUED | RUNNING | COMPLETED | FAILED"
    }

    SimulationRun {
        string id PK
        string userId FK
        string experimentId FK
        string backend
        int shots
        json results
        int depth
        int gateCount
        float fidelity
        int executionTimeMs
    }

    Course {
        string id PK
        string instructorId FK
        string title
        string slug UK
        enum level "BEGINNER | INTERMEDIATE | ADVANCED"
        boolean isPublished
    }
```

---

## 5. Security Architecture & Threat Mitigation

| Threat Vector | Mitigation Strategy Implemented | Subsystem |
| :--- | :--- | :--- |
| **Credential Theft & Replay** | Argon2id hashing; HttpOnly SameSite cookies; short-lived access JWT (15m). | `server/` |
| **Refresh Token Interception** | Token family rotation (`familyId`). Reuse of an already-consumed token invalidates the entire token family immediately. | `server/` |
| **Privilege Escalation** | Two-tier RBAC guards at Express router level (`authorizeRoles`) and Next.js client guards (`ProtectedRoute`). | `server/` & `client/` |
| **Prompt Injection / Jailbreaks** | Hard short-circuit Input Guardrail rejecting off-topic prompts *prior* to LLM invocation. | `agentic-engine/` |
| **Arbitrary Code Execution in Agent Sandbox** | Subprocess execution with hard 15-second timeouts, resource bounds, dedicated output buffers, and restricted imports. | `agentic-engine/` |
| **DDoS & Brute Force** | Rate limiting (`express-rate-limit`) on sensitive auth and OTP endpoints; OTP attempt counters (max 5). | `server/` |

---

## 6. Network Topology & Ports

```
                          [ Internet / Browser ]
                                     |
               +---------------------+---------------------+
               | (Port 3000)                               | (Port 3000)
      [ Next.js Client ]                                  [ Next.js Client ]
               |                                                   |
      HTTP / Cookies (:5001)                           HTTP REST (:8000 & :8001)
               v                                                   v
      [ Express API Gateway ]                    +-----------------+-----------------+
               |                                 |                                   |
         (Prisma ORM)                      [ ai-engine :8000 ]             [ agentic-engine :8001 ]
               |                                 |                                   |
               |                                 | (Direct DB Sync)                  | (Subprocess / Stdio)
               v                                 v                                   v
    [ PostgreSQL (Neon DB) ] <-------------------+                         [ Qiskit MCP Servers & Sandbox ]
```

---

## 7. Operational Workflow Matrix

1. **Learner Experimentation Flow**:
   User creates circuit in Next.js Drag-and-Drop Canvas $\rightarrow$ Client sends simulation request to Express `:5001` $\rightarrow$ Simulation run is recorded in PostgreSQL $\rightarrow$ Circuit transpiles to Qiskit Aer / PennyLane / Cirq $\rightarrow$ Results (Bloch vectors, probabilities, gate counts) returned to UI.
2. **Autonomous Agentic Troubleshooting Flow**:
   User encounters an algorithm bug $\rightarrow$ Agent Studio triggers `:8001/api/v1/agentic/chat` $\rightarrow$ Guardrail passes $\rightarrow$ Supervisor identifies debugging intent $\rightarrow$ Coding Agent initiates execution loop $\rightarrow$ Sandboxed runner detects runtime error $\rightarrow$ Agent self-heals up to 5 times $\rightarrow$ Output plot and statevector visual rendered as base64 and returned with diagnostic MCQ.
3. **Multimedia Video Storyboard Generation**:
   User requests interactive video summary $\rightarrow$ Client triggers `:8000/api/v1/ai/tutor/generate-video` $\rightarrow$ AI Engine queries Gemini with structured schema $\rightarrow$ Generates multi-scene JSON containing narration, slide graphics, and interactive checkpoint $\rightarrow$ Storyboard recorded in PostgreSQL and streamed to user.
