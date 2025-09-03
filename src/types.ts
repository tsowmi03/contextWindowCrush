export type ChipType = 'JOB'|'FACT'|'SHORT'|'QUICK'|'TONE'|'OFFTOPIC';

export interface Chip {
  id: string;
  type: ChipType;
  label: string;       // kid-friendly label, e.g., "Job: One Sentence"
  tokens: number;      // space cost
  relevance?: number;  // for FACT
  penalty?: number;    // for OFFTOPIC
  replaces?: string[]; // for SHORT (which facts it covers)
  fidelityRisk?: number; // 0..1 for SHORT (info loss)
  topic?: string;      // for QUICK
  styleTag?: string;   // for TONE
  isCritical?: boolean;
}

export type Band = 'FAIL'|'MEH'|'GOOD'|'GREAT';

export interface ResultCard {
  band: Band;
  text: string;  // student-facing summary
  hint: string;  // one-line suggestion
}

export interface Level {
  id: string;
  name: string;
  mission: string;
  budget: number;
  criticalFactIds: string[];
  chips: Chip[];
  results: ResultCard[];
}

