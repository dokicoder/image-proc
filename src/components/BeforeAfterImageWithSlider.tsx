import React, { useState, useRef } from 'react';

interface IProps {
  before: React.ReactNode;
  after: React.ReactNode;
}

const Divider: React.FC<{ position: number; onDrag: any }> = ({ position, onDrag }) => {
  return (
    <div
      className="divider"
      draggable={true}
      style={{ left: `${position * 100}%` }}
      onDrag={onDrag}
      onTouchMove={onDrag}
    >
      <div className="divider-line" />
      <div className="knob" />
    </div>
  );
};

export const BeforeAfterImageWithSlider: React.FC<IProps> = ({ before, after }) => {
  const [position, setPosition] = useState(0.5);

  const imageContainerRef = useRef(null);

  const onDragKnob = (event: any) => {
    let eventX = event.clientX;

    if (event.touches?.length === 1) {
      eventX = event.touches[0].clientX;
    }

    const imageContainerRect = imageContainerRef.current.getBoundingClientRect();
    if (event.clientX !== 0) {
      const dragPosition = Math.min(Math.max(eventX - imageContainerRect.x, 0) / imageContainerRect.width, 1);

      setPosition(dragPosition);
    }
  };

  return (
    <div className="image-container" ref={imageContainerRef}>
      {after}
      <div className="mask-container" style={{ maxWidth: `${position * 100}%` }}>
        {before}
      </div>
      <Divider position={position} onDrag={onDragKnob} />
    </div>
  );
};
