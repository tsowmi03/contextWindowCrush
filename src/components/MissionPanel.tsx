import React from 'react';

interface Props {
  name: string;
  mission: string;
}

export const MissionPanel: React.FC<Props> = ({ name, mission }) => {
  return (
    <div className="panel" aria-label="Mission Panel">
      <h2>{name}</h2>
      <p className="mission">Mission: {mission}</p>
      <p className="tip">Tip: Drag helpful tiles into Brain Space. Keep within budget!</p>
    </div>
  );
};

export default MissionPanel;

