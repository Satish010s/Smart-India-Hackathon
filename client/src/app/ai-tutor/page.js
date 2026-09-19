"use client";

import React, { useState, useRef, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { LearnerSidebar } from '../../components/sidebar';
import DashboardNavbar from '../../components/navbar/DashboardNavbar';
import QuantumVideoPlayer from '../../components/learner/ai/QuantumVideoPlayer';
import { apiFetch } from '../../services/api';
import {
  LuBot, LuSend, LuSparkles, LuBookOpen, LuCpu, LuCode,
  LuFlaskConical, LuUser, LuZap, LuRefreshCw, LuThumbsUp,
  LuThumbsDown, LuCopy, LuCheck, LuBrain, LuMessageSquare,
  LuVideo, LuKey, LuSettings, LuPlay, LuExternalLink, LuX,
  LuShieldAlert, LuActivity, LuFileText, LuUpload, LuCircleCheck,
  LuTriangleAlert, LuChevronDown, LuChevronRight, LuCompass,
  LuTarget, LuAward, LuHistory, LuPlus, LuTrash2,
} from 'react-icons/lu';

const AGENTIC_API_URL = process.env.NEXT_PUBLIC_AGENTIC_ENGINE_URL || 'http://localhost:8001';
const LEGACY_AI_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:8000';
const AGENTIC_PORT_LABEL = (AGENTIC_API_URL.match(/:(\d+)/) || [])[1] || '8001';

const SUGGESTIONS = [
  { label: 'Bell state circuit', query: 'make a simple qiskit circut and excute it' },
  { label: 'Superposition concept', query: 'Explain quantum superposition with Dirac notation and a physical analogy' },
  { label: 'Quiz me', query: 'Quiz me on quantum gates, superposition, and entanglement' },
  { label: 'Cirq GHZ simulation', query: 'Simulate a 3-qubit GHZ state in Cirq and print measurement distribution' },
  { label: 'Test guardrail', query: 'What is the weather forecast for tomorrow in Tokyo?' },
];

const VIDEO_PRESETS = [
  { topic: '3D Bloch Sphere & Qubit State Geometry', desc: 'Visualizing single-qubit states, poles, and rotation gates', level: 'Beginner' },
  { topic: 'Quantum Superposition & The Hadamard Gate', desc: 'From classical bits to probability amplitudes and wave interference', level: 'Beginner' },
  { topic: 'Bell State Entanglement & EPR Paradox', desc: 'Two-qubit non-local correlations and CNOT entanglement', level: 'Intermediate' },
  { topic: "Grover's Search Algorithm & Amplitude Amplification", desc: 'Quadratic speedup, oracles, and the inversion about the mean', level: 'Intermediate' },
  { topic: 'Quantum Teleportation Protocol', desc: 'Transmitting quantum states using classical bits and entanglement', level: 'Advanced' },
];

const INITIAL_MESSAGES = [
  {
    id: 'ai-0',
    role: 'ai',
    agent: 'supervisor',
    content: (
      "Welcome to the Quantum Agent Studio.\n\n"
      + "I coordinate a team of autonomous quantum agents to guide your learning:\n"
      + "- **Teaching agent**: conceptual rigor, textbook RAG, and live Tavily research.\n"
      + "- **Coding agent**: Qiskit & Cirq circuit generation with a 5-iteration self-healing execution loop and Matplotlib plots.\n"
      + "- **Assessment agent**: topic-specific adaptive questions and mastery gap analysis.\n"
      + "- **Research agent**: academic paper breakdown and circuit implementation.\n"
      + "- **Quantum guardrail**: keeps the session inside the quantum domain.\n\n"
      + "What quantum topic or circuit would you like to explore today?"
    ),
    thought_log: [
      { agent: 'Supervisor Agent', action: 'System Initialized', detail: 'Agent team ready with Qiskit & Cirq sandboxes.' }
    ],
    timestamp: new Date(),
  },
];

/* ==========================================================================
   CHAT SESSION PERSISTENCE (client-side history: localStorage)
   ========================================================================== */
const SESSIONS_STORAGE_KEY = 'qm_ai_tutor_sessions_v1';

function loadSessionsFromStorage() {
  try {
    const raw = window.localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSessionsToStorage(sessions) {
  try {
    window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Storage unavailable or quota exceeded - chat still works in-memory for this tab.
  }
}

function makeSessionTitle(messages) {
  const firstUser = (messages || []).find(m => m.role === 'user');
  if (!firstUser || !firstUser.content) return 'New chat';
  const text = firstUser.content.trim();
  return text.length > 42 ? `${text.slice(0, 42)}…` : text;
}

function createEmptySession() {
  const now = new Date().toISOString();
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: 'New chat',
    messages: INITIAL_MESSAGES,
    activePlots: [],
    activeCode: '',
    codeFramework: 'qiskit',
    executionHistory: [],
    activeAssessment: null,
    createdAt: now,
    updatedAt: now,
  };
}

/* ==========================================================================
   LIGHTWEIGHT MARKDOWN -> HTML RENDERER
   Handles headings, bold/italic/inline-code, fenced code blocks, and
   ordered/unordered lists so agent responses render as real HTML instead of
   raw asterisks/hashes. No external markdown library dependency.
   ========================================================================== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInline(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code class="qm-inline-code">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  return s;
}

function renderMarkdown(rawText) {
  const text = rawText || '';
  const codeBlocks = [];
  const withPlaceholders = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_match, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: (lang || 'text').trim(), code: code.replace(/\n$/, '') });
    return `@@QM_CODEBLOCK_${idx}@@`;
  });

  const blocks = withPlaceholders.split(/\n{2,}/);

  const html = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';

    const codeMatch = trimmed.match(/^@@QM_CODEBLOCK_(\d+)@@$/);
    if (codeMatch) {
      const { lang, code } = codeBlocks[Number(codeMatch[1])];
      return (
        `<div class="qm-codeblock">`
        + `<div class="qm-codeblock-lang">${escapeHtml(lang)}</div>`
        + `<pre><code>${escapeHtml(code)}</code></pre>`
        + `</div>`
      );
    }

    const lines = trimmed.split('\n');

    if (lines.length === 1) {
      const headingMatch = lines[0].match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        const tag = ['h5', 'h4', 'h4', 'h5'][headingMatch[1].length - 1] || 'h5';
        return `<${tag} class="qm-heading">${renderInline(headingMatch[2])}</${tag}>`;
      }
    }

    const isUnordered = lines.every(l => /^\s*[-*]\s+/.test(l));
    if (isUnordered) {
      const items = lines.map(l => `<li>${renderInline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('');
      return `<ul class="qm-list">${items}</ul>`;
    }

    const isOrdered = lines.every(l => /^\s*\d+[.)]\s+/.test(l));
    if (isOrdered) {
      const items = lines.map(l => `<li>${renderInline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('');
      return `<ol class="qm-list qm-list-ol">${items}</ol>`;
    }

    return `<p class="qm-paragraph">${lines.map(renderInline).join('<br/>')}</p>`;
  }).join('');

  return html;
}

export default function AITutorPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Studio workspace tab
  const [workspaceTab, setWorkspaceTab] = useState('viz');

  // Chat session management (client-side history)
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const sessionsHydrated = useRef(false);

  // Multi-agent state
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentLevel, setStudentLevel] = useState('Beginner');
  const [activeAgent, setActiveAgent] = useState('supervisor');
  const [currentTopic, setCurrentTopic] = useState('Quantum Foundations');

  // Artifacts captured from agents
  const [activePlots, setActivePlots] = useState([]);
  const [activeCode, setActiveCode] = useState('');
  const [codeFramework, setCodeFramework] = useState('qiskit');
  const [executionHistory, setExecutionHistory] = useState([]);
  const [selectedAttemptIdx, setSelectedAttemptIdx] = useState(0);

  // Assessment state
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Research paper upload state
  const [paperFile, setPaperFile] = useState(null);
  const [uploadingPaper, setUploadingPaper] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Video generator state (legacy feature preserved)
  const [videoTopic, setVideoTopic] = useState('');
  const [videoLevel, setVideoLevel] = useState('Beginner');
  const [videoDuration, setVideoDuration] = useState('standard');
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Engine health
  const [engineConnected, setEngineConnected] = useState(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // Hydrate chat sessions from localStorage on mount
  useEffect(() => {
    const stored = loadSessionsFromStorage();
    if (stored.length > 0) {
      const latest = stored[0];
      setSessions(stored);
      setCurrentSessionId(latest.id);
      setMessages(latest.messages && latest.messages.length ? latest.messages : INITIAL_MESSAGES);
      setActivePlots(latest.activePlots || []);
      setActiveCode(latest.activeCode || '');
      setCodeFramework(latest.codeFramework || 'qiskit');
      setExecutionHistory(latest.executionHistory || []);
      setActiveAssessment(latest.activeAssessment || null);
    } else {
      const fresh = createEmptySession();
      setSessions([fresh]);
      setCurrentSessionId(fresh.id);
    }
    sessionsHydrated.current = true;
  }, []);

  // Persist the active session's live state back into history on every change
  useEffect(() => {
    if (!sessionsHydrated.current || !currentSessionId) return;
    setSessions(prev => {
      const updated = prev.map(s => (
        s.id === currentSessionId
          ? {
              ...s,
              title: makeSessionTitle(messages),
              messages,
              activePlots,
              activeCode,
              codeFramework,
              executionHistory,
              activeAssessment,
              updatedAt: new Date().toISOString(),
            }
          : s
      ));
      saveSessionsToStorage(updated);
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, activePlots, activeCode, codeFramework, executionHistory, activeAssessment]);

  function startNewChat() {
    const fresh = createEmptySession();
    setSessions(prev => {
      const updated = [fresh, ...prev];
      saveSessionsToStorage(updated);
      return updated;
    });
    setCurrentSessionId(fresh.id);
    setMessages(INITIAL_MESSAGES);
    setActivePlots([]);
    setActiveCode('');
    setCodeFramework('qiskit');
    setExecutionHistory([]);
    setActiveAssessment(null);
    setSelectedQuizOption(null);
    setWorkspaceTab('viz');
    setShowHistoryPanel(false);
  }

  function switchToSession(id) {
    const target = sessions.find(s => s.id === id);
    if (!target) return;
    setCurrentSessionId(id);
    setMessages(target.messages && target.messages.length ? target.messages : INITIAL_MESSAGES);
    setActivePlots(target.activePlots || []);
    setActiveCode(target.activeCode || '');
    setCodeFramework(target.codeFramework || 'qiskit');
    setExecutionHistory(target.executionHistory || []);
    setActiveAssessment(target.activeAssessment || null);
    setSelectedQuizOption(null);
    setWorkspaceTab('viz');
    setShowHistoryPanel(false);
  }

  function deleteSession(id, e) {
    e.stopPropagation();
    const remaining = sessions.filter(s => s.id !== id);

    if (id === currentSessionId) {
      if (remaining.length > 0) {
        const next = remaining[0];
        setCurrentSessionId(next.id);
        setMessages(next.messages && next.messages.length ? next.messages : INITIAL_MESSAGES);
        setActivePlots(next.activePlots || []);
        setActiveCode(next.activeCode || '');
        setCodeFramework(next.codeFramework || 'qiskit');
        setExecutionHistory(next.executionHistory || []);
        setActiveAssessment(next.activeAssessment || null);
        setSessions(remaining);
        saveSessionsToStorage(remaining);
      } else {
        const fresh = createEmptySession();
        setCurrentSessionId(fresh.id);
        setMessages(INITIAL_MESSAGES);
        setActivePlots([]);
        setActiveCode('');
        setCodeFramework('qiskit');
        setExecutionHistory([]);
        setActiveAssessment(null);
        setSessions([fresh]);
        saveSessionsToStorage([fresh]);
      }
    } else {
      setSessions(remaining);
      saveSessionsToStorage(remaining);
    }
  }

  // Check Agentic Engine health on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${AGENTIC_API_URL}/api/v1/agentic/health`);
        if (res.ok) {
          setEngineConnected(true);
        }
      } catch {
        setEngineConnected(false);
      }
    }
    checkHealth();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Submit query to Agentic Engine
  async function sendMessage(text = input) {
    if (!text.trim() || loading) return;
    const queryText = text.trim();
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: queryText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let data = null;

      // 1. Try Agentic Engine
      try {
        const agenticRes = await fetch(`${AGENTIC_API_URL}/api/v1/agentic/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: queryText,
            student_level: studentLevel,
            topic: currentTopic,
          }),
        });

        if (agenticRes.ok) {
          data = await agenticRes.json();
          setEngineConnected(true);
        }
      } catch (err) {
        console.warn('Agentic engine unreachable, falling back to basic AI engine:', err);
      }

      // 2. Fallback to AI Engine if agentic engine is offline
      if (!data) {
        const fallbackRes = await fetch(`${LEGACY_AI_URL}/api/v1/ai/tutor/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: queryText,
            context: 'general',
          }),
        });
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          data = {
            active_agent: 'teacher',
            route: 'teacher',
            final_response: fbData.reply,
            guardrail_blocked: false,
            thought_log: [
              { agent: 'Fallback AI Tutor', action: 'Standard Response', detail: 'Agentic Engine offline; served via AI Engine.' }
            ],
            plots_base64: [],
            execution_history: [],
          };
        }
      }

      if (data) {
        setActiveAgent(data.active_agent || 'supervisor');

        // Update plots & code artifacts if provided
        if (data.plots_base64 && data.plots_base64.length > 0) {
          setActivePlots(data.plots_base64);
          setWorkspaceTab('viz');
        }
        if (data.code_snippet) {
          setActiveCode(data.code_snippet);
          setCodeFramework(data.code_framework || 'qiskit');
          if (data.execution_history && data.execution_history.length > 0) {
            setExecutionHistory(data.execution_history);
            setSelectedAttemptIdx(data.execution_history.length - 1);
          }
          if (!data.plots_base64 || data.plots_base64.length === 0) {
            setWorkspaceTab('code');
          }
        }
        if (data.assessment) {
          setActiveAssessment(data.assessment);
          setSelectedQuizOption(null);
          setWorkspaceTab('quiz');
        }

        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          agent: data.active_agent,
          content: data.final_response,
          guardrail_blocked: data.guardrail_blocked,
          thought_log: data.thought_log || [],
          code_snippet: data.code_snippet,
          plots_base64: data.plots_base64 || [],
          rag_sources: data.rag_sources || [],
          assessment: data.assessment,
          execution_success: data.execution_success,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Could not connect to quantum backend services.');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'ai',
          agent: 'supervisor',
          content: `**Can't reach the agent engine.** Start the agentic server at \`${AGENTIC_API_URL}\` with \`uvicorn app.main:app --port ${AGENTIC_PORT_LABEL}\`, then send your message again.\n\n*Error details: ${err.message}*`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Submit assessment answer
  async function submitQuizAnswer() {
    if (selectedQuizOption === null || !activeAssessment || submittingQuiz) return;
    setSubmittingQuiz(true);

    try {
      const res = await fetch(`${AGENTIC_API_URL}/api/v1/agentic/assess/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment: activeAssessment,
          selected_option: selectedQuizOption,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveAssessment(data.assessment);
      }
    } catch (err) {
      console.error('Quiz submission failed:', err);
    } finally {
      setSubmittingQuiz(false);
    }
  }

  // Upload research paper PDF
  async function handlePaperUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPaperFile(file);
    setUploadingPaper(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${AGENTIC_API_URL}/api/v1/agentic/upload-paper`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadStatus({
          success: true,
          message: data.message,
          title: data.title,
          chunks: data.chunks_count,
        });
        setMessages(prev => [
          ...prev,
          {
            id: `ai-paper-${Date.now()}`,
            role: 'ai',
            agent: 'researcher',
            content: `**Paper indexed:** \`${file.name}\`\n\nI parsed **${data.chunks_count} sections** into the local quantum vector store. Ask me to explain its methodology, summarize key theorems, or implement its circuits in Qiskit.`,
            timestamp: new Date(),
          },
        ]);
      } else {
        const err = await res.json().catch(() => ({}));
        setUploadStatus({
          success: false,
          message: err.detail || 'The paper could not be parsed. Try a text-based PDF.',
        });
      }
    } catch (err) {
      setUploadStatus({
        success: false,
        message: `Network error: ${err.message}`,
      });
    } finally {
      setUploadingPaper(false);
    }
  }

  // Generate explanation video (legacy feature)
  async function generateVideo(topic = videoTopic) {
    if (!topic.trim() || generatingVideo) return;
    setGeneratingVideo(true);
    try {
      const data = await apiFetch(`${LEGACY_AI_URL}/api/v1/ai/tutor/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level: videoLevel, duration: videoDuration }),
      });
      if (data?.data) {
        setCurrentVideo(data.data);
        setWorkspaceTab('video');
      }
    } catch (err) {
      alert('Video generation failed: ' + err.message);
    } finally {
      setGeneratingVideo(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[var(--color-background)] text-[var(--color-text)] overflow-hidden font-sans flex">
        {/* Navigation Sidebar */}
        <LearnerSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <div
          className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-200 ${
            isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <DashboardNavbar
            title="Quantum Agent Studio"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          {/* Top Agent Studio Bar */}
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2.5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    engineConnected ? 'bg-[var(--qm-accent)]' : 'bg-[var(--color-muted)]'
                  }`}
                />
                <span className="text-xs text-[var(--color-muted)]">
                  {engineConnected ? `Engine online · port ${AGENTIC_PORT_LABEL}` : 'Engine offline · reconnecting'}
                </span>
              </div>

              <span className="hidden sm:block h-4 w-px bg-[var(--color-border)]" />

              {/* Active Agent Badge */}
              <AgentBadge agent={activeAgent} />
            </div>

            {/* Level Selector & Capabilities */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <label htmlFor="qm-level">Level</label>
                <select
                  id="qm-level"
                  value={studentLevel}
                  onChange={e => setStudentLevel(e.target.value)}
                  className="qm-focus bg-[var(--color-background)] border border-[var(--color-border)] rounded-md px-2.5 py-1 text-[var(--color-text)] text-xs"
                >
                  <option value="Beginner">Beginner (intuitive)</option>
                  <option value="Intermediate">Intermediate (circuit math)</option>
                  <option value="Advanced">Advanced (Hamiltonian & ISA)</option>
                </select>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="qm-focus px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)] text-[var(--color-text)] text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <LuUpload size={13} />
                <span>Upload paper</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePaperUpload}
              />
            </div>
          </div>

          {/* Main Studio Dual-Panel Workspace */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* LEFT: Multi-Agent Conversation Feed (6 cols) */}
            <div className="lg:col-span-6 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden">
              {/* History / New Chat Bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-background)] relative z-20">
                <div className="relative">
                  <button
                    onClick={() => setShowHistoryPanel(v => !v)}
                    className="qm-focus flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  >
                    <LuHistory size={14} />
                    <span>History ({sessions.length})</span>
                    <LuChevronDown size={12} className={`transition-transform ${showHistoryPanel ? 'rotate-180' : ''}`} />
                  </button>

                  {showHistoryPanel && (
                    <div className="absolute left-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 space-y-0.5">
                      {sessions.length === 0 && (
                        <p className="text-xs text-[var(--color-muted)] p-3 text-center">No past chats yet.</p>
                      )}
                      {sessions.map(s => (
                        <div
                          key={s.id}
                          onClick={() => switchToSession(s.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={e => { if (e.key === 'Enter') switchToSession(s.id); }}
                          className={`qm-focus w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                            s.id === currentSessionId
                              ? 'bg-[var(--color-background)] text-[var(--color-text)] font-medium'
                              : 'text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]'
                          }`}
                        >
                          <span className="truncate flex-1">{s.title}</span>
                          <button
                            onClick={(e) => deleteSession(s.id, e)}
                            className="qm-focus text-[var(--color-muted)] hover:text-rose-600 flex-shrink-0"
                            title="Delete chat"
                            aria-label="Delete chat"
                          >
                            <LuTrash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={startNewChat}
                  className="qm-focus flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--color-border)] hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)] text-[var(--color-text)] text-xs font-medium transition-colors"
                >
                  <LuPlus size={13} />
                  <span>New chat</span>
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
                {messages.map(msg => (
                  <MessageCard
                    key={msg.id}
                    msg={msg}
                    onGenerateVideoForTopic={topic => {
                      setVideoTopic(topic);
                      generateVideo(topic);
                    }}
                    onSelectTopic={t => sendMessage(t)}
                  />
                ))}
                {loading && <ThinkingIndicator agent={activeAgent} />}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions Pill Bar */}
              <div className="px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-background)] overflow-x-auto flex gap-2 no-scrollbar">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(s.query)}
                    className="qm-focus whitespace-nowrap px-2.5 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)] text-xs text-[var(--color-muted)] transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-background)]">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask a question, request a circuit, or start a quiz"
                    className="qm-focus flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="qm-focus px-4 py-2.5 rounded-md bg-[var(--qm-accent)] hover:bg-[var(--qm-accent-hover)] text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                  >
                    <LuSend size={15} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: Quantum Workspace & Artifacts Studio (6 cols) */}
            <div className="lg:col-span-6 flex flex-col bg-[var(--color-background)] overflow-hidden">
              {/* Studio Tabs */}
              <div className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 gap-1 overflow-x-auto">
                <WorkspaceTabButton
                  active={workspaceTab === 'viz'}
                  onClick={() => setWorkspaceTab('viz')}
                  icon={<LuActivity size={14} />}
                  label="Visualization"
                  badge={activePlots.length > 0 ? activePlots.length : null}
                />
                <WorkspaceTabButton
                  active={workspaceTab === 'code'}
                  onClick={() => setWorkspaceTab('code')}
                  icon={<LuCode size={14} />}
                  label="Code & debug"
                  badge={executionHistory.length > 0 ? `${executionHistory.length}` : null}
                />
                <WorkspaceTabButton
                  active={workspaceTab === 'quiz'}
                  onClick={() => setWorkspaceTab('quiz')}
                  icon={<LuTarget size={14} />}
                  label="Assessment"
                  badge={activeAssessment ? '1' : null}
                />
                <WorkspaceTabButton
                  active={workspaceTab === 'paper'}
                  onClick={() => setWorkspaceTab('paper')}
                  icon={<LuFileText size={14} />}
                  label="Paper RAG"
                  badge={uploadStatus?.chunks ? `${uploadStatus.chunks}` : null}
                />
                <WorkspaceTabButton
                  active={workspaceTab === 'video'}
                  onClick={() => setWorkspaceTab('video')}
                  icon={<LuVideo size={14} />}
                  label="Video"
                />
              </div>

              {/* Workspace Content Area */}
              <div className="flex-1 overflow-y-auto p-4">
                {workspaceTab === 'viz' && (
                  <VisualizationPanel plots={activePlots} onExploreSim={() => sendMessage("Generate a 2-qubit Bell state circuit in Qiskit with measurement plots")} />
                )}

                {workspaceTab === 'code' && (
                  <CodeDebugPanel
                    code={activeCode}
                    framework={codeFramework}
                    history={executionHistory}
                    selectedIdx={selectedAttemptIdx}
                    onSelectIdx={setSelectedAttemptIdx}
                  />
                )}

                {workspaceTab === 'quiz' && (
                  <QuizAssessmentPanel
                    assessment={activeAssessment}
                    selectedOption={selectedQuizOption}
                    onSelectOption={setSelectedQuizOption}
                    onSubmit={submitQuizAnswer}
                    loading={submittingQuiz}
                    onNewQuiz={() => sendMessage("Quiz me on quantum computing gates and superposition")}
                  />
                )}

                {workspaceTab === 'paper' && (
                  <PaperRAGPanel
                    file={paperFile}
                    uploading={uploadingPaper}
                    status={uploadStatus}
                    onUploadClick={() => fileInputRef.current?.click()}
                    onAskPaper={q => sendMessage(q)}
                  />
                )}

                {workspaceTab === 'video' && (
                  <div className="space-y-4">
                    {currentVideo ? (
                      <QuantumVideoPlayer videoData={currentVideo} onClose={() => setCurrentVideo(null)} />
                    ) : (
                      <div className="p-8 text-center border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]">
                        <LuVideo className="mx-auto text-[var(--color-muted)] mb-3" size={28} />
                        <h3 className="font-semibold text-[var(--color-text)] text-sm">Turn a topic into an animated walkthrough</h3>
                        <p className="text-xs text-[var(--color-muted)] mt-1.5 max-w-md mx-auto leading-relaxed">
                          Pick a topic and the studio builds slides, narration, and checkpoint questions around it.
                          {generatingVideo ? ' Building your walkthrough now…' : ''}
                        </p>
                        <div className="mt-5 flex flex-col items-stretch gap-1.5 max-w-sm mx-auto text-left">
                          {VIDEO_PRESETS.map((p, i) => (
                            <button
                              key={i}
                              disabled={generatingVideo}
                              onClick={() => generateVideo(p.topic)}
                              className="qm-focus px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--qm-accent)] text-xs text-[var(--color-text)] disabled:opacity-50 transition-colors"
                            >
                              <span className="block font-medium">{p.topic}</span>
                              <span className="block text-[11px] text-[var(--color-muted)] mt-0.5">{p.desc} · {p.level}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped styles: accent token + rendered markdown content inside chat bubbles */}
      <style jsx global>{`
        :root {
          --qm-accent: #0f766e;
          --qm-accent-hover: #115e56;
          --qm-accent-soft: rgba(15, 118, 110, 0.08);
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --qm-accent: #2dd4bf;
            --qm-accent-hover: #5eead4;
            --qm-accent-soft: rgba(45, 212, 191, 0.1);
          }
        }
        .qm-focus:focus-visible {
          outline: 2px solid var(--qm-accent);
          outline-offset: 2px;
        }
        input.qm-focus:focus,
        select.qm-focus:focus {
          outline: none;
          border-color: var(--qm-accent);
        }
        .qm-heading {
          font-weight: 600;
          margin: 0.5rem 0 0.25rem;
          color: var(--color-text);
        }
        .qm-paragraph {
          margin: 0.25rem 0;
        }
        .qm-list {
          margin: 0.35rem 0 0.35rem 1.1rem;
          list-style-type: disc;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .qm-list-ol {
          list-style-type: decimal;
        }
        .qm-inline-code {
          background: color-mix(in srgb, var(--color-text) 7%, transparent);
          color: var(--color-text);
          padding: 0.1rem 0.3rem;
          border-radius: 0.2rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }
        .qm-codeblock {
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 0.375rem;
          margin: 0.5rem 0;
          overflow: hidden;
        }
        .qm-codeblock-lang {
          font-size: 0.65rem;
          font-family: var(--font-mono);
          padding: 0.3rem 0.6rem;
          color: var(--color-muted);
          border-bottom: 1px solid var(--color-border);
        }
        .qm-codeblock pre {
          margin: 0;
          padding: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--color-text);
          overflow-x: auto;
          white-space: pre;
        }
      `}</style>
    </ProtectedRoute>
  );
}

/* ==========================================================================
   AGENT BADGE COMPONENT
   ========================================================================== */
function AgentBadge({ agent }) {
  const configs = {
    supervisor: { name: 'Supervisor', icon: <LuCompass size={13} /> },
    teacher: { name: 'Teaching agent', icon: <LuBookOpen size={13} /> },
    coder: { name: 'Coding agent', icon: <LuCode size={13} /> },
    assessor: { name: 'Assessment agent', icon: <LuTarget size={13} /> },
    researcher: { name: 'Research agent', icon: <LuFileText size={13} /> },
  };
  const current = configs[agent] || configs.supervisor;

  return (
    <div className="flex items-center gap-1.5 text-xs text-[var(--color-text)]">
      <span className="text-[var(--qm-accent)]">{current.icon}</span>
      <span className="font-medium">{current.name}</span>
      <span className="text-[var(--color-muted)]">active</span>
    </div>
  );
}

/* ==========================================================================
   TAB BUTTON COMPONENT
   ========================================================================== */
function WorkspaceTabButton({ active, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`qm-focus flex items-center gap-2 px-3 py-3 text-xs font-medium transition-colors border-b-2 -mb-px ${
        active
          ? 'text-[var(--color-text)] border-[var(--qm-accent)]'
          : 'text-[var(--color-muted)] hover:text-[var(--color-text)] border-transparent'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="px-1.5 rounded-sm border border-[var(--color-border)] text-[10px] text-[var(--color-muted)] font-normal">
          {badge}
        </span>
      )}
    </button>
  );
}

/* ==========================================================================
   MESSAGE CARD & THOUGHT EXPANDER
   ========================================================================== */
function MessageCard({ msg, onGenerateVideoForTopic, onSelectTopic }) {
  const isAI = msg.role === 'ai';
  const [copied, setCopied] = useState(false);
  const [showThoughts, setShowThoughts] = useState(false);

  function copyText() {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const formatted = renderMarkdown(msg.content || '');

  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]">
        {isAI
          ? (msg.guardrail_blocked
              ? <LuShieldAlert size={14} className="text-rose-600" />
              : <LuBot size={14} className="text-[var(--qm-accent)]" />)
          : <LuUser size={14} />}
      </div>

      <div className={`max-w-[88%] space-y-2 ${isAI ? '' : 'items-end flex flex-col'}`}>
        {/* Guardrail Rejection Notice Box */}
        {msg.guardrail_blocked && (
          <div className="p-3 rounded-md border border-rose-600/40 bg-rose-600/5 text-xs flex items-start gap-2.5">
            <LuShieldAlert className="text-rose-600 flex-shrink-0 mt-0.5" size={15} />
            <div>
              <p className="font-medium text-rose-600">Outside the quantum domain</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-muted)]">
                These agents cover quantum algorithms, Qiskit and Cirq simulation, and quantum hardware.
                Rephrase your question around one of those and I&apos;ll take it from there.
              </p>
            </div>
          </div>
        )}

        {/* Message Bubble (rendered as real HTML from markdown, not raw text) */}
        <div
          className={`px-3.5 py-2.5 rounded-md text-xs leading-relaxed border ${
            isAI
              ? 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]'
              : 'bg-[var(--color-surface)] border-[var(--color-border)] border-l-2 border-l-[var(--qm-accent)] text-[var(--color-text)]'
          }`}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />

        {/* Agent Thought Trace Accordion (AI only) */}
        {isAI && msg.thought_log && msg.thought_log.length > 0 && (
          <div className="w-full">
            <button
              onClick={() => setShowThoughts(!showThoughts)}
              className="qm-focus flex items-center gap-1.5 text-[11px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {showThoughts ? <LuChevronDown size={11} /> : <LuChevronRight size={11} />}
              <span>Workflow trace ({msg.thought_log.length} steps)</span>
            </button>
            {showThoughts && (
              <div className="mt-1.5 p-2.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] space-y-1.5 font-mono">
                {msg.thought_log.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--qm-accent)]">{step.agent}</span>
                    <span className="text-[var(--color-muted)]">{step.action}:</span>
                    <span className="text-[var(--color-text)]">{step.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Citations & Sources */}
        {isAI && msg.rag_sources && msg.rag_sources.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[var(--color-muted)]">Sources</span>
            {msg.rag_sources.map((src, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-sm border border-[var(--color-border)] text-[var(--color-muted)] text-[10px]">
                {src.title} · p.{src.page}
              </span>
            ))}
          </div>
        )}

        {/* Bottom AI Actions */}
        {isAI && (
          <div className="flex items-center gap-3 text-[var(--color-muted)]">
            <button onClick={copyText} className="qm-focus hover:text-[var(--color-text)] transition-colors flex items-center gap-1 text-[11px]">
              {copied ? <LuCheck size={11} className="text-[var(--qm-accent)]" /> : <LuCopy size={11} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            {onGenerateVideoForTopic && (
              <button
                onClick={() => onGenerateVideoForTopic(msg.content.slice(0, 50))}
                className="qm-focus hover:text-[var(--color-text)] transition-colors flex items-center gap-1 text-[11px]"
              >
                <LuVideo size={11} />
                <span>Make a video</span>
              </button>
            )}
            <span className="text-[10px] text-[var(--color-muted)] ml-auto">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   THINKING / PROGRESS INDICATOR
   ========================================================================== */
function ThinkingIndicator({ agent }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] max-w-sm">
      <LuCpu size={14} className="text-[var(--qm-accent)] animate-spin motion-reduce:animate-none" />
      <div>
        <p className="text-xs font-medium text-[var(--color-text)]">Coordinating agents</p>
        <p className="text-[11px] text-[var(--color-muted)]">Guardrail checked · running the agent graph</p>
      </div>
    </div>
  );
}

/* ==========================================================================
   WORKSPACE: VISUALIZATION PANEL
   ========================================================================== */
function VisualizationPanel({ plots, onExploreSim }) {
  if (!plots || plots.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]">
        <LuActivity size={28} className="text-[var(--color-muted)] mb-3" />
        <h4 className="font-semibold text-[var(--color-text)] text-sm">Nothing plotted yet</h4>
        <p className="text-xs text-[var(--color-muted)] mt-1.5 max-w-xs leading-relaxed">
          Run a circuit and the measurement histograms, Bloch spheres, and state distributions appear here.
        </p>
        <button
          onClick={onExploreSim}
          className="qm-focus mt-4 px-3.5 py-2 rounded-md bg-[var(--qm-accent)] hover:bg-[var(--qm-accent-hover)] text-white text-xs font-medium transition-colors"
        >
          Simulate a Bell state
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[var(--color-text)] text-sm">
          Simulation plots ({plots.length})
        </h4>
        <span className="text-[11px] text-[var(--color-muted)]">Matplotlib Agg · 130 DPI</span>
      </div>

      <div className="space-y-3">
        {plots.map((plotUri, idx) => (
          <div key={idx} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md overflow-hidden">
            <img
              src={plotUri}
              alt={`Quantum simulation plot ${idx + 1}`}
              className="w-full h-auto rounded-sm object-contain border border-[var(--color-border)] bg-white"
            />
            <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
              <span>Plot {idx + 1} · probability distribution</span>
              <a
                href={plotUri}
                download={`quantum_plot_${idx + 1}.png`}
                className="qm-focus text-[var(--qm-accent)] hover:underline"
              >
                Download PNG
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   WORKSPACE: CODE & SELF-HEALING DEBUG PANEL
   ========================================================================== */
function CodeDebugPanel({ code, framework, history, selectedIdx, onSelectIdx }) {
  if (!code && (!history || history.length === 0)) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]">
        <LuCode size={28} className="text-[var(--color-muted)] mb-3" />
        <h4 className="font-semibold text-[var(--color-text)] text-sm">No circuit has run yet</h4>
        <p className="text-xs text-[var(--color-muted)] mt-1.5 max-w-xs leading-relaxed">
          Ask for a Qiskit or Cirq circuit. You&apos;ll see the generated code, the sandbox run, and every repair attempt.
        </p>
      </div>
    );
  }

  const currentAttempt = history && history[selectedIdx] ? history[selectedIdx] : null;

  return (
    <div className="space-y-4">
      {/* Header & Framework Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">
            {framework} sandbox run
          </span>
          {currentAttempt && (
            <span className={`px-2 py-0.5 rounded-sm border text-[10px] ${
              currentAttempt.success
                ? 'border-[var(--qm-accent)] text-[var(--qm-accent)]'
                : 'border-rose-600/50 text-rose-600'
            }`}>
              {currentAttempt.success ? 'Succeeded' : 'Failed, diagnosed'}
            </span>
          )}
        </div>
        {currentAttempt && (
          <span className="text-[11px] text-[var(--color-muted)] font-mono">
            {currentAttempt.execution_time_ms}ms
          </span>
        )}
      </div>

      {/* Iteration Attempts Tabs (Self-Healing Visualization) */}
      {history && history.length > 1 && (
        <div className="flex items-center gap-1 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md overflow-x-auto">
          <span className="text-[11px] text-[var(--color-muted)] px-2">Repair loop</span>
          {history.map((att, idx) => (
            <button
              key={idx}
              onClick={() => onSelectIdx(idx)}
              className={`qm-focus px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                selectedIdx === idx
                  ? 'bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)] border border-transparent'
              }`}
            >
              <span>Attempt {att.iteration}</span>
              {att.success
                ? <LuCircleCheck className="text-[var(--qm-accent)]" size={11} />
                : <LuTriangleAlert className="text-rose-600" size={11} />}
            </button>
          ))}
        </div>
      )}

      {/* Code Display */}
      <div className="rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)] text-[11px] font-mono text-[var(--color-muted)]">
          <span>{framework}.py</span>
          <button
            onClick={() => navigator.clipboard.writeText(currentAttempt ? currentAttempt.code : code)}
            className="qm-focus hover:text-[var(--color-text)] flex items-center gap-1 transition-colors"
          >
            <LuCopy size={11} />
            <span>Copy</span>
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-[var(--color-text)] overflow-x-auto leading-relaxed">
          <code>{currentAttempt ? currentAttempt.code : code}</code>
        </pre>
      </div>

      {/* Terminal Output */}
      {currentAttempt && (
        <div className="rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--color-border)] text-[11px] font-mono text-[var(--color-muted)]">
            <span>Output (stdout / stderr)</span>
          </div>
          <div className="p-3 text-xs font-mono">
            {currentAttempt.stdout && (
              <div className="text-[var(--color-text)] whitespace-pre-wrap">
                {currentAttempt.stdout}
              </div>
            )}
            {currentAttempt.stderr && (
              <div className="text-rose-600 whitespace-pre-wrap mt-2">
                {currentAttempt.stderr}
              </div>
            )}
            {currentAttempt.diagnostics && (
              <div className="mt-2 p-2 rounded-sm border border-[var(--color-border)] text-[var(--color-text)] text-[11px] font-sans">
                <span className="text-[var(--color-muted)]">Diagnosis: </span>
                {currentAttempt.diagnostics}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   WORKSPACE: QUIZ ASSESSMENT PANEL
   ========================================================================== */
function QuizAssessmentPanel({ assessment, selectedOption, onSelectOption, onSubmit, loading, onNewQuiz }) {
  if (!assessment) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]">
        <LuTarget size={28} className="text-[var(--color-muted)] mb-3" />
        <h4 className="font-semibold text-[var(--color-text)] text-sm">No assessment running</h4>
        <p className="text-xs text-[var(--color-muted)] mt-1.5 max-w-xs leading-relaxed">
          Start a quiz on any quantum topic and the assessment agent will diagnose where your understanding breaks down.
        </p>
        <button
          onClick={onNewQuiz}
          className="qm-focus mt-4 px-3.5 py-2 rounded-md bg-[var(--qm-accent)] hover:bg-[var(--qm-accent-hover)] text-white text-xs font-medium transition-colors"
        >
          Start a quiz
        </button>
      </div>
    );
  }

  const isEvaluated = assessment.student_selected !== null && assessment.student_selected !== undefined;

  return (
    <div className="space-y-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-[var(--color-text)] text-sm">{assessment.topic}</h4>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">Topic assessment</p>
        </div>
        {isEvaluated && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text)]">
            <LuAward size={13} className="text-[var(--qm-accent)]" />
            <span>Mastery {Math.round(assessment.mastery_score * 100)}%</span>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="p-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] leading-relaxed">
        {assessment.question}
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-2">
        {assessment.options.map((opt, idx) => {
          const isSelected = selectedOption === idx || assessment.student_selected === idx;
          const isCorrectOption = assessment.correct_option === idx;

          let optionStyle = 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--qm-accent)]';
          if (isEvaluated) {
            if (isCorrectOption) {
              optionStyle = 'bg-[var(--color-surface)] border-[var(--qm-accent)] text-[var(--color-text)]';
            } else if (isSelected && !isCorrectOption) {
              optionStyle = 'bg-[var(--color-surface)] border-rose-600/50 text-[var(--color-text)]';
            } else {
              optionStyle = 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)]';
            }
          } else if (isSelected) {
            optionStyle = 'bg-[var(--color-surface)] border-[var(--qm-accent)] text-[var(--color-text)]';
          }

          return (
            <button
              key={idx}
              disabled={isEvaluated}
              onClick={() => onSelectOption(idx)}
              className={`qm-focus w-full p-3 rounded-md border text-xs text-left transition-colors flex items-center justify-between ${optionStyle}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-sm flex items-center justify-center font-mono text-[10px] border border-[var(--color-border)]">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
              {isEvaluated && isCorrectOption && <LuCircleCheck className="text-[var(--qm-accent)]" size={15} />}
              {isEvaluated && isSelected && !isCorrectOption && <LuTriangleAlert className="text-rose-600" size={15} />}
            </button>
          );
        })}
      </div>

      {/* Submit / Action Button */}
      {!isEvaluated ? (
        <button
          onClick={onSubmit}
          disabled={selectedOption === null || loading}
          className="qm-focus w-full py-2.5 rounded-md bg-[var(--qm-accent)] hover:bg-[var(--qm-accent-hover)] text-white font-medium text-xs disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
        >
          {loading ? <LuRefreshCw className="animate-spin motion-reduce:animate-none" size={13} /> : <LuCheck size={13} />}
          <span>{loading ? 'Checking your answer' : 'Submit answer'}</span>
        </button>
      ) : (
        <div className="p-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <span className={`text-xs font-medium ${assessment.is_correct ? 'text-[var(--qm-accent)]' : 'text-rose-600'}`}>
            {assessment.is_correct ? 'Correct' : 'Misconception found'}
          </span>
          <p className="text-xs text-[var(--color-text)] leading-relaxed">
            {assessment.misconception_analysis}
          </p>
          <button
            onClick={onNewQuiz}
            className="qm-focus w-full py-2 rounded-md border border-[var(--color-border)] hover:border-[var(--qm-accent)] hover:text-[var(--qm-accent)] text-[var(--color-text)] text-xs font-medium transition-colors"
          >
            Try another question
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   WORKSPACE: RESEARCH PAPER RAG PANEL
   ========================================================================== */
function PaperRAGPanel({ file, uploading, status, onUploadClick, onAskPaper }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-[var(--color-text)] text-sm">Papers and textbooks</h4>
        <p className="text-xs text-[var(--color-muted)] mt-0.5">
          {file ? `Last upload: ${file.name}` : 'Add a PDF so the agents can quote and implement it.'}
        </p>
      </div>

      {/* Upload Dropzone */}
      <button
        onClick={onUploadClick}
        className="qm-focus w-full p-6 border border-dashed border-[var(--color-border)] hover:border-[var(--qm-accent)] rounded-md text-center bg-[var(--color-surface)] cursor-pointer transition-colors"
      >
        <LuUpload size={24} className="mx-auto text-[var(--color-muted)] mb-2" />
        <p className="text-xs font-medium text-[var(--color-text)]">
          {uploading ? 'Parsing and indexing the PDF…' : 'Upload a PDF'}
        </p>
        <p className="text-[11px] text-[var(--color-muted)] mt-1">
          arXiv preprints, IBM and Google whitepapers, and textbooks all work.
        </p>
      </button>

      {/* Status Card */}
      {status && (
        <div className={`p-3 rounded-md border text-xs leading-relaxed bg-[var(--color-surface)] ${
          status.success ? 'border-[var(--qm-accent)]' : 'border-rose-600/50'
        }`}>
          <div className="flex items-center gap-2 font-medium text-[var(--color-text)]">
            {status.success
              ? <LuCircleCheck size={13} className="text-[var(--qm-accent)]" />
              : <LuTriangleAlert size={13} className="text-rose-600" />}
            <span>{status.title || (status.success ? 'Indexed' : 'Upload failed')}</span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--color-muted)]">{status.message}</p>
        </div>
      )}

      {/* Suggested Inquiries */}
      <div className="space-y-1.5">
        <p className="text-[11px] text-[var(--color-muted)]">Ask about the paper</p>
        {[
          "Explain the problem statement and motivation of this paper",
          "Break down the quantum algorithm proposed in the paper",
          "What are the experimental limitations and noise challenges?",
          "Implement the circuit from this paper in Qiskit"
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => onAskPaper(prompt)}
            className="qm-focus w-full text-left px-3 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--qm-accent)] text-[11px] text-[var(--color-text)] transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}