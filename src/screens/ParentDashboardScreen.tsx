import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Star, Coins, Gem, Trophy, Zap, Clock, Target,
  TrendingUp, TrendingDown, Award, BookOpen, Download, Check, X, Sparkles, Calendar,
} from 'lucide-react';
import { usePlayerStore } from '../lib/store';
import { WORLDS, AVATARS, BADGES } from '../lib/gameData';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';
import { BottomNav } from './HomeScreen';

interface SubjectPerf {
  name: string;
  emoji: string;
  color: string;
  progress: number;
  accuracy: number;
  attempted: number;
  avgScore: number;
}

interface DayActivity {
  day: string;
  xp: number;
  minutes: number;
  questions: number;
}

const SUBJECTS: SubjectPerf[] = [
  { name: 'Maths', emoji: '🔢', color: '#42A5F5', progress: 78, accuracy: 86, attempted: 142, avgScore: 82 },
  { name: 'English', emoji: '🔤', color: '#66BB6A', progress: 84, accuracy: 91, attempted: 128, avgScore: 88 },
  { name: 'Hindi', emoji: '📖', color: '#FFA726', progress: 62, accuracy: 74, attempted: 96, avgScore: 71 },
  { name: 'Science', emoji: '🔬', color: '#26C6DA', progress: 70, accuracy: 80, attempted: 110, avgScore: 77 },
  { name: 'EVS', emoji: '🌍', color: '#AB47BC', progress: 66, accuracy: 78, attempted: 88, avgScore: 75 },
  { name: 'GK', emoji: '🧠', color: '#EF5350', progress: 58, accuracy: 72, attempted: 74, avgScore: 69 },
  { name: 'Logical Reasoning', emoji: '🧩', color: '#5C6BC0', progress: 72, accuracy: 83, attempted: 102, avgScore: 80 },
];

const WEEKLY: DayActivity[] = [
  { day: 'Mon', xp: 240, minutes: 18, questions: 24 },
  { day: 'Tue', xp: 180, minutes: 14, questions: 19 },
  { day: 'Wed', xp: 320, minutes: 22, questions: 31 },
  { day: 'Thu', xp: 150, minutes: 11, questions: 15 },
  { day: 'Fri', xp: 280, minutes: 20, questions: 27 },
  { day: 'Sat', xp: 360, minutes: 25, questions: 34 },
  { day: 'Sun', xp: 210, minutes: 16, questions: 22 },
];

const RECOMMENDATIONS = [
  { icon: '🔢', text: 'Needs more Maths practice', tone: 'warn' },
  { icon: '🔤', text: 'Great improvement in English!', tone: 'good' },
  { icon: '🔥', text: 'Continue your daily streak', tone: 'good' },
  { icon: '🎯', text: "Complete today's challenge", tone: 'info' },
];

function CircularProgress({ value, size = 120, stroke = 10, label }: { value: number; size?: number; stroke?: number; label: string }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF7043" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white font-heading text-2xl font-black"
        >
          {value}%
        </motion.span>
        <span className="text-white/70 text-[10px] font-bold uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
}

function StatTile({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center">
      <div className="w-9 h-9 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: color + '33' }}>
        {icon}
      </div>
      <span className="text-white font-black text-base">{value}</span>
      <span className="text-white/60 text-[10px] font-bold uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default function ParentDashboardScreen() {
  const navigate = useNavigate();
  const { player } = usePlayerStore();
  const [pdfState, setPdfState] = useState<'idle' | 'generating' | 'done'>('idle');

  const profile = useMemo(() => {
    const worldId = player?.unlocked_worlds?.slice(-1)[0] || 'jungle';
    const world = WORLDS.find((w) => w.id === worldId);
    return {
      name: player?.player_name || 'Your Child',
      avatar: AVATARS.find((a) => a.id === player?.avatar)?.emoji || '🦁',
      className: `Class ${player?.current_class || 1}`,
      level: player?.level || 1,
      xp: player?.xp || 0,
      coins: player?.coins || 0,
      gems: player?.gems || 0,
      worldName: world?.name || 'Jungle Journey',
      worldEmoji: world?.emoji || '🌴',
    };
  }, [player]);

  const overallCompletion = 68;
  const totalSolved = 740;
  const accuracy = 82;
  const studyMinutes = 126;
  const streak = player?.streak || 5;

  const weeklyXp = WEEKLY.reduce((s, d) => s + d.xp, 0);
  const weeklyMinutes = WEEKLY.reduce((s, d) => s + d.minutes, 0);
  const weeklyQuestions = WEEKLY.reduce((s, d) => s + d.questions, 0);
  const maxXp = Math.max(...WEEKLY.map((d) => d.xp));

  const bestSubject = SUBJECTS.reduce((a, b) => (a.accuracy > b.accuracy ? a : b));
  const weakSubject = SUBJECTS.reduce((a, b) => (a.accuracy < b.accuracy ? a : b));
  const improvement = 14;

  const earnedBadges = BADGES.slice(0, 6);
  const starsCollected = player?.stars || 47;
  const worldsCompleted = player?.unlocked_worlds.length || 2;

  function handleExport() {
    sound.play('whoosh');
    setPdfState('generating');
    setTimeout(() => {
      setPdfState('done');
      sound.play('success');
      setTimeout(() => setPdfState('idle'), 2600);
    }, 1600);
  }

  return (
    <AnimatedBackground gradient={['#312E81', '#1E3A8A', '#1E1B4B']} variant="stars">
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
            <Award size={26} color="#FFD54F" />
            <h1 className="text-white font-heading text-2xl font-black text-shadow">Parent Dashboard</h1>
          </div>
        </div>

        {/* Child Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-5 mb-5 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white/50 flex items-center justify-center text-4xl shadow-lg"
            >
              {profile.avatar}
            </motion.div>
            <div className="flex-1">
              <h2 className="text-white font-heading text-xl font-black">{profile.name}</h2>
              <p className="text-white/70 text-sm font-semibold">{profile.className} • {profile.worldEmoji} {profile.worldName}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <StatTile icon={<Zap size={18} color="#FFB300" />} value={`Lv ${profile.level}`} label="Level" color="#FFB300" />
            <StatTile icon={<Star size={18} color="#FFD54F" fill="#FFD54F" />} value={profile.xp.toLocaleString()} label="XP" color="#FFD54F" />
            <StatTile icon={<Coins size={18} color="#FFD54F" fill="#FFD54F" />} value={profile.coins.toLocaleString()} label="Coins" color="#FFD54F" />
            <StatTile icon={<Gem size={18} color="#4FC3F7" fill="#4FC3F7" />} value={profile.gems.toLocaleString()} label="Gems" color="#4FC3F7" />
          </div>
        </motion.div>

        {/* Overall Progress */}
        <Section title="Overall Progress" icon={<Target size={20} color="#FFD54F" />}>
          <div className="flex flex-col items-center mb-4">
            <CircularProgress value={overallCompletion} label="Complete" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile icon={<BookOpen size={18} color="#42A5F5" />} value={totalSolved.toLocaleString()} label="Solved" color="#42A5F5" />
            <StatTile icon={<Target size={18} color="#66BB6A" />} value={`${accuracy}%`} label="Accuracy" color="#66BB6A" />
            <StatTile icon={<Clock size={18} color="#AB47BC" />} value={`${studyMinutes}m`} label="Study Time" color="#AB47BC" />
            <StatTile icon={<Zap size={18} color="#FF7043" />} value={`${streak} days`} label="Streak" color="#FF7043" />
          </div>
        </Section>

        {/* Subject Performance */}
        <Section title="Subject Performance" icon={<BookOpen size={20} color="#42A5F5" />}>
          <div className="space-y-3">
            {SUBJECTS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-white font-bold text-sm flex-1">{s.name}</span>
                  <span className="text-white/70 text-xs font-bold">{s.accuracy}% acc</span>
                </div>
                <div className="h-2.5 bg-white/15 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.06, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)` }}
                  />
                </div>
                <div className="flex justify-between text-white/60 text-[11px] font-semibold">
                  <span>{s.attempted} attempted</span>
                  <span>Avg {s.avgScore}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Weekly Report */}
        <Section title="Weekly Report" icon={<Calendar size={20} color="#26C6DA" />}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatTile icon={<Zap size={18} color="#FFB300" />} value={weeklyXp.toLocaleString()} label="XP" color="#FFB300" />
            <StatTile icon={<Clock size={18} color="#26C6DA" />} value={`${weeklyMinutes}m`} label="Time" color="#26C6DA" />
            <StatTile icon={<BookOpen size={18} color="#66BB6A" />} value={weeklyQuestions.toLocaleString()} label="Questions" color="#66BB6A" />
          </div>
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-3">
            <div className="flex items-end justify-between gap-2 h-32">
              {WEEKLY.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.xp / maxXp) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-cyan-300 min-h-[4px]"
                    style={{ maxHeight: '100%' }}
                  />
                  <span className="text-white/60 text-[10px] font-bold mt-1">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Monthly Report */}
        <Section title="Monthly Report" icon={<TrendingUp size={20} color="#66BB6A" />}>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-3">
              <p className="text-white/60 text-[10px] font-bold uppercase mb-1">Best Subject</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{bestSubject.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{bestSubject.name}</p>
                  <p className="text-green-300 text-xs font-semibold">{bestSubject.accuracy}% accuracy</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-3">
              <p className="text-white/60 text-[10px] font-bold uppercase mb-1">Weak Subject</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{weakSubject.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{weakSubject.name}</p>
                  <p className="text-orange-300 text-xs font-semibold">{weakSubject.accuracy}% accuracy</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-400/30 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
              <TrendingUp size={20} color="#66BB6A" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Improvement this month</p>
              <p className="text-green-300 text-xs font-semibold">+{improvement}% better than last month</p>
            </div>
          </div>
        </Section>

        {/* Achievements */}
        <Section title="Achievements" icon={<Trophy size={20} color="#FFD54F" />}>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <StatTile icon={<Trophy size={18} color="#FFD54F" fill="#FFD54F" />} value={`${earnedBadges.length}`} label="Trophies" color="#FFD54F" />
            <StatTile icon={<Award size={18} color="#AB47BC" />} value={`${earnedBadges.length}`} label="Badges" color="#AB47BC" />
            <StatTile icon={<Star size={18} color="#FFD54F" fill="#FFD54F" />} value={`${starsCollected}`} label="Stars" color="#FFD54F" />
          </div>
          <p className="text-white/70 text-xs font-bold uppercase tracking-wide mb-2">Badges Earned</p>
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
            {earnedBadges.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring' }}
                className="flex-shrink-0 w-24 bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-2.5 flex flex-col items-center"
              >
                <span className="text-3xl mb-1">{b.emoji}</span>
                <p className="text-white font-bold text-[11px] text-center leading-tight">{b.name}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
            <span className="text-2xl">🗺️</span>
            <p className="text-white font-semibold text-sm flex-1">Worlds Completed</p>
            <span className="text-amber-300 font-black text-lg">{worldsCompleted}/8</span>
          </div>
        </Section>

        {/* Recommendations */}
        <Section title="Smart Recommendations" icon={<Sparkles size={20} color="#FFB300" />}>
          <div className="space-y-2.5">
            {RECOMMENDATIONS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl p-3 flex items-center gap-3 border backdrop-blur-md ${
                  r.tone === 'warn' ? 'bg-orange-500/15 border-orange-400/30' :
                  r.tone === 'good' ? 'bg-green-500/15 border-green-400/30' :
                  'bg-blue-500/15 border-blue-400/30'
                }`}
              >
                <span className="text-2xl">{r.icon}</span>
                <p className="text-white font-semibold text-sm flex-1">{r.text}</p>
                {r.tone === 'good' ? <Check size={18} color="#66BB6A" /> : <TrendingDown size={18} color="#FFB300" />}
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Export Report */}
        <Section title="Export Report" icon={<Download size={20} color="#4FC3F7" />}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            disabled={pdfState !== 'idle'}
            className="w-full relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl border border-white/20 flex items-center justify-center gap-2 disabled:opacity-80"
          >
            <AnimatePresence mode="wait">
              {pdfState === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Download size={22} color="white" />
                  <span className="text-white font-heading font-black text-base">Download PDF Report</span>
                </motion.div>
              )}
              {pdfState === 'generating' && (
                <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles size={22} color="white" />
                  </motion.div>
                  <span className="text-white font-heading font-black text-base">Generating Report...</span>
                </motion.div>
              )}
              {pdfState === 'done' && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.5 }}>
                    <Check size={24} color="#66BB6A" />
                  </motion.div>
                  <span className="text-white font-heading font-black text-base">Report Ready!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <p className="text-white/50 text-xs font-semibold text-center mt-2">
            A full PDF summary of your child's progress.
          </p>
        </Section>
      </div>

      <BottomNav active="home" />
    </AnimatedBackground>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className="glass rounded-3xl p-5 mb-5 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-white font-heading text-lg font-black">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
