import { Band, Chip, Level, ResultCard } from './types';

export function totalTokens(chips: Chip[]): number {
  return chips.reduce((sum, c) => sum + (c.tokens || 0), 0);
}

export function computeScore(level: Level, selected: Chip[]): { quality: number; band: Band } {
  const hasJob = selected.some(c => c.type === 'JOB');
  const relevance = selected
    .filter(c => c.type === 'FACT')
    .reduce((s, c) => s + (c.relevance || 0), 0);
  const distPenalty = selected
    .filter(c => c.type === 'OFFTOPIC')
    .reduce((s, c) => s + (c.penalty || 0), 0);
  const fidelityPenalty = selected
    .filter(c => c.type === 'SHORT')
    .reduce((s, c) => s + ((c.fidelityRisk || 0) * 10), 0);
  const quickMatches = selected.filter(c => c.type === 'QUICK').length;

  const selectedIds = new Set(selected.map(c => c.id));
  const covered = new Set<string>();

  // Mark covered criticals: either the raw FACT is present, or a SHORT replaces it
  for (const chip of selected) {
    if (chip.type === 'FACT') {
      covered.add(chip.id);
    }
    if (chip.type === 'SHORT' && chip.replaces) {
      for (const r of chip.replaces) covered.add(r);
    }
  }

  let missingCriticals = 0;
  for (const crit of level.criticalFactIds) {
    if (!covered.has(crit)) missingCriticals++;
  }

  const wI = 20, wR = 3, wD = 2, wS = 0, wF = 8, wK = 5;
  const quality = (wI * (hasJob ? 1 : 0))
    + (wR * relevance)
    - (wD * distPenalty)
    - (wF * fidelityPenalty)
    + (wK * quickMatches)
    - (missingCriticals * 25)
    + (wS * 0); // tone currently unused

  let band: Band;
  if (quality >= 60) band = 'GREAT';
  else if (quality >= 40) band = 'GOOD';
  else if (quality >= 20) band = 'MEH';
  else band = 'FAIL';

  return { quality, band };
}

export function pickResultCard(level: Level, band: Band): ResultCard {
  const found = level.results.find(r => r.band === band);
  if (found) return found;
  return level.results.find(r => r.band === 'MEH')
    || { band: 'MEH', text: 'Decent try! Tweak your tiles.', hint: 'Adjust selection and rerun.' };
}

