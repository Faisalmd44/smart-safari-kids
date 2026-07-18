import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Star, Crown, Users, Globe, Calendar, Sparkles } from 'lucide-react';
import { usePlayerStore } from '../lib/store';
import { WORLDS, AVATARS } from '../lib/gameData';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';
import { BottomNav } from './HomeScreen';

type TabId = 'global' | 'weekly' | 'monthly' | 'friends';

interface LeaderEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  stars: number;
  worldId: string;
  isCurrentPlayer?: boolean;
}

const TABS: { id: TabId; label: string; icon: typeof Globe }[] = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'weekly', label: 'Weekly', icon: Calendar },
  { id: 'monthly', label: 'Monthly', icon: Sparkles },
  { id: 'friends', label: 'Friends', icon: Users },
];

const MOCK_NAMES = [
  'Aria', 'Benny', 'Chloe', 'Diego', 'Emma', 'Finn', 'Gia', 'Hugo',
  'Isla', 'Jax', 'Kai', 'Luna', 'Milo', 'Nina', 'Otis', 'Pia',
  'Quinn', 'Ravi', 'Sora', 'Theo', 'Uma', 'Vera', 'Wren', 'Xena',
  'Yusuf', 'Zara', 'Bea', 'Cody', 'Dara', 'Eli',
];

const MOCK_WORLDS = WORLDS.map((w) => w.id);

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildMockLeaderboard(currentPlayer: LeaderEntry, tab: TabId): LeaderEntry[] {
  const count = tab === 'friends' ? 6 : 30;
  const seedBase = tab === 'global' ? 1 : tab === 'weekly' ? 2 : tab === 'monthly' ? 3 : 4;
  const xpCeiling = tab === 'weekly' ? 800 : tab === 'monthly' ? 2400 : 12000;

  const entries: LeaderEntry[] = [];
  for (let i = 0; i < count - 1; i++) {
    const r = seededRandom(seedBase * 100 + i);
    const xp = Math.floor(r * xpCeiling) + 100;
    const stars = Math.floor(seededRandom(seedBase * 200 + i) * 200) + 5;
    const worldId = MOCK_WORLDS[Math.floor(seededRandom(seedBase * 300 + i) * MOCK_WORLDS.length)];
    const name = MOCK_NAMES[i % MOCK_NAMES.length];
    const avatar = AVATARS[Math.floor(seededRandom(seedBase * 400 + i) * AVATARS.length)].emoji;
    entries.push({
      id: `mock-${tab}-${i}`,
      name,
      avatar,
      xp,
      stars,
      worldId,
    });
  }
  entries.push({ ...currentPlayer, isCurrentPlayer: true });

  entries.sort((a, b) => b.xp - a.xp);
  return entries;
}

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const [tab, setTab] = useState<TabId>('global');
  const [loading, setLoading] = useState(true);

  const currentPlayerEntry = useMemo<LeaderEntry>(() => {
    const worldId = player?.unlocked_worlds?.slice(-1)[0] || 'jungle';
    return {
      id: player?.device_id || 'me',
      name: player?.player_name || 'You',
      avatar: AVATARS.find((a) => a.id === player?.avatar)?.emoji || '🦁',
      xp: player?.xp || 0,
      stars: player?.stars || 0,
      worldId,
      isCurrentPlayer: true,
    };
  }, [player]);

  const entries = useMemo(() => buildMockLeaderboard(currentPlayerEntry, tab), [currentPlayerEntry, tab]);
  const myRank = entries.findIndex((e) => e.isCurrentPlayer) + 1;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [tab]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <AnimatedBackground gradient={['#1E3A8A', '#1E40AF', '#1E3A8A']} variant="stars">
      <div className="min-h-screen px-4 pt-12 pb-24 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => { sound.play('tap'); navigate('/home'); }}
            className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-md"
          >
            <ChevronLeft color="white" size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Trophy size={26} color="#FFD54F" fill="#FFD54F" />
            <h1 className="text-white font-heading text-2xl font-black text-shadow">Leaderboard</h1>
          </div>
        </div>

        {/* My rank summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-4 mb-5 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-white/70 text-xs font-bold uppercase tracking-wide">Your Rank</span>
              <motion.span
                key={myRank}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring' }}
                className="text-white font-heading text-3xl font-black"
              >
                #{myRank}
              </motion.span>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{currentPlayerEntry.avatar}</span>
                <div>
                  <p className="text-white font-bold text-base">{currentPlayerEntry.name}</p>
                  <p className="text-white/70 text-xs font-semibold">
                    {WORLDS.find((w) => w.id === currentPlayerEntry.worldId)?.name || 'Jungle'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-amber-300 font-black text-lg">{currentPlayerEntry.xp.toLocaleString()}</p>
              <p className="text-white/70 text-xs font-bold">XP</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => { sound.play('tap'); setTab(t.id); }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                  active
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/80 border border-white/15 backdrop-blur-md'
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </motion.button>
            );
          })}
        </div>

        {/* Friends placeholder */}
        {tab === 'friends' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 mb-4 flex items-center gap-3"
          >
            <Users size={22} color="#FFD54F" />
            <p className="text-white/85 font-semibold text-sm">
              Add friends to compare progress! Coming soon.
            </p>
          </motion.div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                className="h-16 rounded-2xl bg-white/10 backdrop-blur-md"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[1, 0, 2].map((podiumIdx) => {
                const e = top3[podiumIdx];
                if (!e) return <div key={podiumIdx} />;
                const place = podiumIdx + 1;
                const heights = ['h-24', 'h-28', 'h-20'];
                const colors = ['#C0C0C0', '#FFD54F', '#CD7F32'];
                const crownEmoji = ['🥈', '🥇', '🥉'];
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: podiumIdx * 0.1, type: 'spring' }}
                    className={`flex flex-col items-center justify-end ${heights[podiumIdx]}`}
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: podiumIdx * 0.3 }}
                      className="relative"
                    >
                      <span className="text-4xl absolute -top-7 left-1/2 -translate-x-1/2">{crownEmoji[podiumIdx]}</span>
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-3xl border-2 shadow-xl"
                        style={{ borderColor: colors[podiumIdx], backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                      >
                        {e.avatar}
                      </div>
                    </motion.div>
                    <p className="text-white font-bold text-xs mt-2 truncate max-w-full text-center">{e.name}</p>
                    <p className="text-amber-300 font-black text-xs">{e.xp.toLocaleString()} XP</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Rest of the list */}
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {rest.map((e, i) => {
                  const rank = i + 4;
                  const world = WORLDS.find((w) => w.id === e.worldId);
                  const isMe = e.isCurrentPlayer;
                  return (
                    <motion.div
                      key={e.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.04 }}
                      className={`rounded-2xl p-3 flex items-center gap-3 shadow-lg ${
                        isMe
                          ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-2 border-amber-400/60 backdrop-blur-md'
                          : 'bg-white/10 border border-white/15 backdrop-blur-md'
                      }`}
                    >
                      <div className="w-8 text-center">
                        <span className={`font-heading font-black text-base ${isMe ? 'text-amber-300' : 'text-white/80'}`}>
                          {rank}
                        </span>
                      </div>
                      <div className="w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-2xl flex-shrink-0">
                        {e.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${isMe ? 'text-amber-200' : 'text-white'}`}>
                          {e.name} {isMe && <span className="text-amber-300 text-xs">(You)</span>}
                        </p>
                        <p className="text-white/60 text-xs font-semibold flex items-center gap-1">
                          <span>{world?.emoji}</span>
                          <span className="truncate">{world?.name}</span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-amber-300 font-black text-sm">{e.xp.toLocaleString()}</p>
                        <p className="text-white/50 text-[10px] font-bold uppercase">XP</p>
                      </div>
                      <div className="text-right flex-shrink-0 flex items-center gap-1">
                        <Star size={13} color="#FFD54F" fill="#FFD54F" />
                        <span className="text-white font-bold text-xs">{e.stars}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <BottomNav active="home" />
    </AnimatedBackground>
  );
}
