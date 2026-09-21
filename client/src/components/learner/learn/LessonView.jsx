"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  LuArrowLeft, LuArrowRight, LuPlay, LuCode,
  LuCpu, LuCheck, LuSparkles, LuBookOpen, LuLightbulb,
  LuBrain, LuCircleCheckBig, LuClock, LuVideo, LuFileText,
  LuImage, LuLoader,
} from 'react-icons/lu';
import { apiFetch } from '../../../services/api';

// ─── Demo fallback ─────────────────────────────────────────────────────────────
const DEMO_LESSON = {
  id: 'demo',
  title: 'Introduction to Quantum Computing',
  type: 'lesson',
  contentType: 'lesson',
  duration: '15 min',
  module: 'Module 1',
  blocks: [
    { id: 'b1', type: 'heading', content: 'What is a Qubit?' },
    {
      id: 'b2', type: 'text',
      content: 'A qubit (quantum bit) is the basic unit of quantum information. Unlike a classical bit that is either 0 or 1, a qubit can exist in a superposition of both states simultaneously — giving quantum computers their extraordinary power.',
    },
    {
      id: 'b3', type: 'code',
      content: `from qiskit import QuantumCircuit\n\n# Create a single qubit circuit\nqc = QuantumCircuit(1, 1)\nqc.h(0)          # Put qubit in superposition\nqc.measure(0, 0) # Measure the qubit\n\nprint(qc.draw())`,
    },
  ],
  keyPoints: ['Qubits can be 0, 1, or both simultaneously', 'Superposition enables exponential parallelism', 'Measurement collapses the quantum state'],
};

// ─── Block renderer ────────────────────────────────────────────────────────────
function BlockRenderer({ block }) {
  if (!block) return null;
  switch (block.type) {
    case 'heading':
      return <h2 className="text-xl font-semibold text-[var(--color-text)] mt-6 mb-2">{block.content}</h2>;
    case 'text':
      return (
        <p
          className="text-sm text-[var(--color-muted)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: (block.content || '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--color-text)]">$1</strong>') }}
        />
      );
    case 'code':
      return (
        <div className="rounded-xl bg-[#0d1117] border border-[var(--color-border)] overflow-hidden">
          <div className="flex items-center px-4 py-2 border-b border-[var(--color-border)]/40">
            <LuCode size={12} className="text-emerald-400 mr-2" />
            <span className="text-[10px] font-mono text-emerald-400">python</span>
          </div>
          <pre className="p-4 text-[11px] text-emerald-300 leading-relaxed overflow-x-auto font-mono">{block.content}</pre>
        </div>
      );
    case 'image':
      return (
        <div className="rounded-xl overflow-hidden border border-[var(--color-border)]">
          {block.content?.startsWith('http') ? (
            <img src={block.content} alt="Lesson image" className="w-full object-cover" />
          ) : (
            <div className="h-48 flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-muted)] text-xs gap-2">
              <LuImage size={20} className="opacity-40" />
              {block.content || 'Image'}
            </div>
          )}
        </div>
      );
    case 'video':
      return (
        <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-[#0d1117]">
          {block.content?.startsWith('http') ? (
            <video controls className="w-full" src={block.content} />
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--color-muted)] text-xs gap-2">
              <LuVideo size={20} className="opacity-40" />
              {block.content || 'Video'}
            </div>
          )}
        </div>
      );
    default:
      return block.content ? <p className="text-sm text-[var(--color-muted)] leading-relaxed">{block.content}</p> : null;
  }
}

// ─── Video player ──────────────────────────────────────────────────────────────
function VideoPlayer({ videoUrl, videoThumbnail, title }) {
  const videoRef = useRef(null);

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-[#0d1117] rounded-xl flex items-center justify-center border border-[var(--color-border)]">
        <div className="text-center text-[var(--color-muted)]">
          <LuVideo size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-xs">No video URL configured for this lecture.</p>
        </div>
      </div>
    );
  }

  let ytId = null;
  const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch) ytId = ytMatch[1];
  else if (videoUrl.includes('youtube.com/embed/')) ytId = videoUrl.split('youtube.com/embed/')[1].split('?')[0];

  if (ytId) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--color-border)]">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-black">
      <video ref={videoRef} controls poster={videoThumbnail || undefined} className="w-full max-h-[60vh]" src={videoUrl}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

// ─── Quiz section ──────────────────────────────────────────────────────────────
function QuizSection({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? questions.filter((q, i) => answers[i] === q.answer).length : 0;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-5">
      <div className="flex items-center gap-2">
        <LuBrain size={16} className="text-amber-600 dark:text-amber-400" />
        <h4 className="font-semibold text-sm text-[var(--color-text)]">Lesson Quiz</h4>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-text)]">{qi + 1}. {q.q}</p>
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = submitted && oi === q.answer;
              const isWrong = submitted && selected && oi !== q.answer;
              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                  className={`text-left px-4 py-2.5 rounded-lg border text-xs transition-all ${
                    isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400' :
                    isWrong   ? 'bg-rose-500/10   border-rose-500/40   text-rose-700   dark:text-rose-400'    :
                    selected  ? 'border-[var(--color-primary)]/50 text-[var(--color-primary)]'                 :
                    'bg-[var(--color-background,var(--bg))] border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-text)]'
                  }`}
                  style={selected && !submitted ? { background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' } : undefined}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-colors"
          style={{ background: 'var(--color-primary)' }}
        >
          Submit Answers
        </button>
      ) : (
        <div className={`px-4 py-3 rounded-lg text-sm font-semibold text-center ${
          score === questions.length
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
        }`}>
          {score}/{questions.length} correct! {score === questions.length ? '🎉 Perfect!' : '📖 Review the lesson and try again.'}
        </div>
      )}
    </div>
  );
}

// ─── Main LessonView ──────────────────────────────────────────────────────────
export default function LessonView({ lesson: lessonProp, onClose, onNext, onPrev, lessonIndex = 1, totalLessons = 1 }) {
  const [lessonData, setLessonData] = useState(lessonProp || DEMO_LESSON);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [completed, setCompleted] = useState(lessonProp?.completed || false);
  const [completing, setCompleting] = useState(false);
  const [xpEarned, setXpEarned] = useState(null);

  const isVideo = lessonData?.type === 'video lecture' || lessonData?.contentType === 'video';
  const blocks = Array.isArray(lessonData?.blocks) ? lessonData.blocks : [];
  const hasBlocks = blocks.length > 0;

  useEffect(() => {
    if (!lessonProp?.id || lessonProp.id.startsWith('les_')) return;
    if (lessonProp.blocks || lessonProp.videoUrl) {
      setLessonData(lessonProp);
      setCompleted(lessonProp.completed || false);
      return;
    }
    let mounted = true;
    setLoading(true);
    apiFetch(`/learner/lessons/${lessonProp.id}`)
      .then(res => {
        if (mounted && res?.data?.lesson) {
          setLessonData({ ...lessonProp, ...res.data.lesson });
          setCompleted(lessonProp.completed || false);
        }
      })
      .catch(err => {
        console.warn('Could not load lesson content:', err.message);
        setLessonData(lessonProp);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [lessonProp?.id]);

  const handleMarkComplete = async () => {
    if (completed || completing) return;
    setCompleting(true);
    try {
      const res = await apiFetch(`/learner/lessons/${lessonData.id}/complete`, { method: 'PATCH' });
      if (res?.success) {
        setCompleted(true);
        setXpEarned(res.data?.xpEarned || 25);
      }
    } catch (err) {
      console.warn('Complete lesson API error:', err.message);
      setCompleted(true);
      setXpEarned(25);
    } finally {
      setCompleting(false);
    }
  };

  const tabs = isVideo
    ? [{ id: 'content', label: 'Video', icon: LuVideo }]
    : [
        { id: 'content', label: 'Content', icon: LuBookOpen },
        ...(lessonData?.code    ? [{ id: 'code',    label: 'Code',    icon: LuCode }] : []),
        ...(lessonData?.circuit ? [{ id: 'circuit', label: 'Circuit', icon: LuCpu  }] : []),
      ];

  return (
    <div className="space-y-0">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="rounded-t-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 flex items-center gap-4">
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--color-border)]/30 text-[var(--color-muted)] transition-colors flex-shrink-0"
          >
            <LuArrowLeft size={18} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-widest flex items-center gap-1.5">
            {isVideo ? <LuVideo size={10} /> : <LuFileText size={10} />}
            {lessonData?.module || 'Lesson'}
          </div>
          <h2 className="text-base font-semibold text-[var(--color-text)] truncate">{lessonData?.title || 'Loading...'}</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] font-mono flex-shrink-0">
          <LuClock size={12} />
          {lessonData?.duration}
          <span className="ml-2">Lesson {lessonIndex}/{totalLessons}</span>
        </div>
      </div>

      {/* ── Progress bar (solid, no gradient) ─────────────────────────── */}
      <div className="h-0.5 bg-[var(--color-border)]">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(lessonIndex / totalLessons) * 100}%`, background: 'var(--color-primary)' }}
        />
      </div>

      {/* ── Content body ───────────────────────────────────────────────── */}
      <div className="rounded-b-xl border-x border-b border-[var(--color-border)] bg-[var(--color-background,var(--bg))] p-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <LuLoader size={22} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm text-[var(--color-muted)]">Loading lesson content...</p>
          </div>
        ) : (
          <>
            {/* Tab bar */}
            {tabs.length > 1 && (
              <div className="flex gap-1 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg w-fit">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all ${
                        activeTab === tab.id
                          ? 'text-white'
                          : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                      }`}
                      style={activeTab === tab.id ? { background: 'var(--color-primary)' } : undefined}
                    >
                      <Icon size={13} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* VIDEO */}
            {isVideo && (
              <div className="space-y-4">
                <VideoPlayer videoUrl={lessonData?.videoUrl} videoThumbnail={lessonData?.videoThumbnail} title={lessonData?.title} />
                {lessonData?.description && (
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{lessonData.description}</p>
                )}
              </div>
            )}

            {/* TEXT / BLOCK LESSON */}
            {!isVideo && activeTab === 'content' && (
              <div className="space-y-4">
                {hasBlocks ? (
                  <div className="space-y-4">
                    {blocks.map(block => <BlockRenderer key={block.id} block={block} />)}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessonData?.theory ? (
                      lessonData.theory.split('\n\n').map((para, i) => (
                        <p
                          key={i}
                          className="text-sm text-[var(--color-muted)] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--color-text)]">$1</strong>') }}
                        />
                      ))
                    ) : (
                      <div className="py-12 text-center text-[var(--color-muted)]">
                        <LuFileText size={28} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No content has been added to this lesson yet.</p>
                        <p className="text-xs mt-1 opacity-60">Check back later when the instructor publishes content.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Key takeaways */}
                {lessonData?.keyPoints?.length > 0 && (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                      <LuLightbulb size={14} className="text-amber-600 dark:text-amber-400" /> Key Takeaways
                    </div>
                    <ul className="space-y-1.5">
                      {lessonData.keyPoints.map(pt => (
                        <li key={pt} className="flex items-start gap-2 text-xs text-[var(--color-muted)]">
                          <LuCheck size={12} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" /> {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quiz */}
                {lessonData?.quizQuestions?.length > 0 && <QuizSection questions={lessonData.quizQuestions} />}
              </div>
            )}

            {/* CODE TAB */}
            {!isVideo && activeTab === 'code' && lessonData?.code && (
              <div className="rounded-xl bg-[#0d1117] border border-[var(--color-border)] overflow-hidden">
                <div className="flex items-center px-4 py-2 border-b border-[var(--color-border)]/40">
                  <LuCode size={12} className="text-emerald-400 mr-2" />
                  <span className="text-[10px] font-mono text-emerald-400">lesson_code.py</span>
                </div>
                <pre className="p-4 text-[11px] text-emerald-300 leading-relaxed overflow-x-auto font-mono">{lessonData.code}</pre>
              </div>
            )}

            {/* CIRCUIT TAB */}
            {!isVideo && activeTab === 'circuit' && lessonData?.circuit && (
              <div className="rounded-xl bg-[#0d1117] border border-[var(--color-border)] overflow-hidden">
                <div className="flex items-center px-4 py-2 border-b border-[var(--color-border)]/40">
                  <LuCpu size={12} className="text-[var(--color-primary)] mr-2" />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--color-primary)' }}>Circuit Diagram</span>
                </div>
                <div className="p-6">
                  <pre className="text-sm font-mono leading-loose" style={{ color: 'var(--color-primary)' }}>{lessonData.circuit}</pre>
                </div>
              </div>
            )}

            {/* XP flash */}
            {xpEarned && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-semibold">
                <LuSparkles size={14} /> +{xpEarned} XP earned! Great work.
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)]/30 disabled:opacity-30 transition-all"
              >
                <LuArrowLeft size={14} /> Previous
              </button>

              {!completed ? (
                <button
                  onClick={handleMarkComplete}
                  disabled={completing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {completing ? <LuLoader size={14} className="animate-spin" /> : <LuCircleCheckBig size={14} />}
                  {completing ? 'Saving...' : 'Mark Complete'}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <LuCheck size={13} /> Completed!
                  </span>
                  {onNext && (
                    <button
                      onClick={onNext}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-all"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      Next Lesson <LuArrowRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
