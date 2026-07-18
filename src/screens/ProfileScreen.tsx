import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Coins, Gem, Trophy, Zap, Award, Lock, Settings, BookOpen, TrendingUp, RotateCcw } from 'lucide-react';
import { usePlayerStore } from '../lib/store';
import { AVATARS, CHARACTERS, STICKERS, BADGES, WORLDS, getTotalLevels } from '../lib/gameData';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';
import { BottomNav } from './HomeScreen';
import { useState } from 'react';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { player, updateProfile, resetPlayer } = usePlayerStore();
  const [tab, setTab] = useState<'overview' | 'stickers' | 'badges'>('overview');
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  if (!player) return null;

  const totalLevels = getTotalLevels();
  const completedLevels = player.unlocked_levels.length;
  const avatarEmoji = AVATARS.find((c) => c.id === player.avatar)?.emoji || '🦁';

  return (
    <AnimatedBackground gradient={['#607D8B', '#455A64', '#263238']} variant="clouds">
      <div className="min-h-screen px-4 pt-12 pb-24 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { sound.play('tap'); navigate('/home'); }} className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <ChevronLeft color="white" size={24} />
          </button>
          <h1 className="text-white font-heading text-2xl font-black text-shadow">My Profile</h1>
        </div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 mb-6 flex items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-white/40 flex items-center justify-center text-5xl shadow-xl">
            {avatarEmoji}
          </div>
          <div className="flex-1">
            <h2 className="text-white font-heading text-2xl font-black text-shadow">{player.player_name}</h2>
            <p className="text-white/80 font-semibold">Level {player.level} Explorer</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-amber-500/30 text-amber-200 text-xs font-bold px-2 py-0.5 rounded-full">Class {player.current_class}</span>
              <span className="bg-orange-500/30 text-orange-200 text-xs font-bold px-2 py-0.5 rounded-full">{player.streak} day streak</span>
            </div>
          </div>
        </motion.div>

        {/* Currencies */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard icon={<Star size={24} fill="#FFD54F" color="#FFD54F" />} value={player.stars} label="Stars" delay={0} />
          <StatCard icon={<Coins size={24} fill="#FFD54F" color="#FFD54F" />} value={player.coins} label="Coins" delay={0.1} />
          <StatCard icon={<Gem size={24} fill="#4FC3F7" color="#4FC3F7" />} value={player.gems} label="Gems" delay={0.2} />
          <StatCard icon={<Trophy size={24} fill="#FFD54F" color="#FFD54F" />} value={player.trophies} label="Trophies" delay={0.3} />
        </div>

        {/* Progress */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold text-sm">Overall Progress</span>
            <span className="text-amber-300 font-black">{completedLevels}/{totalLevels} levels</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedLevels / totalLevels) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-3 text-white/80 text-sm font-semibold">
            <span>Worlds: {player.unlocked_worlds.length}/8</span>
            <span>XP: {player.xp}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 bg-black/20 rounded-2xl p-1">
          {([['overview', 'Overview'], ['stickers', 'Stickers'], ['badges', 'Badges']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => { sound.play('tap'); setTab(id); }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === id ? 'bg-white text-gray-800' : 'text-white/80'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-3">
            <div className="glass rounded-2xl p-4">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><BookOpen size={18} color="#FFD54F" /> Worlds Unlocked</h3>
              <div className="flex flex-wrap gap-2">
                {WORLDS.map((w) => {
                  const unlocked = player.unlocked_worlds.includes(w.id);
                  return (
                    <div key={w.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${unlocked ? 'bg-white/20' : 'bg-black/20 opacity-50'}`}>
                      <span className="text-lg">{unlocked ? w.emoji : '🔒'}</span>
                      <span className="text-white text-xs font-semibold">{w.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2"><TrendingUp size={18} color="#FFD54F" /> Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatRow label="Total Stars" value={player.stars} />
                <StatRow label="Total Coins" value={player.coins} />
                <StatRow label="Total Gems" value={player.gems} />
                <StatRow label="Trophies" value={player.trophies} />
                <StatRow label="Day Streak" value={player.streak} />
                <StatRow label="Player Level" value={player.level} />
              </div>
            </div>
          </div>
        )}

        {tab === 'stickers' && (
          <div className="grid grid-cols-4 gap-3">
            {STICKERS.map((sticker, i) => {
              const owned = player.unlocked_stickers.includes(sticker);
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-3xl shadow-md ${owned ? 'bg-white/95' : 'bg-black/20'}`}
                >
                  <span style={{ opacity: owned ? 1 : 0.3 }}>{sticker}</span>
                  {!owned && <Lock size={14} color="white" className="absolute" />}
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === 'badges' && (
          <div className="space-y-2">
            {BADGES.map((badge, i) => {
              const earned = player.badges.includes(badge.id);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 rounded-2xl p-4 ${earned ? 'bg-white/95' : 'bg-black/15'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${earned ? 'bg-amber-100' : 'bg-black/20'}`}>
                    <span style={{ opacity: earned ? 1 : 0.4 }}>{badge.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${earned ? 'text-gray-800' : 'text-white/60'}`}>{badge.name}</p>
                    <p className={`text-xs ${earned ? 'text-gray-500' : 'text-white/50'}`}>{badge.desc}</p>
                  </div>
                  {earned ? <Award size={24} color="#FFD54F" fill="#FFD54F" /> : <Lock size={20} color="rgba(255,255,255,0.4)" />}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Settings */}
        <div className="glass rounded-2xl p-4 mt-6">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Settings size={18} color="#FFD54F" /> Settings</h3>
          <label className="block text-white/80 text-sm font-semibold mb-1">Player Name</label>
          <input
            type="text"
            value={player.player_name}
            onChange={(e) => updateProfile({ player_name: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-800 font-bold outline-none mb-3"
          />
          <label className="block text-white/80 text-sm font-semibold mb-1">Class Level (affects difficulty)</label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((c) => (
              <button
                key={c}
                onClick={() => { sound.play('tap'); updateProfile({ current_class: c }); }}
                className={`px-4 py-2 rounded-xl font-bold ${player.current_class === c ? 'bg-amber-500 text-white' : 'bg-white/20 text-white'}`}
              >
                Class {c}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Profile */}
        <div className="glass rounded-2xl p-4 mt-6">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2"><RotateCcw size={18} color="#FF6F61" /> Reset Profile</h3>
          <p className="text-white/70 text-sm font-semibold mb-3">This will erase your explorer and all progress. You will see the Create Explorer screen again.</p>
          {!confirmReset ? (
            <button
              onClick={() => { sound.play('tap'); setConfirmReset(true); }}
              className="w-full py-3 rounded-xl bg-red-500/80 text-white font-bold border border-red-300/30"
            >
              Reset My Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => { sound.play('tap'); setConfirmReset(false); }}
                disabled={resetting}
                className="flex-1 py-3 rounded-xl bg-white/20 text-white font-bold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setResetting(true);
                  sound.play('whoosh');
                  await resetPlayer();
                  navigate('/', { replace: true });
                }}
                disabled={resetting}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold disabled:opacity-60"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset Everything'}
              </button>
            </div>
          )}
        </div>
      </div>
      <BottomNav active="profile" />
    </AnimatedBackground>
  );
}

function StatCard({ icon, value, label, delay }: { icon: React.ReactNode; value: number; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/95 rounded-2xl p-3 flex flex-col items-center shadow-md"
    >
      {icon}
      <span className="text-gray-800 font-black text-xl mt-1">{value}</span>
      <span className="text-gray-500 text-xs font-bold">{label}</span>
    </motion.div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
      <span className="text-white/80 text-sm font-semibold">{label}</span>
      <span className="text-white font-black">{value}</span>
    </div>
  );
}
