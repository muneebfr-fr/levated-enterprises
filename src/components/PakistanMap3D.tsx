import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { geoContains, geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, MultiPolygon } from 'geojson';
import provincesData from '../data/pakistan-provinces.json';

/**
 * Province boundaries: geoBoundaries gbOpen PAK ADM1 (public domain), simplified
 * and rounded to ~100m. The outline and the city pins go through the SAME
 * projection below, so a pin can only ever sit at its real lat/lon.
 */
const provinces = provincesData as unknown as FeatureCollection<MultiPolygon, { name: string }>;

const W = 800;
const H = 740;
const projection = geoMercator().fitExtent([[24, 24], [W - 24, H - 24]], provinces);
const path = geoPath(projection);

export type MapCity = {
  name: string;
  lat: number;
  lon: number;
  hq?: boolean;
  tag: string;
  /** Where the label sits relative to the pin head, to keep close cities readable */
  side?: 'top' | 'left' | 'right';
  /** Pin height in px */
  height?: number;
  /** Hide the label until hovered, for cities sitting right on top of another */
  quiet?: boolean;
};

const PROVINCE_LABELS: Record<string, { text: string; dx?: number; dy?: number; size?: number }> = {
  'Balochistan':        { text: 'BALOCHISTAN', dx: -10 },
  'Sindh':              { text: 'SINDH', dx: 6, dy: -18 },
  'Punjab':             { text: 'PUNJAB', dx: -24, dy: 30 },
  'Khyber Pakhtunkhwa': { text: 'KHYBER PAKHTUNKHWA', size: 10, dx: -26, dy: 6 },
  'Gilgit-Baltistan':   { text: 'GILGIT-BALTISTAN', size: 10, dx: -6 },
  'Azad Kashmir':       { text: 'AJK', size: 10, dx: -2 },
};

const SLAB_LAYERS = 7;   // stacked silhouettes that give the map its thickness
const SLAB_STEP = 2.4;   // px between layers
const BASE_TILT = 44;    // deg, how far the map leans back once in view

interface Props {
  cities: MapCity[];
  active: string | null;
  onActive: (name: string | null) => void;
}

export default function PakistanMap3D({ cities, active, onActive }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [settled, setSettled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, z: 0 });
  const [hoverProv, setHoverProv] = useState<string | null>(null);

  const shapes = useMemo(() => {
    const outline = path(provinces) ?? '';
    const provs = provinces.features.map(f => {
      const [cx, cy] = path.centroid(f);
      return { name: f.properties.name, d: path(f) ?? '', cx, cy };
    });
    const hq = cities.find(c => c.hq);
    const pins = cities.map(c => {
      const [x, y] = projection([c.lon, c.lat])!;
      const province = provinces.features.find(f => geoContains(f, [c.lon, c.lat]))?.properties.name ?? null;
      return { ...c, x, y, province };
    });
    // Gentle arcs from the HQ to every delivery city
    const routes = hq
      ? pins.filter(p => !p.hq).map(p => {
          const [hx, hy] = projection([hq.lon, hq.lat])!;
          const mx = (hx + p.x) / 2, my = (hy + p.y) / 2;
          const dx = p.x - hx, dy = p.y - hy, len = Math.hypot(dx, dy) || 1;
          const bend = len * 0.18;
          return { name: p.name, d: `M${hx},${hy} Q${mx + (dy / len) * bend},${my - (dx / len) * bend} ${p.x},${p.y}` };
        })
      : [];
    return { outline, provs, pins, routes };
  }, [cities]);

  // Tilt in once when scrolled into view; pause looping animations when off-screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setPlaying(e.isIntersecting);
      if (e.intersectionRatio > 0.35) setInView(true);
    }, { threshold: [0, 0.35] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSettled(true), 1500);
    return () => clearTimeout(t);
  }, [inView]);

  const onMove = (e: ReactMouseEvent) => {
    if (!settled) return;
    const r = rootRef.current!.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -ny * 8, z: nx * 10 });
  };

  const stageStyle = {
    '--ax': `${inView ? BASE_TILT + tilt.x : 0}deg`,
    '--az': `${inView ? -4 + tilt.z : 0}deg`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`map3d${inView ? ' is-in' : ''}${settled ? ' is-settled' : ''}${playing ? ' is-playing' : ''}${active ? ' has-active' : ''}`}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, z: 0 })}
      role="img"
      aria-label={`Map of Pakistan showing ${cities.map(c => c.name).join(', ')}`}
    >
      <div className="map3d-stage" style={stageStyle}>
        {/* Soft ground shadow */}
        <svg className="map3d-layer map3d-shadow" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <path d={shapes.outline} />
        </svg>

        {/* Slab: stacked silhouettes, darkest at the bottom */}
        {Array.from({ length: SLAB_LAYERS }, (_, i) => (
          <svg
            key={i}
            className="map3d-layer map3d-slab"
            viewBox={`0 0 ${W} ${H}`}
            style={{ transform: `translateZ(${-(SLAB_LAYERS - i) * SLAB_STEP}px)`, '--k': i / (SLAB_LAYERS - 1) } as CSSProperties}
            aria-hidden="true"
          >
            <path d={shapes.outline} />
          </svg>
        ))}

        {/* Provinces, each its own layer (with its own label) so it can lift on hover */}
        {shapes.provs.map(p => {
          const l = PROVINCE_LABELS[p.name];
          return (
            <svg
              key={p.name}
              className={`map3d-layer map3d-prov${p.name === 'Sindh' ? ' is-home' : ''}${hoverProv === p.name ? ' is-hover' : ''}`}
              viewBox={`0 0 ${W} ${H}`}
              aria-hidden="true"
            >
              <path
                d={p.d}
                onMouseEnter={() => setHoverProv(p.name)}
                onMouseLeave={() => setHoverProv(h => (h === p.name ? null : h))}
              />
              {l && (
                <text x={p.cx + (l.dx ?? 0)} y={p.cy + (l.dy ?? 0)} className="map3d-prov-label" style={{ fontSize: l.size ?? 12 }}>
                  {l.text}
                </text>
              )}
            </svg>
          );
        })}

        {/* Delivery routes from the HQ, hovering just above the surface */}
        <svg className="map3d-layer map3d-routes" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {shapes.routes.map(r => (
            <path key={r.name} d={r.d} className={`map3d-route${active === r.name ? ' is-active' : ''}`} />
          ))}
        </svg>

        {/* Pins, positioned on the surface and turned to face the viewer */}
        {shapes.pins.map((p, i) => (
          <div
            key={p.name}
            className={`map3d-pin${p.hq ? ' is-hq' : ''}${active === p.name ? ' is-active' : ''}${p.province && p.province === hoverProv ? ' is-lifted' : ''}${p.quiet ? ' is-quiet' : ''} side-${p.side ?? 'top'}`}
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, '--i': i, '--h': `${p.height ?? (p.hq ? 96 : 60)}px` } as CSSProperties}
          >
            <span className="map3d-pin-ring" />
            <span className="map3d-pin-foot" />
            <div
              className="map3d-pin-stand"
              onMouseEnter={() => onActive(p.name)}
              onMouseLeave={() => onActive(null)}
            >
              <div className="map3d-pin-rise">
                <span className="map3d-pin-beam" />
                <span className="map3d-pin-head" />
                <span className="map3d-pin-label">
                  <strong>{p.name}</strong>
                  <em>{p.tag}</em>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
