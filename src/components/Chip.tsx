import React, { useState } from 'react';
import { Chip as ChipT } from '../types';
import { generatedText } from '../levels';

interface Props {
  chip: ChipT;
  draggable?: boolean;
}

export const Chip: React.FC<Props> = ({ chip, draggable = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.dataTransfer.setData('text/plain', chip.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getTooltipText = () => {
    switch (chip.type) {
      case 'SHORT':
        return generatedText.summaryTileText; // "It lives in eucalyptus forests and eats young leaves."
      case 'QUICK':
        if (chip.topic === 'HABITAT') {
          return generatedText.quickFacts.HABITAT; // "Lives in eucalyptus forests of southeastern Australia"
        }
        return "Quick fact retrieval";
      case 'JOB':
        // Show the actual instruction content
        switch (chip.id) {
          case 'INS_ONE_SENT':
            return "Write exactly one sentence about the topic.";
          default:
            return "Task instruction for the AI system";
        }
      case 'FACT':
        // Show the actual fact content
        switch (chip.id) {
          case 'F_HABITAT':
            return "Koalas live in eucalyptus forests of southeastern Australia, spending most of their time in tree canopies.";
          case 'F_DIET':
            return "Koalas are herbivores that eat almost exclusively eucalyptus leaves, consuming 200-500g daily.";
          case 'F_BEHAVIOR':
            return "Koalas sleep 18-22 hours per day and are mostly solitary, communicating through vocalizations.";
          case 'F_CONSERVATION':
            return "Koala populations are declining due to habitat loss, with some regions listing them as endangered.";
          case 'F_REPRODUCTION':
            return "Female koalas give birth to one joey after 35 days, which stays in the pouch for 6-7 months.";
          case 'F_PHYSICAL':
            return "Adult koalas weigh 4-15kg, have gray fur, large black nose, and strong claws for climbing.";
          default:
            return "Factual information about the topic";
        }
      case 'OFFTOPIC':
        // Show the distracting content
        switch (chip.id) {
          case 'DIST_TOURISM':
            return "Australia's tourism industry generates $60 billion annually, with wildlife tours being popular attractions.";
          default:
            return "Off-topic information that doesn't help with the mission";
        }
      case 'TONE':
        return "Use simple, easy-to-understand language suitable for general audiences.";
      default:
        return `Content for ${chip.label}`;
    }
  };

  const tooltipText = getTooltipText();

  return (
    <div className="chip-container" style={{ position: 'relative' }}>
      <div
        className={`chip chip-${chip.type.toLowerCase()}`}
        draggable={draggable}
        onDragStart={draggable ? onDragStart : undefined}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`${chip.label}, ${chip.tokens} space`}
        tabIndex={0}
      >
        <span className="chip-label">{chip.label}</span>
        <span className="chip-badge" aria-hidden> {chip.tokens} space</span>
      </div>
      {showTooltip && tooltipText && (
        <div className="tooltip" role="tooltip">
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default Chip;

