import React from 'react';
import { Band } from '../types';

interface Props {
  band: Band;
  text: string;
  hint: string;
}

const ResultCard: React.FC<Props> = ({ band, text, hint }) => (
  <div className={`result ${band}`}> 
    <h3>{band}</h3>
    <p>{text}</p>
    <small>{hint}</small>
  </div>
);

export default ResultCard;
