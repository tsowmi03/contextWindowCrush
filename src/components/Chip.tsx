import React from 'react';
import { Chip as ChipT } from '../types';

interface Props {
  chip: ChipT;
  draggable?: boolean;
}

export const Chip: React.FC<Props> = ({ chip, draggable = true }) => {
  const onDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.dataTransfer.setData('text/plain', chip.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`chip chip-${chip.type.toLowerCase()}`}
      draggable={draggable}
      onDragStart={draggable ? onDragStart : undefined}
      aria-label={`${chip.label}, ${chip.tokens} space`}
      tabIndex={0}
    >
      <span className="chip-label">{chip.label}</span>
      <span className="chip-badge" aria-hidden> {chip.tokens} space</span>
    </div>
  );
};

export default Chip;

