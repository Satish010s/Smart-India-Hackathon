import json
import os
import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import AiChatHistory, AiGeneratedVideo
from app.core.config import settings

# System prompt for conversational quantum tutoring
TUTOR_SYSTEM_PROMPT = """You are the Quantum AI Tutor, an elite quantum computing pedagogue, quantum physicist, and Qiskit expert educator.

Your Mission:
Help learners master quantum computing—from basic qubits to advanced algorithms like Grover, Shor, and VQE—with clarity, mathematical intuition, and practical code.

Pedagogical Guidelines:
1. Intuition First: Explain physical concepts using accessible analogies (e.g. spinning coin vs flat coin for superposition; correlated dice for entanglement; noise channels for decoherence).
2. Mathematical Precision: Use standard Dirac bra-ket notation (|0⟩, |1⟩, |+⟩, |-⟩, |ψ⟩ = α|0⟩ + β|1⟩), unitary matrices (H, X, Y, Z, CNOT, S, T), and inner/outer products where appropriate.
3. Working Code: Provide executable, modern Python Qiskit code examples whenever code is requested or helps clarify a concept.
4. Active Learning: Conclude your responses with 1-2 thought-provoking follow-up questions, conceptual check-ins, or mini-challenges.
5. Structure & Formatting: Use clean Markdown headers, bullet points, bolding for key terms, and language-tagged code blocks.
"""

# System prompt for structured video storyboard generation
VIDEO_SYSTEM_PROMPT = """You are an award-winning scientific video director, 3Blue1Brown-style animator, and master quantum computing educator.
Your task is to produce a structured, broadcast-quality educational video script and visual storyboard on the user's requested topic.

Return ONLY a valid JSON object matching the exact schema below (no markdown fences, no preamble):
{
  "title": "Compelling, catchy video title",
  "topic": "The exact topic name",
  "level": "Beginner | Intermediate | Advanced",
  "totalDurationSeconds": 90,
  "summary": "1-2 sentence overview of what the viewer will understand after watching",
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene Title",
      "durationSeconds": 15,
      "narration": "Full spoken voiceover script in an engaging, crystal-clear, conversational teacher voice...",
      "visualType": "bloch_sphere" | "circuit" | "comparison" | "matrix" | "wave" | "code",
      "visualData": {
        "headline": "Short title on screen",
        "subheadline": "Subtitle or core formula",
        "equation": "|ψ⟩ = α|0⟩ + β|1⟩",
        "points": ["Key bullet point 1", "Key bullet point 2", "Key bullet point 3"],
        "blochSphere": { "theta": 1.57, "phi": 0, "stateLabel": "|+⟩ state" },
        "circuit": {
          "qubits": 2,
          "gates": [
            { "qubit": 0, "gate": "H", "step": 1 },
            { "qubit": 0, "target": 1, "gate": "CNOT", "step": 2 }
          ]
        },
        "probabilities": [
          { "state": "|00⟩", "prob": 0.5 },
          { "state": "|11⟩", "prob": 0.5 }
        ],
        "codeSnippet": "from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)"
      },
      "keyTakeaway": "Bottom banner highlight phrase",
      "accentColor": "cyan" | "violet" | "emerald" | "amber" | "rose"
    }
  ],
  "quizQuestion": {
    "question": "A quick check-in question based on this video",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct"
  }
}

Ensure the narration is timed to the duration, rich with clear explanations, and directly matches the visual elements described. Generate between 4 to 6 engaging scenes."""


def get_gemini_client(user_key: Optional[str] = None):
    """Instantiate Google Gen AI client if key is available."""
    api_key = (user_key or settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")).strip()
    if not api_key:
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Google GenAI client: {e}")
        return None


async def chat_with_tutor(
    message: str,
    context: str = "general",
    history: Optional[List[Dict[str, str]]] = None,
    user_api_key: Optional[str] = None,
    db: Optional[Session] = None,
    user_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Generate conversational tutor response."""
    client = get_gemini_client(user_api_key)

    if not client:
        fallback = generate_fallback_chat(message, context)
        if db and user_id:
            db.add(AiChatHistory(userId=user_id, message=message, context=context, reply=fallback["reply"], source="fallback"))
            db.commit()
        return fallback

    try:
        context_prompt = (
            "Focus specifically on clean Python Qiskit implementation and code debugging."
            if context == "code"
            else "Focus on circuit diagram design, gate decompositions, and quantum hardware topologies."
            if context == "circuit"
            else "Focus on deep intuitive analogies, physical foundations, and state vector transformations."
            if context == "concept"
            else "Provide a balanced explanation combining intuition, math, and practical quantum computing examples."
        )

        system_instruction = f"{TUTOR_SYSTEM_PROMPT}\n\nCurrent Mode: {context_prompt}"

        # Build contents from history
        contents = []
        if history:
            for turn in history[-8:]:
                contents.append({
                    "role": "user" if turn.get("role") == "user" else "model",
                    "parts": [{"text": turn.get("content", "")}],
                })
        contents.append({"role": "user", "parts": [{"text": message}]})

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=contents,
            config={
                "system_instruction": system_instruction,
                "temperature": 0.7,
                "max_output_tokens": 1500,
            },
        )

        reply_text = response.text or ""
        if reply_text:
            if db and user_id:
                db.add(AiChatHistory(userId=user_id, message=message, context=context, reply=reply_text, source="gemini"))
                db.commit()
            return {"reply": reply_text, "source": "gemini"}

        fallback = generate_fallback_chat(message, context)
        if db and user_id:
            db.add(AiChatHistory(userId=user_id, message=message, context=context, reply=fallback["reply"], source="fallback"))
            db.commit()
        return fallback
    except Exception as e:
        print(f"Gemini API error in Python ai-engine: {e}")
        fallback = generate_fallback_chat(message, context)
        if db and user_id:
            db.add(AiChatHistory(userId=user_id, message=message, context=context, reply=fallback["reply"], source="fallback"))
            db.commit()
        return fallback


async def generate_explanation_video(
    topic: str,
    level: str = "Beginner",
    duration: str = "standard",
    user_api_key: Optional[str] = None,
    db: Optional[Session] = None,
    user_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Generate structured educational video storyboard."""
    client = get_gemini_client(user_api_key)

    if not client:
        fallback = generate_fallback_video(topic, level)
        if db and user_id:
            db.add(AiGeneratedVideo(userId=user_id, topic=topic, level=level, duration=duration, videoData=fallback["data"], source="fallback"))
            db.commit()
        return fallback

    try:
        prompt = (
            f"Generate an interactive explanation video on the topic: '{topic}'. "
            f"Target audience level: {level}. "
            f"Desired video format: {duration} (~4 to 6 scenes). "
            f"Strictly adhere to the JSON schema."
        )

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[{"role": "user", "parts": [{"text": prompt}]}],
            config={
                "system_instruction": VIDEO_SYSTEM_PROMPT,
                "response_mime_type": "application/json",
                "temperature": 0.6,
            },
        )

        raw_text = (response.text or "").strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        video_data = json.loads(raw_text)
        if db and user_id:
            db.add(AiGeneratedVideo(userId=user_id, topic=topic, level=level, duration=duration, videoData=video_data, source="gemini"))
            db.commit()
        return {"success": True, "source": "gemini", "data": video_data}
    except Exception as e:
        print(f"Gemini video generation error in Python ai-engine: {e}")
        fallback = generate_fallback_video(topic, level)
        if db and user_id:
            db.add(AiGeneratedVideo(userId=user_id, topic=topic, level=level, duration=duration, videoData=fallback["data"], source="fallback"))
            db.commit()
        return fallback


def generate_fallback_chat(query: str, context: str) -> Dict[str, Any]:
    q = (query or "").lower()

    if "superposition" in q or "hadamard" in q:
        reply = (
            "### Understanding Quantum Superposition 🌀\n\n"
            "In classical computing, a bit is strictly **0** or **1** (like a light switch). In quantum computing, a **qubit** can exist in a linear combination of both states simultaneously until measured.\n\n"
            "#### Mathematical Foundation:\n"
            "$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$\n"
            "Where $\\alpha$ and $\\beta$ are complex probability amplitudes satisfying:\n"
            "$$|\\alpha|^2 + |\\beta|^2 = 1$$\n\n"
            "When you apply a **Hadamard (H) Gate** to the ground state $|0\\rangle$:\n"
            "$$H|0\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) = |+\\rangle$$\n"
            "This creates an exact $50\\%$ probability of measuring $0$ and $50\\%$ of measuring $1$.\n\n"
            "```python\n"
            "from qiskit import QuantumCircuit\n"
            "from qiskit.quantum_info import Statevector\n\n"
            "qc = QuantumCircuit(1)\n"
            "qc.h(0)  # Put qubit 0 into superposition\n"
            "psi = Statevector(qc)\n"
            "print('State vector:', psi)\n"
            "```\n\n"
            "**Question for you**: What do you think happens if you apply *two* Hadamard gates in a row to $|0\\rangle$?"
        )
    elif "entanglement" in q or "bell state" in q or "cnot" in q:
        reply = (
            "### Quantum Entanglement & Bell States 🔔\n\n"
            "Quantum entanglement is a phenomenon where two or more qubits become correlated in such a way that the quantum state of each qubit cannot be described independently of the others, regardless of the distance separating them.\n\n"
            "#### Creating the Canonical Bell State $|\\Phi^+\\rangle$:\n"
            "1. Apply **Hadamard** to qubit 0 $\\rightarrow \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle) \\otimes |0\\rangle$\n"
            "2. Apply **CNOT** with control on qubit 0 and target on qubit 1:\n"
            "$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$\n\n"
            "```python\n"
            "from qiskit import QuantumCircuit\n"
            "qc = QuantumCircuit(2, 2)\n"
            "qc.h(0)        # Superposition on qubit 0\n"
            "qc.cx(0, 1)    # Entangle qubit 0 with qubit 1\n"
            "qc.measure([0, 1], [0, 1])\n"
            "print(qc.draw(output='text'))\n"
            "```\n\n"
            "If you measure qubit 0 and observe **0**, qubit 1 instantaneously collapses to **0** with 100% certainty."
        )
    else:
        reply = (
            f"### Quantum Insight: {query[:50]}...\n\n"
            "Quantum computing leverages the fundamental principles of **superposition**, **interference**, and **entanglement** to explore computational state spaces that are exponentially intractable for classical supercomputers.\n\n"
            "#### Core Concept Breakdown:\n"
            "- **State Representation**: Rather than binary bits, information is stored in Hilbert spaces as vector states $|\\psi\\rangle$.\n"
            "- **Reversibility**: All quantum gates (except measurement) are unitary transformations ($U^\\dagger U = I$), preserving quantum information without heat dissipation.\n"
            "- **Interference**: Destructive interference cancels erroneous answer paths while constructive interference amplifies the correct solution.\n\n"
            "```python\n"
            "from qiskit import QuantumCircuit\n"
            "qc = QuantumCircuit(2)\n"
            "qc.h(0)\n"
            "qc.cx(0, 1)\n"
            "print(qc.draw(output='text'))\n"
            "```\n\n"
            "How would you like to explore this further?"
        )

    return {"reply": reply, "source": "fallback"}


def generate_fallback_video(topic: str, level: str) -> Dict[str, Any]:
    safe_topic = topic or "Quantum Superposition & Qubit States"
    return {
        "success": True,
        "source": "fallback",
        "data": {
            "title": f"{safe_topic}: Intuitive Masterclass",
            "topic": safe_topic,
            "level": level or "Beginner",
            "totalDurationSeconds": 90,
            "summary": f"A visual, step-by-step masterclass explaining {safe_topic} using Bloch spheres, circuit animations, and probability distributions.",
            "scenes": [
                {
                    "sceneNumber": 1,
                    "title": "The Classical vs Quantum Divide",
                    "durationSeconds": 15,
                    "narration": "Welcome to this quantum masterclass. In everyday computing, information is binary—a transistor is either on or off, representing a 0 or 1. But in the subatomic realm, nature operates under completely different rules. Here, we encounter the qubit.",
                    "visualType": "comparison",
                    "visualData": {
                        "headline": "Classical Bit vs Quantum Qubit",
                        "subheadline": "From Binary Switches to State Vectors",
                        "equation": "|0⟩ and |1⟩ → |ψ⟩ = α|0⟩ + β|1⟩",
                        "points": [
                            "Classical bits are deterministic: strictly 0 or 1",
                            "Qubits exist in a continuum of superposition states",
                            "Measurement collapses the state probabilistically",
                        ],
                        "probabilities": [
                            {"state": "Bit 0", "prob": 1.0},
                            {"state": "Bit 1", "prob": 0.0},
                        ],
                    },
                    "keyTakeaway": "Qubits represent continuous geometric states, not just discrete binary switches.",
                    "accentColor": "cyan",
                },
                {
                    "sceneNumber": 2,
                    "title": "Visualizing with the Bloch Sphere",
                    "durationSeconds": 18,
                    "narration": "To truly visualize a qubit, physicists use the Bloch Sphere. The north pole represents the pure state 0, and the south pole represents the pure state 1. Any point on the surface of this sphere is a valid, distinct quantum superposition state.",
                    "visualType": "bloch_sphere",
                    "visualData": {
                        "headline": "The Bloch Sphere Representation",
                        "subheadline": "Geometric visualization of single-qubit quantum states",
                        "equation": "|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩",
                        "points": [
                            "North Pole = |0⟩ state",
                            "South Pole = |1⟩ state",
                            "Equator = Equal superposition states |+⟩ and |-⟩",
                        ],
                        "blochSphere": {"theta": 1.57, "phi": 0, "stateLabel": "|+⟩ = (|0⟩ + |1⟩)/√2"},
                    },
                    "keyTakeaway": "The Bloch Sphere maps probability amplitudes and phases onto a 3D unit sphere.",
                    "accentColor": "violet",
                },
                {
                    "sceneNumber": 3,
                    "title": "Creating Superposition: The Hadamard Gate",
                    "durationSeconds": 18,
                    "narration": "How do we enter superposition? We apply a quantum gate called the Hadamard gate. Starting from the ground state zero, the Hadamard gate rotates the qubit 90 degrees around the Y axis, then 180 degrees around the X axis, landing directly on the equator.",
                    "visualType": "circuit",
                    "visualData": {
                        "headline": "The Hadamard (H) Gate",
                        "subheadline": "Unitary transformation into equal superposition",
                        "equation": "H = (1/√2) [[1, 1], [1, -1]]",
                        "points": [
                            "Transforms basis states: H|0⟩ = |+⟩, H|1⟩ = |-⟩",
                            "Creates exactly 50% probability for |0⟩ and 50% for |1⟩",
                            "Hadamard is its own inverse: H · H = I",
                        ],
                        "circuit": {
                            "qubits": 1,
                            "gates": [{"qubit": 0, "gate": "H", "step": 1}],
                        },
                        "probabilities": [
                            {"state": "|0⟩", "prob": 0.5},
                            {"state": "|1⟩", "prob": 0.5},
                        ],
                    },
                    "keyTakeaway": "The Hadamard gate creates quantum superposition with balanced probability amplitudes.",
                    "accentColor": "cyan",
                },
                {
                    "sceneNumber": 4,
                    "title": "Entanglement & Multi-Qubit Correlation",
                    "durationSeconds": 20,
                    "narration": "When we combine superposition with two-qubit interaction through a Controlled-NOT gate, we unlock quantum entanglement. The two qubits become inextricably linked. Measuring one instantaneously determines the outcome of the other, no matter how far apart they are.",
                    "visualType": "circuit",
                    "visualData": {
                        "headline": "Bell State Generation",
                        "subheadline": "Superposition + CNOT = Maximum Entanglement",
                        "equation": "|Φ+⟩ = (|00⟩ + |11⟩)/√2",
                        "points": [
                            "Qubit 0 controls the flipping of Qubit 1",
                            "Neither qubit has an independent state",
                            "Foundation for quantum teleportation and cryptography",
                        ],
                        "circuit": {
                            "qubits": 2,
                            "gates": [
                                {"qubit": 0, "gate": "H", "step": 1},
                                {"qubit": 0, "target": 1, "gate": "CNOT", "step": 2},
                            ],
                        },
                        "probabilities": [
                            {"state": "|00⟩", "prob": 0.5},
                            {"state": "|01⟩", "prob": 0.0},
                            {"state": "|10⟩", "prob": 0.0},
                            {"state": "|11⟩", "prob": 0.5},
                        ],
                    },
                    "keyTakeaway": "Entanglement produces non-classical correlations impossible in classical physics.",
                    "accentColor": "emerald",
                },
                {
                    "sceneNumber": 5,
                    "title": "Real-World Python Implementation",
                    "durationSeconds": 19,
                    "narration": "You can write and run this circuit today using IBM Qiskit. In just four lines of code, we initialize two qubits, apply the Hadamard and CNOT gates, and extract the state vector or measure the outcomes on a real superconducting quantum processor.",
                    "visualType": "code",
                    "visualData": {
                        "headline": "Qiskit Python Code",
                        "subheadline": "Running on IBM Quantum Cloud",
                        "equation": "qc.draw() → Quantum Circuit",
                        "points": [
                            "qc.h(0): Create superposition on wire 0",
                            "qc.cx(0, 1): Entangle wire 0 with wire 1",
                            "Run with Statevector or AerSimulator",
                        ],
                        "codeSnippet": "from qiskit import QuantumCircuit\nfrom qiskit_aer import AerSimulator\n\n# 1. Create Bell State circuit\nqc = QuantumCircuit(2, 2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure([0, 1], [0, 1])\n\n# 2. Simulate\nsim = AerSimulator()\ncounts = sim.run(qc, shots=1024).result().get_counts()\nprint(counts)  # {'00': ~512, '11': ~512}",
                    },
                    "keyTakeaway": "Quantum code is concise, expressive, and directly maps to physical microwave pulses.",
                    "accentColor": "amber",
                },
            ],
            "quizQuestion": {
                "question": "After applying a Hadamard gate to |0⟩, what is the probability of measuring the qubit in state |1⟩?",
                "options": ["0%", "50%", "100%", "25%"],
                "correctIndex": 1,
                "explanation": "The Hadamard gate transforms |0⟩ into (|0⟩ + |1⟩)/√2. The probability of measuring |1⟩ is |1/√2|² = 1/2 = 50%.",
            },
        },
    }
