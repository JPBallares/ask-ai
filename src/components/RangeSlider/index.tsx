import React, { ChangeEvent } from 'react';

interface RangeSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <>
      <div className="flex flex-row">
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <span className="ml-auto text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mb-2"
        onChange={onChange}
      />
    </>
  );
};

export default RangeSlider;
