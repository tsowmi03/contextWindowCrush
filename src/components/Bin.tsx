import React from 'react';
import { Chip as ChipT } from '../types';
import Chip from './Chip';

interface Props {
  selected: ChipT[];
  onDrop: (id: string) => void;
  onRemove: (id: string) => void;
  budget: number;
}

export const Bin: React.FC<Props> = ({ selected, onDrop, onRemove, budget }) => {
  const used = selected.reduce((s, c) => s + c.tokens, 0);

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const id = e.dataTransfer.getData('text/plain');
    if (id) onDrop(id);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const fill = Math.min(100, Math.round((used / budget) * 100));

  return (
    <div className="panel" aria-label="Brain Space">
      <h3>Brain Space</h3>
      <div className="tokenbar" aria-label={`Space used: ${used} of ${budget}`}>
        <div className="tokenfill" style={{ width: `${fill}%` }} />
        <div className="tokenlabel">{used} / {budget}</div>
      </div>
      <div
        className="bin-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="region"
        aria-label="Drop tiles here"
        tabIndex={0}
      >
        {selected.length === 0 && <div className="empty-note">Drop tiles here</div>}
        {selected.map(chip => (
          <div key={chip.id} className="bin-item">
            <Chip chip={chip} draggable={false} />
            <button
              className="remove-btn"
              onClick={() => onRemove(chip.id)}
              aria-label={`Remove ${chip.label}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bin;

