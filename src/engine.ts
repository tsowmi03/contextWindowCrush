import { Chip, Level, Band, ResultCard } from './types';

export function totalTokens(chips: Chip[]): number {
  return chips.reduce((sum, c) => sum + c.tokens, 0);
}

export function computeScore(level: Level, selected: Chip[]) {
  const hasJob = selected.some(c => c.type === 'JOB');
  const relevance = selected
    .filter(c => c.type === 'FACT')
    .reduce((s, c) => s + (c.relevance || 0), 0);
  const distPenalty = selected
    .filter(c => c.type === 'OFFTOPIC')
    .reduce((s, c) => s + (c.penalty || 0), 0);
  const fidelityPenalty = selected
    .filter(c => c.type === 'SHORT')
    .reduce((s, c) => s + (c.fidelityRisk || 0) * 10, 0);
  const quickMatches = selected.filter(c => c.type === 'QUICK').length;

  const covered = new Set<string>();
  selected.forEach(c => {
    if (c.type === 'FACT' && level.criticalFactIds.includes(c.id)) {
      covered.add(c.id);
    }
    if (c.type === 'SHORT' && c.replaces) {
      c.replaces.forEach(id => covered.add(id));
    }
  });
  const missingCriticals = level.criticalFactIds.filter(id => !covered.has(id)).length;

  const wI = 20, wR = 3, wD = 2, wS = 0, wF = 8, wK = 5;
  const quality = (wI * (hasJob ? 1 : 0))
    + (wR * relevance)
    - (wD * distPenalty)
    - (wF * fidelityPenalty)
    + (wK * quickMatches)
    - (missingCriticals * 25);

  let band: Band = 'FAIL';
  if (quality >= 60) band = 'GREAT';
  else if (quality >= 40) band = 'GOOD';
  else if (quality >= 20) band = 'MEH';

  return { quality, band };
}

export function pickResultCard(level: Level, band: Band): ResultCard {
  return level.results.find(r => r.band === band)
    || level.results.find(r => r.band === 'MEH')!
    || { band: 'MEH', text: '', hint: '' };
}
