import React from 'react';
import { Chip as ChipT } from '../types';
import Chip from './Chip';

interface Props {
  available: ChipT[];
}

export const Palette: React.FC<Props> = ({ available }) => {
  return (
    <div className="panel" aria-label="Tile Palette">
      <h3>Palette</h3>
      <div className="palette-list">
        {available.map(chip => (
          <Chip key={chip.id} chip={chip} />
        ))}
        {available.length === 0 && (
          <div className="empty-note">All tiles are in the Brain Space.</div>
        )}
      </div>
    </div>
  );
};

export default Palette;

