"use client";

import React from "react";
import Link from "next/link";

const LOGO_CSS = `
.qm-logo{
  --l-surface:#ffffff;
  --l-border:#d4d4d8;
  --l-text:#111418;
  --l-muted:#5b6572;
  --l-accent:#0f766e;
}
.dark .qm-logo,
[data-theme="dark"] .qm-logo{
  --l-surface:#0f1318;
  --l-border:#2b3540;
  --l-text:#e8ecf1;
  --l-muted:#8a95a3;
  --l-accent:#5eead4;
}
`;

export function QubitMindMark({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="10"
        style={{ fill: "var(--l-surface)", stroke: "var(--l-border)" }}
        strokeWidth="1.5"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="12.5"
        ry="5.5"
        transform="rotate(-35 20 20)"
        style={{ stroke: "var(--l-accent)" }}
        strokeWidth="1.6"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="12.5"
        ry="5.5"
        transform="rotate(35 20 20)"
        style={{ stroke: "var(--l-accent)" }}
        strokeWidth="1.6"
        opacity="0.4"
      />
      <circle cx="20" cy="20" r="2.8" style={{ fill: "var(--l-accent)" }} />
      <circle cx="29.2" cy="14.3" r="1.7" style={{ fill: "var(--l-text)" }} />
    </svg>
  );
}

export default function QubitMindLogo({
  iconSize = 36,
  subtitle = "",
  href = "/",
  showText = true,
  className = "",
}) {
  return (
    <Link
      href={href}
      aria-label="QubitMinds home"
      className={`qm-logo group inline-flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--l-accent)] ${className}`}
    >
      <style>{LOGO_CSS}</style>

      <QubitMindMark
        size={iconSize}
        className="transition-transform duration-300 group-hover:rotate-[8deg] motion-reduce:transition-none"
      />

      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className="font-heading text-lg font-semibold tracking-tight"
            style={{ color: "var(--l-text)" }}
          >
            Qubit<span style={{ color: "var(--l-accent)" }}>Minds</span>
          </span>
          {subtitle && (
            <span
              className="hidden sm:block mt-1 text-[9px] font-mono font-medium uppercase tracking-[0.18em]"
              style={{ color: "var(--l-muted)" }}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}