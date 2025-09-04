import gen from './data/level3.gen.json';
import { Level } from './types';

export const level1: Level = {
  id: 'lvl_01',
  name: 'What is a Context Window?',
  mission: 'Include the important facts. Stay within the space limit.',
  budget: 40, // Very tight to force prioritization
  criticalFactIds: ['F_MAIN'],
  chips: [
    { id: 'INS_BASIC', type: 'JOB', label: 'Job: Answer Question', tokens: 8 },
    { id: 'F_MAIN', type: 'FACT', label: 'Fact: Key Information', tokens: 20, relevance: 5, isCritical: true },
    { id: 'F_EXTRA', type: 'FACT', label: 'Fact: Extra Detail', tokens: 12, relevance: 2 },
    { id: 'F_BACKGROUND', type: 'FACT', label: 'Fact: Background Info', tokens: 15, relevance: 1 },
    { id: 'DIST_UNRELATED', type: 'OFFTOPIC', label: 'Off-Topic: Random Fact', tokens: 18, penalty: 5 }
  ],
  results: [
    { band: 'FAIL', text: 'Context window too empty or missing key info!', hint: 'You need the Job instruction and Key Information.' },
    { band: 'MEH', text: 'Basic info included but space wasted.', hint: 'Remove off-topic content to make room for useful facts.' },
    { band: 'GOOD', text: 'Good use of limited space!', hint: 'You prioritized important information.' },
    { band: 'GREAT', text: 'Perfect context window management!', hint: 'You understand the space constraints.' }
  ]
};

export const level2: Level = {
  id: 'lvl_02', 
  name: 'Information Compression',
  mission: 'Fit 3 key facts using summaries to save space.',
  budget: 50,
  criticalFactIds: ['F_FACT1', 'F_FACT2', 'F_FACT3'],
  chips: [
    { id: 'INS_SUMMARY', type: 'JOB', label: 'Job: Write Summary', tokens: 10 },
    { id: 'F_FACT1', type: 'FACT', label: 'Fact: Important A', tokens: 15, relevance: 4, isCritical: true },
    { id: 'F_FACT2', type: 'FACT', label: 'Fact: Important B', tokens: 12, relevance: 4, isCritical: true },
    { id: 'F_FACT3', type: 'FACT', label: 'Fact: Important C', tokens: 13, relevance: 4, isCritical: true },
    // Total individual facts: 15+12+13 = 40 tokens + 10 job = 50 tokens (exactly budget)
    { id: 'SUMM_AB', type: 'SHORT', label: 'Summary: A + B', tokens: 18, replaces: ['F_FACT1', 'F_FACT2'], fidelityRisk: 0.1 },
    { id: 'SUMM_ALL', type: 'SHORT', label: 'Summary: All Three Facts', tokens: 25, replaces: ['F_FACT1', 'F_FACT2', 'F_FACT3'], fidelityRisk: 0.2 }
  ],
  results: [
    { band: 'FAIL', text: 'Missing critical facts or over budget!', hint: 'Use summaries to fit more information in less space.' },
    { band: 'MEH', text: 'Got some facts but inefficient.', hint: 'Try combining facts with summaries.' },
    { band: 'GOOD', text: 'Smart use of compression!', hint: 'Summaries help fit more in less space.' },
    { band: 'GREAT', text: 'Perfect compression strategy!', hint: 'You understand the trade-offs between space and detail.' }
  ]
};

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

export const allLevels = [level1, level2, level3];
export const generatedText = gen;

