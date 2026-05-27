import { CSSProperties } from 'react';

interface BorderBeamProps {
  duration?: number;
  className?: string;
}

/**
 * Sweeping conic-gradient border light.
 * Parent must have: position: relative; border-radius: [value]
 * Uses the same @property --beam-angle trick already in index.css for the loader.
 */
export default function BorderBeam({ duration = 5, className = '' }: BorderBeamProps) {
  return (
    <div
      className={`border-beam ${className}`}
      style={{ '--beam-duration': `${duration}s` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
