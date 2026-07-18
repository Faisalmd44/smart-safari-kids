import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  gradient: [string, string, string];
  variant?: 'clouds' | 'leaves' | 'butterflies' | 'bubbles' | 'stars';
  children: React.ReactNode;
}

const EMOJI_MAP: Record<string, string[]> = {
  clouds: ['☁️', '⛅', '☁️'],
  leaves: ['🍃', '🌿', '🍂'],
  butterflies: ['🦋', '🐝', '🦋'],
  bubbles: ['🫧', '💧', '✨'],
  stars: ['⭐', '✨', '🌟'],
};

export default function AnimatedBackground({ gradient, variant = 'clouds', children }: AnimatedBackgroundProps) {
  const emojis = EMOJI_MAP[variant] || EMOJI_MAP.clouds;
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 24,
    delay: Math.random() * 3,
    emoji: emojis[i % emojis.length],
  }));

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${gradient.join(', ')})` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
            animate={{
              y: [0, -30, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
