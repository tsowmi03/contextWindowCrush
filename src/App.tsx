import React, { useEffect, useMemo, useState } from 'react';
import { Band, Chip } from './types';
import { computeScore, pickResultCard, totalTokens } from './engine';
import { allLevels, generatedText } from './levels';
import MissionPanel from './components/MissionPanel';
import Bin from './components/Bin';
import Palette from './components/Palette';
import ResultCard from './components/ResultCard';

type ScoreBreakdown = {
  hasJob: boolean;
  relevance: number;
  penalties: number;
  fidelityRisk: number;
  quickMatches: number;
  missingCriticals: number;
  quality: number;
};

type ResultView = { 
  band: Band; 
  text: string; 
  hint: string;
  breakdown?: ScoreBreakdown;
} | null;

// Level progression requirements
const LEVEL_REQUIREMENTS = {
  0: 30, // Level 1 needs 30+ points to unlock Level 2
  1: 35, // Level 2 needs 35+ points to unlock Level 3  
  2: 40  // Level 3 needs 40+ points for completion
};

// Medal thresholds (cumulative points across all levels)
const MEDAL_THRESHOLDS = {
  bronze: 100,
  silver: 150, 
  gold: 200,
  platinum: 250
};

type Medal = 'bronze' | 'silver' | 'gold' | 'platinum' | null;

export const App: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [levelScores, setLevelScores] = useState<number[]>([0, 0, 0]); // Best score for each level
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentMedal, setCurrentMedal] = useState<Medal>(null);
  const [showMedalToast, setShowMedalToast] = useState(false);
  
  const level = allLevels[currentLevelIndex];
  const [selected, setSelected] = useState<Chip[]>([]);
  const [toast, setToast] = useState<string>('');
  const [result, setResult] = useState<ResultView>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const selectedIds = useMemo(() => new Set(selected.map(c => c.id)), [selected]);
  const available = useMemo(() => level.chips.filter(c => !selectedIds.has(c.id)), [level.chips, selectedIds]);

  const budget = level.budget;

  // Check if next level is unlocked
  const isNextLevelUnlocked = useMemo(() => {
    if (currentLevelIndex >= allLevels.length - 1) return false;
    const requiredScore = LEVEL_REQUIREMENTS[currentLevelIndex as keyof typeof LEVEL_REQUIREMENTS];
    return levelScores[currentLevelIndex] >= requiredScore;
  }, [currentLevelIndex, levelScores]);

  // Calculate medal based on total points
  const calculateMedal = (points: number): Medal => {
    if (points >= MEDAL_THRESHOLDS.platinum) return 'platinum';
    if (points >= MEDAL_THRESHOLDS.gold) return 'gold';
    if (points >= MEDAL_THRESHOLDS.silver) return 'silver';
    if (points >= MEDAL_THRESHOLDS.bronze) return 'bronze';
    return null;
  };

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
    const { band, quality } = computeScore(level, selected);
    const card = pickResultCard(level, band);
    
    // Update best score for current level
    const newLevelScores = [...levelScores];
    if (quality > newLevelScores[currentLevelIndex]) {
      newLevelScores[currentLevelIndex] = quality;
      setLevelScores(newLevelScores);
      
      // Update total points and check for medal upgrades
      const newTotal = newLevelScores.reduce((sum, score) => sum + score, 0);
      const oldMedal = currentMedal;
      const newMedal = calculateMedal(newTotal);
      
      setTotalPoints(newTotal);
      
      if (newMedal !== oldMedal && newMedal) {
        setCurrentMedal(newMedal);
        setShowMedalToast(true);
        setTimeout(() => setShowMedalToast(false), 3000);
      }
    }
    
    // Calculate detailed breakdown for educational feedback
    const hasJob = selected.some(c => c.type === 'JOB');
    const relevance = selected
      .filter(c => c.type === 'FACT')
      .reduce((s, c) => s + (c.relevance || 0), 0);
    const penalties = selected
      .filter(c => c.type === 'OFFTOPIC')
      .reduce((s, c) => s + (c.penalty || 0), 0);
    const fidelityRisk = selected
      .filter(c => c.type === 'SHORT')
      .reduce((s, c) => s + ((c.fidelityRisk || 0) * 10), 0);
    const quickMatches = selected.filter(c => c.type === 'QUICK').length;
    
    // Calculate missing criticals
    const selectedIds = new Set(selected.map(c => c.id));
    const covered = new Set<string>();
    for (const chip of selected) {
      if (chip.type === 'FACT') covered.add(chip.id);
      if (chip.type === 'SHORT' && chip.replaces) {
        for (const r of chip.replaces) covered.add(r);
      }
    }
    const missingCriticals = level.criticalFactIds.filter(id => !covered.has(id)).length;
    
    const breakdown: ScoreBreakdown = {
      hasJob,
      relevance,
      penalties,
      fidelityRisk,
      quickMatches,
      missingCriticals,
      quality
    };
    
    setResult({ 
      band: card.band, 
      text: card.text, 
      hint: card.hint,
      breakdown
    });
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
    setShowBreakdown(false);
  };

  const nextLevel = () => {
    if (currentLevelIndex < allLevels.length - 1 && isNextLevelUnlocked) {
      setCurrentLevelIndex(prev => prev + 1);
      reset();
    }
  };

  const prevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(prev => prev - 1);
      reset();
    }
  };

  // Accessibility: clear toast on unmount
  useEffect(() => () => window.clearTimeout((window as any).__toastTimer), []);

  return (
    <div className="app">
      {/* Progress Header */}
      <div className="progress-header">
        <div className="level-nav">
          <button onClick={prevLevel} disabled={currentLevelIndex === 0}>← Previous</button>
          <span className="level-indicator">Level {currentLevelIndex + 1} of {allLevels.length}</span>
          <button 
            onClick={nextLevel} 
            disabled={!isNextLevelUnlocked}
            className={isNextLevelUnlocked ? '' : 'locked'}
          >
            Next → {!isNextLevelUnlocked && `(Need ${LEVEL_REQUIREMENTS[currentLevelIndex as keyof typeof LEVEL_REQUIREMENTS]}+ pts)`}
          </button>
        </div>
        
        <div className="score-display">
          <div className="total-points">Total Points: {totalPoints}</div>
          {currentMedal && (
            <div className={`medal medal-${currentMedal}`}>
              🏅 {currentMedal.charAt(0).toUpperCase() + currentMedal.slice(1)} Medal
            </div>
          )}
          <div className="level-scores">
            {levelScores.map((score, i) => (
              <span key={i} className={`level-score ${i === currentLevelIndex ? 'current' : ''}`}>
                L{i + 1}: {score}pts
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Medal Toast */}
      {showMedalToast && currentMedal && (
        <div className="medal-toast">
          🎉 {currentMedal.charAt(0).toUpperCase() + currentMedal.slice(1)} Medal Earned! 🎉
        </div>
      )}

      <h1>Context Window Crush</h1>
      <div className="grid">
        <div className="col">
          <MissionPanel name={level.name} mission={level.mission} />
          {/* Show current level progress */}
          <div className="level-progress">
            <div className="progress-label">
              Best Score: {levelScores[currentLevelIndex]} pts
            </div>
            {!isNextLevelUnlocked && currentLevelIndex < allLevels.length - 1 && (
              <div className="unlock-requirement">
                🔒 Need {LEVEL_REQUIREMENTS[currentLevelIndex as keyof typeof LEVEL_REQUIREMENTS]}+ points to unlock next level
              </div>
            )}
          </div>
        </div>
        <div className="col">
          <Bin selected={selected} onDrop={drop} onRemove={remove} budget={budget} />
        </div>
        <div className="col">
          <div className="panel" aria-label="Outcome Panel">
            <h3>Outcome</h3>
            {result ? (
              <div>
                <ResultCard band={result.band} text={result.text} hint={result.hint} />
                {result.breakdown && (
                  <div className="score-section">
                    <button 
                      className="breakdown-toggle"
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      aria-expanded={showBreakdown}
                    >
                      Score: {result.breakdown.quality} {showBreakdown ? '▼' : '▶'}
                      {result.breakdown.quality > levelScores[currentLevelIndex] && (
                        <span className="new-best"> NEW BEST!</span>
                      )}
                    </button>
                    {showBreakdown && (
                      <div className="score-breakdown" role="region" aria-label="Score breakdown">
                        <div className="score-item">
                          <span className="score-label">Job Instructions:</span>
                          <span className={`score-value ${result.breakdown.hasJob ? 'positive' : 'negative'}`}>
                            {result.breakdown.hasJob ? '+20' : '0'}
                          </span>
                        </div>
                        <div className="score-item">
                          <span className="score-label">Fact Relevance:</span>
                          <span className={`score-value ${result.breakdown.relevance > 0 ? 'positive' : 'neutral'}`}>
                            +{result.breakdown.relevance * 3}
                          </span>
                        </div>
                        <div className="score-item">
                          <span className="score-label">Quick Facts Bonus:</span>
                          <span className={`score-value ${result.breakdown.quickMatches > 0 ? 'positive' : 'neutral'}`}>
                            +{result.breakdown.quickMatches * 5}
                          </span>
                        </div>
                        <div className="score-item">
                          <span className="score-label">Off-Topic Penalty:</span>
                          <span className={`score-value ${result.breakdown.penalties > 0 ? 'negative' : 'neutral'}`}>
                            -{result.breakdown.penalties * 2}
                          </span>
                        </div>
                        <div className="score-item">
                          <span className="score-label">Fidelity Risk:</span>
                          <span className={`score-value ${result.breakdown.fidelityRisk > 0 ? 'negative' : 'neutral'}`}>
                            -{Math.round(result.breakdown.fidelityRisk)}
                          </span>
                        </div>
                        <div className="score-item">
                          <span className="score-label">Missing Critical Facts:</span>
                          <span className={`score-value ${result.breakdown.missingCriticals > 0 ? 'negative' : 'neutral'}`}>
                            -{result.breakdown.missingCriticals * 25}
                          </span>
                        </div>
                        <div className="score-item score-total">
                          <span className="score-label">Total Quality:</span>
                          <span className={`score-value ${result.breakdown.quality >= 40 ? 'positive' : result.breakdown.quality >= 20 ? 'neutral' : 'negative'}`}>
                            {result.breakdown.quality}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
          </div>
        </div>
      </div>

      <Palette available={available} />
    </div>
  );
};

export default App;

