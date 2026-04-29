import { useState, type CSSProperties, type ReactNode } from 'react';
import { C, DURATIONS, FONT, HOME_COUNTRIES, SLICE_COLORS } from '../lib/constants';
import type { FormData, Holding, PortfolioData } from '../types';
import { DiversificationGauge, DonutChart, GeoBar, ProjectedBar, RiskBar } from './Charts';

type Props = {
  data: PortfolioData;
  formData: FormData;
  onReset: () => void;
};

function card(children: ReactNode, style: CSSProperties = {}) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, ...style }}>{children}</div>;
}

function sectionTitle(text: string, right?: string) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
      <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT.sans, fontWeight: 600 }}>{text}</p>
      {right && <p style={{ fontSize: 12, color: C.textSub, fontFamily: FONT.sans }}>{right}</p>}
    </div>
  );
}

function durationYears(duration: string) {
  if (duration === '1') return 1;
  if (duration === '2-3') return 2.5;
  if (duration === '5') return 5;
  if (duration === '10') return 10;
  return 15;
}

export function ResultsScreen({ data, formData, onReset }: Props) {
  const { summary, holdings } = data;
  const country = HOME_COUNTRIES.find(item => item.value === formData.homeCountry) || HOME_COUNTRIES[0];
  const symbol = country.symbol;
  const midReturn = ((summary.expectedReturnLow || 0) + (summary.expectedReturnHigh || 0)) / 2 / 100;
  const years = durationYears(formData.duration);
  const projectedValue = Math.round(formData.amount * Math.pow(1 + midReturn, years));
  const estimatedGain = projectedValue - formData.amount;
  const todayMoney = Math.round(projectedValue / Math.pow(1.03, years));
  const horizon = DURATIONS.find(item => item.value === formData.duration)?.label || formData.duration;

  const statBox = (label: string, value: string, sub?: string) => (
    <div style={{ padding: '20px 24px', borderRight: `1px solid ${C.border}` }}>
      <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT.sans, marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FONT.sans, marginBottom: sub ? 2 : 0 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.sans }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: C.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 800, fontSize: 14, fontFamily: FONT.sans }}>FP</span>
          </div>
          <h2 style={{ fontFamily: FONT.serif, fontSize: 24, color: C.text, fontWeight: 400 }}>Your Portfolio</h2>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['Export PDF', 'Share', 'Save portfolio'].map(label => (
            <button key={label} type="button" style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 2, color: C.textSub, fontSize: 12, fontFamily: FONT.sans, cursor: 'pointer', fontWeight: 500 }}>{label}</button>
          ))}
          <button type="button" onClick={onReset} style={{ padding: '8px 16px', background: C.gold, border: 'none', borderRadius: 2, color: '#000', fontSize: 12, fontFamily: FONT.sans, cursor: 'pointer', fontWeight: 700 }}>Start over</button>
        </div>
      </div>

      {card(
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {statBox('Total Invested', `${symbol}${Number(formData.amount).toLocaleString()}`)}
          {statBox('Expected Return', `${summary.expectedReturnLow}-${summary.expectedReturnHigh}% p.a.`)}
          {statBox('Risk Level', summary.riskLevel)}
          {statBox('Horizon', horizon)}
          {statBox('Home Country', country.label.split(' ')[0])}
          {statBox('Recommendations', `Top ${holdings.length}`)}
        </div>,
        { marginBottom: 16, overflow: 'hidden' },
      )}

      {card(
        <div style={{ padding: '24px 28px', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <DiversificationGauge score={summary.diversificationScore} size={90} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT.sans, marginBottom: 6 }}>Global Diversification Score</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FONT.sans, marginBottom: 12 }}>{summary.diversificationLabel}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
              {summary.regionBreakdown.map((item, index) => (
                <span key={`${item.region}-${index}`} style={{ fontSize: 12, color: C.textSub, fontFamily: FONT.sans, padding: '3px 8px', background: C.surface2, borderRadius: 2 }}>
                  {item.region} · {item.percentage}%
                </span>
              ))}
            </div>
          </div>
        </div>,
        { marginBottom: 16 },
      )}

      {card(
        <div style={{ padding: 28, display: 'grid', gridTemplateColumns: 'minmax(180px, 220px) 1fr', gap: 40, alignItems: 'start' }} className="max-[720px]:!grid-cols-1">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <DonutChart holdings={holdings} size={220} thickness={42} />
          </div>
          <div>
            {holdings.map((holding, index) => (
              <div key={`${holding.ticker}-${index}`} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}`, gap: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: holding.color || SLICE_COLORS[index % SLICE_COLORS.length], flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: C.text, fontFamily: FONT.sans }}>{holding.name}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.gold, fontFamily: FONT.sans, minWidth: 40, textAlign: 'right' }}>{holding.allocation}%</span>
              </div>
            ))}
          </div>
        </div>,
        { marginBottom: 16 },
      )}

      {card(
        <div style={{ padding: 28 }}>
          {sectionTitle('Projected Outcome', `Compounded at ${(midReturn * 100).toFixed(1)}% / yr over ${years} yrs`)}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginBottom: 4 }}>You invest</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: C.text, fontFamily: FONT.sans }}>{symbol}{Number(formData.amount).toLocaleString()}</p>
            </div>
            <div style={{ fontSize: 24, color: C.gold }}>→</div>
            <div>
              <p style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginBottom: 4 }}>Projected value</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: C.gold, fontFamily: FONT.sans }}>{symbol}{projectedValue.toLocaleString()}</p>
              <p style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.sans }}>≈ {symbol}{todayMoney.toLocaleString()} in today's money</p>
            </div>
          </div>
          <ProjectedBar principal={formData.amount} gain={estimatedGain} />
          <div style={{ display: 'flex', gap: 24, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMuted, fontFamily: FONT.sans }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.border, display: 'inline-block' }} />
              Principal: {symbol}{Number(formData.amount).toLocaleString()}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textMuted, fontFamily: FONT.sans }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.gold, display: 'inline-block' }} />
              Estimated gain: {symbol}{estimatedGain.toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginTop: 16, lineHeight: 1.6 }}>
            Estimate only. Uses the midpoint of the expected return range, compounded annually. The today's-money figure assumes 3% inflation. Actual returns vary with market conditions.
          </p>
        </div>,
        { marginBottom: 16 },
      )}

      {card(
        <div style={{ padding: 28 }}>
          {sectionTitle('Risk Breakdown', `${summary.overallRiskLabel} · ${summary.overallRiskScore} / 10`)}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <RiskBar score={summary.overallRiskScore} color={C.gold} />
          </div>
          {holdings.map((holding, index) => (
            <div key={`${holding.name}-risk-${index}`} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 48px', gap: 16, alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }} className="max-[640px]:!grid-cols-1">
              <span style={{ fontSize: 13, color: C.text, fontFamily: FONT.sans }}>{holding.name}</span>
              <RiskBar score={holding.riskScore} color={holding.color || SLICE_COLORS[index % SLICE_COLORS.length]} />
              <span style={{ fontSize: 12, color: C.textSub, fontFamily: FONT.sans, textAlign: 'right' }}>{holding.riskScore}/10</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans, marginTop: 16, lineHeight: 1.6 }}>
            Indicative only. Scores are based on the typical volatility profile of each instrument category, weighted by your allocation.
          </p>
        </div>,
        { marginBottom: 24 },
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {holdings.map((holding, index) => (
          <FundCard key={`${holding.ticker}-card-${index}`} holding={holding} index={index} symbol={symbol} />
        ))}
      </div>

      <p style={{ textAlign: 'center', color: C.textMuted, fontSize: 12, fontFamily: FONT.sans, marginTop: 40 }}>
        For educational purposes only. Not financial advice. Consult a licensed financial advisor in your jurisdiction before investing.
      </p>
    </div>
  );
}

function FundCard({ holding, index, symbol }: { holding: Holding; index: number; symbol: string }) {
  const [open, setOpen] = useState(index < 3);
  const color = holding.color || SLICE_COLORS[index % SLICE_COLORS.length];
  const riskColor = holding.riskLabel === 'High' ? '#e74c3c' : holding.riskLabel === 'Medium' ? '#f39c12' : '#2ecc71';
  const tag = (label: string, background: string = C.surface3) => (
    <span style={{ padding: '3px 10px', borderRadius: 2, fontSize: 11, fontFamily: FONT.sans, fontWeight: 500, background, color: C.textSub }}>{label}</span>
  );

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: 3, background: color }} />
      <button type="button" style={{ padding: '20px 24px', cursor: 'pointer', width: '100%', background: 'transparent', border: 0, textAlign: 'left' }} onClick={() => setOpen(current => !current)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 3, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#000', fontWeight: 800, fontSize: 13, fontFamily: FONT.sans }}>#{holding.rank}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONT.sans }}>{holding.name}</span>
                <span style={{ fontSize: 11, color: C.textMuted, border: `1px solid ${C.border}`, padding: '1px 6px', borderRadius: 2, fontFamily: FONT.sans }}>{holding.ticker}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {holding.categories.map((category, categoryIndex) => tag(category, categoryIndex === 0 ? C.surface3 : C.surface2))}
                {tag(`Risk: ${holding.riskLabel}`, `${riskColor}22`)}
                {tag(`Liquidity: ${holding.liquidity}`)}
                {tag(holding.returnRange, C.goldGlow)}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: C.gold, fontFamily: FONT.sans }}>{holding.allocation}%</p>
            <p style={{ fontSize: 13, color: C.textSub, fontFamily: FONT.sans }}>{symbol}{Number(holding.amount).toLocaleString()}</p>
          </div>
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 14, color: C.textSub, fontFamily: FONT.sans, lineHeight: 1.75, padding: '20px 0', borderBottom: `1px solid ${C.border}` }}>{holding.description}</p>
          <div style={{ paddingTop: 20 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT.sans, marginBottom: 12 }}>Geographic Exposure</p>
            <GeoBar exposure={holding.geographicExposure} />
          </div>
        </div>
      )}
    </div>
  );
}
