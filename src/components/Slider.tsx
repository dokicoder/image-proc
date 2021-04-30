import React, { useState } from 'react';
import { v4 as randomId } from 'uuid';

interface IProps {
  value: number;
  update: (value: number) => void;
  label?: string;
  range?: number[];
}

export const Slider: React.FC<IProps> = ({ value, label, update, range: [min, max] = [0, 1] }) => {
  const [id] = useState<string>(`slider-${randomId()}`);

  return (
    <div className="slider">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="range"
        value={value}
        step={(max - min) / 100}
        min={min}
        max={max}
        onChange={e => update(+e.target.value)}
      />
    </div>
  );
};
