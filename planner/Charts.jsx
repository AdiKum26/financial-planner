// Charts.jsx — DonutChart, DiversificationGauge, RiskBar, GeoBar
const { useMemo } = React;

// ── SVG Donut Chart ──────────────────────────────────────────────────────────
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function DonutChart({ holdings, size = 220, thickness = 42 }) {
  const cx = size / 2, cy = size / 2, r = (size - thickness) / 2;
  const segments = useMemo(() => {
    let start = 0;
    return holdings.map((h, i) => {
      const sweep = (h.allocation / 100) * 360;
      const end = start + sweep;
      const path = arcPath(cx, cy, r, start, end - 0.5);
      const seg = { path, color: h.color || SLICE_COLORS[i % SLICE_COLORS.length], name: h.name, allocation: h.allocation };
      start = end;
      return seg;
    });
  }, [holdings, size]);

  const [hovered, setHovered] = React.useState(null);
  const active = hovered !== null ? holdings[hovered] : null;

  return (
    <svg width={size} height={size} style={{ overflow: 'visible', display: 'block' }}>
      {segments.map((seg, i) => (
        <path
          key={i}
          d={seg.path}
          fill="none"
          stroke={seg.color}
          strokeWidth={thickness}
          strokeLinecap="butt"
          style={{ cursor: 'pointer', opacity: hovered === null || hovered === i ? 1 : 0.4, transition: 'opacity 0.2s' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
      {/* Center label */}
      <text x={cx} y={cy - 10} textAnchor="middle" fill={C.textSub} fontSize="11" fontFamily={FONT.sans} letterSpacing="1">RISK</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={C.text} fontSize="13" fontWeight="600" fontFamily={FONT.sans}>
        {active ? active.name.split(' ').slice(0,2).join(' ') : (holdings[0] ? holdings[0].name.split(' ').slice(0,2).join(' ') : '')}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fill={C.textSub} fontSize="11" fontFamily={FONT.sans}>{holdings.length} holdings</text>
    </svg>
  );
}

// ── Diversification Gauge ────────────────────────────────────────────────────
function DiversificationGauge({ score, size = 90 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;
  const startDeg = 135, endDeg = 405;
  const filled = startDeg + (score / 100) * 270;
  const trackPath = arcPath(cx, cy, r, startDeg, endDeg);
  const scorePath = arcPath(cx, cy, r, startDeg, filled);

  return (
    <svg width={size} height={size}>
      <path d={trackPath} fill="none" stroke={C.border} strokeWidth={8} strokeLinecap="round" />
      <path d={scorePath} fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={C.gold} fontSize="22" fontWeight="700" fontFamily={FONT.sans}>{score}</text>
    </svg>
  );
}

// ── Risk Gradient Bar ────────────────────────────────────────────────────────
function RiskBar({ score, color }) {
  const pct = ((score - 1) / 9) * 100;
  return (
    <div style={{ position: 'relative', height: 6, borderRadius: 3, background: `linear-gradient(to right, #2ecc71, #f39c12, #e74c3c)` }}>
      <div style={{
        position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)',
        left: `${pct}%`, width: 12, height: 12, borderRadius: '50%',
        background: color || C.gold, border: `2px solid ${C.surface}`, boxShadow: `0 0 6px ${color || C.gold}`,
      }} />
    </div>
  );
}

// ── Geographic Exposure Bar ──────────────────────────────────────────────────
function GeoBar({ exposure }) {
  if (!exposure || !exposure.length) return null;
  return (
    <div>
      <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
        {exposure.map((e, i) => (
          <div key={i} style={{ flex: e.percentage, background: GEO_COLORS[e.region] || SLICE_COLORS[i % SLICE_COLORS.length], minWidth: 2 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8 }}>
        {exposure.map((e, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.textSub, fontFamily: FONT.sans }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: GEO_COLORS[e.region] || SLICE_COLORS[i % SLICE_COLORS.length], display: 'inline-block' }} />
            {e.region} {e.percentage}%
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Projected Outcome Bar ────────────────────────────────────────────────────
function ProjectedBar({ principal, gain }) {
  const total = principal + gain;
  const principalPct = (principal / total) * 100;
  return (
    <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', background: C.surface3 }}>
      <div style={{ width: `${principalPct}%`, background: C.border }} />
      <div style={{ flex: 1, background: `linear-gradient(90deg, ${C.goldDim}, ${C.gold})` }} />
    </div>
  );
}

Object.assign(window, { DonutChart, DiversificationGauge, RiskBar, GeoBar, ProjectedBar });
