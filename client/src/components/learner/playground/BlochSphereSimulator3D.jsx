"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';

// ══════════════════════════════════════════════════════════════════════════════
//  Math Utilities & Vector Operations
// ══════════════════════════════════════════════════════════════════════════════

const TAU = Math.PI * 2;
const PI  = Math.PI;

const mat3Vec = (m, v) => [
  m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2],
  m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2],
  m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2],
];

const mat3Mul = (a, b) => {
  const r = [[0,0,0],[0,0,0],[0,0,0]];
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) for (let k=0;k<3;k++) r[i][j] += a[i][k]*b[k][j];
  return r;
};

const rotX = a => { const c=Math.cos(a),s=Math.sin(a); return [[1,0,0],[0,c,-s],[0,s,c]]; };
const rotY = a => { const c=Math.cos(a),s=Math.sin(a); return [[c,0,s],[0,1,0],[-s,0,c]]; };
const rotZ = a => { const c=Math.cos(a),s=Math.sin(a); return [[c,-s,0],[s,c,0],[0,0,1]]; };

const axisAngleMat = (nx, ny, nz, angle) => {
  const len = Math.sqrt(nx*nx+ny*ny+nz*nz) || 1;
  nx/=len; ny/=len; nz/=len;
  const c=Math.cos(angle), s=Math.sin(angle), t=1-c;
  return [
    [t*nx*nx+c,    t*nx*ny-s*nz, t*nx*nz+s*ny],
    [t*nx*ny+s*nz, t*ny*ny+c,    t*ny*nz-s*nx],
    [t*nx*nz-s*ny, t*ny*nz+s*nx, t*nz*nz+c   ],
  ];
};

const blochFromAngles = (theta, phi) => [
  Math.sin(theta) * Math.cos(phi),
  Math.sin(theta) * Math.sin(phi),
  Math.cos(theta),
];

const anglesFromBloch = (v) => {
  const theta = Math.acos(Math.max(-1, Math.min(1, v[2])));
  let phi = Math.atan2(v[1], v[0]);
  if (phi < 0) phi += TAU;
  return { theta, phi };
};

// ── Spherical linear interpolation (slerp) ───────────────────────────────────
function slerpVec(a, b, t) {
  const magA = Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]) || 1;
  const magB = Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2]) || 1;
  const magT  = magA + (magB - magA) * t;

  const ua = a.map(c=>c/magA);
  const ub = b.map(c=>c/magB);

  const dot = Math.max(-1, Math.min(1, ua[0]*ub[0]+ua[1]*ub[1]+ua[2]*ub[2]));
  const angle = Math.acos(dot);

  if (angle < 1e-5) return b;

  const sinA = Math.sin(angle);
  const fa = Math.sin((1-t)*angle) / sinA;
  const fb = Math.sin(t * angle)   / sinA;

  const dir = [fa*ua[0]+fb*ub[0], fa*ua[1]+fb*ub[1], fa*ua[2]+fb*ub[2]];
  return dir.map(c => c * magT);
}

// ── Ultra-Smooth Easing (Quintic Smoothstep) ─────────────────────────────────
const smoothQuintic = t =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

// ══════════════════════════════════════════════════════════════════════════════
//  Gate Definitions
// ══════════════════════════════════════════════════════════════════════════════

const GATE_DEFS = {
  Px:    rotX(PI),      Py:    rotY(PI),      Pz:    rotZ(PI),
  H:     axisAngleMat(1,0,1,PI),
  'Px½': rotX(PI/2),   'Py½': rotY(PI/2),   'Pz½': rotZ(PI/2),
  'Px-½':rotX(-PI/2),  'Py-½':rotY(-PI/2),  'Pz-½':rotZ(-PI/2),
  S:     rotZ(PI/2),   'S-1': rotZ(-PI/2),  T:     rotZ(PI/4),   'T-1': rotZ(-PI/4),
  'Px¼': rotX(PI/4),   'Py¼': rotY(PI/4),   'Pz¼': rotZ(PI/4),
  'Px-¼':rotX(-PI/4),  'Py-¼':rotY(-PI/4),  'Pz-¼':rotZ(-PI/4),
};

// ══════════════════════════════════════════════════════════════════════════════
//  Canvas 3D Renderer (HiDPI Vector Crisp with Dual Light/Dark Theme Support)
// ══════════════════════════════════════════════════════════════════════════════

const FOV = 4.5;

function projectPt(p3, cam, cx, cy, scale) {
  const t = mat3Vec(cam, p3);
  const d = Math.max(0.01, t[2] + FOV);
  return { x: cx + (t[0]/d)*scale*FOV, y: cy - (t[1]/d)*scale*FOV, z: t[2] };
}

// ── Cross-browser safe rounded rectangle ────────────────────────────────────
function drawPill(ctx, x, y, w, h, r, fillColor, strokeColor) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
  ctx.closePath();
  if (fillColor) { ctx.fillStyle = fillColor; ctx.fill(); }
  if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = 1; ctx.stroke(); }
}

// ── Sphere 3D gradient surface ──────────────────────────────────────────────
function drawSphereFill(ctx, cam, cx, cy, scale, isLight = false) {
  const lightDir = mat3Vec(cam, [-0.4, 0.65, 0.75]);
  const lx = lightDir[0], ly = -lightDir[1];
  const len = Math.sqrt(lx*lx+ly*ly) || 1;
  const lnx = lx/len, lny = ly/len;

  const lGrad = ctx.createRadialGradient(
    cx + lnx*scale*0.40, cy + lny*scale*0.40, scale*0.02,
    cx, cy, scale*1.06
  );

  if (isLight) {
    lGrad.addColorStop(0,   'rgba(14, 165, 233, 0.22)');
    lGrad.addColorStop(0.35,'rgba(186, 230, 253, 0.35)');
    lGrad.addColorStop(0.70,'rgba(226, 232, 240, 0.50)');
    lGrad.addColorStop(1,   'rgba(203, 213, 225, 0.65)');
  } else {
    lGrad.addColorStop(0,   'rgba(56, 120, 245, 0.25)');
    lGrad.addColorStop(0.40,'rgba(20, 35, 90, 0.16)');
    lGrad.addColorStop(0.75,'rgba(8, 14, 40, 0.22)');
    lGrad.addColorStop(1,   'rgba(4, 6, 20, 0.42)');
  }

  ctx.beginPath();
  ctx.arc(cx, cy, scale, 0, TAU);
  ctx.fillStyle = lGrad;
  ctx.fill();

  const hGrad = ctx.createRadialGradient(
    cx + lnx*scale*0.50, cy + lny*scale*0.50, 0,
    cx + lnx*scale*0.50, cy + lny*scale*0.50, scale*0.45
  );
  if (isLight) {
    hGrad.addColorStop(0,   'rgba(255, 255, 255, 0.85)');
    hGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.35)');
    hGrad.addColorStop(1,   'transparent');
  } else {
    hGrad.addColorStop(0,   'rgba(160, 210, 255, 0.22)');
    hGrad.addColorStop(0.5, 'rgba(70, 140, 240, 0.08)');
    hGrad.addColorStop(1,   'transparent');
  }
  ctx.beginPath();
  ctx.arc(cx, cy, scale, 0, TAU);
  ctx.fillStyle = hGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, scale, 0, TAU);
  ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.45)' : 'rgba(56, 189, 248, 0.22)';
  ctx.lineWidth = 1.8;
  ctx.stroke();
}

// ── Sphere wireframe grid with high depth contrast ──────────────────────────
function drawSphereWireframe(ctx, cam, cx, cy, scale, isLight = false) {
  const SEG = 48;

  const drawArcPath = (pts, isSpecial = false, specialColor = '') => {
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = projectPt(pts[i],   cam, cx, cy, scale);
      const p2 = projectPt(pts[i+1], cam, cx, cy, scale);
      const mz = (p1.z + p2.z) / 2;
      const back = mz < 0;

      const depthT = Math.max(0, Math.min(1, (mz + 1.2) / 2.4));
      const alpha   = back ? (0.05 + depthT * 0.08) : (0.22 + depthT * 0.42);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      if (isSpecial) {
        ctx.strokeStyle = back
          ? specialColor.replace('1)', `${alpha * 0.5})`)
          : specialColor.replace('1)', `${alpha * 1.5})`);
        ctx.lineWidth = back ? 1.0 : 2.0;
      } else {
        ctx.strokeStyle = isLight
          ? (back ? `rgba(71, 85, 105, ${alpha * 0.9})` : `rgba(15, 23, 42, ${Math.min(1, alpha * 1.8)})`)
          : (back ? `rgba(60, 100, 210, ${alpha * 0.7})` : `rgba(90, 150, 255, ${alpha})`);
        ctx.lineWidth = back ? 0.7 : (isLight ? 1.2 : 1.0);
      }
      ctx.setLineDash(back ? [3, 6] : []);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  // Latitude Parallels
  for (let li = 1; li < 7; li++) {
    const lat = PI * li / 7 - PI/2;
    const r = Math.cos(lat), zv = Math.sin(lat);
    drawArcPath(Array.from({length: SEG+1}, (_,j) => {
      const lon = TAU*j/SEG;
      return [r*Math.cos(lon), r*Math.sin(lon), zv];
    }));
  }

  // Equator Circle (Bold Sky Blue)
  drawArcPath(Array.from({length: SEG+1}, (_,j) => {
    const lon = TAU*j/SEG;
    return [Math.cos(lon), Math.sin(lon), 0];
  }), true, isLight ? 'rgba(2, 132, 199, 1)' : 'rgba(56, 189, 248, 1)');

  // Prime Meridian (Bold Purple/Violet)
  drawArcPath(Array.from({length: SEG+1}, (_,j) => {
    const lat = PI*j/SEG - PI/2;
    return [Math.cos(lat), 0, Math.sin(lat)];
  }), true, isLight ? 'rgba(126, 34, 206, 1)' : 'rgba(192, 132, 252, 1)');

  // Longitude Meridians
  for (let mi = 0; mi < 8; mi++) {
    const lon = TAU*mi/8;
    if (mi === 0 || mi === 4) continue;
    drawArcPath(Array.from({length: SEG+1}, (_,j) => {
      const lat = PI*j/SEG - PI/2;
      return [Math.cos(lat)*Math.cos(lon), Math.cos(lat)*Math.sin(lon), Math.sin(lat)];
    }));
  }
}

// ── 3D Axis Arrows ──────────────────────────────────────────────────────────
function drawAxisArrow(ctx, from3, to3, cam, cx, cy, scale, color) {
  const f = projectPt(from3, cam, cx, cy, scale);
  const t = projectPt(to3,   cam, cx, cy, scale);
  const HEAD = 12;

  ctx.save();
  ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y);
  ctx.strokeStyle = color; ctx.lineWidth = 2.4;
  ctx.shadowColor = color; ctx.shadowBlur = 6;
  ctx.stroke();

  const ang = Math.atan2(t.y-f.y, t.x-f.x);
  ctx.beginPath();
  ctx.moveTo(t.x, t.y);
  ctx.lineTo(t.x - HEAD*Math.cos(ang-0.38), t.y - HEAD*Math.sin(ang-0.38));
  ctx.lineTo(t.x - HEAD*Math.cos(ang+0.38), t.y - HEAD*Math.sin(ang+0.38));
  ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  ctx.restore();
}

// ── Motion Trajectory Trace (Silk Ribbon) ────────────────────────────────────
function drawMotionTrail(ctx, trail, cam, cx, cy, scale, isLight = false) {
  if (trail.length < 2) return;
  ctx.save();
  for (let i = 0; i < trail.length - 1; i++) {
    const p1 = projectPt(trail[i],   cam, cx, cy, scale);
    const p2 = projectPt(trail[i+1], cam, cx, cy, scale);
    const progress = i / trail.length;
    const alpha    = progress * 0.70;
    const width    = 1.5 + progress * 2.5;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
    ctx.lineWidth = width;
    ctx.shadowColor = isLight ? '#0284c7' : '#38bdf8';
    ctx.shadowBlur = 8 * progress;
    ctx.stroke();
  }
  ctx.restore();
}

// ── State Vector Arrow with Glowing Tip ──────────────────────────────────────
function drawStateArrow(ctx, vec, cam, cx, cy, scale, animT = 1, isLight = false) {
  const o = projectPt([0,0,0], cam, cx, cy, scale);
  const t = projectPt(vec,     cam, cx, cy, scale);
  const color = isLight ? '#0284c7' : '#38bdf8';
  const HEAD  = 15;

  const glowPulse = animT < 1 ? 26 + 14 * Math.sin(animT * PI * 4) : 18;

  ctx.save();

  // Outer glow shaft
  ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(t.x, t.y);
  ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.30)' : 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 10; ctx.stroke();

  // Inner core shaft
  ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(t.x, t.y);
  ctx.strokeStyle = color; ctx.lineWidth = 3.5;
  ctx.shadowColor = color; ctx.shadowBlur = glowPulse;
  ctx.stroke();

  // Arrowhead
  const ang = Math.atan2(t.y-o.y, t.x-o.x);
  ctx.beginPath();
  ctx.moveTo(t.x, t.y);
  ctx.lineTo(t.x - HEAD*Math.cos(ang-0.34), t.y - HEAD*Math.sin(ang-0.34));
  ctx.lineTo(t.x - HEAD*Math.cos(ang+0.34), t.y - HEAD*Math.sin(ang+0.34));
  ctx.closePath();
  ctx.fillStyle = isLight ? '#0284c7' : '#ffffff';
  ctx.shadowColor = color;
  ctx.shadowBlur = glowPulse + 10;
  ctx.fill();

  // Tip orb halo
  const halo = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 22);
  halo.addColorStop(0,   isLight ? 'rgba(2, 132, 199, 0.95)' : 'rgba(255, 255, 255, 0.95)');
  halo.addColorStop(0.35,isLight ? 'rgba(56, 189, 248, 0.70)' : 'rgba(56, 189, 248, 0.85)');
  halo.addColorStop(1,   'transparent');
  ctx.beginPath(); ctx.arc(t.x, t.y, 22, 0, TAU);
  ctx.fillStyle = halo; ctx.shadowBlur = 0; ctx.fill();

  ctx.restore();
}

// ── Text label with depth scale ──────────────────────────────────────────────
function drawTextAt(ctx, p3, text, color, cam, cx, cy, scale, fontSize=13, isLight=false) {
  const p = projectPt(p3, cam, cx, cy, scale);
  ctx.save();
  ctx.font = `bold ${fontSize}px "Courier New", monospace`;
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = isLight ? 'rgba(255, 255, 255, 0.9)' : color;
  ctx.shadowBlur = isLight ? 4 : 6;
  ctx.fillText(text, p.x, p.y);
  ctx.restore();
}

// ── Projection Dashes ────────────────────────────────────────────────────────
function drawProjectionLines(ctx, vec, cam, cx, cy, scale, isLight = false) {
  const xy = Math.sqrt(vec[0]*vec[0]+vec[1]*vec[1]);
  if (xy < 0.03) return;

  const projXY = [vec[0], vec[1], 0];
  const o   = projectPt([0,0,0], cam, cx, cy, scale);
  const tip = projectPt(vec,     cam, cx, cy, scale);
  const eq  = projectPt(projXY,  cam, cx, cy, scale);

  ctx.save();
  ctx.setLineDash([4, 6]); ctx.lineWidth = 1.4;
  ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.60)' : 'rgba(56, 189, 248, 0.40)';

  ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(eq.x, eq.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tip.x, tip.y); ctx.lineTo(eq.x, eq.y); ctx.stroke();

  ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(eq.x, eq.y, 3.5, 0, TAU);
  ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
  ctx.shadowColor = isLight ? '#0284c7' : '#38bdf8'; ctx.shadowBlur = 6;
  ctx.fill();

  ctx.restore();
}

// ── Floating Angle Badge ─────────────────────────────────────────────────────
function drawAngleBadge(ctx, sx, sy, label, value, color, isLight = false) {
  const text = `${label} = ${value}`;
  ctx.save();
  ctx.font = 'bold 11px "Courier New", monospace';
  const tw = ctx.measureText(text).width;
  const w  = tw + 16;
  const h  = 20;

  const bg = isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(8, 12, 28, 0.90)';
  drawPill(ctx, sx - w/2, sy - h/2, w, h, 6, bg, color);

  ctx.fillStyle = color;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = color; ctx.shadowBlur = 4;
  ctx.fillText(text, sx, sy);
  ctx.restore();
}

// ══════════════════════════════════════════════════════════════════════════════
//  GateButton Component
// ══════════════════════════════════════════════════════════════════════════════

function GateButton({ gateKey, base, sub, sup, onClick, isLight }) {
  return (
    <button
      onClick={() => onClick(gateKey)}
      title={gateKey}
      className={`py-2 px-1.5 rounded-xl border transition-all duration-150 text-center select-none active:scale-95 flex items-center justify-center gap-0.5 cursor-pointer ${
        isLight
          ? 'bg-slate-50 text-slate-800 border-slate-300 hover:border-cyan-600 hover:bg-cyan-50 hover:text-cyan-800 shadow-sm font-bold'
          : 'bg-[#141930] text-slate-200 border-slate-700/50 hover:text-cyan-300 hover:border-cyan-500/60'
      }`}
      style={{
        fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 700,
      }}
    >
      <span>{base}</span>
      {sub && <sub style={{fontSize:'0.72em',verticalAlign:'sub'}}>{sub}</sub>}
      {sup && <sup style={{fontSize:'0.68em',verticalAlign:'super',marginLeft:1}}>{sup}</sup>}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  Main Component: BlochSphereSimulator3D
// ══════════════════════════════════════════════════════════════════════════════

export default function BlochSphereSimulator3D({ externalVectors = null, numCircuitQubits = 0 }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Active theme is global resolvedTheme or theme
  const effectiveTheme = resolvedTheme || theme || 'dark';
  const isLight = effectiveTheme === 'light';

  const canvasRef   = useRef(null);
  const blochRef    = useRef({ theta: 0, phi: 0 });
  const animRef     = useRef(null);
  const trailRef    = useRef([]);
  const camRef      = useRef({ az: -0.55, el: 0.32 });
  const dragRef     = useRef(null);

  const [display, setDisplay]           = useState({ theta: 0, phi: 0 });
  const [lambdaAngle, setLambdaAngle]   = useState(45);
  const [animProgress, setAnimProgress] = useState(1);
  const [activeTab, setActiveTab]       = useState('gates');

  const getCam = () => mat3Mul(rotX(camRef.current.el), rotY(camRef.current.az));

  // ── Render Frame ───────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;

    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width  = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    }

    const W = rect.width;
    const H = rect.height;
    const cx = W / 2;
    const cy = H / 2;
    const scale = Math.min(W, H) * 0.31;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // ── Background Gradient ──────────────────────────────────────────────────
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.85);
    if (isLight) {
      bg.addColorStop(0, '#f8fafc');
      bg.addColorStop(0.65, '#e2e8f0');
      bg.addColorStop(1, '#cbd5e1');
    } else {
      bg.addColorStop(0, '#0d1226');
      bg.addColorStop(1, '#050712');
    }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // ── Advance Slerp Animation ─────────────────────────────────────────────
    let animT = 1;
    if (animRef.current) {
      const { from, to, startMs, durMs } = animRef.current;
      const elapsed = performance.now() - startMs;
      const rawT    = Math.min(1, elapsed / durMs);
      animT         = smoothQuintic(rawT);

      const curVec = slerpVec(from, to, animT);
      const { theta, phi } = anglesFromBloch(curVec);
      blochRef.current = { theta, phi };

      trailRef.current.push(curVec);
      if (trailRef.current.length > 35) trailRef.current.shift();

      setAnimProgress(animT);
      if (rawT >= 1) {
        animRef.current = null;
        setDisplay({ theta, phi });
        setAnimProgress(1);
      } else {
        setDisplay({ theta, phi });
      }
    }

    const cam = getCam();

    // ── 1. Sphere Surface Fill ──────────────────────────────────────────────
    drawSphereFill(ctx, cam, cx, cy, scale, isLight);

    // ── 2. Sphere Wireframe Grid ─────────────────────────────────────────────
    drawSphereWireframe(ctx, cam, cx, cy, scale, isLight);

    // ── 3. Axis Lines & Arrows ───────────────────────────────────────────────
    const AL = 1.28;
    drawAxisArrow(ctx, [-AL,0,0],[AL,0,0],  cam, cx, cy, scale, isLight ? '#dc2626' : '#f87171');
    drawAxisArrow(ctx, [0,-AL,0],[0,AL,0],  cam, cx, cy, scale, isLight ? '#16a34a' : '#4ade80');
    drawAxisArrow(ctx, [0,0,-AL],[0,0,AL],  cam, cx, cy, scale, isLight ? '#d97706' : '#facc15');

    const LL = 1.48;
    drawTextAt(ctx, [ LL,0,0], 'X', isLight ? '#dc2626' : '#f87171', cam, cx, cy, scale, 13, isLight);
    drawTextAt(ctx, [0, LL,0], 'Y', isLight ? '#16a34a' : '#4ade80', cam, cx, cy, scale, 13, isLight);
    drawTextAt(ctx, [0,0, LL], 'Z', isLight ? '#d97706' : '#facc15', cam, cx, cy, scale, 13, isLight);

    const BL = 1.66;
    drawTextAt(ctx, [0,0, BL], '|0\u27E9', isLight ? '#b45309' : '#facc15', cam, cx, cy, scale, 13, isLight);
    drawTextAt(ctx, [0,0,-BL], '|1\u27E9', isLight ? '#b91c1c' : '#f87171', cam, cx, cy, scale, 13, isLight);
    drawTextAt(ctx, [ BL,0,0], '|+\u27E9', isLight ? '#b91c1c' : '#f87171', cam, cx, cy, scale, 13, isLight);
    drawTextAt(ctx, [-BL,0,0], '|-\u27E9', isLight ? '#c2410c' : '#fb923c', cam, cx, cy, scale, 13, isLight);
    drawTextAt(ctx, [0, BL,0], '|i\u27E9', isLight ? '#15803d' : '#4ade80', cam, cx, cy, scale, 13, isLight);
    drawTextAt(ctx, [0,-BL,0], '|-i\u27E9',isLight ? '#047857' : '#34d399', cam, cx, cy, scale, 12, isLight);

    // ── 4. Trajectory Trail Ribbon ──────────────────────────────────────────
    drawMotionTrail(ctx, trailRef.current, cam, cx, cy, scale, isLight);

    // ── 5. Active State Vector ──────────────────────────────────────────────
    const { theta, phi } = blochRef.current;
    const vec = blochFromAngles(theta, phi);

    drawProjectionLines(ctx, vec, cam, cx, cy, scale, isLight);
    drawStateArrow(ctx, vec, cam, cx, cy, scale, animT, isLight);

    // ── 6. θ Arc (Latitude from Z Axis) ──────────────────────────────────────
    if (theta > 0.02) {
      ctx.save();
      ctx.beginPath();
      let first = true;
      const ARC_R = 0.38;
      for (let i = 0; i <= 36; i++) {
        const t = (i / 36) * theta;
        const ap = blochFromAngles(t, phi).map(c => c * ARC_R);
        const p  = projectPt(ap, cam, cx, cy, scale);
        if (first) { ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.90)' : 'rgba(250, 204, 21, 0.85)';
      ctx.lineWidth = 2.2; ctx.setLineDash([4, 4]);
      ctx.shadowColor = isLight ? '#d97706' : '#facc15'; ctx.shadowBlur = 6;
      ctx.stroke(); ctx.setLineDash([]); ctx.restore();

      const midT   = theta / 2;
      const midVec = blochFromAngles(midT, phi).map(c => c * ARC_R * 1.55);
      const midPt  = projectPt(midVec, cam, cx, cy, scale);
      drawAngleBadge(ctx, midPt.x, midPt.y, 'θ', `${(theta * 180 / PI).toFixed(1)}°`, isLight ? '#b45309' : '#facc15', isLight);
    }

    // ── 7. φ Arc (Longitude on Equatorial Plane) ────────────────────────────
    const sinTh = Math.sin(theta);
    if (theta > 0.02 && sinTh > 0.02) {
      ctx.save();
      ctx.beginPath();
      let first = true;
      const PHIL = 0.30;
      for (let i = 0; i <= 28; i++) {
        const t = (i / 28) * phi;
        const ap = [PHIL * Math.cos(t), PHIL * Math.sin(t), 0];
        const p  = projectPt(ap, cam, cx, cy, scale);
        if (first) { ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.90)' : 'rgba(56, 189, 248, 0.80)';
      ctx.lineWidth = 2.2; ctx.setLineDash([4, 4]);
      ctx.shadowColor = isLight ? '#0284c7' : '#38bdf8'; ctx.shadowBlur = 6;
      ctx.stroke(); ctx.setLineDash([]); ctx.restore();

      const midPhi  = phi / 2;
      const PLBL    = 0.30 * 1.62;
      const midPvec = [PLBL * Math.cos(midPhi), PLBL * Math.sin(midPhi), 0];
      const midPPt  = projectPt(midPvec, cam, cx, cy, scale);
      drawAngleBadge(ctx, midPPt.x, midPPt.y, 'φ', `${(phi * 180 / PI).toFixed(1)}°`, isLight ? '#0284c7' : '#38bdf8', isLight);
    }

    ctx.restore();
  }, [isLight]);

  useEffect(() => {
    let active = true;
    const loop = () => { if (!active) return; draw(); requestAnimationFrame(loop); };
    loop();
    return () => { active = false; };
  }, [draw]);

  const onMD = e => { dragRef.current = { x: e.clientX, y: e.clientY, ...camRef.current }; };
  const onMM = e => {
    if (!dragRef.current) return;
    camRef.current.az = dragRef.current.az - (e.clientX - dragRef.current.x) * 0.0075;
    camRef.current.el = Math.max(-1.45, Math.min(1.45, dragRef.current.el + (e.clientY - dragRef.current.y) * 0.0075));
  };
  const onMU = () => { dragRef.current = null; };
  const onTS = e => { const t = e.touches[0]; dragRef.current = { x: t.clientX, y: t.clientY, ...camRef.current }; };
  const onTM = e => {
    if (!dragRef.current) return;
    const t = e.touches[0];
    camRef.current.az = dragRef.current.az - (t.clientX - dragRef.current.x) * 0.0075;
    camRef.current.el = Math.max(-1.45, Math.min(1.45, dragRef.current.el + (t.clientY - dragRef.current.y) * 0.0075));
  };

  const applyMat = useCallback((mat) => {
    const { theta, phi } = blochRef.current;
    const from = blochFromAngles(theta, phi);
    const to   = mat3Vec(mat, from);

    animRef.current = {
      from,
      to,
      startMs: performance.now(),
      durMs:   850,
    };
  }, []);

  const applyGate = key => { const m = GATE_DEFS[key]; if (m) applyMat(m); };

  const resetTo = useCallback((t, p) => {
    const from = blochFromAngles(blochRef.current.theta, blochRef.current.phi);
    const to   = blochFromAngles(t, p);
    animRef.current = { from, to, startMs: performance.now(), durMs: 750 };
  }, []);

  const setDirectAngles = (tDeg, pDeg) => {
    const t = tDeg * PI / 180;
    const p = pDeg * PI / 180;
    resetTo(t, p);
  };

  const { theta, phi } = display;
  const vec   = blochFromAngles(theta, phi);
  const alpha = Math.cos(theta/2);
  const bMag  = Math.sin(theta/2);
  const bReal = bMag * Math.cos(phi);
  const bImag = bMag * Math.sin(phi);
  const prob0 = (alpha * alpha * 100).toFixed(1);
  const prob1 = (bMag * bMag * 100).toFixed(1);
  const fmt   = n => (n >= 0 ? '+' : '') + n.toFixed(4);

  const isAnimating = animProgress < 0.99;

  const GRow = ({ keys }) => (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${keys.length}, 1fr)` }}>
      {keys.map(([k, b, s, sp]) => (
        <GateButton key={k} gateKey={k} base={b} sub={s} sup={sp} onClick={applyGate} isLight={isLight} />
      ))}
    </div>
  );

  const MiniBloch = ({ vec: v, size = 52 }) => {
    const r  = size * 0.38;
    const cx2 = size/2, cy2 = size/2;
    const { x=0, y=0, z=0 } = v || {};
    const tx  = cx2 + x*r;
    const ty  = cy2 - (z*r*0.85 + y*r*0.30);
    const mag = Math.sqrt(x*x+y*y+z*z);
    const hue = ((Math.atan2(y,x)*180/PI)+360)%360;
    const col = `hsl(${hue},82%,60%)`;
    return (
      <svg width={size} height={size} className="overflow-visible">
        <circle cx={cx2} cy={cy2} r={r} fill="none" stroke={isLight ? "rgba(2,132,199,0.30)" : "rgba(56,189,248,0.20)"} strokeWidth={1}/>
        <line x1={cx2} y1={cy2-r*0.88} x2={cx2} y2={cy2+r*0.88} stroke={isLight ? "rgba(217,119,6,0.35)" : "rgba(250,204,21,0.25)"} strokeWidth={0.8}/>
        <line x1={cx2-r} y1={cy2} x2={cx2+r} y2={cy2} stroke={isLight ? "rgba(220,38,38,0.35)" : "rgba(248,113,113,0.22)"} strokeWidth={0.8}/>
        {mag>0.02 && (<><line x1={cx2} y1={cy2} x2={tx} y2={ty} stroke={col} strokeWidth={2} strokeLinecap="round"/><circle cx={tx} cy={ty} r={3} fill={col}/></>)}
        <circle cx={cx2} cy={cy2} r={2} fill={isLight ? "rgba(71,85,105,0.40)" : "rgba(148,163,184,0.40)"}/>
      </svg>
    );
  };

  return (
    <div
      className={`w-full h-full flex-1 flex overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#070913] text-slate-100'
      }`}
    >
      {/* ── 3-D Interactive Canvas Area ────────────────────────────────────── */}
      <div
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
        onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onMU}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Orbit Hint */}
        <div className="absolute top-4 left-4 pointer-events-none z-10">
          <span className={`text-[10px] font-mono tracking-widest uppercase opacity-80 ${isLight ? 'text-slate-700 font-bold' : 'text-slate-400'}`}>
            ✦ Drag to orbit 3D camera
          </span>
        </div>

        {/* Animating Indicator */}
        {isAnimating && (
          <div className="absolute top-14 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md"
            style={{
              background: isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(56, 189, 248, 0.12)',
              border: isLight ? '1px solid rgba(2, 132, 199, 0.40)' : '1px solid rgba(56, 189, 248, 0.35)'
            }}>
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>smooth rotation</span>
          </div>
        )}

        {/* Quick State Shortcuts */}
        <div className="absolute top-14 left-4 flex flex-col gap-1.5 pointer-events-auto">
          <span className={`text-[9px] font-mono uppercase tracking-widest mb-0.5 ${isLight ? 'text-slate-700 font-bold' : 'text-slate-500'}`}>States</span>
          {[
            ['|0⟩',  0,   0,       isLight ? 'text-amber-800' : 'text-yellow-400'],
            ['|1⟩',  PI,  0,       isLight ? 'text-rose-800' : 'text-rose-400'],
            ['|+⟩',  PI/2,0,       isLight ? 'text-sky-800' : 'text-cyan-400'],
            ['|-⟩',  PI/2,PI,      isLight ? 'text-amber-900' : 'text-amber-400'],
            ['|i⟩',  PI/2,PI/2,    isLight ? 'text-emerald-800' : 'text-emerald-400'],
            ['|-i⟩', PI/2,3*PI/2,  isLight ? 'text-teal-800' : 'text-teal-400'],
          ].map(([lbl, t, p, clr]) => (
            <button key={lbl} onClick={() => resetTo(t, p)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${clr} active:scale-95 transition-all shadow-sm cursor-pointer ${
                isLight
                  ? 'bg-white/95 border border-slate-300 hover:border-cyan-500 hover:bg-cyan-50 text-slate-800'
                  : 'bg-[#0c1022]/90 border border-cyan-500/20'
              }`}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Bottom HUD Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 grid grid-cols-3 px-8 py-3.5 font-mono text-xs backdrop-blur-md border-t transition-colors ${
            isLight
              ? 'bg-white/95 text-slate-900 border-slate-300 shadow-lg'
              : 'bg-[#04060e]/95 text-slate-100 border-slate-900'
          }`}
        >
          {/* Angles */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={isLight ? "text-slate-600 font-bold" : "text-slate-500"}>θ:</span>
              <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-yellow-300'}`}>{(theta*180/PI).toFixed(1)}°</span>
              <span className={`text-[10px] ${isLight ? 'text-slate-500 font-medium' : 'text-slate-600'}`}>({(theta/PI).toFixed(2)}π)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={isLight ? "text-slate-600 font-bold" : "text-slate-500"}>φ:</span>
              <span className={`font-bold ${isLight ? 'text-sky-700' : 'text-cyan-300'}`}>{(phi*180/PI).toFixed(1)}°</span>
              <span className={`text-[10px] ${isLight ? 'text-slate-500 font-medium' : 'text-slate-600'}`}>({(phi/PI).toFixed(2)}π)</span>
            </div>
          </div>

          {/* State amplitudes */}
          <div className={`space-y-1 text-center border-x px-4 ${isLight ? 'border-slate-300' : 'border-slate-800/60'}`}>
            <div className={`text-[11px] font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
              |ψ⟩ = <span className={isLight ? "text-amber-700 font-black" : "text-yellow-300"}>{fmt(alpha)}</span>|0⟩ + <span className={isLight ? "text-sky-700 font-black" : "text-cyan-300"}>({fmt(bReal)}{bImag>=0?'+':''}{bImag.toFixed(4)}i)</span>|1⟩
            </div>
            <div className="flex justify-center gap-4 text-[10px]">
              <span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>P(|0⟩) = {prob0}%</span>
              <span className={`font-bold ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>P(|1⟩) = {prob1}%</span>
            </div>
          </div>

          {/* Bloch Vector Coordinates */}
          <div className="space-y-0.5 text-right">
            <div><span className={isLight ? "text-slate-600 font-bold" : "text-slate-500"}>X: </span><span className={`font-bold ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>{fmt(vec[0])}</span></div>
            <div><span className={isLight ? "text-slate-600 font-bold" : "text-slate-500"}>Y: </span><span className={`font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{fmt(vec[1])}</span></div>
            <div><span className={isLight ? "text-slate-600 font-bold" : "text-slate-500"}>Z: </span><span className={`font-bold ${isLight ? 'text-amber-700' : 'text-yellow-400'}`}>{fmt(vec[2])}</span></div>
          </div>
        </div>
      </div>

      {/* ── Control Panel Toolbox ──────────────────────────────────────────── */}
      <div
        className={`w-[290px] flex-shrink-0 flex flex-col border-l transition-colors ${
          isLight ? 'bg-white border-slate-300 text-slate-900 shadow-lg' : 'bg-[#0b0e20] border-slate-800 text-slate-100'
        }`}
      >
        {/* Header Tabs */}
        <div className={`flex border-b ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#080a18] border-slate-800'}`}>
          <button
            onClick={() => setActiveTab('gates')}
            className={`flex-1 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'gates'
                ? (isLight ? 'text-sky-700 border-sky-600 bg-white shadow-sm' : 'text-cyan-400 border-cyan-400 bg-cyan-950/20')
                : (isLight ? 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50' : 'text-slate-400 border-transparent hover:text-slate-200')
            }`}
          >
            Gates
          </button>
          <button
            onClick={() => setActiveTab('sliders')}
            className={`flex-1 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'sliders'
                ? (isLight ? 'text-sky-700 border-sky-600 bg-white shadow-sm' : 'text-cyan-400 border-cyan-400 bg-cyan-950/20')
                : (isLight ? 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50' : 'text-slate-400 border-transparent hover:text-slate-200')
            }`}
          >
            Angles
          </button>
          {externalVectors && externalVectors.length > 0 && (
            <button
              onClick={() => setActiveTab('circuit')}
              className={`flex-1 py-3 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'circuit'
                  ? (isLight ? 'text-sky-700 border-sky-600 bg-white shadow-sm' : 'text-cyan-400 border-cyan-400 bg-cyan-950/20')
                  : (isLight ? 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50' : 'text-slate-400 border-transparent hover:text-slate-200')
              }`}
            >
              Circuit ({externalVectors.length})
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* ── TAB 1: GATES ──────────────────────────────────────────────── */}
          {activeTab === 'gates' && (
            <>
              {/* Half-Turn (180°) */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Pauli &amp; Hadamard</p>
                  <span className={`text-[9px] font-mono ${isLight ? 'text-slate-600 font-bold' : 'text-slate-500'}`}>180° rotation</span>
                </div>
                <GRow keys={[['Px','X','',''],['Py','Y','',''],['Pz','Z','','']]} />
                <div className="mt-1.5"><GateButton gateKey="H" base="H (Hadamard)" sub="" sup="" onClick={applyGate} isLight={isLight} /></div>
              </section>

              {/* Quarter-Turn (90°) */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Quarter Pulses (90°)</p>
                  <span className={`text-[9px] font-mono ${isLight ? 'text-slate-600 font-bold' : 'text-slate-500'}`}>π/2</span>
                </div>
                <GRow keys={[['Px½','X','½',''],['Py½','Y','½',''],['Pz½','Z','½','']]} />
                <div className="mt-1.5">
                  <GRow keys={[['Px-½','X','-½',''],['Py-½','Y','-½',''],['Pz-½','Z','-½','']]} />
                </div>
                <div className="mt-1.5">
                  <GRow keys={[['S','S','',''],['S-1','S','','†'],['T','T','',''],['T-1','T','','†']]} />
                </div>
              </section>

              {/* Eighth-Turn (45°) */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Eighth Pulses (45°)</p>
                  <span className={`text-[9px] font-mono ${isLight ? 'text-slate-600 font-bold' : 'text-slate-500'}`}>π/4</span>
                </div>
                <GRow keys={[['Px¼','X','¼',''],['Py¼','Y','¼',''],['Pz¼','Z','¼','']]} />
                <div className="mt-1.5">
                  <GRow keys={[['Px-¼','X','-¼',''],['Py-¼','Y','-¼',''],['Pz-¼','Z','-¼','']]} />
                </div>
              </section>

              {/* Parametric Z Rotation (Lambda) */}
              <section className={`p-3.5 rounded-2xl border ${isLight ? 'border-slate-300 bg-slate-50 shadow-sm' : 'border-slate-800 bg-[#10142a]'}`}>
                <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Parametric Rz(λ) Gate
                </p>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-mono ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>Phase λ:</span>
                  <span className={`text-xs font-mono font-bold ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>{lambdaAngle}°</span>
                </div>
                <input
                  type="range" min={0} max={360} step={5} value={lambdaAngle}
                  onChange={e => setLambdaAngle(Number(e.target.value))}
                  className={`w-full h-1.5 rounded-full cursor-pointer mb-3 ${isLight ? 'accent-sky-600 bg-slate-200' : 'accent-cyan-500'}`}
                />
                <button
                  onClick={() => applyMat(rotZ(lambdaAngle * PI / 180))}
                  className={`w-full py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all active:scale-95 cursor-pointer ${
                    isLight
                      ? 'text-sky-800 border border-sky-400 bg-sky-100/80 hover:bg-sky-200 shadow-sm'
                      : 'text-cyan-300 border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/50'
                  }`}
                >
                  APPLY Rz({lambdaAngle}°)
                </button>
              </section>
            </>
          )}

          {/* ── TAB 2: ANGLE SLIDERS ───────────────────────────────────────── */}
          {activeTab === 'sliders' && (
            <div className="space-y-5">
              <section className={`p-3.5 rounded-2xl border space-y-3 ${isLight ? 'border-slate-300 bg-slate-50 shadow-sm' : 'border-slate-800 bg-[#10142a]'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isLight ? 'text-amber-800' : 'text-yellow-400'}`}>Polar Angle θ (Latitude)</span>
                  <span className={`text-xs font-mono font-bold ${isLight ? 'text-amber-700' : 'text-yellow-300'}`}>{(theta * 180 / PI).toFixed(1)}°</span>
                </div>
                <input
                  type="range" min={0} max={180} step={1}
                  value={Math.round(theta * 180 / PI)}
                  onChange={e => setDirectAngles(Number(e.target.value), phi * 180 / PI)}
                  className={`w-full h-2 rounded-full cursor-pointer ${isLight ? 'accent-amber-600 bg-slate-200' : 'accent-amber-500'}`}
                />
                <div className={`flex justify-between text-[9px] font-mono ${isLight ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                  <span>0° (|0⟩)</span>
                  <span>90° (Equator)</span>
                  <span>180° (|1⟩)</span>
                </div>
              </section>

              <section className={`p-3.5 rounded-2xl border space-y-3 ${isLight ? 'border-slate-300 bg-slate-50 shadow-sm' : 'border-slate-800 bg-[#10142a]'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isLight ? 'text-sky-800' : 'text-cyan-400'}`}>Azimuthal Angle φ (Longitude)</span>
                  <span className={`text-xs font-mono font-bold ${isLight ? 'text-sky-700' : 'text-cyan-300'}`}>{(phi * 180 / PI).toFixed(1)}°</span>
                </div>
                <input
                  type="range" min={0} max={360} step={1}
                  value={Math.round(phi * 180 / PI)}
                  onChange={e => setDirectAngles(theta * 180 / PI, Number(e.target.value))}
                  className={`w-full h-2 rounded-full cursor-pointer ${isLight ? 'accent-sky-600 bg-slate-200' : 'accent-cyan-500'}`}
                />
                <div className={`flex justify-between text-[9px] font-mono ${isLight ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                  <span>0° (+X)</span>
                  <span>90° (+Y)</span>
                  <span>180° (-X)</span>
                  <span>360° (+X)</span>
                </div>
              </section>
            </div>
          )}

          {/* ── TAB 3: CIRCUIT QUBIT VECTORS ───────────────────────────────── */}
          {activeTab === 'circuit' && externalVectors && (
            <div className="space-y-3">
              <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                Multi-Qubit Circuit State
              </p>
              <div className="grid grid-cols-2 gap-2">
                {externalVectors.map((v, idx) => {
                  const t2  = v.theta ?? Math.acos(Math.max(-1, Math.min(1, v.z ?? 0)));
                  const raw = Math.atan2(v.y ?? 0, v.x ?? 0);
                  const p2  = raw < 0 ? raw + TAU : raw;
                  return (
                    <button
                      key={idx}
                      onClick={() => resetTo(t2, p2)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all active:scale-95 select-none cursor-pointer ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 hover:border-sky-500 shadow-sm'
                          : 'bg-[#0e132a] border-cyan-500/25 hover:border-cyan-500/60'
                      }`}
                    >
                      <MiniBloch vec={v} size={56} />
                      <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>q[{idx}]</span>
                      <span className={`text-[9px] font-mono ${isLight ? 'text-sky-700 font-bold' : 'text-cyan-400'}`}>
                        P₁ = {(((v.prob1 ?? 0) * 100).toFixed(0))}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <section className={`pt-2 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
            <button
              onClick={() => resetTo(0, 0)}
              className="w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 text-rose-500 border border-rose-400/40 bg-rose-500/10 hover:bg-rose-500/20 cursor-pointer"
            >
              Reset to Ground State |0⟩
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
