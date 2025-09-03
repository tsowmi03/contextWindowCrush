import React, { useEffect, useMemo, useState } from 'react';
import { Band, Chip } from './types';
import { computeScore, pickResultCard, totalTokens } from './engine';
import { level3, generatedText } from './levels';
import MissionPanel from './components/MissionPanel';
import Bin from './components/Bin';
import Palette from './components/Palette';
import ResultCard from './components/ResultCard';

type ResultView = { band: Band; text: string; hint: string } | null;

export const App: React.FC = () => {
  const level = level3;
  const [selected, setSelected] = useState<Chip[]>([]);
  const [toast, setToast] = useState<string>('');
  const [result, setResult] = useState<ResultView>(null);

  const selectedIds = useMemo(() => new Set(selected.map(c => c.id)), [selected]);
  const available = useMemo(() => level.chips.filter(c => !selectedIds.has(c.id)), [level.chips, selectedIds]);

  const budget = level.budget;

  const drop = (id: string) => {
    if (selectedIds.has(id)) return; // no duplicates
    const chip = level.chips.find(c => c.id === id);
    if (!chip) return;
    const next = [...selected, chip];

    // Enforce budget with FIFO ejection
    const ejected: Chip[] = [];
    while (totalTokens(next) > budget && next.length > 0) {
      const removed = next.shift();
      if (removed) ejected.push(removed);
    }
    setSelected(next);
    if (ejected.length > 0) {
      const last = ejected[ejected.length - 1];
      setToast(`Too full! '${last.label}' fell out.`);
      window.clearTimeout((window as any).__toastTimer);
      (window as any).__toastTimer = window.setTimeout(() => setToast(''), 2500);
    }
    setResult(null);
  };

  const remove = (id: string) => {
    setSelected(prev => prev.filter(c => c.id !== id));
    setResult(null);
  };

  const run = () => {
    const { band } = computeScore(level, selected);
    const card = pickResultCard(level, band);
    setResult({ band: card.band, text: card.text, hint: card.hint });
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  // Accessibility: clear toast on unmount
  useEffect(() => () => window.clearTimeout((window as any).__toastTimer), []);

  return (
    <div className="app">
      <h1>Context Window Crush</h1>
      <div className="grid">
        <div className="col">
          <MissionPanel name={level.name} mission={level.mission} />
        </div>
        <div className="col">
          <Bin selected={selected} onDrop={drop} onRemove={remove} budget={budget} />
        </div>
        <div className="col">
          <div className="panel" aria-label="Outcome Panel">
            <h3>Outcome</h3>
            {result ? (
              <ResultCard band={result.band} text={result.text} hint={result.hint} />
            ) : (
              <div className="empty-note">Press RUN to see result</div>
            )}
            <div className="actions">
              <button onClick={run} aria-label="Run scoring">RUN</button>
              <button onClick={reset} aria-label="Reset attempt">Reset</button>
            </div>
            <div className="toast" role="status" aria-live="polite">
              {toast}
            </div>
            {/* TODO: Tooltip on Short Version using generatedText.summaryTileText */}
            {/* TODO: Popover on Quick Facts using generatedText.quickFacts.HABITAT */}
            {/* TODO: Level select for more configs */}
            {/* TODO: Keyboard add/remove */}
          </div>
        </div>
      </div>

      <Palette available={available} />
    </div>
  );
};

export default App;

