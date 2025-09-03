import React from 'react';

interface Props {
  name: string;
  mission: string;
}

const MissionPanel: React.FC<Props> = ({ name, mission }) => (
  <div className="panel" aria-label="Mission">
    <h2>{name}</h2>
    <p>{mission}</p>
    <small>Drag tiles into Brain Space.</small>
  </div>
);

export default MissionPanel;
