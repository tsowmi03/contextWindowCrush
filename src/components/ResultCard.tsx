import React from 'react';
import { Band } from '../types';

interface Props {
  band: Band;
  text: string;
  hint: string;
}

export const ResultCard: React.FC<Props> = ({ band, text, hint }) => {
  return (
    <div className={`result result-${band.toLowerCase()}`} role="status" aria-live="polite">
      <div className="result-band">{band}</div>
      <div className="result-text">{text}</div>
      <div className="result-hint">Hint: {hint}</div>
    </div>
  );
};

export default ResultCard;

