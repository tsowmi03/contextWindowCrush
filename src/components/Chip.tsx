import React from 'react';
import { Chip as ChipType } from '../types';

interface Props {
  chip: ChipType;
  draggable?: boolean;
}

const Chip: React.FC<Props> = ({ chip, draggable = true }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', chip.id);
  };
  return (
    <div
      className={`chip ${chip.type}`}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      aria-label={`${chip.label} ${chip.tokens} space`}
    >
      {chip.label} <small>{chip.tokens}</small>
    </div>
  );
};

export default Chip;
