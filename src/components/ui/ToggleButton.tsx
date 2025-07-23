import React from "react";

interface ToggleButtonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelTrue?: string;
  labelFalse?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked = false,
  onChange = () => {},
  labelTrue = 'Family',
  labelFalse = 'NSFW',
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer gap-2 scale-90">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={`
          relative w-11 h-6 rounded-full transition-colors
          peer-focus:ring-2 peer-focus:ring-white-600
          ${checked ? 'bg-blue-600' : 'bg-red-600'}
        `}
      >
        <div
          className={`
            absolute top-0.5 left-[2px] h-5 w-5 rounded-full bg-black border border-black-300
            transition-transform duration-200 transform
            ${checked ? 'translate-x-full' : 'translate-x-0'}
          `}
        ></div>
      </div>
      <span
        className={`text-sm font-medium ${checked ? 'text-blue-600' : 'text-red-600'}`}
        style={{ minWidth: '50px' }}
      >
        {checked ? labelTrue : labelFalse}
      </span>
    </label>
  );
};

export default ToggleButton;
