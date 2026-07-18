import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Coins, Gem, Trophy, Zap, Map, User, Play, BookOpen, Calendar, ChevronRight, Crown, Award } from 'lucide-react';
import { usePlayerStore } from '../lib/store';
import { CHARACTERS, WORLDS, AVATARS } from '../lib/gameData';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';
import SoundToggle from '../components/SoundToggle';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  if (!player) return null;

  const xpProgress = (player.xp % 100) / 100 * 100;
  const currentWorld = WORLDS.find((w) => player.unlocked_worlds.includes(w.id));
  const nextStoryChapter = player.story_progress + 1;

  const actions = [
    { icon: Map, label: 'Adventure', desc: 'Explore worlds', color: 'from-green-500 to-green-700', onClick: () => { sound.play('whoosh'); navigate('/map'); } },
    { icon: Play, label: 'Continue', desc: currentWorld ? currentWorld.name : 'Start playing', color: 'from-blue-500 to-blue-700', onClick: () => { sound.play('whoosh'); navigate('/map'); } },
    { icon: BookOpen, label: 'Quick Quiz', desc: 'Practice any subject', color: 'from-amber-500 to-orange-600', onClick: () => { sound.play('whoosh'); navigate(`/quiz/${currentWorld?.id || 'jungle'}/1`); } },
    { icon: User, label: 'Profile', desc: 'View your progress', color: 'from-purple-500 to-purple-700', onClick: () => { sound.play('whoosh'); navigate('/profile'); } },
  ];

  return (
    <AnimatedBackground gradient={['#81C784', '#43A047', '#1B5E20']} variant="butterflies">
      <div className="min-h-screen px-4 pt-12 pb-24 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center text-3xl">
              {AVATARS.find((a) => a.id === player.avatar)?.emoji || '🦁'}
            </div>
            <div>
              <p className="text-white/80 text-sm font-semibold">Welcome back,</p>
              <h1 className="text-white font-heading text-2xl font-black text-shadow">{player.player_name}</h1>
            </div>
          </div>
          <SoundToggle />
        </div>

        {/* Currencies */}
        <div className="flex gap-2 mb-4 justify-center flex-wrap">
          <CurrencyPill icon={<Star size={16} fill="#FFD54F" color="#FFD54F" />} value={player.stars} />
          <CurrencyPill icon={<Coins size={16} fill="#FFD54F" color="#FFD54F" />} value={player.coins} />
          <CurrencyPill icon={<Gem size={16} fill="#4FC3F7" color="#4FC3F7" />} value={player.gems} />
          <CurrencyPill icon={<Trophy size={16} fill="#FFD54F" color="#FFD54F" />} value={player.trophies} />
        </div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-white shadow-lg">
              <span className="text-white font-black text-lg">{player.level}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-white text-sm font-bold">Level {player.level}</span>
                <span className="text-white/70 text-xs font-semibold">{player.xp % 100}/100 XP</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Streak Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 glass rounded-2xl p-4 mb-6"
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/30 flex items-center justify-center">
            <Zap size={24} fill="#FF6F00" color="#FF6F00" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-lg">{player.streak} Day Streak!</p>
            <p className="text-white/80 text-sm font-semibold">Keep playing every day to grow it!</p>
          </div>
          <Calendar size={24} color="white" />
        </motion.div>

        {/* Story Banner */}
        {nextStoryChapter <= 8 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { sound.play('whoosh'); navigate(`/story/${nextStoryChapter}`); }}
            className="w-full mb-6"
          >
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
              <span className="text-4xl">📖</span>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-base">Story Mode - Chapter {nextStoryChapter}</p>
                <p className="text-white/90 text-sm font-semibold">Continue the adventure!</p>
              </div>
              <ChevronRight color="white" size={24} />
            </div>
          </motion.button>
        )}

        {/* Leaderboard Banner */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { sound.play('whoosh'); navigate('/leaderboard'); }}
          className="w-full mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-4 flex items-center gap-3 shadow-xl border border-white/20">
            <div className="w-12 h-12 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center">
              <Trophy size={26} color="#FFD54F" fill="#FFD54F" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-base">Leaderboard</p>
              <p className="text-white/90 text-sm font-semibold">See how you rank against explorers!</p>
            </div>
            <ChevronRight color="white" size={24} />
          </div>
        </motion.button>

        {/* Parent Dashboard Banner */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { sound.play('whoosh'); navigate('/parent'); }}
          className="w-full mb-6"
        >
          <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-4 flex items-center gap-3 shadow-xl border border-white/20">
            <div className="w-12 h-12 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center">
              <Award size={26} color="white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-base">Parent Dashboard</p>
              <p className="text-white/90 text-sm font-semibold">Track progress &amp; reports</p>
            </div>
            <ChevronRight color="white" size={24} />
          </div>
        </motion.button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {actions.map((a, i) => (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={a.onClick}
              className={`bg-gradient-to-br ${a.color} rounded-2xl p-5 flex flex-col items-center shadow-xl`}
            >
              <div className="w-14 h-14 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center mb-2">
                <a.icon color="white" size={28} />
              </div>
              <p className="text-white font-bold text-base text-shadow">{a.label}</p>
              <p className="text-white/80 text-xs font-semibold mt-1 text-center">{a.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Meet the characters */}
        <h2 className="text-white font-heading text-xl font-bold mb-3 text-shadow">Meet Your Friends</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {CHARACTERS.map((c) => (
            <motion.div
              key={c.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => sound.play('pop')}
              className="flex-shrink-0 w-28 bg-white/95 rounded-2xl p-3 flex flex-col items-center shadow-lg"
            >
              <span className="text-4xl">{c.emoji}</span>
              <p className="text-gray-800 font-bold text-sm mt-2">{c.name.split(' ')[0]}</p>
              <p className="text-gray-500 text-xs font-semibold text-center">{c.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav active="home" />
    </AnimatedBackground>
  );
}

function CurrencyPill({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1.5">
      {icon}
      <span className="text-white font-bold text-sm">{value}</span>
    </div>
  );
}

export function BottomNav({ active }: { active: string }) {
  const navigate = useNavigate();
  const items = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/home' },
    { id: 'map', icon: '🗺️', label: 'Map', path: '/map' },
    { id: 'profile', icon: '👤', label: 'Profile', path: '/profile' },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-green-900/90 backdrop-blur-md border-t border-white/15 px-4 py-2 flex justify-around items-center max-w-2xl mx-auto">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => { sound.play('tap'); navigate(item.path); }}
          className={`flex flex-col items-center px-6 py-2 rounded-2xl transition-all ${
            active === item.id ? 'bg-amber-500/30 scale-110' : 'opacity-60'
          }`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className={`text-white text-xs font-bold ${active === item.id ? 'text-amber-300' : ''}`}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
