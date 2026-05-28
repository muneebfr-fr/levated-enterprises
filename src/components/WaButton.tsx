import { ReactNode } from 'react';

interface WaButtonProps {
  className?: string;
  children: ReactNode;
}

/** Fires the global 'open-wa-widget' event — WaFloat picks it up and opens the chip panel. */
export default function WaButton({ className = '', children }: WaButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent('open-wa-widget'))}
    >
      {children}
    </button>
  );
}
