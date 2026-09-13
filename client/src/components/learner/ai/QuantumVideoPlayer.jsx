"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  LuPlay,
  LuPause,
  LuRotateCcw,
  LuSkipBack,
  LuSkipForward,
  LuVolume2,
  LuVolumeX,
  LuMaximize,
  LuMinimize,
  LuSparkles,
  LuBrain,
  LuClock,
  LuCheck,
  LuX,
  LuCircleHelp,
  LuShare2,
} from 'react-icons/lu';

export default function QuantumVideoPlayer({ video, onRegenerate }) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 within current scene
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [canvasAngle, setCanvasAngle] = useState(0);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const speechUtteranceRef = useRef(null);

  const scenes = video?.scenes || [];
  const currentScene = scenes[currentSceneIdx] || scenes[0];
  const totalScenes = scenes.length;

  // ─── 3D Bloch Sphere / Quantum Animation Canvas ──────────────────────────
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let angle = canvasAngle;

    const render = () => {
      angle += 0.015 * (isPlaying ? 1 : 0.4);
      setCanvasAngle(angle);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.32;

      ctx.clearRect(0, 0, w, h);

      // Gradient backdrop glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r * 1.5);
      bgGrad.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
      bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (currentScene?.visualType === 'bloch_sphere') {
        // Draw 3D Bloch Sphere
        // Outer boundary circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Equator ellipse
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vertical meridian ellipse (rotating)
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * Math.abs(Math.cos(angle)), r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
        ctx.stroke();

        // Z-axis (Vertical)
        ctx.beginPath();
        ctx.moveTo(cx, cy - r - 15);
        ctx.lineTo(cx, cy + r + 15);
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Z Labels (|0⟩ and |1⟩)
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('|0⟩ (North)', cx, cy - r - 20);

        ctx.fillStyle = '#f43f5e';
        ctx.fillText('|1⟩ (South)', cx, cy + r + 28);

        // State vector arrow |ψ⟩ (interpolates with angle)
        const theta = currentScene?.visualData?.blochSphere?.theta ?? (Math.PI / 3);
        const phi = (currentScene?.visualData?.blochSphere?.phi ?? 0) + angle;

        const vx = cx + r * Math.sin(theta) * Math.cos(phi);
        const vy = cy - r * Math.cos(theta) + (r * 0.35) * Math.sin(theta) * Math.sin(phi);

        // Vector line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(vx, vy);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Arrow head / glowing state dot
        ctx.beginPath();
        ctx.arc(vx, vy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label on state vector
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(currentScene?.visualData?.blochSphere?.stateLabel || '|ψ⟩', vx + 12, vy - 8);

      } else if (currentScene?.visualType === 'circuit') {
        // Draw Animated Quantum Circuit
        const wires = currentScene?.visualData?.circuit?.qubits || 2;
        const spacing = (r * 1.6) / (wires + 1);

        for (let i = 0; i < wires; i++) {
          const wy = cy - r * 0.7 + (i + 1) * spacing;

          // Wire
          ctx.beginPath();
          ctx.moveTo(cx - r * 1.3, wy);
          ctx.lineTo(cx + r * 1.3, wy);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Qubit label
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`q[${i}]: |0⟩`, cx - r * 1.35, wy + 4);

          // Gate boxes
          const gx = cx - r * 0.3 + (i === 0 ? 0 : 70);
          ctx.fillStyle = i === 0 ? '#0284c7' : '#7c3aed';
          ctx.roundRect(gx - 18, wy - 18, 36, 36, 6);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(i === 0 ? 'H' : 'X', gx, wy + 5);

          // Moving quantum particle pulse
          const pulseX = cx - r * 1.3 + ((angle * 60) % (r * 2.6));
          ctx.beginPath();
          ctx.arc(pulseX, wy, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // CNOT connection line if 2+ qubits
        if (wires >= 2) {
          const wy0 = cy - r * 0.7 + 1 * spacing;
          const wy1 = cy - r * 0.7 + 2 * spacing;
          const cnotX = cx + r * 0.4;

          ctx.beginPath();
          ctx.moveTo(cnotX, wy0);
          ctx.lineTo(cnotX, wy1);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Control dot
          ctx.beginPath();
          ctx.arc(cnotX, wy0, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();

          // Target circle
          ctx.beginPath();
          ctx.arc(cnotX, wy1, 10, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

      } else {
        // Probability Wave or Matrix Interference mode
        const probs = currentScene?.visualData?.probabilities || [
          { state: '|00⟩', prob: 0.5 },
          { state: '|11⟩', prob: 0.5 },
        ];

        const barWidth = 50;
        const totalW = probs.length * (barWidth + 24);
        const startX = cx - totalW / 2;

        probs.forEach((p, idx) => {
          const bx = startX + idx * (barWidth + 24);
          const barH = (r * 1.3) * p.prob;
          const by = cy + r * 0.6 - barH;

          // Bar gradient
          const barGrad = ctx.createLinearGradient(bx, by, bx, by + barH);
          barGrad.addColorStop(0, '#06b6d4');
          barGrad.addColorStop(1, '#8b5cf6');
          ctx.fillStyle = barGrad;
          ctx.roundRect(bx, by, barWidth, barH, [6, 6, 0, 0]);
          ctx.fill();

          // Value
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${Math.round(p.prob * 100)}%`, bx + barWidth / 2, by - 6);

          // State label
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(p.state, bx + barWidth / 2, cy + r * 0.6 + 18);
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentScene, isPlaying]);

  // ─── Speech Synthesis Narration ──────────────────────────────────────────
  const speakNarration = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (isMuted || !text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    // Pick English natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => {
      // Advance to next scene automatically when done
      if (currentSceneIdx < totalScenes - 1) {
        setCurrentSceneIdx(prev => prev + 1);
        setProgress(0);
      } else {
        setIsPlaying(false);
        setShowQuiz(true);
      }
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          speakNarration(currentScene?.narration);
        }
      }
    }
  };

  // Change scene
  useEffect(() => {
    setProgress(0);
    if (isPlaying) {
      speakNarration(currentScene?.narration);
    }
  }, [currentSceneIdx]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer progression for progress bar
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const duration = (currentScene?.durationSeconds || 15) * 1000;
    const interval = 100;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + (interval / duration) * 100;
        if (next >= 100) return 100;
        return next;
      });
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentSceneIdx]);

  const goToScene = (idx) => {
    setCurrentSceneIdx(idx);
    setShowQuiz(false);
  };

  return (
    <div className="flex flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-background)]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white shadow-md">
            <LuSparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--color-text)] leading-tight">{video.title}</h2>
            <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)] font-mono">
              <span>{video.level || 'Beginner'}</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">{video.scenes?.length || 0} Scenes</span>
              <span>•</span>
              <span className="flex items-center gap-1"><LuClock size={11} />~{video.totalDurationSeconds || 90}s</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors flex items-center gap-1.5"
            >
              <LuRotateCcw size={13} />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video Screen (Visual Stage) */}
      <div className="relative aspect-video w-full bg-[#070b13] flex items-center justify-center overflow-hidden select-none">
        {/* Animated Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full object-contain"
        />

        {/* On-screen visual overlays */}
        <div className="absolute top-6 left-6 max-w-sm space-y-1 pointer-events-none">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Scene {currentSceneIdx + 1} of {totalScenes}: {currentScene?.title}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
            {currentScene?.visualData?.headline}
          </h3>
          <p className="text-xs text-slate-300 font-medium">
            {currentScene?.visualData?.subheadline}
          </p>
        </div>

        {/* Equation Badge */}
        {currentScene?.visualData?.equation && (
          <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-xl text-cyan-300 font-mono text-xs shadow-lg">
            {currentScene.visualData.equation}
          </div>
        )}

        {/* Code Snippet Overlay (if type is code) */}
        {currentScene?.visualType === 'code' && currentScene?.visualData?.codeSnippet && (
          <div className="absolute inset-x-8 bottom-16 bg-slate-950/90 border border-slate-700/60 rounded-2xl p-4 font-mono text-[11px] text-cyan-300 overflow-x-auto shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 text-slate-400 text-[10px]">
              <span>qiskit_implementation.py</span>
              <span className="text-emerald-400">● Live Python</span>
            </div>
            <pre className="leading-relaxed">{currentScene.visualData.codeSnippet}</pre>
          </div>
        )}

        {/* Bullet Points Overlay */}
        {currentScene?.visualData?.points && currentScene?.visualType !== 'code' && (
          <div className="absolute bottom-16 right-6 max-w-xs space-y-1.5 pointer-events-none hidden sm:block">
            {currentScene.visualData.points.map((pt, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-900/75 backdrop-blur-md border border-slate-700/40 px-2.5 py-1 rounded-lg text-[11px] text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Big Center Play Overlay Button if Paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
          >
            <LuPlay size={26} className="ml-1 group-hover:scale-105 transition-transform" />
          </button>
        )}

        {/* Interactive Quiz Modal Overlay */}
        {showQuiz && video.quizQuestion && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-6 z-20">
            <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                  <LuBrain size={14} /> Comprehension Check
                </span>
                <button onClick={() => setShowQuiz(false)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  <LuX size={16} />
                </button>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-[var(--color-text)]">
                {video.quizQuestion.question}
              </h4>

              <div className="space-y-2">
                {video.quizQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === video.quizQuestion.correctIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="p-3 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-muted)] leading-relaxed">
                  {selectedAnswer === video.quizQuestion.correctIndex ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 mb-1">
                      <LuCheck size={14} /> Correct!
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold block mb-1">Incorrect</span>
                  )}
                  {video.quizQuestion.explanation}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrubber & Player Controls */}
      <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-background)] space-y-4">
        {/* Progress Bar (Scene Timeline) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-[var(--color-muted)]">
            <span>Scene {currentSceneIdx + 1}: {currentScene?.title}</span>
            <span>{Math.round(progress)}% of scene</span>
          </div>

          <div className="flex gap-1 h-2">
            {scenes.map((sc, idx) => {
              const isPast = idx < currentSceneIdx;
              const isCurrent = idx === currentSceneIdx;
              return (
                <div
                  key={idx}
                  onClick={() => goToScene(idx)}
                  className="flex-1 bg-[var(--color-border)]/40 rounded-full overflow-hidden cursor-pointer hover:brightness-125 transition-all relative"
                >
                  <div
                    className={`h-full rounded-full transition-all ${
                      isPast
                        ? 'bg-cyan-500'
                        : isCurrent
                        ? 'bg-gradient-to-r from-cyan-400 to-violet-500'
                        : 'bg-transparent'
                    }`}
                    style={{ width: isCurrent ? `${progress}%` : isPast ? '100%' : '0%' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Control Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Playback transport */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToScene(Math.max(0, currentSceneIdx - 1))}
              disabled={currentSceneIdx === 0}
              className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/20 disabled:opacity-30 transition-colors"
            >
              <LuSkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 rounded-2xl bg-[var(--color-primary)] text-white hover:opacity-90 transition-all shadow-md shadow-[var(--color-primary)]/20"
            >
              {isPlaying ? <LuPause size={18} /> : <LuPlay size={18} className="ml-0.5" />}
            </button>

            <button
              onClick={() => goToScene(Math.min(totalScenes - 1, currentSceneIdx + 1))}
              disabled={currentSceneIdx === totalScenes - 1}
              className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/20 disabled:opacity-30 transition-colors"
            >
              <LuSkipForward size={18} />
            </button>

            <button
              onClick={() => {
                goToScene(0);
                setProgress(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/20 transition-colors"
              title="Restart from beginning"
            >
              <LuRotateCcw size={16} />
            </button>
          </div>

          {/* Right: Audio & Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-mono ${
                isMuted
                  ? 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                  : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {isMuted ? <LuVolumeX size={15} /> : <LuVolume2 size={15} />}
              <span>{isMuted ? 'Muted' : 'Voice On'}</span>
            </button>

            <select
              value={playbackSpeed}
              onChange={e => setPlaybackSpeed(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-mono text-[var(--color-text)] focus:outline-none"
            >
              <option value={0.8}>0.8x</option>
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>

            {video.quizQuestion && (
              <button
                onClick={() => setShowQuiz(true)}
                className="px-3 py-1.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:bg-violet-500/25 transition-colors flex items-center gap-1.5"
              >
                <LuCircleHelp size={14} />
                <span>Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Voiceover Subtitle / Transcript */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-muted)]">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className={`w-2 h-2 rounded-full bg-cyan-400 ${isPlaying && !isMuted ? 'animate-ping' : ''}`} />
              AI Voiceover Narration
            </span>
            <span>Key Takeaway</span>
          </div>

          <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed italic">
            "{currentScene?.narration}"
          </p>

          {currentScene?.keyTakeaway && (
            <div className="pt-2 border-t border-[var(--color-border)]/40 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <LuCheck size={14} /> {currentScene.keyTakeaway}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
