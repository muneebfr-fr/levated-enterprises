interface Branch {
  points: { x: number; y: number }[]; // orthogonal polyline (Manhattan routing)
  end?: 'hollow' | 'solid';
  start?: 'hollow' | 'solid';
}

interface CircuitMeshProps {
  branches: Branch[];
  viewW: number;
  viewH: number;
  inverted?: boolean;
  pulse?: boolean; // pulses the last branch's end node
  className?: string;
}

/** Small branching circuit-trace accent, matching the hollow/solid node mix under the logo wordmark. */
export default function CircuitMesh({ branches, viewW, viewH, inverted = false, pulse = false, className = '' }: CircuitMeshProps) {
  const stroke = inverted ? 'rgba(255,255,255,0.55)' : 'rgba(240,120,64,0.55)';
  const nodeColor = inverted ? '#ffb38a' : 'var(--orange)';

  const toPath = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');

  return (
    <svg
      className={`circuit-mesh ${className}`}
      width={viewW} height={viewH} viewBox={`0 0 ${viewW} ${viewH}`}
      fill="none" aria-hidden="true"
    >
      {branches.map((b, i) => {
        const first = b.points[0];
        const last = b.points[b.points.length - 1];
        return (
          <g key={i}>
            <path d={toPath(b.points)} stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
            {b.start === 'hollow' && <circle cx={first.x} cy={first.y} r="3" stroke={nodeColor} strokeWidth="1.3" fill="none" />}
            {b.start === 'solid' && <circle cx={first.x} cy={first.y} r="2.1" fill={nodeColor} />}
            {b.end === 'hollow' && <circle cx={last.x} cy={last.y} r="3" stroke={nodeColor} strokeWidth="1.3" fill="none" />}
            {b.end === 'solid' && <circle cx={last.x} cy={last.y} r="2.1" fill={nodeColor} />}
            {i === branches.length - 1 && pulse && b.end && (
              <circle className="circuit-mesh-pulse" cx={last.x} cy={last.y} r="3" fill={nodeColor} opacity="0.4" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
