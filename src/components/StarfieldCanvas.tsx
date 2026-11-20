import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  tint: string;
}

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  speed: number;
  hue: 'rose' | 'gold' | 'blush';
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  spriteIndex: number;
}

interface StarfieldCanvasProps {
  intensity: 'calm' | 'blooming' | 'radiant';
  burstSignal: { x: number; y: number; id: number } | null;
}

const FIREFLY_COLORS = {
  rose: '251, 146, 178',
  gold: '253, 224, 155',
  blush: '249, 168, 212',
} as const;

const BURST_COLORS = [
  '253, 224, 155',
  '251, 146, 178',
  '249, 168, 212',
  '255, 241, 242',
] as const;

function createGlowSprite(rgb: string, spriteSize = 32): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = spriteSize;
  sprite.height = spriteSize;
  const sctx = sprite.getContext('2d');
  if (!sctx) return sprite;

  const half = spriteSize / 2;
  const grad = sctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(255, 250, 245, 0.95)');
  grad.addColorStop(0.22, `rgba(${rgb}, 0.85)`);
  grad.addColorStop(0.5, `rgba(${rgb}, 0.28)`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);

  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, spriteSize, spriteSize);
  return sprite;
}

export function StarfieldCanvas({ intensity, burstSignal }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intensityRef = useRef(intensity);
  const burstsRef = useRef<BurstParticle[]>([]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    if (!burstSignal || reducedMotionRef.current) return;

    // Cap active burst particles for low-end mobile performance
    if (burstsRef.current.length > 42) {
      burstsRef.current.splice(0, burstsRef.current.length - 24);
    }

    const count = 14;
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.38;
      const speed = 0.65 + Math.random() * 1.75;
      burstsRef.current.push({
        x: burstSignal.x,
        y: burstSignal.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.45,
        life: 0,
        maxLife: 44 + Math.random() * 28,
        size: 10 + Math.random() * 12,
        spriteIndex: i % BURST_COLORS.length,
      });
    }
  }, [burstSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let lastEntityWidth = 0;
    let lastEntityHeight = 0;
    let animationFrameId = 0;
    let isVisible = !document.hidden;

    const starTints = ['#f8fafc', '#fde68a', '#fbcfe8', '#e0e7ff'];
    const stars: Star[] = [];
    const fireflies: Firefly[] = [];

    // Pre-rendered glow sprites eliminate per-frame radial gradient allocations
    const fireflySprites: Record<'rose' | 'gold' | 'blush', HTMLCanvasElement> = {
      rose: createGlowSprite(FIREFLY_COLORS.rose, 32),
      gold: createGlowSprite(FIREFLY_COLORS.gold, 32),
      blush: createGlowSprite(FIREFLY_COLORS.blush, 32),
    };
    const burstSprites = BURST_COLORS.map((rgb) => createGlowSprite(rgb, 28));

    const setupEntities = () => {
      stars.length = 0;
      fireflies.length = 0;
      lastEntityWidth = width;
      lastEntityHeight = height;

      const starCount = Math.min(75, Math.max(36, Math.floor((width * height) / 17000)));
      for (let i = 0; i < starCount; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.88,
          radius: 0.45 + Math.random() * 1.15,
          baseAlpha: 0.2 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.02,
          tint: starTints[i % starTints.length],
        });
      }

      const fireflyCount = Math.min(22, Math.max(12, Math.floor(width / 46)));
      const hues: Array<'rose' | 'gold' | 'blush'> = ['rose', 'gold', 'blush'];
      for (let i = 0; i < fireflyCount; i += 1) {
        fireflies.push({
          x: Math.random() * width,
          y: height * 0.14 + Math.random() * height * 0.78,
          vx: (Math.random() - 0.5) * 0.24,
          vy: -0.1 - Math.random() * 0.22,
          size: 14 + Math.random() * 14,
          phase: Math.random() * Math.PI * 2,
          speed: 0.016 + Math.random() * 0.024,
          hue: hues[i % hues.length],
        });
      }
    };

    const resize = (forceRebuild = false) => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      width = nextWidth;
      height = nextHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Ignore minor vertical shifts caused by mobile URL bars / Instagram WebView toolbars
      const widthChanged = Math.abs(width - lastEntityWidth) > 24;
      const heightChangedSignificantly = Math.abs(height - lastEntityHeight) > 140;
      if (forceRebuild || stars.length === 0 || widthChanged || heightChangedSignificantly) {
        setupEntities();
      }
    };

    resize(true);

    let tick = 0;

    const renderFrame = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        const twinkle = reducedMotionRef.current
          ? 0.9
          : 0.55 + 0.45 * Math.sin(tick * star.speed + star.phase);
        ctx.globalAlpha = star.baseAlpha * twinkle;
        ctx.fillStyle = star.tint;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw floating bioluminescent fireflies using cached sprites
      const mode = intensityRef.current;
      const fireflyBoost = mode === 'radiant' ? 1.0 : mode === 'blooming' ? 0.8 : 0.45;
      const activeCount = Math.floor(fireflies.length * fireflyBoost);

      for (let i = 0; i < activeCount; i += 1) {
        const f = fireflies[i];
        if (!reducedMotionRef.current) {
          f.x += f.vx + Math.sin(tick * 0.012 + f.phase) * 0.14;
          f.y += f.vy;

          if (f.y < -24) {
            f.y = height + 20;
            f.x = Math.random() * width;
          }
          if (f.x < -24) f.x = width + 20;
          if (f.x > width + 24) f.x = -20;
        }

        const pulse = reducedMotionRef.current
          ? 0.5
          : 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(tick * f.speed + f.phase));

        ctx.globalAlpha = pulse;
        const sprite = fireflySprites[f.hue];
        const half = f.size / 2;
        ctx.drawImage(sprite, f.x - half, f.y - half, f.size, f.size);
      }

      // Draw interactive burst sparkles
      for (let i = burstsRef.current.length - 1; i >= 0; i -= 1) {
        const p = burstsRef.current[i];
        p.life += 1;
        if (p.life >= p.maxLife) {
          burstsRef.current.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 + 0.015;

        const progress = p.life / p.maxLife;
        ctx.globalAlpha = Math.sin((1 - progress) * Math.PI * 0.5);
        const sprite = burstSprites[p.spriteIndex];
        const half = p.size / 2;
        ctx.drawImage(sprite, p.x - half, p.y - half, p.size, p.size);
      }

      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (!isVisible || reducedMotionRef.current) {
        animationFrameId = 0;
        return;
      }
      renderFrame();
      animationFrameId = window.requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (reducedMotionRef.current) {
        renderFrame();
        return;
      }
      if (!animationFrameId && isVisible) {
        animationFrameId = window.requestAnimationFrame(loop);
      }
    };

    const stopLoop = () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const handleResize = () => {
      resize(false);
      if (reducedMotionRef.current) {
        renderFrame();
      }
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
        stopLoop();
        burstsRef.current.length = 0;
        renderFrame();
      } else {
        startLoop();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionChange);

    startLoop();

    return () => {
      stopLoop();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
