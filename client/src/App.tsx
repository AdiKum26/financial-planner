import { useState } from 'react';
import { C, FONT } from './lib/constants';
import { fetchPortfolio } from './lib/api';
import type { FormData, PortfolioData } from './types';
import { FormScreen } from './components/FormScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsScreen } from './components/ResultsScreen';

type Screen = 'form' | 'loading' | 'results' | 'error';

export default function App() {
  const [screen, setScreen] = useState<Screen>('form');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleFormSubmit(nextFormData: FormData) {
    setFormData(nextFormData);
    setScreen('loading');
    setErrorMessage('');

    try {
      const data = await fetchPortfolio(nextFormData);
      setPortfolioData(data);
      setScreen('results');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setScreen('error');
    }
  }

  function handleReset() {
    setScreen('form');
    setPortfolioData(null);
    setFormData(null);
    setErrorMessage('');
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {screen === 'form' && <FormScreen onSubmit={handleFormSubmit} />}
      {screen === 'loading' && <LoadingScreen formData={formData} />}
      {screen === 'results' && portfolioData && formData && <ResultsScreen data={portfolioData} formData={formData} onReset={handleReset} />}
      {screen === 'error' && <ApiErrorScreen message={errorMessage} onReset={handleReset} />}
    </div>
  );
}

function ApiErrorScreen({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: C.surface, border: '1px solid #3a1a1a', borderRadius: 4, padding: '40px min(48px, 8vw)', maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16, color: C.red }}>!</div>
        <h2 style={{ fontFamily: FONT.serif, fontSize: 22, color: C.text, marginBottom: 12, fontWeight: 400 }}>Something went wrong</h2>
        <p style={{ fontSize: 13, color: C.textSub, fontFamily: FONT.sans, marginBottom: 8, lineHeight: 1.6 }}>{message}</p>
        <p style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.sans, marginBottom: 28 }}>Check that the server is running and the root .env file contains a valid OPENAI_API_KEY.</p>
        <button type="button" onClick={onReset} style={{ padding: '10px 20px', background: C.gold, border: 'none', borderRadius: 2, color: '#000', fontSize: 13, fontWeight: 700, fontFamily: FONT.sans, cursor: 'pointer' }}>
          Try again
        </button>
      </div>
    </div>
  );
}
