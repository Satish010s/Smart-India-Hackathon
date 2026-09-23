"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowRight, LuFlaskConical, LuSparkles } from "react-icons/lu";

/* ── High-Quality Quantum Images (Excluding images 2 and 6) ────────────────── */
const HERO_IMAGES = [
  "/images/datacenter.jpg",
  "/images/quantum-bg.jpg",
  "/images/c8b456d8a4c183d6ba3a34f326eb7b19.jpg",
  "/images/44aab134f62d3230400e2dc44759e10a.jpg",
];

/* ── Theme detection ─────────────────────────────────────────────────────── */
function readTheme() {
  const roots = [document.documentElement, document.body];
  for (const el of roots) {
    if (!el) continue;
    const attr = el.getAttribute("data-theme") || el.getAttribute("data-mode");
    if (el.classList.contains("dark") || attr === "dark") return "dark";
    if (el.classList.contains("light") || attr === "light") return "light";
  }
  const cs = document.documentElement.style.colorScheme;
  if (cs === "dark" || cs === "light") return cs;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function useTheme() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const apply = () => setTheme(readTheme());
    apply();

    const opts = { attributes: true, attributeFilter: ["class", "data-theme", "data-mode", "style"] };
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, opts);
    if (document.body) mo.observe(document.body, opts);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);

    return () => {
      mo.disconnect();
      mq.removeEventListener("change", apply);
    };
  }, []);

  return theme;
}

export default function Hero() {
  const theme = useTheme();
  const isLight = theme === "light";
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance background carousel (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reveal = (delay = "") =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${delay} ${
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;

  return (
    <section
      id="hero"
      aria-label="QubitMinds introduction"
      className={`relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 transition-colors duration-300 ${
        isLight ? "bg-[#fafaf9] text-slate-900" : "bg-[#0a0c0f] text-white"
      }`}
    >
      {/* ── Background Image Carousel ── */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {HERO_IMAGES.map((src, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Quantum Infrastructure Background"
                loading={idx === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover object-center brightness-105 contrast-105 opacity-100"
              />
            </div>
          );
        })}

        {/* Smooth Subtle Overlay (No heavy white wash or blurring on images) */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            background: isLight
              ? "linear-gradient(180deg, rgba(250,250,249,0.3) 0%, rgba(250,250,249,0.05) 35%, rgba(250,250,249,0.1) 65%, rgba(250,250,249,0.7) 100%)"
              : "linear-gradient(180deg, rgba(10,12,15,0.82) 0%, rgba(10,12,15,0.55) 35%, rgba(10,12,15,0.6) 65%, rgba(10,12,15,1) 100%)",
          }}
        />
      </div>

      {/* ── Bottom Wave Transition ── */}
      <div
        className="absolute bottom-0 left-0 w-full z-[5] overflow-hidden pointer-events-none"
        style={{ height: "10vh" }}
      >
        <svg
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ea580c"
            fillOpacity={isLight ? "0.15" : "0.3"}
            d="M0,160L48,149.3C96,139,192,117,288,138.7C384,160,480,224,576,245.3C672,267,768,245,864,208C960,171,1056,117,1152,112C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill={isLight ? "#fafaf9" : "#0a0c0f"}
            fillOpacity="1"
            d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,133.3C672,139,768,181,864,208C960,235,1056,245,1152,240C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* ── Main Content Container ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center my-auto">
        {/* Soft Backlight Spotlight behind text (Ensures 100% text legibility over busy background images) */}
        <div
          className="absolute -inset-x-8 -inset-y-6 -z-10 pointer-events-none rounded-3xl"
          style={{
            background: isLight
              ? "radial-gradient(ellipse 90% 75% at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 100%)"
              : "radial-gradient(ellipse 90% 75% at 50% 50%, rgba(10,12,15,0.85) 0%, rgba(10,12,15,0.55) 45%, rgba(10,12,15,0) 100%)",
            filter: "blur(20px)",
          }}
        />

        <div className={`flex flex-col items-center text-center ${reveal()}`}>
          {/* Top Pill Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-md transition-colors ${
              isLight
                ? "bg-white/90 text-slate-900 border border-slate-300 shadow-sm"
                : "bg-teal-950/70 text-teal-300 border border-teal-500/30 shadow-md"
            }`}
          >
            <LuSparkles className={isLight ? "text-amber-600" : "text-amber-400"} size={14} />
            Next-Gen AI Quantum Platform
          </div>

          {/* Headline */}
          <h1
            className={`text-4xl sm:text-6xl xl:text-7xl font-heading font-extrabold tracking-tight leading-[1.15] mb-6 ${
              isLight ? "text-slate-950" : "text-white"
            }`}
            style={{
              textShadow: isLight
                ? "0 0 20px #ffffff, 0 0 10px #ffffff, 0 1px 3px #ffffff"
                : "0 2px 8px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            The intelligent way to learn{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block mt-2">
              {/* Pure Crisp White / Light Gold Text */}
              <span
                className={`relative z-10 inline-block font-extrabold bg-clip-text text-transparent ${
                  isLight
                    ? "bg-gradient-to-r from-[#0f172a] via-[#d97706] to-[#0284c7]"
                    : "bg-gradient-to-r from-[#ffffff] via-[#fef08a] to-[#38bdf8]"
                }`}
                style={{
                  textShadow: isLight
                    ? "0 0 20px #ffffff"
                    : "0 0 20px rgba(56, 189, 248, 0.5), 0 2px 8px rgba(0, 0, 0, 0.9)",
                }}
              >
                Quantum Computing.
              </span>

              {/* Sleek Underline Accent Bar */}
              <span
                className="absolute -bottom-1 left-0 w-full h-1.5 rounded-full"
                style={{
                  background: isLight
                    ? "linear-gradient(90deg, #d97706, #0284c7, #38bdf8)"
                    : "linear-gradient(90deg, #38bdf8, #818cf8, #fbbf24)",
                  boxShadow: isLight
                    ? "0 0 10px rgba(217, 119, 6, 0.4)"
                    : "0 0 16px rgba(56, 189, 248, 0.85)",
                }}
              />
            </span>
          </h1>

          {/* Subheading */}
          <p
            className={`text-base sm:text-xl lg:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto ${
              isLight ? "text-slate-950 font-bold" : "text-slate-200 font-medium"
            }`}
            style={{
              textShadow: isLight
                ? "0 0 16px #ffffff, 0 0 8px #ffffff, 0 1px 2px #ffffff"
                : "0 2px 8px rgba(0,0,0,0.9)",
            }}
          >
            An end-to-end educational platform featuring an AI quantum tutor, an interactive circuit playground, multi-backend simulations, and a fully gamified learning experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-10">
            <Link
              href="/signup"
              id="hero-cta-primary"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base sm:text-lg text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 overflow-hidden bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#d97706] shadow-[0_10px_35px_-8px_rgba(234,88,12,0.6)] hover:shadow-[0_14px_45px_-6px_rgba(234,88,12,0.85)] border border-white/30 active:scale-[0.98]"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-out -translate-x-full skew-x-12 pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2.5 drop-shadow">
                Start Learning Free
                <LuArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </span>
            </Link>

            <Link
              href="/playground"
              id="hero-cta-secondary"
              className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 backdrop-blur-md active:scale-[0.98] ${
                isLight
                  ? "bg-white/80 hover:bg-white text-slate-900 border border-slate-300 shadow-md"
                  : "bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 shadow-xl"
              }`}
            >
              <LuFlaskConical
                size={20}
                className={isLight ? "text-teal-700" : "text-teal-300"}
                aria-hidden="true"
              />
              Try Circuit Builder
            </Link>
          </div>

          {/* Trust Strip */}
          <div
            className={`flex flex-wrap items-center gap-x-6 gap-y-3 justify-center px-7 py-3.5 rounded-full backdrop-blur-md border ${
              isLight
                ? "bg-white/90 border-slate-200/90 text-slate-700 shadow-sm"
                : "bg-slate-900/80 border-slate-800 text-slate-300 shadow-lg"
            }`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-widest ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Runs on
            </span>
            {["Qiskit Aer", "PennyLane", "Cirq", "qBraid"].map((tool, i) => (
              <span key={tool} className="flex items-center gap-6">
                {i > 0 && (
                  <span
                    className={`w-px h-4 ${isLight ? "bg-slate-300" : "bg-slate-700"}`}
                    aria-hidden="true"
                  />
                )}
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wide">
                  {tool}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}