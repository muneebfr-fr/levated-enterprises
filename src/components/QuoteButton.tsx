import { ReactNode } from 'react';

interface QuoteButtonProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

/** Fires the global 'open-quote-form' event. QuoteModal picks it up and opens the form. */
export default function QuoteButton({ className = '', children, onClick }: QuoteButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        window.dispatchEvent(new CustomEvent('open-quote-form'));
      }}
    >
      {children}
    </button>
  );
}
