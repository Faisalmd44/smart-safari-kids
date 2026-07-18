import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ParticleBurstProps {
  trigger: number;
  emojis?: string[];
}

const DEFAULT_EMOJIS = ['⭐', '🪙', '💎', '✨', '🎉', '🌟'];

export default function ParticleBurst({ trigger, emojis = DEFAULT_EMOJIS }: ParticleBurstProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!show) return null;

  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist = 100 + Math.random() * 150;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 80,
      emoji: emojis[i % emojis.length],
      scale: 0.5 + Math.random() * 0.8,
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {show && particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: p.scale, rotate: 180 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute text-3xl"
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
