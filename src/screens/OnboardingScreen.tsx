import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AVATARS } from '../lib/gameData';
import { usePlayerStore } from '../lib/store';
import { sound } from '../lib/sound';

const CLASSES = [1, 2, 3, 4, 5] as const;

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const { createPlayer } = usePlayerStore();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('leo');
  const [currentClass, setCurrentClass] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const canStart = name.trim().length > 0 && currentClass !== null;

  const handleStart = async () => {
    if (!canStart) return;
    setCreating(true);
    sound.play('reward');
    await createPlayer(name.trim(), avatar, currentClass!);
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 via-green-600 to-green-900 flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-3"
          >
            {AVATARS.find((a) => a.id === avatar)?.emoji || '🦁'}
          </motion.div>
          <h1 className="font-heading text-3xl font-black text-white text-shadow-lg">Create Your Explorer</h1>
          <p className="font-body text-white/90 font-semibold mt-2">Pick a name, avatar, and class to begin!</p>
        </div>

        <div className="glass rounded-3xl p-6 shadow-2xl">
          <label className="block text-white font-bold text-sm mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            placeholder="Type your name..."
            className="w-full px-4 py-3 rounded-2xl bg-white/90 text-gray-800 font-bold text-lg placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-white/30"
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />

          <label className="block text-white font-bold text-sm mb-3 mt-5">Pick Your Avatar</label>
          <div className="grid grid-cols-3 gap-3">
            {AVATARS.map((a) => (
              <motion.button
                key={a.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => { sound.play('pop'); setAvatar(a.id); }}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                  avatar === a.id
                    ? 'bg-white/40 border-white scale-105'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <span className="text-4xl">{a.emoji}</span>
                <span className="text-white text-xs font-bold mt-1">{a.name}</span>
              </motion.button>
            ))}
          </div>

          <label className="block text-white font-bold text-sm mb-3 mt-5">
            Choose Your Class <span className="text-amber-200 text-xs">(required)</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {CLASSES.map((c) => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.9 }}
                onClick={() => { sound.play('tap'); setCurrentClass(c); }}
                className={`flex flex-col items-center py-3 rounded-2xl border-2 transition-all ${
                  currentClass === c
                    ? 'bg-amber-400 border-white scale-105'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <span className="text-white font-black text-lg">{c}</span>
              </motion.button>
            ))}
          </div>
          <p className="text-white/70 text-xs font-semibold mt-2">
            {currentClass === null
              ? 'Tap a class to choose your difficulty level'
              : `Class ${currentClass} selected!`}
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={!canStart || creating}
            className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-heading font-black text-lg shadow-lg disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Start Adventure! 🎒'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
