"use client";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export default function Toggle({
  enabled,
  onChange,
  disabled = false,
  id,
}: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex h-[20px] w-[32px] shrink-0 cursor-pointer
        rounded-full border border-transparent transition-colors
        duration-200 ease-in-out focus:outline-none
        ${enabled ? "bg-black" : "bg-gray-200"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-[16px] w-[16px]
          transform rounded-full bg-white shadow-sm ring-0
          transition duration-200 ease-in-out
          absolute top-[1px] left-[1px]
          ${enabled ? "translate-x-[14px]" : "translate-x-0"}
        `}
      />
    </button>
  );
}

