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
        relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer
        rounded-full border-2 border-transparent transition-colors
        duration-200 ease-in-out focus:outline-none focus-visible:ring-2
        focus-visible:ring-offset-2 focus-visible:ring-gray-500
        ${enabled ? "bg-gray-900" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-[18px] w-[18px]
          transform rounded-full bg-white shadow-sm ring-0
          transition duration-200 ease-in-out
          ${enabled ? "translate-x-[18px]" : "translate-x-0"}
        `}
      />
    </button>
  );
}
