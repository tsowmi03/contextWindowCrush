import React, { useState } from 'react';
import level from './levels';
import { Chip } from './types';
import { totalTokens, computeScore, pickResultCard } from './engine';
import Palette from './components/Palette';
import Bin from './components/Bin';
import MissionPanel from './components/MissionPanel';
import ResultCard from './components/ResultCard';

// TODO: Add Level Select and more Level configs
// TODO: Keyboard add/remove (Enter to add from palette; Space/Backspace to remove in bin)

const App: React.FC = () => {
  const [selected, setSelected] = useState<Chip[]>([]);
  const [toast, setToast] = useState('');
  const [result, setResult] = useState<{band: any; text: string; hint: string} | null>(null);

  const selectedIds = new Set(selected.map(c => c.id));
  const available = level.chips.filter(c => !selectedIds.has(c.id));

  const drop = (id: string) => {
    if (selectedIds.has(id)) return;
    const chip = level.chips.find(c => c.id === id);
    if (!chip) return;
    const next = [...selected, chip];
    const overflow = [...next];
    let removed: Chip | null = null;
    while (totalTokens(overflow) > level.budget) {
      removed = overflow.shift() || null;
    }
    setSelected(overflow);
    if (removed) {
      setToast(`Too full! '${removed.label}' fell out.`);
      setTimeout(() => setToast(''), 2500);
    }
    setResult(null);
  };

  const remove = (id: string) => {
    setSelected(selected.filter(c => c.id !== id));
    setResult(null);
  };

  const run = () => {
    const score = computeScore(level, selected);
    const card = pickResultCard(level, score.band);
    setResult(card);
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  return (
    <div className="app">
      <div className="grid">
        <MissionPanel name={level.name} mission={level.mission} />
        <Bin selected={selected} onDrop={drop} onRemove={remove} budget={level.budget} />
        <div className="panel" aria-label="Outcome">
          {result && <ResultCard band={result.band} text={result.text} hint={result.hint} />}
          <button onClick={run} aria-label="Run">RUN</button>
          <button onClick={reset} aria-label="Reset">Reset</button>
        </div>
      </div>
      <Palette available={available} />
      {toast && <div className="toast" aria-live="polite">{toast}</div>}
    </div>
  );
};

export default App;
