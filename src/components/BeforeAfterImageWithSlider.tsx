import React, { useState, useRef } from 'react';

interface IProps {
  before: React.ReactNode;
  after: React.ReactNode;
}

const Divider: React.FC<{ position: number; onDrag: React.DragEventHandler<HTMLDivElement> }> = ({
  position,
  onDrag,
}) => {
  return (
    <div className="divider" draggable={true} style={{ left: `${position * 100}%` }} onDrag={onDrag}>
      <div className="divider-line" />
      <div className="knob" />
    </div>
  );
};

export const BeforeAfterImageWithSlider: React.FC<IProps> = ({ before, after }) => {
  const [position, setPosition] = useState(0.5);

  const imageContainerRef = useRef(null);

  const onDragKnob = (event: any) => {
    const imageContainerRect = imageContainerRef.current.getBoundingClientRect();
    if (event.clientX !== 0) {
      const dragPosition = Math.min(Math.max(event.clientX - imageContainerRect.x, 0) / imageContainerRect.width, 1);

      setPosition(dragPosition);
    }
  };

  return (
    <div className="image-container" ref={imageContainerRef}>
      {after}
      <div className="image-before">
        <div className="mask-container" style={{ maxWidth: `${position * 100}%` }}>
          {before}
        </div>
        <Divider position={position} onDrag={onDragKnob} />
      </div>
    </div>
  );
};
