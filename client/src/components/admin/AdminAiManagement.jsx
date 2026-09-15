"use client";

import React, { useState, useEffect } from 'react';
import {
  LuBrain, LuSave, LuRefreshCcw, LuCheck, LuSlidersHorizontal,
  LuSparkles, LuActivity, LuLock, LuTerminal, LuCpu,
} from 'react-icons/lu';
import { apiFetch } from '../../services/api';

export default function AdminAiManagement() {
  const [config, setConfig] = useState({
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    temperature: 0.2,
    maxOutputTokens: 2048,
    rateLimitPerMin: 60,
    dailyTokenQuota: 1000000,
    systemPrompt: 'You are QubitMind AI, a state-of-the-art quantum computing tutor. Provide rigorous, mathematically sound yet accessible explanations for quantum concepts, circuits, gates, and algorithms.',
    features: {
      tutor: true,
      codeGeneration: true,
      circuitDebugging: true,
      circuitOptimization: true,
      recommendations: true,
    },
    metrics: {
      todayRequests: 142,
      avgLatencyMs: 320,
      errorRate: 0.5,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchAiConfig = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/ai/config');
      if (res?.success && res.data?.config) {
        setConfig(res.data.config);
      }
    } catch (err) {
      console.warn('Using default AI config:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiFetch('/admin/ai/config', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      if (res?.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update AI configuration.');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = (key) => {
    setConfig({
      ...config,
      features: {
        ...config.features,
        [key]: !config.features[key],
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuBrain className="text-cyan-400" />
            AI Engine &amp; Quantum Tutor Management
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Configure primary AI provider, model hyper-parameters, system-level prompts, feature flags, and rate-limiting quotas.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          {saving ? <LuRefreshCcw size={14} className="animate-spin" /> : savedSuccess ? <LuCheck size={14} /> : <LuSave size={14} />}
          <span>{savedSuccess ? 'Configuration Saved!' : 'Save AI Settings'}</span>
        </button>
      </div>

      {/* Live Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--color-muted)]">Requests Today</div>
            <div className="text-2xl font-extrabold text-[var(--color-text)] mt-1">{config.metrics?.todayRequests || 142}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <LuActivity size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--color-muted)]">Inference Latency</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{config.metrics?.avgLatencyMs || 320} ms</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <LuCpu size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--color-muted)]">Error Rate</div>
            <div className="text-2xl font-extrabold text-[var(--color-text)] mt-1">{config.metrics?.errorRate || 0.5}%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <LuSparkles size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Config Form + Feature Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Provider & Model Parameters */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-5">
          <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuSlidersHorizontal size={18} className="text-cyan-400" />
            Model &amp; Provider Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Provider */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text)]">AI Engine Provider</label>
              <select
                value={config.provider}
                onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
              >
                <option value="gemini">Google Gemini (Default)</option>
                <option value="openai">OpenAI GPT-4o</option>
                <option value="local">Local HuggingFace / Ollama</option>
              </select>
            </div>

            {/* Model Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text)]">Active Model Identifier</label>
              <input
                type="text"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-[var(--color-text)]">Sampling Temperature</label>
                <span className="font-mono text-cyan-400">{config.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <span className="text-[10px] text-[var(--color-muted)]">Lower = rigorous/deterministic, higher = creative</span>
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text)]">Max Output Tokens</label>
              <input
                type="number"
                value={config.maxOutputTokens}
                onChange={(e) => setConfig({ ...config, maxOutputTokens: parseInt(e.target.value) || 2048 })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            {/* Rate Limit per minute */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text)]">Rate Limit (Req/min per user)</label>
              <input
                type="number"
                value={config.rateLimitPerMin}
                onChange={(e) => setConfig({ ...config, rateLimitPerMin: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            {/* Daily Token Quota */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text)]">Daily Platform Token Quota</label>
              <input
                type="number"
                value={config.dailyTokenQuota}
                onChange={(e) => setConfig({ ...config, dailyTokenQuota: parseInt(e.target.value) || 1000000 })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-[var(--color-text)] flex items-center gap-1.5">
              <LuTerminal size={14} className="text-cyan-400" />
              Global System Prompt for Quantum Tutor
            </label>
            <textarea
              rows={4}
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
            />
            <p className="text-[10px] text-[var(--color-muted)]">
              This prompt is prepended to all student queries in the interactive AI Tutor and circuit assistant.
            </p>
          </div>
        </div>

        {/* Right col: Feature Toggles */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-5">
          <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
            <LuSparkles size={18} className="text-amber-400" />
            AI Capability Toggles
          </h3>
          <p className="text-xs text-[var(--color-muted)]">
            Enable or disable specific AI-driven interactive capabilities across the learner portal.
          </p>

          <div className="space-y-3.5">
            {[
              { id: 'tutor', label: 'Interactive AI Tutor', desc: 'Contextual Q&A on quantum theory and circuits' },
              { id: 'codeGeneration', label: 'Circuit Code Generation', desc: 'Generates Qiskit/Cirq code from prompts' },
              { id: 'circuitDebugging', label: 'Automated Circuit Debugger', desc: 'Identifies gate errors and state collapses' },
              { id: 'circuitOptimization', label: 'Gate Reduction & Optimizer', desc: 'Transpiles to reduce circuit depth' },
              { id: 'recommendations', label: 'Curriculum Recommendations', desc: 'Suggests next modules based on learner XP' },
            ].map((f) => {
              const active = config.features?.[f.id] ?? true;

              return (
                <div
                  key={f.id}
                  onClick={() => toggleFeature(f.id)}
                  className="p-3.5 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="text-xs font-bold text-[var(--color-text)]">{f.label}</div>
                    <div className="text-[10px] text-[var(--color-muted)]">{f.desc}</div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      active ? 'bg-cyan-600' : 'bg-[var(--color-border)]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
