import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlayerStore } from '../lib/store';
import { STORY_CHAPTERS, WORLDS } from '../lib/gameData';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';

export default function StoryScreen() {
  const { chapter: chapterParam } = useParams<{ chapter: string }>();
  const navigate = useNavigate();
  const { player, advanceStory } = usePlayerStore();
  const chapter = parseInt(chapterParam || '1', 10);
  const [page, setPage] = useState(0);

  const story = STORY_CHAPTERS.find((s) => s.chapter === chapter);
  const world = WORLDS[chapter - 1];

  if (!player || !story || !world) return null;

  // Split story text into pages
  const pages = story.text.split('...').map((p) => p.trim()).filter(Boolean);
  const currentPage = pages[page] || story.text;
  const isLastPage = page >= pages.length - 1;

  const handleNext = async () => {
    sound.play('whoosh');
    if (isLastPage) {
      await advanceStory(chapter);
      if (chapter === 1) {
        navigate('/map');
      } else {
        navigate(`/world/${world.id}`);
      }
    } else {
      setPage((p) => p + 1);
    }
  };

  return (
    <AnimatedBackground gradient={world.bgGradient} variant="leaves">
      <div className="min-h-screen flex flex-col px-6 pt-12 pb-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { sound.play('tap'); navigate('/home'); }} className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <ChevronLeft color="white" size={24} />
          </button>
          <div className="flex-1">
            <p className="text-white/70 text-sm font-semibold">Chapter {chapter} of 8</p>
            <h1 className="text-white font-heading text-xl font-black text-shadow">{story.title}</h1>
          </div>
        </div>

        {/* Story content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            key={page}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
            className="text-7xl mb-8"
          >
            {world.emoji}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-white font-body text-lg font-semibold text-center leading-relaxed max-w-md mb-8 text-shadow"
            >
              {currentPage}{!isLastPage ? '...' : ''}
            </motion.p>
          </AnimatePresence>

          {/* Page dots */}
          <div className="flex gap-2 mb-8">
            {pages.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === page ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {page > 0 && (
            <button
              onClick={() => { sound.play('tap'); setPage((p) => p - 1); }}
              className="flex items-center gap-1 px-6 py-4 rounded-full bg-white/20 border-2 border-white/30 text-white font-bold"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-heading font-black text-lg shadow-lg"
          >
            {isLastPage ? (chapter === 1 ? 'Start Adventure!' : `Enter ${world.name}!`) : 'Next'}
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </AnimatedBackground>
  );
}
