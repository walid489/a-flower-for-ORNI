import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { BloomingFlower } from './components/BloomingFlower';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { ambientAudio } from './utils/ambientAudio';

type ExperiencePhase = 'intro' | 'blooming' | 'revealed';

export default function App() {
  const [phase, setPhase] = useState<ExperiencePhase>('intro');
  const [bloomKey, setBloomKey] = useState(0);
  const [showName, setShowName] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showFinalLine, setShowFinalLine] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [burstSignal, setBurstSignal] = useState<{ x: number; y: number; id: number } | null>(null);

  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const triggerBurst = useCallback((x: number, y: number) => {
    setBurstSignal({ x, y, id: Date.now() + Math.random() });
  }, []);

  const startBloomSequence = useCallback(() => {
    clearTimers();
    setShowName(false);
    setShowMessage(false);
    setShowFinalLine(false);
    setShowSignature(false);
    setShowReplay(false);
    setPhase('blooming');
    setBloomKey((prev) => prev + 1);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tName = reducedMotion ? 600 : 6100;
    const tMsg = reducedMotion ? 900 : 7050;
    const tFinal = reducedMotion ? 1150 : 8000;
    const tSignature = reducedMotion ? 1400 : 8650;
    const tReplay = reducedMotion ? 1650 : 9250;

    timersRef.current.push(
      window.setTimeout(() => {
        setShowName(true);
        triggerBurst(window.innerWidth / 2, window.innerHeight * 0.32);
      }, tName),
      window.setTimeout(() => setShowMessage(true), tMsg),
      window.setTimeout(() => setShowFinalLine(true), tFinal),
      window.setTimeout(() => setShowSignature(true), tSignature),
      window.setTimeout(() => {
        setShowReplay(true);
        setPhase('revealed');
      }, tReplay),
    );
  }, [clearTimers, triggerBurst]);

  useEffect(() => {
    return () => {
      clearTimers();
      ambientAudio.dispose();
    };
  }, [clearTimers]);

  const getClickCoords = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.clientX === 0 && e.clientY === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleOpenFlower = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { x, y } = getClickCoords(e);
    triggerBurst(x, y);
    startBloomSequence();
  };

  const handleReplay = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { x, y } = getClickCoords(e);
    triggerBurst(x, y);
    startBloomSequence();
  };

  const handleToggleMusic = () => {
    const nextState = ambientAudio.toggle();
    setIsMusicOn(nextState);
  };

  const canvasIntensity =
    phase === 'intro' ? 'calm' : showName ? 'radiant' : 'blooming';

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto bg-[#060713] text-[#f8f3f0] flex flex-col justify-between">
      {/* Ambient midnight aurora & romantic radial backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 65% at 50% 32%, rgba(92, 24, 68, 0.24) 0%, rgba(28, 17, 56, 0.26) 45%, rgba(6, 7, 19, 0.96) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[130vw] max-w-[960px] h-[38vh] z-0"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(190, 24, 93, 0.12) 0%, rgba(20, 83, 45, 0.08) 40%, rgba(6, 7, 19, 0) 75%)',
        }}
      />

      {/* Starfield & floating glowing particles */}
      <StarfieldCanvas intensity={canvasIntensity} burstSignal={burstSignal} />

      {/* Quiet top bar with optional music toggle (OFF by default) */}
      <header className="relative z-30 flex items-center justify-end px-4 pt-[max(0.875rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6">
        <button
          type="button"
          onClick={handleToggleMusic}
          aria-pressed={isMusicOn}
          aria-label={isMusicOn ? 'Turn ambient music off' : 'Turn ambient music on'}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap shrink-0 cursor-pointer touch-manipulation border border-rose-200/15 bg-white/[0.04] backdrop-blur-md text-rose-100/80 hover:text-rose-50 hover:bg-white/[0.09] hover:border-rose-200/30 active:scale-[0.97] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
        >
          {isMusicOn ? (
            <Volume2 className="w-4 h-4 text-rose-300" aria-hidden="true" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-200/60" aria-hidden="true" />
          )}
          <span>{isMusicOn ? 'Music on' : 'Music off'}</span>
        </button>
      </header>

      {/* Main Centered Experience Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 pb-3 pt-1 sm:px-8">
        {phase === 'intro' ? (
          <section
            aria-label="Greeting for Orni"
            className="w-full max-w-lg mx-auto text-center flex flex-col items-center animate-text-fade-up"
          >
            {/* Subtle ambient moonlight glow behind greeting */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(244, 114, 182, 0.16) 0%, rgba(251, 191, 36, 0.06) 45%, transparent 72%)',
              }}
            />

            <h1 className="relative font-display text-[clamp(2.25rem,8vw,3.75rem)] font-medium tracking-tight text-rose-50 leading-[1.12] [text-wrap:balance]">
              Hey Orni... <span aria-hidden="true">🌷</span>
            </h1>

            <p className="relative mt-3.5 sm:mt-5 text-[15px] sm:text-lg text-rose-100/75 font-normal leading-relaxed max-w-md [text-wrap:balance]">
              Someone made something special for you.
            </p>

            <div className="relative mt-8 sm:mt-10">
              <button
                type="button"
                onClick={handleOpenFlower}
                className="group relative inline-flex items-center justify-center gap-2.5 min-h-[50px] px-7 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-medium tracking-wide text-[#fff8f6] whitespace-nowrap shrink-0 cursor-pointer touch-manipulation transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(225, 29, 72, 0.72) 0%, rgba(190, 24, 93, 0.68) 50%, rgba(157, 23, 77, 0.78) 100%)',
                  boxShadow:
                    '0 0 28px rgba(244, 114, 182, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(253, 164, 175, 0.42)',
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 40px rgba(251, 113, 133, 0.48)',
                  }}
                />
                <span>Open your flower</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:scale-110">
                  🌸
                </span>
              </button>
            </div>
          </section>
        ) : (
          <section
            aria-label="Blooming flower gift for Orni"
            className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center"
          >
            {/* Flower Stage — fluidly adapts to both 320px width & short mobile/Instagram WebView heights */}
            <div className="w-full flex items-center justify-center -mt-3 sm:-mt-5">
              <div className="w-[min(66vw,34dvh)] sm:w-[min(62vw,37dvh)] md:w-[340px] lg:w-[365px] min-w-[185px] max-w-[365px]">
                <BloomingFlower
                  key={bloomKey}
                  isRevealed={showName}
                  onFlowerTap={(x, y) => triggerBurst(x, y)}
                />
              </div>
            </div>

            {/* Poetic Name & Message Reveal */}
            <div className="w-full max-w-xl mx-auto text-center -mt-2 sm:-mt-3 min-h-[185px] sm:min-h-[210px] flex flex-col items-center px-1">
              {showName && (
                <div className="relative inline-flex items-center justify-center animate-name-reveal">
                  {/* Soft pulsing aura behind Orni's name (compositor-only opacity + transform) */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-8 -inset-y-3 rounded-full animate-soft-glow-pulse"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(244, 114, 182, 0.24) 0%, rgba(253, 224, 155, 0.12) 48%, transparent 75%)',
                    }}
                  />

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="relative w-4 h-4 sm:w-5 sm:h-5 mr-2.5 sm:mr-3 text-amber-200/90 animate-sparkle-twinkle shrink-0"
                  >
                    <path
                      fill="currentColor"
                      d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z"
                    />
                  </svg>

                  <h1 className="relative inline-flex items-baseline gap-2 sm:gap-3 font-display italic font-medium text-[clamp(2.5rem,10vw,4.25rem)] tracking-[0.04em] leading-none">
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          'linear-gradient(120deg, #fff5f7 0%, #fbcfe8 35%, #fde68a 68%, #fff1f2 100%)',
                      }}
                    >
                      Orni
                    </span>
                    <span aria-hidden="true" className="not-italic text-[clamp(1.65rem,6.5vw,2.45rem)]">
                      🌷
                    </span>
                  </h1>

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="relative w-4 h-4 sm:w-5 sm:h-5 ml-2.5 sm:ml-3 text-rose-200/90 animate-sparkle-twinkle shrink-0"
                    style={{ '--twinkle-delay': '0.8s' } as React.CSSProperties}
                  >
                    <path
                      fill="currentColor"
                      d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z"
                    />
                  </svg>
                </div>
              )}

              {showMessage && (
                <p className="mt-3 sm:mt-4 text-[14px] sm:text-lg leading-[1.62] sm:leading-[1.68] text-rose-100/85 font-normal max-w-md mx-auto [text-wrap:balance] animate-text-fade-up">
                  Some flowers bloom just to make the world a little more beautiful. And some people do the same.
                </p>
              )}

              {showFinalLine && (
                <p className="mt-2.5 sm:mt-3 font-display italic text-[17px] sm:text-xl text-amber-100/80 tracking-wide animate-text-fade-up">
                  This little flower is yours.
                </p>
              )}

              {showReplay && (
                <div className="mt-4 sm:mt-5 animate-text-fade-up">
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap shrink-0 cursor-pointer touch-manipulation border border-rose-200/20 bg-white/[0.04] backdrop-blur-md text-rose-100/85 hover:text-white hover:bg-white/[0.1] hover:border-rose-200/35 active:scale-[0.97] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-300/90" aria-hidden="true" />
                    <span>Replay bloom</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Bottom personal dedication from Walid */}
      <footer className="relative z-20 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1 px-4 text-center min-h-[46px] flex items-center justify-center">
        {phase !== 'intro' && showSignature && (
          <div className="relative inline-flex items-center justify-center animate-walid-reveal">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-6 -inset-y-2 rounded-full animate-soft-glow-pulse"
              style={{
                background:
                  'radial-gradient(circle, rgba(251, 146, 178, 0.2) 0%, rgba(253, 224, 155, 0.1) 50%, transparent 75%)',
              }}
            />

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="relative w-3 h-3 text-amber-200/85 mr-2 animate-sparkle-float shrink-0"
              style={{ '--float-dur': '3.1s', '--float-delay': '0.1s' } as React.CSSProperties}
            >
              <path
                fill="currentColor"
                d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z"
              />
            </svg>

            <p className="relative text-[13px] sm:text-[15px] text-rose-100/80 tracking-wide">
              Made with love by{' '}
              <span className="relative inline-block font-display italic font-semibold text-xl sm:text-[1.35rem] tracking-wider mx-0.5 text-amber-100">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-full animate-soft-glow-pulse"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(253, 224, 171, 0.35) 0%, rgba(244, 114, 182, 0.18) 55%, transparent 80%)',
                  }}
                />
                <span className="relative">Walid</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute -top-2 -right-2.5 w-2.5 h-2.5 text-amber-200 animate-sparkle-float"
                  style={{ '--float-dur': '2.7s', '--float-delay': '0.6s' } as React.CSSProperties}
                >
                  <path
                    fill="currentColor"
                    d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z"
                  />
                </svg>
              </span>{' '}
              <span aria-hidden="true">❤️</span>
            </p>

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="relative w-3 h-3 text-rose-200/85 ml-2 animate-sparkle-float shrink-0"
              style={{ '--float-dur': '3.5s', '--float-delay': '1.1s' } as React.CSSProperties}
            >
              <path
                fill="currentColor"
                d="M12 1 L14.2 9.8 L23 12 L14.2 14.2 L12 23 L9.8 14.2 L1 12 L9.8 9.8 Z"
              />
            </svg>
          </div>
        )}
      </footer>
    </div>
  );
}
