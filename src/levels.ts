import gen from './data/level3.gen.json';
import { Level } from './types';

export const level3: Level = {
  id: 'lvl_03',
  name: 'Summaries to the Rescue',
  mission: 'One sentence. Keep Habitat & Diet.',
  budget: 80,
  criticalFactIds: ['F_HABITAT','F_DIET'],
  chips: [
    { id: 'INS_ONE_SENT', type: 'JOB', label: 'Job: One Sentence', tokens: 12 },
    { id: 'F_HABITAT', type: 'FACT', label: 'Fact: Habitat', tokens: 18, relevance: 5, isCritical: true },
    { id: 'F_DIET', type: 'FACT', label: 'Fact: Diet', tokens: 16, relevance: 4, isCritical: true },
    { id: 'F_HISTORY', type: 'FACT', label: 'Fact: History', tokens: 20, relevance: 1 },
    { id: 'SUMM_HAB_DIET', type: 'SHORT', label: 'Short Version: Habitat + Diet', tokens: 16, replaces: ['F_HABITAT','F_DIET'], fidelityRisk: 0.15 },
    { id: 'RETR_HABITAT', type: 'QUICK', label: 'Quick Facts: Habitat', tokens: 6, topic: 'HABITAT' },
    { id: 'DIST_TOURISM', type: 'OFFTOPIC', label: 'Off-Topic: Tourism', tokens: 14, penalty: 8 }
  ],
  results: gen.resultCards as any
};

export const generatedText = gen;

