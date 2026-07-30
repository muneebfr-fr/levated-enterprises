interface Branch {
  points: { x: number; y: number }[];
  end?: 'hollow' | 'solid';
  start?: 'hollow' | 'solid';
}

export interface CircuitPattern {
  viewW: number;
  viewH: number;
  branches: Branch[];
}

/**
 * Small branching corner traces. Each pattern has a vertical trunk running
 * along x = viewW - 4 (the card's own right edge once positioned flush), with
 * branches peeling inward — so the mark reads as bound to the card, not a
 * stray floating sticker.
 */
export const CIRCUIT_PATTERNS: CircuitPattern[] = [
  {
    viewW: 58, viewH: 64,
    branches: [
      { points: [{ x: 54, y: 6 }, { x: 54, y: 58 }] },
      { points: [{ x: 54, y: 16 }, { x: 34, y: 16 }, { x: 34, y: 10 }], end: 'solid' },
      { points: [{ x: 54, y: 40 }, { x: 20, y: 40 }], end: 'hollow' },
    ],
  },
  {
    viewW: 58, viewH: 64,
    branches: [
      { points: [{ x: 54, y: 8 }, { x: 54, y: 56 }] },
      { points: [{ x: 54, y: 20 }, { x: 38, y: 20 }], end: 'hollow' },
      { points: [{ x: 54, y: 44 }, { x: 24, y: 44 }, { x: 24, y: 52 }, { x: 10, y: 52 }], end: 'solid' },
    ],
  },
  {
    // minimal, single branch — the subtlest variant
    viewW: 58, viewH: 64,
    branches: [
      { points: [{ x: 54, y: 10 }, { x: 54, y: 54 }] },
      { points: [{ x: 54, y: 30 }, { x: 28, y: 30 }, { x: 28, y: 38 }, { x: 12, y: 38 }], end: 'solid' },
    ],
  },
  {
    // featured/hub variant — a sub-branch peels off a branch
    viewW: 58, viewH: 64,
    branches: [
      { points: [{ x: 54, y: 4 }, { x: 54, y: 60 }] },
      { points: [{ x: 54, y: 14 }, { x: 40, y: 14 }], end: 'hollow' },
      { points: [{ x: 54, y: 26 }, { x: 30, y: 26 }, { x: 30, y: 18 }, { x: 16, y: 18 }], end: 'solid' },
      { points: [{ x: 54, y: 44 }, { x: 34, y: 44 }], end: 'hollow' },
      { points: [{ x: 42, y: 44 }, { x: 42, y: 54 }, { x: 22, y: 54 }], end: 'solid' },
    ],
  },
];
