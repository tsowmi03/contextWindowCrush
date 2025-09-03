import React from 'react';
import { Chip } from '../types';
import ChipView from './Chip';
import { totalTokens } from '../engine';

interface Props {
  selected: Chip[];
  onDrop: (id: string) => void;
  onRemove: (id: string) => void;
  budget: number;
}

const Bin: React.FC<Props> = ({ selected, onDrop, onRemove, budget }) => {
  const used = totalTokens(selected);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onDrop(id);
  };
  return (
    <div className="panel" onDragOver={e => e.preventDefault()} onDrop={handleDrop} aria-label="Brain Space">
      <div className="tokenbar" aria-label={`Used ${used} of ${budget}`}>
        <div className="tokenfill" style={{ width: `${(used / budget) * 100}%` }}></div>
      </div>
      {selected.map(chip => (
        <div key={chip.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <ChipView chip={chip} draggable={false} />
          <button aria-label={`Remove ${chip.label}`} onClick={() => onRemove(chip.id)}>✕</button>
        </div>
      ))}
    </div>
  );
};

export default Bin;
