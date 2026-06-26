"use client";

import Image from "next/image";

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
      className={`focus:outline-none transition-transform hover:scale-105 active:scale-95 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <img
        src={
          enabled
            ? "https://img.icons8.com/parakeet-filled/48/switch-on.png"
            : "https://img.icons8.com/officel/80/switch-off.png"
        }
        alt={enabled ? "Active" : "Inactive"}
        className="w-10 h-10 object-contain"
      />
    </button>
  );
}
