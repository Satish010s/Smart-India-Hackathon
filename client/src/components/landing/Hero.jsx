"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowRight, LuFlaskConical } from "react-icons/lu";

/* ── Palettes: neutral + single teal accent (no purple) ─────────────────── */
const THEMES = {
  dark: {
    bg: "#0a0c0f",
    surface: "#0f1318",
    surface2: "#141a21",
    border: "#1f2730",
    borderStrong: "#2b3540",
    text: "#e8ecf1",
    muted: "#8a95a3",
    accent: "#5eead4",
    accentSoft: "rgba(94,234,212,0.15)",
    neutral: "#cbd5e1",
    shadow: "0 30px 80px -30px rgba(0,0,0,0.8)",
    gridOpacity: 0.35,
  },
  light: {
    bg: "#fafaf9",
    surface: "#ffffff",
    surface2: "#f4f4f5",
    border: "#e4e4e7",
    borderStrong: "#d4d4d8",
    text: "#111418",
    muted: "#5b6572",
    accent: "#0f766e",
    accentSoft: "rgba(15,118,110,0.15)",
    neutral: "#475569",
    shadow: "0 30px 70px -30px rgba(15,23,42,0.2)",
    gridOpacity: 0.7,
  },
};

/* ── Theme detection: follows your toggle (class / data-attr / color-scheme)
   and falls back to the OS preference. Re-runs live on every toggle.
   If your toggle uses something else, adjust readTheme() only.            */
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
  const C = THEMES[theme];
  const [mounted, setMounted] = useState(false);

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
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-16 transition-colors duration-300"
      style={{ background: mounted ? C.bg : "transparent", color: C.text }}
    >


      {/* 3 Layer of Waves in 1/3 Bottom */}
      <div className="absolute bottom-0 left-0 w-full z-0 overflow-hidden" style={{ height: "33vh" }}>
        <svg
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Layer 1 (Back - Burnt Sienna) */}
          <path
            fill="#d64a17"
            fillOpacity="0.3"
            d="M0,160L48,149.3C96,139,192,117,288,138.7C384,160,480,224,576,245.3C672,267,768,245,864,208C960,171,1056,117,1152,112C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          {/* Layer 2 (Middle - Yellow Green) */}
          <path
            fill="#dee64c"
            fillOpacity="0.3"
            d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,74.7C672,75,768,117,864,154.7C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          {/* Layer 3 (Front, matching background to seamlessly transition into next section) */}
          <path
            fill={C.bg}
            fillOpacity="1"
            d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,133.3C672,139,768,181,864,208C960,235,1056,245,1152,240C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
        <div className={`flex flex-col items-center text-center ${reveal()}`}>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-heading font-bold tracking-tight leading-[1.1] mb-8 drop-shadow-lg" style={{ color: C.text }}>
            The intelligent way to learn{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block mt-2">
              <span 
                className="relative z-10 bg-clip-text text-transparent"
                style={{
                  backgroundImage: theme === 'dark'
                    ? "linear-gradient(to right, #d64a17, #e7b46a, #dee64c)"
                    : "linear-gradient(to right, #c24115, #ba812f, #84901b)"
                }}
              >
                Quantum Computing.
              </span>
              {theme === 'dark' && (
                <span className="absolute bottom-2 left-0 w-full h-4 opacity-30 blur-sm rounded-full bg-[#d64a17]" />
              )}
            </span>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-2xl leading-relaxed mb-12 max-w-3xl drop-shadow-md font-medium mx-auto" style={{ color: C.muted }}>
            An end-to-end educational platform featuring an AI quantum tutor, an interactive circuit playground, multi-backend simulations, and a fully gamified learning experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center mb-12">
            <Link
              href="/signup"
              id="hero-cta-primary"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 overflow-hidden"
              style={{ background: C.text, color: C.bg }}
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12" />
              <span className="relative z-10 flex items-center gap-2">
                Start Learning Free
                <LuArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/playground"
              id="hero-cta-secondary"
              className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ border: `2px solid ${C.borderStrong}`, color: C.text, background: C.surface }}
            >
              <LuFlaskConical size={20} style={{ color: C.accent }} aria-hidden="true" />
              Try Circuit Builder
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 justify-center px-8 py-4 rounded-3xl" style={{ border: `1px solid ${C.border}`, background: C.surface2 }}>
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: C.muted }}>
              Runs on
            </span>
            {["Qiskit Aer", "PennyLane", "Cirq", "qBraid"].map((tool, i) => (
              <span key={tool} className="flex items-center gap-8">
                {i > 0 && <span className="w-px h-5" style={{ background: C.borderStrong }} aria-hidden="true" />}
                <span className="font-mono text-sm font-semibold tracking-wide" style={{ color: C.text }}>
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