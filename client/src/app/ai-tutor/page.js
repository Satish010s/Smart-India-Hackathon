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
} from 'react-icons/lu';

const SUGGESTIONS = [
  'Explain quantum superposition with a simple analogy',
  'How does the Hadamard gate create superposition?',
  'What is quantum entanglement and why is it useful?',
  "Walk me through Grover's algorithm step by step",
  'Explain the difference between |0⟩ and |1⟩ states',
  'What is a quantum oracle in simple terms?',
];

const VIDEO_PRESETS = [
  { topic: '3D Bloch Sphere & Qubit State Geometry', desc: 'Visualizing single-qubit states, poles, and rotation gates', level: 'Beginner' },
  { topic: 'Quantum Superposition & The Hadamard Gate', desc: 'From classical bits to probability amplitudes and wave interference', level: 'Beginner' },
  { topic: 'Bell State Entanglement & EPR Paradox', desc: 'Two-qubit non-local correlations and CNOT entanglement', level: 'Intermediate' },
  { topic: "Grover's Search Algorithm & Amplitude Amplification", desc: 'Quadratic speedup, oracles, and the inversion about the mean', level: 'Intermediate' },
  { topic: 'Quantum Teleportation Protocol', desc: 'Transmitting quantum states using classical bits and entanglement', level: 'Advanced' },
  { topic: 'Variational Quantum Eigensolver (VQE)', desc: 'Hybrid quantum-classical optimization for molecular ground states', level: 'Advanced' },
];

const INITIAL_MESSAGES = [
  {
    id: 'ai-0',
    role: 'ai',
    content: "Hi! I'm your Quantum AI Tutor 🤖⚛️ powered by Gemini. I can explain quantum concepts, debug Qiskit code, analyze circuits, and generate complete animated explanation videos on any topic. What would you like to master today?",
    timestamp: new Date(),
  },
];

function Message({ msg, onGenerateVideoForTopic }) {
  const [copied, setCopied] = useState(false);
  const isAI = msg.role === 'ai';

  function copyText() {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Simple markdown-like rendering
  const rendered = msg.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-[var(--color-border)]/30 px-1.5 py-0.5 rounded text-cyan-300 text-[11px] font-mono">$1</code>')
    .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre class="bg-[#0d1117] border border-[var(--color-border)]/50 rounded-xl p-4 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed mt-2 mb-2">$2</pre>')
    .split('\n').join('<br/>');

  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-md ${
        isAI ? 'bg-gradient-to-br from-cyan-500 to-violet-500' : 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]'
      }`}>
        {isAI ? <LuBot size={16} /> : <LuUser size={16} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] space-y-2 ${isAI ? '' : 'items-end flex flex-col'}`}>
        <div className={`px-4 py-3.5 rounded-2xl text-sm leading-relaxed ${
          isAI
            ? 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-tl-sm'
            : 'bg-[var(--color-primary)] text-white rounded-tr-sm'
        }`}
          dangerouslySetInnerHTML={{ __html: rendered }}
        />

        {/* Actions (AI only) */}
        {isAI && (
          <div className="flex items-center gap-2 px-1 flex-wrap">
            <button onClick={copyText} className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/30 transition-colors text-xs flex items-center gap-1">
              {copied ? <LuCheck size={12} className="text-emerald-400" /> : <LuCopy size={12} />}
              <span className="text-[10px] font-mono">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onGenerateVideoForTopic && (
              <button
                onClick={() => onGenerateVideoForTopic(msg.content.slice(0, 60))}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/15 to-violet-500/15 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-[11px] font-semibold flex items-center gap-1.5"
              >
                <LuVideo size={12} />
                <span>Generate Video</span>
              </button>
            )}

            <button className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-emerald-400 transition-colors">
              <LuThumbsUp size={12} />
            </button>
            <button className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-rose-400 transition-colors">
              <LuThumbsDown size={12} />
            </button>
            <span className="text-[10px] text-[var(--color-muted)] font-mono ml-auto">
              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AITutorPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Mode: 'chat' | 'video'
  const [activeTab, setActiveTab] = useState('chat');

  // Chat state
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeContext, setActiveContext] = useState('general');

  // Video generator state
  const [videoTopic, setVideoTopic] = useState('');
  const [videoLevel, setVideoLevel] = useState('Beginner');
  const [videoDuration, setVideoDuration] = useState('standard');
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Gemini API Key config
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [serverHasKey, setServerHasKey] = useState(false);

  const bottomRef = useRef(null);

  // Check server key status on load and read localStorage key
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('quantum_gemini_api_key') || '';
      setGeminiApiKey(storedKey);
    }

    async function checkKey() {
      try {
        const data = await apiFetch('http://localhost:8000/api/v1/ai/tutor/key-status');
        if (data?.hasServerKey) {
          setServerHasKey(true);
        }
      } catch {}
    }
    checkKey();
  }, []);

  useEffect(() => {
    if (activeTab === 'chat') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  function saveApiKey(newKey) {
    setGeminiApiKey(newKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quantum_gemini_api_key', newKey);
    }
    setShowKeyModal(false);
  }

  // Send chat message
  async function sendMessage(text = input) {
    if (!text.trim() || loading) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content,
      }));

      const headers = { 'Content-Type': 'application/json' };
      if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

      const data = await apiFetch('http://localhost:8000/api/v1/ai/tutor/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          context: activeContext,
          history,
          apiKey: geminiApiKey || undefined,
        }),
      });

      const reply = data?.reply || "I'm having trouble processing that right now. Please try again!";
      setMessages(prev => [
        ...prev,
        { id: `ai-${Date.now()}`, role: 'ai', content: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: `I'm sorry, I encountered an error communicating with the server. Please check your API key or try again later.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Generate video on topic
  async function handleGenerateVideo(customTopic = null) {
    const topicToUse = customTopic || videoTopic;
    if (!topicToUse.trim() || generatingVideo) return;

    setGeneratingVideo(true);
    setActiveTab('video');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

      const data = await apiFetch('http://localhost:8000/api/v1/ai/tutor/generate-video', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topic: topicToUse.trim(),
          level: videoLevel,
          duration: videoDuration,
          apiKey: geminiApiKey || undefined,
        }),
      });

      if (data?.data) {
        setCurrentVideo(data.data);
      }
    } catch (err) {
      console.error('Video generation error:', err);
    } finally {
      setGeneratingVideo(false);
    }
  }

  const contexts = [
    { id: 'general', label: 'General', icon: LuBrain },
    { id: 'code', label: 'Code Help', icon: LuCode },
    { id: 'circuit', label: 'Circuit', icon: LuCpu },
    { id: 'concept', label: 'Concepts', icon: LuBookOpen },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex">
        <LearnerSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />

        <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <DashboardNavbar
            title="Quantum AI Tutor & Video Studio"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />

          {/* Sub-header Navigation Bar */}
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <LuMessageSquare size={15} />
                <span>AI Tutor Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'video'
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <LuVideo size={15} />
                <span>AI Video Studio</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold">
                  NEW
                </span>
              </button>
            </div>

            {/* Gemini Key Status & Settings */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeyModal(true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                  serverHasKey || geminiApiKey
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-400'
                }`}
              >
                <LuKey size={13} />
                <span className="hidden sm:inline">
                  {serverHasKey || geminiApiKey ? 'Gemini 2.5 Active' : 'Configure Gemini Key'}
                </span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
            {/* ─── TAB 1: AI TUTOR CHAT ─── */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden w-full">
                {/* Left Sidebar Panel */}
                <div className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
                  {/* Tutor Identity */}
                  <div className="p-5 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg text-white">
                        <LuBot size={22} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[var(--color-text)]">Quantum AI Tutor</div>
                        <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Gemini 2.5 Flash
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Context Mode */}
                  <div className="p-4 border-b border-[var(--color-border)] space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted)]">
                      Focus Context
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {contexts.map(ctx => {
                        const Icon = ctx.icon;
                        return (
                          <button
                            key={ctx.id}
                            onClick={() => setActiveContext(ctx.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              activeContext === ctx.id
                                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
                            }`}
                          >
                            <Icon size={13} /> {ctx.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Suggested Prompts */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted)]">
                      Suggested questions
                    </div>
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="w-full text-left text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] px-3 py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 bg-[var(--color-background)] transition-all leading-relaxed"
                      >
                        <LuSparkles size={11} className="inline mr-1.5 text-cyan-400" />
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Bottom Controls */}
                  <div className="p-4 border-t border-[var(--color-border)] space-y-2">
                    <button
                      onClick={() => setMessages(INITIAL_MESSAGES)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)]/40 transition-all"
                    >
                      <LuRefreshCw size={12} /> New Conversation
                    </button>
                  </div>
                </div>

                {/* Chat Messages & Input Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                    {messages.map(msg => (
                      <Message
                        key={msg.id}
                        msg={msg}
                        onGenerateVideoForTopic={topic => {
                          setVideoTopic(topic);
                          handleGenerateVideo(topic);
                        }}
                      />
                    ))}

                    {/* Loading Indicator */}
                    {loading && (
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex-shrink-0 flex items-center justify-center text-white">
                          <LuBot size={16} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Chat Input Bar */}
                  <div className="p-4 sm:p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                    <div className="flex items-end gap-3 max-w-4xl mx-auto">
                      <div className="flex-1 relative">
                        <textarea
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder="Ask anything about quantum computing, circuits, code, or theory..."
                          rows={1}
                          className="w-full px-4 py-3 pr-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)]/60 resize-none transition-colors"
                          style={{ minHeight: '48px', maxHeight: '120px' }}
                        />
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            if (!input.trim()) return;
                            const topic = input;
                            setInput('');
                            setVideoTopic(topic);
                            handleGenerateVideo(topic);
                          }}
                          disabled={!input.trim() || loading}
                          title="Generate Video from Prompt"
                          className="h-12 px-4 rounded-2xl bg-[var(--color-surface)] border border-cyan-500/30 text-cyan-400 flex items-center gap-2 justify-center hover:bg-cyan-500/10 disabled:opacity-40 transition-all shadow-sm text-sm font-semibold"
                        >
                          <LuVideo size={16} />
                          <span className="hidden sm:inline">Gen Video</span>
                        </button>
                        <button
                          onClick={() => sendMessage()}
                          disabled={!input.trim() || loading}
                          title="Ask AI Tutor"
                          className="w-12 h-12 sm:w-auto sm:px-5 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center gap-2 justify-center hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-[var(--color-primary)]/20 text-sm font-semibold"
                        >
                          <LuSend size={16} />
                          <span className="hidden sm:inline">Ask AI</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-center text-[10px] text-[var(--color-muted)] mt-2 font-mono">
                      Press Enter to send · Shift+Enter for new line
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 2: AI VIDEO STUDIO ─── */}
            {activeTab === 'video' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
                {/* Topic Input Box */}
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                      AI Quantum Video Director
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)]">
                      Generate Interactive Explanation Video
                    </h2>
                    <p className="text-sm text-[var(--color-muted)] max-w-2xl leading-relaxed">
                      Enter any quantum topic, algorithm, or theorem. Gemini will craft a structured 3D visual storyboard with synchronized speech narration, Bloch sphere animations, live circuit diagrams, and comprehension quizzes.
                    </p>
                  </div>

                  {/* Input and Controls */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={videoTopic}
                      onChange={e => setVideoTopic(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleGenerateVideo(); }}
                      placeholder="e.g. 3D Bloch Sphere, Quantum Teleportation, Grover's Algorithm..."
                      className="flex-1 px-4 py-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:border-cyan-400/60 transition-colors"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={videoLevel}
                        onChange={e => setVideoLevel(e.target.value)}
                        className="px-3 py-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] text-xs font-mono text-[var(--color-text)] focus:outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>

                      <button
                        onClick={() => {
                          if (!videoTopic.trim()) return;
                          const topic = videoTopic;
                          setVideoTopic('');
                          setActiveTab('chat');
                          setInput(topic);
                        }}
                        disabled={!videoTopic.trim() || generatingVideo}
                        title="Chat about this topic"
                        className="px-4 py-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-cyan-400 hover:border-cyan-500/30 text-sm font-semibold transition-all flex items-center gap-2"
                      >
                        <LuMessageSquare size={16} />
                        <span className="hidden sm:inline">Ask AI</span>
                      </button>
                      <button
                        onClick={() => handleGenerateVideo()}
                        disabled={!videoTopic.trim() || generatingVideo}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-[var(--color-primary)] to-violet-600 text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 flex-shrink-0"
                      >
                        {generatingVideo ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            <span>Directing Video...</span>
                          </>
                        ) : (
                          <>
                            <LuPlay size={15} />
                            <span>Generate Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Topics */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono text-[var(--color-muted)]">
                      Or choose a curated quantum masterclass topic:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {VIDEO_PRESETS.map(preset => (
                        <div
                          key={preset.topic}
                          onClick={() => {
                            setVideoTopic(preset.topic);
                            setVideoLevel(preset.level);
                            handleGenerateVideo(preset.topic);
                          }}
                          className="p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] hover:border-cyan-400/50 hover:-translate-y-0.5 transition-all cursor-pointer group space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-cyan-400 font-semibold">{preset.level}</span>
                            <span className="text-[var(--color-muted)] group-hover:text-cyan-300">Play ▶</span>
                          </div>
                          <div className="text-xs font-bold text-[var(--color-text)] group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {preset.topic}
                          </div>
                          <p className="text-[11px] text-[var(--color-muted)] line-clamp-1">
                            {preset.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Loading State during Generation */}
                {generatingVideo && (
                  <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-[var(--color-surface)] to-violet-500/10 p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-violet-500 mx-auto flex items-center justify-center text-white shadow-2xl animate-pulse">
                      <LuSparkles size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[var(--color-text)]">
                        Gemini is Generating Your Video Storyboard...
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] max-w-md mx-auto">
                        Deconstructing "{videoTopic}" into scene scripts, 3D Bloch sphere projections, circuit states, and voiceover timing.
                      </p>
                    </div>
                  </div>
                )}

                {/* Video Player Display */}
                {currentVideo && !generatingVideo && (
                  <QuantumVideoPlayer
                    video={currentVideo}
                    onRegenerate={() => handleGenerateVideo()}
                  />
                )}
              </div>
            )}
          </main>
        </div>

        {/* Gemini API Key Configuration Modal */}
        {showKeyModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                    <LuKey size={18} />
                  </div>
                  <h3 className="font-bold text-base text-[var(--color-text)]">Gemini API Key Setup</h3>
                </div>
                <button onClick={() => setShowKeyModal(false)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  <LuX size={18} />
                </button>
              </div>

              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Connect your Google Gemini API key to power unconstrained AI tutoring and deep-dive video generation. You can obtain a free API key directly from Google AI Studio.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-[var(--color-text)]">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-cyan-400">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>Get free key at Google AI Studio</span>
                  <LuExternalLink size={12} />
                </a>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveApiKey(geminiApiKey)}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-90 transition-all shadow-md"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
