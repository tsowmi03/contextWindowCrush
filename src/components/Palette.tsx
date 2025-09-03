import React from 'react';
import { Chip } from '../types';
import ChipView from './Chip';

interface Props {
  available: Chip[];
}

const Palette: React.FC<Props> = ({ available }) => {
  return (
    <div className="panel" aria-label="Palette">
      {available.map(chip => (
        <ChipView key={chip.id} chip={chip} />
      ))}
    </div>
  );
};

export default Palette;
