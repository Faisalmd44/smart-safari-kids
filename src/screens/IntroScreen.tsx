import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../lib/sound';
import { usePlayerStore } from '../lib/store';

const STORY_SLIDES = [
  {
    emoji: '🦁',
    title: 'Welcome to Safari Island!',
    text: 'A magical island where animals live, learn, and play together in harmony.',
    bg: 'from-green-400 via-green-600 to-green-800',
  },
  {
    emoji: '💎',
    title: 'The Knowledge Crystals',
    text: 'For centuries, magical Knowledge Crystals kept the island wise and peaceful. Every animal learned from them.',
    bg: 'from-amber-400 via-orange-500 to-red-600',
  },
  {
    emoji: '👹',
    title: 'The Shadow Hunter Strikes!',
    text: 'One dark night, the evil Shadow Hunter stole all the crystals! The animals started forgetting everything...',
    bg: 'from-gray-600 via-gray-800 to-gray-900',
  },
  {
    emoji: '🗺️',
    title: 'Your Adventure Begins!',
    text: 'Join Leo the Lion and his brave friends! Travel across 8 amazing worlds, recover the crystals, and save Safari Island!',
    bg: 'from-blue-400 via-blue-600 to-indigo-800',
  },
];

export default function IntroScreen() {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const [slide, setSlide] = useState(0);

  // If player already exists, skip to home
  useEffect(() => {
    if (player) navigate('/home', { replace: true });
  }, [player, navigate]);

  const current = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;

  const next = () => {
    sound.play('whoosh');
    if (isLast) {
      navigate('/onboarding');
    } else {
      setSlide((s) => s + 1);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${current.bg} flex flex-col items-center justify-center px-6 transition-all duration-700`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-8xl mb-8"
          >
            {current.emoji}
          </motion.div>
          <h1 className="font-heading text-3xl font-black text-white text-shadow-lg mb-4">{current.title}</h1>
          <p className="font-body text-lg text-white/95 font-semibold leading-relaxed">{current.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-2 mt-12">
        {STORY_SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={next}
        className="mt-10 px-10 py-4 rounded-full bg-white/25 backdrop-blur-md border-2 border-white/40 text-white font-heading font-bold text-lg shadow-xl"
      >
        {isLast ? 'Start Your Adventure! 🚀' : 'Next →'}
      </motion.button>

      <button
        onClick={() => { sound.play('tap'); navigate('/onboarding'); }}
        className="mt-4 text-white/60 text-sm font-semibold underline"
      >
        Skip Intro
      </button>
    </div>
  );
}
