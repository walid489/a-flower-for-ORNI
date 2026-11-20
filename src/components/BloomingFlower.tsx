import type { CSSProperties, MouseEvent } from 'react';

interface BloomingFlowerProps {
  onFlowerTap?: (x: number, y: number) => void;
  isRevealed: boolean;
}

interface PetalSpec {
  id: string;
  startRot: number;
  endRot: number;
  delay: string;
  gradient: string;
  stroke: string;
  path: string;
  veinPath?: string;
}

const BACK_PETALS: PetalSpec[] = [
  {
    id: 'back-center',
    startRot: 0,
    endRot: 0,
    delay: '3.35s',
    gradient: 'url(#petalDeepGrad)',
    stroke: 'rgba(253, 224, 232, 0.35)',
    path: 'M 200 184 C 170 150, 166 96, 200 72 C 234 96, 230 150, 200 184 Z',
    veinPath: 'M 200 180 C 200 144, 200 108, 200 80',
  },
  {
    id: 'back-left',
    startRot: -6,
    endRot: -26,
    delay: '3.52s',
    gradient: 'url(#petalDeepGrad)',
    stroke: 'rgba(253, 224, 232, 0.32)',
    path: 'M 200 184 C 166 154, 158 98, 198 76 C 232 102, 226 152, 200 184 Z',
    veinPath: 'M 200 180 C 195 142, 193 110, 198 84',
  },
  {
    id: 'back-right',
    startRot: 6,
    endRot: 26,
    delay: '3.68s',
    gradient: 'url(#petalDeepGrad)',
    stroke: 'rgba(253, 224, 232, 0.32)',
    path: 'M 200 184 C 174 152, 168 102, 202 76 C 242 98, 234 154, 200 184 Z',
    veinPath: 'M 200 180 C 205 142, 207 110, 202 84',
  },
];

const OUTER_PETALS: PetalSpec[] = [
  {
    id: 'outer-far-left',
    startRot: -12,
    endRot: -62,
    delay: '3.88s',
    gradient: 'url(#petalMidGrad)',
    stroke: 'rgba(255, 228, 235, 0.42)',
    path: 'M 200 186 C 160 162, 146 112, 188 86 C 228 108, 224 160, 200 186 Z',
    veinPath: 'M 200 182 C 188 148, 184 118, 189 94',
  },
  {
    id: 'outer-far-right',
    startRot: 12,
    endRot: 62,
    delay: '4.04s',
    gradient: 'url(#petalMidGrad)',
    stroke: 'rgba(255, 228, 235, 0.42)',
    path: 'M 200 186 C 176 160, 172 108, 212 86 C 254 112, 240 162, 200 186 Z',
    veinPath: 'M 200 182 C 212 148, 216 118, 211 94',
  },
  {
    id: 'outer-mid-left',
    startRot: -8,
    endRot: -41,
    delay: '4.22s',
    gradient: 'url(#petalSoftGrad)',
    stroke: 'rgba(255, 240, 244, 0.48)',
    path: 'M 200 186 C 162 156, 156 106, 196 84 C 236 108, 230 158, 200 186 Z',
    veinPath: 'M 200 182 C 194 146, 192 118, 196 92',
  },
  {
    id: 'outer-mid-right',
    startRot: 8,
    endRot: 41,
    delay: '4.38s',
    gradient: 'url(#petalSoftGrad)',
    stroke: 'rgba(255, 240, 244, 0.48)',
    path: 'M 200 186 C 170 158, 164 108, 204 84 C 244 106, 238 156, 200 186 Z',
    veinPath: 'M 200 182 C 206 146, 208 118, 204 92',
  },
];

const MIDDLE_PETALS: PetalSpec[] = [
  {
    id: 'mid-left',
    startRot: -4,
    endRot: -22,
    delay: '4.56s',
    gradient: 'url(#petalLuminousGrad)',
    stroke: 'rgba(255, 244, 246, 0.55)',
    path: 'M 200 186 C 166 158, 164 112, 200 94 C 236 112, 234 158, 200 186 Z',
    veinPath: 'M 200 182 C 198 150, 198 124, 200 102',
  },
  {
    id: 'mid-right',
    startRot: 4,
    endRot: 22,
    delay: '4.72s',
    gradient: 'url(#petalLuminousGrad)',
    stroke: 'rgba(255, 244, 246, 0.55)',
    path: 'M 200 186 C 166 158, 164 112, 200 94 C 236 112, 234 158, 200 186 Z',
    veinPath: 'M 200 182 C 202 150, 202 124, 200 102',
  },
  {
    id: 'mid-front-left',
    startRot: -10,
    endRot: -46,
    delay: '4.88s',
    gradient: 'url(#petalBlushRimGrad)',
    stroke: 'rgba(255, 245, 248, 0.55)',
    path: 'M 200 188 C 170 166, 168 124, 202 110 C 232 128, 228 168, 200 188 Z',
  },
  {
    id: 'mid-front-right',
    startRot: 10,
    endRot: 46,
    delay: '5.02s',
    gradient: 'url(#petalBlushRimGrad)',
    stroke: 'rgba(255, 245, 248, 0.55)',
    path: 'M 200 188 C 172 168, 168 128, 198 110 C 232 124, 230 166, 200 188 Z',
  },
];

const INNER_PETALS: PetalSpec[] = [
  {
    id: 'inner-left',
    startRot: -5,
    endRot: -20,
    delay: '5.08s',
    gradient: 'url(#petalHeartGrad)',
    stroke: 'rgba(255, 250, 245, 0.65)',
    path: 'M 200 187 C 176 164, 178 124, 202 114 C 224 128, 222 166, 200 187 Z',
  },
  {
    id: 'inner-right',
    startRot: 5,
    endRot: 20,
    delay: '5.22s',
    gradient: 'url(#petalHeartGrad)',
    stroke: 'rgba(255, 250, 245, 0.65)',
    path: 'M 200 187 C 178 166, 176 128, 198 114 C 222 124, 224 164, 200 187 Z',
  },
];

const FRONT_LIP_PETAL: PetalSpec = {
  id: 'inner-cup',
  startRot: 0,
  endRot: 0,
  delay: '5.36s',
  gradient: 'url(#petalCupGrad)',
  stroke: 'rgba(255, 247, 237, 0.72)',
  path: 'M 200 189 C 174 176, 176 150, 200 144 C 224 150, 226 176, 200 189 Z',
};

const SPARKLES = [
  { cx: 112, cy: 112, size: 6.2, dur: '3.1s', delay: '5.6s' },
  { cx: 292, cy: 102, size: 7.0, dur: '3.6s', delay: '5.9s' },
  { cx: 88, cy: 190, size: 5.0, dur: '2.9s', delay: '6.1s' },
  { cx: 314, cy: 184, size: 5.4, dur: '3.4s', delay: '5.75s' },
  { cx: 148, cy: 62, size: 4.8, dur: '3.8s', delay: '6.3s' },
  { cx: 256, cy: 58, size: 5.8, dur: '3.2s', delay: '6.05s' },
];

const STAMEN_ANTHERS = [
  { cx: 180, cy: 131, r: 2.2 },
  { cx: 190, cy: 126, r: 2.3 },
  { cx: 200, cy: 123, r: 2.8 },
  { cx: 210, cy: 126, r: 2.3 },
  { cx: 220, cy: 131, r: 2.2 },
];

export function BloomingFlower({ onFlowerTap, isRevealed }: BloomingFlowerProps) {
  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!onFlowerTap) return;
    if (e.clientX === 0 && e.clientY === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      onFlowerTap(rect.left + rect.width / 2, rect.top + rect.height * 0.35);
      return;
    }
    onFlowerTap(e.clientX, e.clientY);
  };

  return (
    <div className="relative flex items-center justify-center w-full mx-auto select-none touch-manipulation">
      {/* Soft luminous halo behind the blossom (pure CSS radial gradient for GPU speed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[10%] left-1/2 -translate-x-1/2 w-[78%] aspect-square rounded-full animate-halo-breath"
        style={{
          background:
            'radial-gradient(circle, rgba(244, 114, 182, 0.24) 0%, rgba(251, 191, 36, 0.09) 42%, rgba(6, 7, 19, 0) 72%)',
        }}
      />

      <svg
        viewBox="0 0 400 470"
        onClick={handleClick}
        role="img"
        aria-label="An animated glowing rose-peony flower blooming in a midnight garden for Orni"
        className={`w-full h-auto overflow-visible touch-manipulation ${isRevealed ? 'cursor-pointer' : ''}`}
      >
        <defs>
          {/* Soil mist */}
          <radialGradient id="soilMistGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.34" />
            <stop offset="45%" stopColor="#34d399" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#060713" stopOpacity="0" />
          </radialGradient>

          {/* Seed gradient */}
          <radialGradient id="seedCoreGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#fde047" />
            <stop offset="75%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be185d" />
          </radialGradient>

          <radialGradient id="seedAuraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#fb7185" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </radialGradient>

          {/* Stem gradients */}
          <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="45%" stopColor="#15803d" />
            <stop offset="85%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>

          <linearGradient id="stemHighlightGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#bbf7d0" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ecfccb" stopOpacity="0.8" />
          </linearGradient>

          {/* Leaf gradients */}
          <linearGradient id="leafLeftGrad" x1="100%" y1="80%" x2="0%" y2="10%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="55%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>

          <linearGradient id="leafRightGrad" x1="0%" y1="80%" x2="100%" y2="10%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="55%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>

          {/* Calyx gradient */}
          <linearGradient id="calyxGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>

          {/* Multi-layered petal gradients */}
          <linearGradient id="petalDeepGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#500724" />
            <stop offset="38%" stopColor="#9d174d" />
            <stop offset="78%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>

          <linearGradient id="petalMidGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#831843" />
            <stop offset="42%" stopColor="#db2777" />
            <stop offset="82%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#fce7f3" />
          </linearGradient>

          <linearGradient id="petalSoftGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#9f1239" />
            <stop offset="40%" stopColor="#e11d48" />
            <stop offset="80%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>

          <linearGradient id="petalLuminousGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#be185d" />
            <stop offset="45%" stopColor="#f472b6" />
            <stop offset="85%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#fff1f2" />
          </linearGradient>

          <linearGradient id="petalBlushRimGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#9d174d" stopOpacity="0.96" />
            <stop offset="50%" stopColor="#fb7185" stopOpacity="0.96" />
            <stop offset="90%" stopColor="#fecdd3" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#fff5f7" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="petalHeartGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="48%" stopColor="#fda4af" />
            <stop offset="88%" stopColor="#ffe4e6" />
            <stop offset="100%" stopColor="#fffbeb" />
          </linearGradient>

          <linearGradient id="petalCupGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#be123c" stopOpacity="0.92" />
            <stop offset="50%" stopColor="#fb7185" stopOpacity="0.88" />
            <stop offset="88%" stopColor="#fecdd3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fffbeb" stopOpacity="0.94" />
          </linearGradient>

          <radialGradient id="stamenGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="45%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="antherHaloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground glow / misty midnight earth */}
        <ellipse cx="200" cy="448" rx="92" ry="14" fill="url(#soilMistGrad)" />
        <ellipse cx="200" cy="448" rx="40" ry="4.5" fill="#fda4af" fillOpacity="0.18" />

        {/* Phase 1: Tiny glowing seed */}
        <g className="animate-seed-fade" style={{ transformOrigin: '200px 443px' }}>
          <g className="animate-seed-appear" style={{ transformOrigin: '200px 443px' }}>
            <circle
              cx="200"
              cy="443"
              r="20"
              fill="url(#seedAuraGrad)"
              className="animate-seed-pulse"
              style={{ transformOrigin: '200px 443px' }}
            />
            <path
              d="M 200 434 C 204.5 439, 205 446, 200 449 C 195 446, 195.5 439, 200 434 Z"
              fill="url(#seedCoreGrad)"
            />
            <path
              d="M 200 448 Q 194 454 188 456 M 200 448 Q 206 454 212 456"
              stroke="#fde68a"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        {/* Living swaying plant assembly */}
        <g className="animate-breeze-sway">
          {/* Phase 2: Curved botanical stem with exact pathLength for smooth growth */}
          <path
            d="M 200 448 C 196 392, 212 332, 197 268 C 190 236, 196 206, 200 185"
            pathLength={360}
            fill="none"
            stroke="url(#stemGrad)"
            strokeWidth="5.2"
            strokeLinecap="round"
            className="animate-stem-grow"
          />
          <path
            d="M 200 448 C 196 392, 212 332, 197 268 C 190 236, 196 206, 200 185"
            pathLength={360}
            fill="none"
            stroke="url(#stemHighlightGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="animate-stem-grow"
          />

          {/* Phase 3: Leaves unfurling along the stem */}
          <g
            className="animate-leaf-left"
            style={{ transformOrigin: '201px 362px', animationDelay: '2.05s' }}
          >
            <path
              d="M 201 362 C 176 355, 146 334, 134 304 C 162 302, 188 326, 201 362 Z"
              fill="url(#leafLeftGrad)"
              stroke="rgba(187, 247, 208, 0.35)"
              strokeWidth="0.9"
            />
            <path
              d="M 200 361 C 178 344, 158 325, 139 307"
              fill="none"
              stroke="rgba(220, 252, 231, 0.52)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>

          <g
            className="animate-leaf-right"
            style={{ transformOrigin: '202px 308px', animationDelay: '2.38s' }}
          >
            <path
              d="M 202 308 C 228 300, 258 278, 270 248 C 242 246, 216 270, 202 308 Z"
              fill="url(#leafRightGrad)"
              stroke="rgba(187, 247, 208, 0.35)"
              strokeWidth="0.9"
            />
            <path
              d="M 203 307 C 225 289, 246 270, 265 251"
              fill="none"
              stroke="rgba(220, 252, 231, 0.52)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>

          <g
            className="animate-leaf-left"
            style={{ transformOrigin: '196px 250px', animationDelay: '2.68s' }}
          >
            <path
              d="M 196 250 C 178 242, 158 225, 152 204 C 173 205, 190 224, 196 250 Z"
              fill="url(#leafLeftGrad)"
              stroke="rgba(187, 247, 208, 0.32)"
              strokeWidth="0.8"
            />
            <path
              d="M 195 249 C 180 236, 168 222, 156 207"
              fill="none"
              stroke="rgba(220, 252, 231, 0.48)"
              strokeWidth="0.85"
              strokeLinecap="round"
            />
          </g>

          {/* Flower Crown Assembly */}
          <g className="animate-head-bob">
            {/* Phase 4a: Calyx / Green Sepals */}
            <g className="animate-calyx-open" style={{ transformOrigin: '200px 189px' }}>
              <path
                d="M 200 192 C 186 188, 174 176, 169 164 C 184 168, 194 178, 200 192 Z"
                fill="url(#calyxGrad)"
              />
              <path
                d="M 200 192 C 214 188, 226 176, 231 164 C 216 168, 206 178, 200 192 Z"
                fill="url(#calyxGrad)"
              />
              <path
                d="M 200 194 C 194 186, 194 174, 200 165 C 206 174, 206 186, 200 194 Z"
                fill="url(#calyxGrad)"
              />
            </g>

            {/* Phase 4b: Back Crown Petals */}
            {BACK_PETALS.map((petal) => (
              <g
                key={petal.id}
                className="animate-petal-open"
                style={
                  {
                    transformOrigin: '200px 184px',
                    animationDelay: petal.delay,
                    '--petal-start-rot': `${petal.startRot}deg`,
                    '--petal-end-rot': `${petal.endRot}deg`,
                  } as CSSProperties
                }
              >
                <path
                  d={petal.path}
                  fill={petal.gradient}
                  stroke={petal.stroke}
                  strokeWidth="0.85"
                />
                {petal.veinPath && (
                  <path
                    d={petal.veinPath}
                    fill="none"
                    stroke="rgba(255, 240, 245, 0.22)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}

            {/* Phase 4c: Outer Guard Petals */}
            {OUTER_PETALS.map((petal) => (
              <g
                key={petal.id}
                className="animate-petal-open"
                style={
                  {
                    transformOrigin: '200px 185px',
                    animationDelay: petal.delay,
                    '--petal-start-rot': `${petal.startRot}deg`,
                    '--petal-end-rot': `${petal.endRot}deg`,
                  } as CSSProperties
                }
              >
                <path
                  d={petal.path}
                  fill={petal.gradient}
                  stroke={petal.stroke}
                  strokeWidth="0.9"
                />
                {petal.veinPath && (
                  <path
                    d={petal.veinPath}
                    fill="none"
                    stroke="rgba(255, 240, 245, 0.24)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}

            {/* Phase 4d: Middle Cupped Petals */}
            {MIDDLE_PETALS.map((petal) => (
              <g
                key={petal.id}
                className="animate-petal-open"
                style={
                  {
                    transformOrigin: '200px 186px',
                    animationDelay: petal.delay,
                    '--petal-start-rot': `${petal.startRot}deg`,
                    '--petal-end-rot': `${petal.endRot}deg`,
                  } as CSSProperties
                }
              >
                <path
                  d={petal.path}
                  fill={petal.gradient}
                  stroke={petal.stroke}
                  strokeWidth="0.9"
                />
                {petal.veinPath && (
                  <path
                    d={petal.veinPath}
                    fill="none"
                    stroke="rgba(255, 245, 248, 0.28)"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}

            {/* Phase 4e: Inner Heart Petals */}
            {INNER_PETALS.map((petal) => (
              <g
                key={petal.id}
                className="animate-inner-petal-open"
                style={
                  {
                    transformOrigin: '200px 187px',
                    animationDelay: petal.delay,
                    '--petal-start-rot': `${petal.startRot}deg`,
                    '--petal-end-rot': `${petal.endRot}deg`,
                  } as CSSProperties
                }
              >
                <path
                  d={petal.path}
                  fill={petal.gradient}
                  stroke={petal.stroke}
                  strokeWidth="0.95"
                />
              </g>
            ))}

            {/* Phase 4f: Luminous Golden Stamen Crown & Glowing Heart */}
            <g className="animate-core-glow" style={{ transformOrigin: '200px 156px' }}>
              <circle cx="200" cy="148" r="28" fill="url(#stamenGlowGrad)" />

              <g stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round" fill="none">
                <path d="M 200 170 Q 184 148 180 132" />
                <path d="M 200 170 Q 191 146 190 127" />
                <path d="M 200 170 L 200 124" />
                <path d="M 200 170 Q 209 146 210 127" />
                <path d="M 200 170 Q 216 148 220 132" />
              </g>

              {STAMEN_ANTHERS.map((anther, idx) => (
                <g key={idx}>
                  <circle cx={anther.cx} cy={anther.cy} r={anther.r * 3} fill="url(#antherHaloGrad)" />
                  <circle cx={anther.cx} cy={anther.cy} r={anther.r} fill="#fef08a" />
                </g>
              ))}

              <circle cx="200" cy="148" r="4.8" fill="#fffbeb" fillOpacity="0.9" />
            </g>

            {/* Front lower cupped lip petal */}
            <g
              className="animate-inner-petal-open"
              style={
                {
                  transformOrigin: '200px 188px',
                  animationDelay: FRONT_LIP_PETAL.delay,
                  '--petal-start-rot': `${FRONT_LIP_PETAL.startRot}deg`,
                  '--petal-end-rot': `${FRONT_LIP_PETAL.endRot}deg`,
                } as CSSProperties
              }
            >
              <path
                d={FRONT_LIP_PETAL.path}
                fill={FRONT_LIP_PETAL.gradient}
                stroke={FRONT_LIP_PETAL.stroke}
                strokeWidth="0.95"
              />
            </g>

            {/* Receptacle collar */}
            <path
              d="M 192 187 Q 200 194 208 187 Q 204 198 200 198 Q 196 198 192 187 Z"
              fill="#15803d"
              className="animate-calyx-open"
              style={{ transformOrigin: '200px 189px' }}
            />
          </g>
        </g>

        {/* Phase 5: Lightweight twinkling star sparkles around the bloom */}
        {SPARKLES.map((s, idx) => (
          <g
            key={idx}
            className="animate-sparkle-twinkle"
            style={
              {
                transformOrigin: `${s.cx}px ${s.cy}px`,
                '--twinkle-dur': s.dur,
                '--twinkle-delay': s.delay,
              } as CSSProperties
            }
          >
            <circle
              cx={s.cx}
              cy={s.cy}
              r={s.size * 1.3}
              fill={idx % 2 === 0 ? '#fef3c7' : '#fbcfe8'}
              fillOpacity="0.16"
            />
            <path
              d={`M ${s.cx} ${s.cy - s.size} Q ${s.cx} ${s.cy} ${s.cx + s.size} ${s.cy} Q ${s.cx} ${s.cy} ${s.cx} ${s.cy + s.size} Q ${s.cx} ${s.cy} ${s.cx - s.size} ${s.cy} Q ${s.cx} ${s.cy} ${s.cx} ${s.cy - s.size} Z`}
              fill={idx % 2 === 0 ? '#fef3c7' : '#fbcfe8'}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
