import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Lock, Swords, Crown } from 'lucide-react';
import { usePlayerStore } from '../lib/store';
import { WORLDS, SUBJECTS, getLevelDifficulty, type Subject } from '../lib/gameData';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';
import { BottomNav } from './HomeScreen';
import { useState } from 'react';

const DIFFICULTY_COLORS = {
  easy: { bg: 'from-green-400 to-green-600', label: 'E', color: '#43A047' },
  medium: { bg: 'from-amber-400 to-orange-500', label: 'M', color: '#FF8F00' },
  hard: { bg: 'from-red-400 to-red-600', label: 'H', color: '#C62828' },
};

export default function WorldDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const [selectedSubject, setSelectedSubject] = useState<Subject>('maths');
  if (!player || !id) return null;

  const world = WORLDS.find((w) => w.id === id);
  if (!world) return null;

  const totalLevels = world.levelsPerDifficulty * 3;
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <AnimatedBackground gradient={world.bgGradient} variant="leaves">
      <div className="min-h-screen px-4 pt-12 pb-24 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { sound.play('tap'); navigate('/map'); }} className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <ChevronLeft color="white" size={24} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-16 h-16 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center text-4xl">
              {world.emoji}
            </div>
            <div>
              <h1 className="text-white font-heading text-xl font-black text-shadow">{world.name}</h1>
              <p className="text-white/80 text-sm font-semibold">{world.description}</p>
              {world.premium && (
                <div className="flex items-center gap-1 mt-1">
                  <Crown size={12} color="#FFD54F" fill="#FFD54F" />
                  <span className="text-amber-300 text-xs font-bold">Premium World</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject selector */}
        <p className="text-white font-bold text-sm mb-2">Choose Subject</p>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => { sound.play('tap'); setSelectedSubject(s.id); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 transition-all flex-shrink-0 ${
                selectedSubject === s.id ? 'border-white scale-105' : 'border-transparent bg-white/80'
              }`}
              style={selectedSubject === s.id ? { backgroundColor: s.color } : {}}
            >
              <span className="text-lg">{s.emoji}</span>
              <span className={`font-bold text-sm ${selectedSubject === s.id ? 'text-white' : 'text-gray-700'}`}>{s.name}</span>
            </button>
          ))}
        </div>

        {/* Difficulty legend */}
        <div className="flex gap-3 mb-4 justify-center">
          {(Object.keys(DIFFICULTY_COLORS) as (keyof typeof DIFFICULTY_COLORS)[]).map((d) => (
            <div key={d} className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: DIFFICULTY_COLORS[d].color }}>
                {DIFFICULTY_COLORS[d].label}
              </div>
              <span className="text-white text-xs font-semibold capitalize">{d}</span>
            </div>
          ))}
        </div>

        {/* Level grid */}
        <p className="text-white font-bold text-sm mb-2">Levels (126 total)</p>
        <div className="grid grid-cols-5 gap-3 mb-6">
          {levels.map((lvl, i) => {
            const diff = getLevelDifficulty(lvl);
            const diffColor = DIFFICULTY_COLORS[diff];
            const isBoss = lvl % 7 === 0;
            const levelKey = `${world.id}-${lvl}`;
            const completed = player.unlocked_levels.includes(levelKey);
            const prevKey = `${world.id}-${lvl - 1}`;
            const prevCompleted = lvl === 1 || player.unlocked_levels.includes(prevKey);
            const accessible = prevCompleted;

            return (
              <motion.button
                key={lvl}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.01, 0.5) }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (!accessible) { sound.play('error'); return; }
                  sound.play('whoosh');
                  navigate(`/quiz/${world.id}/${lvl}`);
                }}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center shadow-lg bg-gradient-to-br ${diffColor.bg} ${!accessible ? 'opacity-40' : ''}`}
              >
                {isBoss ? (
                  <>
                    <Swords color="white" size={24} strokeWidth={2.5} />
                    <span className="text-white text-[8px] font-black mt-0.5">BOSS</span>
                  </>
                ) : (
                  <span className="text-white font-black text-lg">{lvl}</span>
                )}
                {completed && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                    <span className="text-[10px]">✓</span>
                  </div>
                )}
                {!accessible && (
                  <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                    <Lock size={16} color="white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Boss info */}
        <div className="glass rounded-2xl p-4 flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center text-3xl flex-shrink-0"
          >
            {world.boss.emoji}
          </motion.div>
          <div>
            <p className="text-white font-bold text-base">Final Boss: {world.boss.name}</p>
            <p className="text-white/80 text-sm font-semibold">Every 7th level is a boss battle. Defeat it to unlock the next world!</p>
          </div>
        </div>
      </div>
      <BottomNav active="map" />
    </AnimatedBackground>
  );
}
