import { useEffect, useState } from 'react';
import { C, DURATIONS, FONT, HOME_COUNTRIES } from '../lib/constants';
import type { FormData } from '../types';

const STEPS = [
  'Analysing your risk profile...',
  'Scanning global markets...',
  'Filtering by selected regions...',
  'Ranking investment instruments...',
  'Calculating diversification score...',
  'Projecting portfolio outcomes...',
  'Finalising your portfolio...',
];

export function LoadingScreen({ formData }: { formData: FormData | null }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => setStep(current => (current + 1) % STEPS.length), 1800);
    return () => window.clearInterval(intervalId);
  }, []);

  const country = HOME_COUNTRIES.find(item => item.value === formData?.homeCountry);
  const duration = DURATIONS.find(item => item.value === formData?.duration);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
        <div style={{ width: 36, height: 36, background: C.gold, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#000', fontWeight: 800, fontSize: 16, fontFamily: FONT.sans }}>FP</span>
        </div>
        <h1 style={{ fontFamily: FONT.serif, fontSize: 28, color: C.text, fontWeight: 400 }}>Financial Planner</h1>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '60px min(80px, 10vw)', textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 32px' }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ animation: 'spin 1.2s linear infinite' }} aria-hidden="true">
            <circle cx="36" cy="36" r="30" fill="none" stroke={C.border} strokeWidth="4" />
            <circle cx="36" cy="36" r="30" fill="none" stroke={C.gold} strokeWidth="4" strokeDasharray="60 130" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 10, height: 10, background: C.gold, borderRadius: '50%', boxShadow: `0 0 16px ${C.gold}` }} />
          </div>
        </div>

        <p style={{ fontFamily: FONT.serif, fontSize: 22, color: C.text, marginBottom: 12, fontWeight: 400 }}>Building your portfolio</p>
        <p key={step} style={{ fontFamily: FONT.sans, fontSize: 14, color: C.textSub, animation: 'fadeUp 0.4s ease-out' }}>{STEPS[step]}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
          {STEPS.map((_, index) => (
            <div key={index} style={{ width: index === step ? 20 : 6, height: 6, borderRadius: 3, background: index === step ? C.gold : C.border, transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      {formData && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 36, justifyContent: 'center', maxWidth: 520 }}>
          {[
            `${country?.symbol || '$'}${Number(formData.amount).toLocaleString()}`,
            duration?.label,
            formData.riskCategory,
            `Top ${formData.numRecommendations}`,
          ].filter(Boolean).map(chip => (
            <span key={chip} style={{ padding: '5px 12px', border: `1px solid ${C.border}`, borderRadius: 2, fontSize: 12, color: C.textSub, fontFamily: FONT.sans, background: C.surface }}>
              {chip}
            </span>
          ))}
        </div>
      )}

      <p style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT.sans, marginTop: 40 }}>For educational purposes only. Not financial advice.</p>
    </div>
  );
}
