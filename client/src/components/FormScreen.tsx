import { useMemo, useState, type CSSProperties } from 'react';
import { C, DURATIONS, FONT, HOME_COUNTRIES, REGIONS } from '../lib/constants';
import type { FormData, RiskCategory } from '../types';

type Props = {
  onSubmit: (formData: FormData) => void;
};

type Errors = Partial<Record<'amount' | 'duration' | 'risk', string>>;

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: C.surface2,
  border: `1px solid ${C.border}`,
  borderRadius: 2,
  color: C.text,
  fontSize: 15,
  fontFamily: FONT.sans,
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: C.textSub,
  marginBottom: 8,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  fontFamily: FONT.sans,
};

const fieldStyle: CSSProperties = { marginBottom: 28 };
const errorStyle: CSSProperties = { fontSize: 12, color: C.red, marginTop: 6, fontFamily: FONT.sans };

const riskCards: Array<{ id: RiskCategory; title: string; desc: string }> = [
  { id: 'Conservative', title: 'Conservative', desc: 'Capital safety first. Steady, low-volatility returns.' },
  { id: 'Balanced', title: 'Balanced', desc: 'Mix of growth and stability. Moderate risk and return.' },
  { id: 'Aggressive', title: 'Aggressive', desc: 'High-growth focus. Higher volatility, longer horizon.' },
];

export function FormScreen({ onSubmit }: Props) {
  const [homeCountry, setHomeCountry] = useState('us');
  const [amount, setAmount] = useState('100000');
  const [duration, setDuration] = useState('');
  const [numRecommendations, setNumRecommendations] = useState(8);
  const [risk, setRisk] = useState<RiskCategory | ''>('');
  const [regions, setRegions] = useState<string[]>(['global']);
  const [errors, setErrors] = useState<Errors>({});

  const country = HOME_COUNTRIES.find(item => item.value === homeCountry) || HOME_COUNTRIES[0];
  const groupedRegions = useMemo(() => {
    return REGIONS.reduce<Record<string, typeof REGIONS[number][]>>((groups, region) => {
      groups[region.group] ||= [];
      groups[region.group].push(region);
      return groups;
    }, {});
  }, []);

  function toggleRegion(id: string) {
    if (id === 'global') {
      setRegions(['global']);
      return;
    }

    setRegions(previous => {
      const withoutGlobal = previous.filter(regionId => regionId !== 'global');
      if (withoutGlobal.includes(id)) {
        const next = withoutGlobal.filter(regionId => regionId !== id);
        return next.length === 0 ? ['global'] : next;
      }
      return [...withoutGlobal, id];
    });
  }

  function validate() {
    const nextErrors: Errors = {};
    const numericAmount = Number(amount.replace(/,/g, ''));

    if (!amount || Number.isNaN(numericAmount) || numericAmount < 1000) {
      nextErrors.amount = 'Minimum investment is 1,000';
    }
    if (!duration) {
      nextErrors.duration = 'Please select a duration';
    }
    if (!risk) {
      nextErrors.risk = 'Please select a risk category';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate() || !risk) return;
    onSubmit({
      homeCountry,
      amount: Number(amount.replace(/,/g, '')),
      duration,
      numRecommendations,
      riskCategory: risk,
      selectedRegions: regions,
    });
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, background: C.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 800, fontSize: 16, fontFamily: FONT.sans }}>FP</span>
          </div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: 32, color: C.text, fontWeight: 400 }}>Financial Planner</h1>
        </div>
        <p style={{ color: C.textSub, fontFamily: FONT.sans, fontSize: 15 }}>Get a personalized, globally-diversified portfolio tailored to your goals.</p>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '40px min(40px, 6vw)' }}>
        <h2 style={{ fontFamily: FONT.serif, fontSize: 22, color: C.text, fontWeight: 400, marginBottom: 6 }}>Tell us about your investment</h2>
        <p style={{ color: C.textMuted, fontFamily: FONT.sans, fontSize: 13, marginBottom: 36 }}>We'll generate a personalized portfolio for you.</p>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="home-country">Home country & currency</label>
          <select id="home-country" value={homeCountry} onChange={event => setHomeCountry(event.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {HOME_COUNTRIES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontFamily: FONT.sans }}>Used for tax/regulatory context and currency formatting.</p>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="amount">Investment amount</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ padding: '12px 14px', background: C.surface3, border: `1px solid ${C.border}`, borderRight: 'none', borderRadius: '2px 0 0 2px', color: C.gold, fontFamily: FONT.sans, fontSize: 15, fontWeight: 600 }}>{country.symbol}</span>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={event => setAmount(event.target.value.replace(/[^0-9,]/g, ''))}
              style={{ ...inputStyle, borderRadius: '0 2px 2px 0', flex: 1 }}
              placeholder="100,000"
            />
          </div>
          {errors.amount ? <p style={errorStyle}>{errors.amount}</p> : <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontFamily: FONT.sans }}>Minimum {country.symbol}1,000.</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="duration">Investment duration</label>
          <select id="duration" value={duration} onChange={event => setDuration(event.target.value)} style={{ ...inputStyle, cursor: 'pointer', color: duration ? C.text : C.textMuted }}>
            <option value="">Select investment duration</option>
            {DURATIONS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          {errors.duration && <p style={errorStyle}>{errors.duration}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="num-recommendations">Number of top investment options</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input
              id="num-recommendations"
              type="range"
              min={1}
              max={20}
              value={numRecommendations}
              onChange={event => setNumRecommendations(Number(event.target.value))}
              style={{ flex: 1, accentColor: C.gold, cursor: 'pointer', height: 4 }}
            />
            <span style={{ fontSize: 22, fontWeight: 700, color: C.gold, fontFamily: FONT.sans, minWidth: 32, textAlign: 'center' }}>{numRecommendations}</span>
          </div>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontFamily: FONT.sans }}>Pick between 1 and 20 recommendations, ranked by suitability.</p>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Risk category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            {riskCards.map(card => {
              const active = risk === card.id;
              return (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => setRisk(card.id)}
                  style={{
                    padding: 16,
                    border: `1px solid ${active ? C.gold : C.border}`,
                    borderRadius: 3,
                    cursor: 'pointer',
                    background: active ? C.goldGlow : C.surface2,
                    transition: 'all 0.2s',
                    position: 'relative',
                    textAlign: 'left',
                  }}
                >
                  {active && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: C.gold, borderRadius: '3px 3px 0 0' }} />}
                  <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: active ? C.gold : C.text, fontFamily: FONT.sans, marginBottom: 6, textTransform: 'uppercase' }}>{card.title}</p>
                  <p style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.sans, lineHeight: 1.5 }}>{card.desc}</p>
                </button>
              );
            })}
          </div>
          {errors.risk && <p style={errorStyle}>{errors.risk}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Geographic focus</label>
          <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16, fontFamily: FONT.sans }}>Select specific countries or regions to include. Choose "Global" for no restriction.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(groupedRegions).map(([group, items]) => (
              <div key={group}>
                <p style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.sans, marginBottom: 8 }}>{group}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {items.map(region => {
                    const selected = regions.includes(region.id);
                    return (
                      <button
                        type="button"
                        key={region.id}
                        onClick={() => toggleRegion(region.id)}
                        style={{
                          padding: '6px 14px',
                          border: `1px solid ${selected ? C.gold : C.border}`,
                          borderRadius: 2,
                          cursor: 'pointer',
                          fontFamily: FONT.sans,
                          fontSize: 12,
                          fontWeight: 500,
                          background: selected ? C.goldGlow : 'transparent',
                          color: selected ? C.gold : C.textSub,
                          transition: 'all 0.15s',
                        }}
                      >
                        {region.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: C.border, margin: '8px 0 32px' }} />
        <button
          type="button"
          onClick={handleSubmit}
          style={{ width: '100%', padding: 16, background: C.gold, color: '#000', border: 'none', borderRadius: 2, fontSize: 15, fontWeight: 700, fontFamily: FONT.sans, cursor: 'pointer', letterSpacing: '0.04em', transition: 'opacity 0.2s' }}
        >
          Generate my portfolio
        </button>
      </div>

      <p style={{ textAlign: 'center', color: C.textMuted, fontSize: 12, fontFamily: FONT.sans, marginTop: 24 }}>
        For educational purposes only. Not financial advice. Consult a licensed financial advisor in your jurisdiction before investing.
      </p>
    </div>
  );
}
