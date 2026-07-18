import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, ChevronLeft } from 'lucide-react';
import { usePlayerStore } from '../lib/store';
import { WORLDS } from '../lib/gameData';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';
import { BottomNav } from './HomeScreen';

export default function WorldMapScreen() {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  if (!player) return null;

  return (
    <AnimatedBackground gradient={['#64B5F6', '#1976D2', '#0D47A1']} variant="clouds">
      <div className="min-h-screen px-4 pt-12 pb-24 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { sound.play('tap'); navigate('/home'); }} className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <ChevronLeft color="white" size={24} />
          </button>
          <div>
            <h1 className="text-white font-heading text-2xl font-black text-shadow">Safari World Map</h1>
            <p className="text-white/80 text-sm font-semibold">Recover the Knowledge Crystals!</p>
          </div>
        </div>

        {/* Progress */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold text-sm">Worlds Unlocked</span>
            <span className="text-amber-300 font-black text-lg">{player.unlocked_worlds.length} / {WORLDS.length}</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(player.unlocked_worlds.length / WORLDS.length) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
            />
          </div>
        </div>

        {/* World nodes */}
        <div className="flex flex-col items-center gap-3">
          {WORLDS.map((world, idx) => {
            const unlocked = player.unlocked_worlds.includes(world.id);
            const isCurrent = idx === player.unlocked_worlds.length - 1 && unlocked;
            const offset = idx % 2 === 0 ? 'self-start ml-4' : 'self-end mr-4';

            return (
              <div key={world.id} className={`w-full max-w-sm ${offset}`}>
                {idx > 0 && (
                  <div className="flex justify-center my-1">
                    <div className="w-1 h-6 bg-white/30 rounded-full border-dashed" />
                  </div>
                )}
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (!unlocked) { sound.play('error'); return; }
                    sound.play('whoosh');
                    navigate(`/world/${world.id}`);
                  }}
                  className="w-full"
                >
                  <div
                    className="rounded-3xl p-5 shadow-2xl relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${world.gradient.join(', ')})` }}
                  >
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-3 right-3 bg-amber-500 px-3 py-1 rounded-full"
                      >
                        <span className="text-white text-xs font-black">PLAY NOW</span>
                      </motion.div>
                    )}
                    {world.premium && unlocked && (
                      <div className="absolute top-3 right-3 bg-black/30 rounded-full p-1.5">
                        <Crown size={14} color="#FFD54F" fill="#FFD54F" />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center text-4xl flex-shrink-0">
                        {unlocked ? world.emoji : '🔒'}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="bg-black/30 text-white text-xs font-black px-2 py-0.5 rounded-full">{idx + 1}</span>
                          <p className="text-white font-bold text-lg text-shadow">{world.name}</p>
                        </div>
                        <p className="text-white/90 text-sm font-semibold mt-1">{world.boss.emoji} Boss: {world.boss.name}</p>
                        <p className="text-white/70 text-xs font-medium mt-0.5">{world.levelsPerDifficulty * 3} levels</p>
                      </div>
                      {!unlocked && (
                        <div className="flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-full">
                          <Lock size={12} color="white" />
                          <span className="text-white/80 text-xs font-bold">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 glass rounded-2xl p-3">
          <LegendItem color="#43A047" label="Unlocked" />
          <LegendItem color="#FFB300" label="Current" />
          <LegendItem color="#9E9E9E" label="Locked" />
        </div>
      </div>
      <BottomNav active="map" />
    </AnimatedBackground>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-white text-sm font-semibold">{label}</span>
    </div>
  );
}
