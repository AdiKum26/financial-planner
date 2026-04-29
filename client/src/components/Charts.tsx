import { useMemo, useState } from 'react';
import { C, FONT, GEO_COLORS, SLICE_COLORS } from '../lib/constants';
import type { Holding, RegionBreakdown } from '../types';

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function DonutChart({ holdings, size = 220, thickness = 42 }: { holdings: Holding[]; size?: number; thickness?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - thickness) / 2;
  const totalAllocation = holdings.reduce((sum, holding) => sum + Number(holding.allocation || 0), 0) || 100;

  const segments = useMemo(() => {
    let start = 0;
    return holdings.map((holding, index) => {
      const sweep = (Number(holding.allocation || 0) / totalAllocation) * 360;
      const end = start + sweep;
      const segment = {
        path: arcPath(cx, cy, radius, start, Math.max(start, end - 0.5)),
        color: holding.color || SLICE_COLORS[index % SLICE_COLORS.length],
      };
      start = end;
      return segment;
    });
  }, [cx, cy, holdings, radius, totalAllocation]);

  const active = hovered !== null ? holdings[hovered] : holdings[0];
  const activeName = active?.name.split(' ').slice(0, 2).join(' ') || '';

  return (
    <svg width={size} height={size} style={{ overflow: 'visible', display: 'block' }} aria-label="Portfolio allocation chart">
      {segments.map((segment, index) => (
        <path
          key={`${segment.path}-${index}`}
          d={segment.path}
          fill="none"
          stroke={segment.color}
          strokeWidth={thickness}
          strokeLinecap="butt"
          style={{
            cursor: 'pointer',
            opacity: hovered === null || hovered === index ? 1 : 0.4,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
      <text x={cx} y={cy - 10} textAnchor="middle" fill={C.textSub} fontSize="11" fontFamily={FONT.sans} letterSpacing="1">
        ALLOC
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={C.text} fontSize="13" fontWeight="600" fontFamily={FONT.sans}>
        {activeName}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fill={C.textSub} fontSize="11" fontFamily={FONT.sans}>
        {holdings.length} holdings
      </text>
    </svg>
  );
}

export function DiversificationGauge({ score, size = 90 }: { score: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, Number(score || 0)));
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 8;
  const startDeg = 135;
  const endDeg = 405;
  const filled = startDeg + (clamped / 100) * 270;

  return (
    <svg width={size} height={size} aria-label={`Diversification score ${clamped}`}>
      <path d={arcPath(cx, cy, radius, startDeg, endDeg)} fill="none" stroke={C.border} strokeWidth={8} strokeLinecap="round" />
      <path d={arcPath(cx, cy, radius, startDeg, filled)} fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={C.gold} fontSize="22" fontWeight="700" fontFamily={FONT.sans}>
        {Math.round(clamped)}
      </text>
    </svg>
  );
}

export function RiskBar({ score, color }: { score: number; color?: string }) {
  const clamped = Math.max(1, Math.min(10, Number(score || 1)));
  const pct = ((clamped - 1) / 9) * 100;

  return (
    <div style={{ position: 'relative', height: 6, borderRadius: 3, background: 'linear-gradient(to right, #2ecc71, #f39c12, #e74c3c)' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          left: `${pct}%`,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: color || C.gold,
          border: `2px solid ${C.surface}`,
          boxShadow: `0 0 6px ${color || C.gold}`,
        }}
      />
    </div>
  );
}

export function GeoBar({ exposure }: { exposure?: RegionBreakdown[] }) {
  if (!exposure?.length) return null;

  return (
    <div>
      <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
        {exposure.map((entry, index) => (
          <div
            key={`${entry.region}-${index}`}
            style={{
              flex: Math.max(1, entry.percentage),
              background: GEO_COLORS[entry.region] || SLICE_COLORS[index % SLICE_COLORS.length],
              minWidth: 2,
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8 }}>
        {exposure.map((entry, index) => (
          <span key={`${entry.region}-label-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.textSub, fontFamily: FONT.sans }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: GEO_COLORS[entry.region] || SLICE_COLORS[index % SLICE_COLORS.length], display: 'inline-block' }} />
            {entry.region} {entry.percentage}%
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProjectedBar({ principal, gain }: { principal: number; gain: number }) {
  const safeGain = Math.max(0, gain);
  const total = Math.max(1, principal + safeGain);
  const principalPct = (principal / total) * 100;

  return (
    <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', background: C.surface3 }}>
      <div style={{ width: `${principalPct}%`, background: C.border }} />
      <div style={{ flex: 1, background: `linear-gradient(90deg, ${C.goldDim}, ${C.gold})` }} />
    </div>
  );
}
