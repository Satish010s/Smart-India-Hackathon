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
flowchart TB
    subgraph ClientTier ["Presentation Layer (client/ - Next.js 14 @ :3000)"]
        UI_Learner["Learner Portal\n(Dashboard, Canvas, Courses, Quizzes)"]
        UI_Instructor["Instructor Studio\n(Curriculum, Challenges, Analytics)"]
        UI_Admin["Admin Console\n(RBAC, Moderation, System Health)"]
        UI_Agentic["Quantum Agent Studio\n(Self-Healing Coder, Visualizer, RAG)"]
        ZustandAuth["Zustand Auth Store\n(State, Role, Profile)"]
        FetchClient["Universal Fetch Client\n(Auto Silent Refresh, HttpOnly)"]
    end

    subgraph GatewayTier ["Backend API Gateway (server/ - Express + Prisma @ :5001)"]
        AuthMiddleware["Auth & RBAC Guards\n(Argon2id, Access JWT, Refresh Family)"]
        AuthRouter["/api/auth\n(Login, Signup, OTP, Token Rotation)"]
        LearnerRouter["/api/learner\n(Progress, Badges, XP, Goals)"]
        InstructorRouter["/api/instructor\n(Course CRUD, Challenge Grading)"]
        AdminRouter["/api/admin\n(Governance, Audit Logs, Settings)"]
        SimRouter["/api/experiments & simulations\n(Circuit persistence, Metrics)"]
        PrismaClient["Prisma ORM (6.4.1)"]
    end

    subgraph AIClassicTier ["Generative AI Engine (ai-engine/ - FastAPI @ :8000)"]
        FastAPI_AI["FastAPI Server"]
        TutorChat["Quantum Tutor Service\n(Context Grounding: General, Playground, Debug)"]
        VideoStoryboard["Storyboard Generator\n(Slide scenes, Voice scripts, Quiz hooks)"]
        GoogleGenAI["Google Gemini 2.5/1.5 Flash SDK"]
        SQLAlchemyEngine["SQLAlchemy Direct DB Writer"]
    end

    subgraph AgenticTier ["Autonomous Agentic Engine (agentic-engine/ - FastAPI @ :8001)"]
        FastAPI_Agentic["FastAPI Server"]
        Guardrail["Input Guardrail (core/guardrails.py)\n(Zero-LLM Hard Rejection)"]
        Supervisor["Supervisor Router (LangGraph)\n(Intent Classification & State Machine)"]
        
        subgraph MultiAgentCore ["Multi-Agent Specialist Team"]
            TeachingAgent["Teaching Agent\n(Conceptual Pedagogical RAG)"]
            CodingAgent["Coding Agent (Self-Healing Loop)\n(Qiskit / Cirq Generation & Debug <= 5 iters)"]
            AssessorAgent["Assessment Agent\n(Adaptive MCQs & Misconception Diagnosis)"]
            ResearchAgent["Research / Paper Agent\n(PDF Ingestion & Section-level RAG)"]
        end

        Sandbox["Execution Sandbox\n(Subprocess Runner, Timeout = 15s)"]
        Visualizer["Matplotlib Base64 Visualizer\n(Bloch Sphere, State Probabilities, Circuit)"]
        MCPClient["Model Context Protocol (MCP) Client\n(Qiskit MCP Servers via Stdio)"]
        VectorStore["Quantum Vector Store\n(Textbook RAG & Paper Embeddings)"]
        TavilySearch["Tavily Live Web Search API"]
    end

    subgraph DataStorage ["Data & External Persistence Layer"]
        Postgres["PostgreSQL (Neon Serverless DB with Pooling)\n(Users, Auth, LMS, Gamification, Circuits, Chat History)"]
        ResendAPI["Resend Email Service\n(OTP Verification & Password Reset)"]
        GeminiAPI["Google Gemini LLM Cloud"]
    end

    %% Client Interactions
    UI_Learner & UI_Instructor & UI_Admin --> ZustandAuth
    ZustandAuth --> FetchClient
    FetchClient -- "REST / Cookies (JWT)" --> GatewayTier
    UI_Learner -- "REST / Storyboard & Tutor" --> FastAPI_AI
    UI_Agentic -- "REST / Autonomous Multi-Agent Loop" --> FastAPI_Agentic

    %% Gateway to Data
    AuthRouter & LearnerRouter & InstructorRouter & AdminRouter & SimRouter --> PrismaClient
    PrismaClient --> Postgres
    AuthRouter -- "Transactional Emails" --> ResendAPI

    %% AI Engine Interactions
    FastAPI_AI --> TutorChat & VideoStoryboard
    TutorChat & VideoStoryboard --> GoogleGenAI
    GoogleGenAI --> GeminiAPI
    FastAPI_AI --> SQLAlchemyEngine
    SQLAlchemyEngine --> Postgres

    %% Agentic Engine Interactions
    FastAPI_Agentic --> Guardrail
    Guardrail -- "Pass" --> Supervisor
    Supervisor --> MultiAgentCore
    TeachingAgent --> VectorStore & TavilySearch
    CodingAgent <--> Sandbox
    CodingAgent <--> MCPClient
    Sandbox --> Visualizer
    ResearchAgent --> VectorStore
    AssessorAgent --> MultiAgentCore
    MultiAgentCore --> GeminiAPI
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
