// ResultsScreen.jsx
function ResultsScreen({ data, formData, onReset }) {
  const { summary, holdings } = data;
  const country = HOME_COUNTRIES.find(c => c.value === formData.homeCountry) || HOME_COUNTRIES[0];
  const sym = country.symbol;

  // Projected outcome calculation
  const midReturn = (summary.expectedReturnLow + summary.expectedReturnHigh) / 2 / 100;
  const years = formData.duration === '1' ? 1 : formData.duration === '2-3' ? 2.5 : formData.duration === '5' ? 5 : formData.duration === '10' ? 10 : 15;
  const projectedValue = Math.round(formData.amount * Math.pow(1 + midReturn, years));
  const estimatedGain = projectedValue - formData.amount;
  const inflationRate = 0.03;
  const todayMoney = Math.round(projectedValue / Math.pow(1 + inflationRate, years));

  const statBox = (label, value, sub) => (
    <div style={{ padding: '20px 24px', borderRight: `1px solid ${C.border}` }}>
      <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT.sans, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FONT.sans, marginBottom: sub ? 2 : 0 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.sans }}>{sub}</p>}
    </div>
  );

  const sectionTitle = (text, right) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT.sans, fontWeight: 600 }}>{text}</p>
      {right && <p style={{ fontSize: 12, color: C.textSub, fontFamily: FONT.sans }}>{right}</p>}
    </div>
  );

  const card = (children, style = {}) => (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, ...style }}>{children}</div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: C.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 800, fontSize: 14, fontFamily: FONT.sans }}>FP</span>
          </div>
          <h2 style={{ fontFamily: FONT.serif, fontSize: 24, color: C.text, fontWeight: 400 }}>Your Portfolio</h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Export PDF', 'Share', 'Save portfolio'].map(label => (
            <button key={label} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 2, color: C.textSub, fontSize: 12, fontFamily: FONT.sans, cursor: 'pointer', fontWeight: 500 }}>{label}</button>
          ))}
          <button onClick={onReset} style={{ padding: '8px 16px', background: C.gold, border: 'none', borderRadius: 2, color: '#000', fontSize: 12, fontFamily: FONT.sans, cursor: 'pointer', fontWeight: 700 }}>Start over</button>
        </div>
      </div>

      {/* Summary stats */}
      {card(
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {statBox('Total Invested', `${sym}${Number(formData.amount).toLocaleString()}`)}
          {statBox('Expected Return', `${summary.expectedReturnLow}–${summary.expectedReturnHigh}% p.a.`)}
          {statBox('Risk Level', summary.riskLevel)}
          {statBox('Horizon', DURATIONS.find(d => d.value === formData.duration)?.label || formData.duration)}
          {statBox('Home Country', country.label.split(' ')[0], null)}
          {statBox('Recommendations', `Top ${holdings.length}`, null)}
        </div>,
        { marginBottom: 16, overflow: 'hidden' }
      )}

      {/* Diversification score */}
      {card(
        <div style={{ padding: '24px 28px', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <DiversificationGauge score={summary.diversificationScore} size={90} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT.sans, marginBottom: 6 }}>Global Diversification Score</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FONT.sans, marginBottom: 12 }}>{summary.diversificationLabel}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
              {summary.regionBreakdown.map((rb, i) => (
                <span key={i} style={{ fontSize: 12, color: C.textSub, fontFamily: FONT.sans, padding: '3px 8px', background: C.surface2, borderRadius: 2 }}>
                  {rb.region} · {rb.percentage}%
                </span>
              ))}
            </div>
          </div>
        </div>,
        { marginBottom: 16 }
      )}

      {/* Holdings + Pie Chart */}
      {card(
        <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <DonutChart holdings={holdings} size={220} thickness={42} />
          </div>
          <div>
            {holdings.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: h.color || SLICE_COLORS[i % SLICE_COLORS.length], marginRight: 12, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: C.text, fontFamily: FONT.sans }}>{h.name}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.gold, fontFamily: FONT.sans, minWidth: 40, textAlign: 'right' }}>{h.allocation}%</span>
              </div>
            ))}
          </div>
        </div>,
        { marginBottom: 16 }
      )}

      {/* Projected Outcome */}
      {card(
        <div style={{ padding: '28px' }}>
          {sectionTitle('Projected Outcome', `Compounded at ${midReturn * 100 > 0 ? (midReturn * 100).toFixed(1) : '?'}% / yr over ${years} yrs`)}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginBottom: 4 }}>You invest</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: C.text, fontFamily: FONT.sans }}>{sym}{Number(formData.amount).toLocaleString()}</p>
            </div>
            <div style={{ fontSize: 24, color: C.gold }}>→</div>
            <div>
              <p style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginBottom: 4 }}>Projected value</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: C.gold, fontFamily: FONT.sans }}>{sym}{projectedValue.toLocaleString()}</p>
              <p style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.sans }}>≈ {sym}{todayMoney.toLocaleString()} in today's money</p>
            </div>
          </div>
          <ProjectedBar principal={formData.amount} gain={estimatedGain} />
          <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMuted, fontFamily: FONT.sans }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.border, display: 'inline-block' }} />
              Principal: {sym}{Number(formData.amount).toLocaleString()}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMuted, fontFamily: FONT.sans }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.gold, display: 'inline-block' }} />
              Estimated gain: {sym}{estimatedGain.toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginTop: 16, lineHeight: 1.6 }}>
            Estimate only. Uses the midpoint of the expected return range, compounded annually. The today's-money figure assumes 3% inflation. Actual returns vary with market conditions.
          </p>
        </div>,
        { marginBottom: 16 }
      )}

      {/* Risk Breakdown */}
      {card(
        <div style={{ padding: '28px' }}>
          {sectionTitle('Risk Breakdown', `${summary.overallRiskLabel} · ${summary.overallRiskScore} / 10`)}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>Conservative</span><span>Aggressive</span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <RiskBar score={summary.overallRiskScore} color={C.gold} />
          </div>
          {holdings.map((h, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 48px', gap: 16, alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13, color: C.text, fontFamily: FONT.sans }}>{h.name}</span>
              <RiskBar score={h.riskScore} color={h.color || SLICE_COLORS[i % SLICE_COLORS.length]} />
              <span style={{ fontSize: 12, color: C.textSub, fontFamily: FONT.sans, textAlign: 'right' }}>{h.riskScore}/10</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginTop: 16, lineHeight: 1.6 }}>
            Indicative only. Scores are based on the typical volatility profile of each instrument category, weighted by your allocation.
          </p>
        </div>,
        { marginBottom: 24 }
      )}

      {/* Individual fund cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {holdings.map((h, i) => (
          <FundCard key={i} holding={h} index={i} sym={sym} formData={formData} />
        ))}
      </div>

      <p style={{ textAlign: 'center', color: C.textMuted, fontSize: 12, fontFamily: FONT.sans, marginTop: 40 }}>
        For educational purposes only. Not financial advice. Consult a licensed financial advisor in your jurisdiction before investing.
      </p>
    </div>
  );
}

function FundCard({ holding: h, index: i, sym, formData }) {
  const [open, setOpen] = React.useState(i < 3);
  const color = h.color || SLICE_COLORS[i % SLICE_COLORS.length];
  const riskColor = h.riskLabel === 'High' ? '#e74c3c' : h.riskLabel === 'Medium' ? '#f39c12' : '#2ecc71';

  const tag = (label, bg) => (
    <span style={{ padding: '3px 10px', borderRadius: 2, fontSize: 11, fontFamily: FONT.sans, fontWeight: 500, background: bg || C.surface3, color: C.textSub }}>{label}</span>
  );

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ height: 3, background: color }} />
      <div style={{ padding: '20px 24px', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Rank badge */}
            <div style={{ width: 36, height: 36, borderRadius: 3, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#000', fontWeight: 800, fontSize: 13, fontFamily: FONT.sans }}>#{h.rank}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONT.sans }}>{h.name}</span>
                <span style={{ fontSize: 11, color: C.textMuted, border: `1px solid ${C.border}`, padding: '1px 6px', borderRadius: 2, fontFamily: FONT.sans }}>{h.ticker}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {h.categories.map((cat, ci) => tag(cat))}
                {tag(`Risk: ${h.riskLabel}`, `${riskColor}22`)}
                {tag(`Liquidity: ${h.liquidity}`)}
                {tag(h.returnRange, C.goldGlow)}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: C.gold, fontFamily: FONT.sans }}>{h.allocation}%</p>
            <p style={{ fontSize: 13, color: C.textSub, fontFamily: FONT.sans }}>{sym}{Number(h.amount).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 14, color: C.textSub, fontFamily: FONT.sans, lineHeight: 1.75, padding: '20px 0 20px', borderBottom: `1px solid ${C.border}` }}>{h.description}</p>
          <div style={{ paddingTop: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT.sans, marginBottom: 12 }}>Geographic Exposure</p>
            <GeoBar exposure={h.geographicExposure} />
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ResultsScreen });
