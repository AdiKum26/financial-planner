// FormScreen.jsx
function FormScreen({ onSubmit }) {
  const { useState } = React;

  const [homeCountry, setHomeCountry] = useState('us');
  const [amount, setAmount] = useState('100000');
  const [duration, setDuration] = useState('');
  const [numRec, setNumRec] = useState(8);
  const [risk, setRisk] = useState('');
  const [regions, setRegions] = useState(['global']);
  const [errors, setErrors] = useState({});

  const country = HOME_COUNTRIES.find(c => c.value === homeCountry) || HOME_COUNTRIES[0];

  function toggleRegion(id) {
    if (id === 'global') {
      setRegions(['global']);
      return;
    }
    setRegions(prev => {
      const without = prev.filter(r => r !== 'global');
      if (without.includes(id)) {
        const next = without.filter(r => r !== id);
        return next.length === 0 ? ['global'] : next;
      }
      return [...without, id];
    });
  }

  function validate() {
    const e = {};
    if (!amount || isNaN(Number(amount.replace(/,/g, ''))) || Number(amount.replace(/,/g, '')) < 1000) e.amount = 'Minimum investment is 1,000';
    if (!duration) e.duration = 'Please select a duration';
    if (!risk) e.risk = 'Please select a risk category';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({ homeCountry, amount: Number(amount.replace(/,/g, '')), duration, numRecommendations: numRec, riskCategory: risk, selectedRegions: regions });
  }

  const grouped = REGIONS.reduce((acc, r) => {
    if (!acc[r.group]) acc[r.group] = [];
    acc[r.group].push(r);
    return acc;
  }, {});

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 2, color: C.text, fontSize: 15, fontFamily: FONT.sans, outline: 'none',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: C.textSub, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: FONT.sans };
  const fieldStyle = { marginBottom: 28 };
  const errStyle = { fontSize: 12, color: C.red, marginTop: 6, fontFamily: FONT.sans };

  const riskCards = [
    { id: 'Conservative', title: 'Conservative', desc: 'Capital safety first. Steady, low-volatility returns.' },
    { id: 'Balanced',     title: 'Balanced',     desc: 'Mix of growth and stability. Moderate risk and return.' },
    { id: 'Aggressive',   title: 'Aggressive',   desc: 'High-growth focus. Higher volatility, longer horizon.' },
  ];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, background: C.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 800, fontSize: 16, fontFamily: FONT.sans }}>FP</span>
          </div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: 32, color: C.text, fontWeight: 400 }}>Financial Planner</h1>
        </div>
        <p style={{ color: C.textSub, fontFamily: FONT.sans, fontSize: 15 }}>Get a personalized, globally-diversified portfolio tailored to your goals.</p>
      </div>

      {/* Card */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '40px 40px' }}>
        <h2 style={{ fontFamily: FONT.serif, fontSize: 22, color: C.text, fontWeight: 400, marginBottom: 6 }}>Tell us about your investment</h2>
        <p style={{ color: C.textMuted, fontFamily: FONT.sans, fontSize: 13, marginBottom: 36 }}>We'll generate a personalized portfolio for you.</p>

        {/* Home country */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Home country & currency</label>
          <select value={homeCountry} onChange={e => setHomeCountry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {HOME_COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontFamily: FONT.sans }}>Used for tax/regulatory context and currency formatting.</p>
        </div>

        {/* Amount */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Investment amount</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <span style={{ padding: '12px 14px', background: C.surface3, border: `1px solid ${C.border}`, borderRight: 'none', borderRadius: '2px 0 0 2px', color: C.gold, fontFamily: FONT.sans, fontSize: 15, fontWeight: 600 }}>{country.symbol}</span>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
              style={{ ...inputStyle, borderRadius: '0 2px 2px 0', flex: 1 }}
              placeholder="100,000"
            />
          </div>
          {errors.amount && <p style={errStyle}>{errors.amount}</p>}
          {!errors.amount && <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontFamily: FONT.sans }}>Minimum {country.symbol}1,000.</p>}
        </div>

        {/* Duration */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Investment duration</label>
          <select value={duration} onChange={e => setDuration(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', color: duration ? C.text : C.textMuted }}>
            <option value="">Select investment duration</option>
            {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          {errors.duration && <p style={errStyle}>{errors.duration}</p>}
        </div>

        {/* Slider */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Number of top investment options</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input
              type="range" min={1} max={20} value={numRec}
              onChange={e => setNumRec(Number(e.target.value))}
              style={{ flex: 1, accentColor: C.gold, cursor: 'pointer', height: 4 }}
            />
            <span style={{ fontSize: 22, fontWeight: 700, color: C.gold, fontFamily: FONT.sans, minWidth: 32, textAlign: 'center' }}>{numRec}</span>
          </div>
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontFamily: FONT.sans }}>Pick between 1 and 20 recommendations, ranked by suitability.</p>
        </div>

        {/* Risk category */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Risk category</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {riskCards.map(rc => {
              const active = risk === rc.id;
              return (
                <div
                  key={rc.id}
                  onClick={() => setRisk(rc.id)}
                  style={{
                    padding: '16px', border: `1px solid ${active ? C.gold : C.border}`,
                    borderRadius: 3, cursor: 'pointer', background: active ? C.goldGlow : C.surface2,
                    transition: 'all 0.2s', position: 'relative',
                  }}
                >
                  {active && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: C.gold, borderRadius: '3px 3px 0 0' }} />}
                  <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: active ? C.gold : C.text, fontFamily: FONT.sans, marginBottom: 6, textTransform: 'uppercase' }}>{rc.title}</p>
                  <p style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.sans, lineHeight: 1.5 }}>{rc.desc}</p>
                </div>
              );
            })}
          </div>
          {errors.risk && <p style={errStyle}>{errors.risk}</p>}
        </div>

        {/* Geographic Focus */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Geographic focus</label>
          <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16, fontFamily: FONT.sans }}>Select specific countries or regions to include. Choose "Global" for no restriction.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <p style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: FONT.sans, marginBottom: 8 }}>{group}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {items.map(r => {
                    const selected = regions.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => toggleRegion(r.id)}
                        style={{
                          padding: '6px 14px', border: `1px solid ${selected ? C.gold : C.border}`,
                          borderRadius: 2, cursor: 'pointer', fontFamily: FONT.sans, fontSize: 12, fontWeight: 500,
                          background: selected ? C.goldGlow : 'transparent',
                          color: selected ? C.gold : C.textSub,
                          transition: 'all 0.15s',
                        }}
                      >{r.label}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: C.border, margin: '8px 0 32px' }} />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%', padding: '16px', background: C.gold, color: '#000',
            border: 'none', borderRadius: 2, fontSize: 15, fontWeight: 700, fontFamily: FONT.sans,
            cursor: 'pointer', letterSpacing: '0.04em', transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.88'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >Generate my portfolio</button>
      </div>

      <p style={{ textAlign: 'center', color: C.textMuted, fontSize: 12, fontFamily: FONT.sans, marginTop: 24 }}>
        For educational purposes only. Not financial advice. Consult a licensed financial advisor in your jurisdiction before investing.
      </p>
    </div>
  );
}

Object.assign(window, { FormScreen });
