import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, X, Lightbulb, Heart, ChevronLeft, Star, Coins, Zap, Trophy } from 'lucide-react';
import { usePlayerStore } from '../lib/store';
import { WORLDS, SUBJECTS, getLevelDifficulty, type Subject } from '../lib/gameData';
import { generateQuiz, type Question } from '../lib/questions';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';
import ParticleBurst from '../components/ParticleBurst';

const QUESTIONS_PER_LEVEL = 5;
const BOSS_QUESTIONS = 8;

export default function QuizScreen() {
  const { worldId, levelNum } = useParams<{ worldId: string; levelNum: string }>();
  const navigate = useNavigate();
  const { player, completeLevel } = usePlayerStore();

  const level = parseInt(levelNum || '1', 10);
  const world = WORLDS.find((w) => w.id === worldId);
  const isBoss = level % 7 === 0;
  const difficulty = getLevelDifficulty(level);
  const totalQ = isBoss ? BOSS_QUESTIONS : QUESTIONS_PER_LEVEL;

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [bossHealth, setBossHealth] = useState(100);
  const [bossPower, setBossPower] = useState(20);
  const [finished, setFinished] = useState(false);
  const [victory, setVictory] = useState(false);
  const [burst, setBurst] = useState(0);

  const questions = useMemo<Question[]>(() => {
    const subjects: Subject[] = ['maths', 'english', 'science', 'geography', 'reasoning'];
    const subj = subjects[Math.floor(Math.random() * subjects.length)];
    return generateQuiz(subj, difficulty, totalQ);
  }, [level, difficulty, totalQ]);

  const q = questions[idx];

  useEffect(() => {
    if (bossHealth <= 0 && isBoss && !finished) {
      finishQuiz(true);
    }
  }, [bossHealth]);

  useEffect(() => {
    if (lives <= 0 && !finished) {
      finishQuiz(false);
    }
  }, [lives]);

  if (!player || !world || !q) return null;

  function handleAnswer(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    const correct = i === q.answer;
    if (correct) {
      setCorrectCount((c) => c + 1);
      sound.play('success');
      if (isBoss) {
        setBossHealth((h) => Math.max(0, h - Math.ceil(100 / totalQ)));
      }
    } else {
      sound.play('error');
      if (isBoss) {
        setBossPower((p) => p + 10);
      } else {
        setLives((l) => l - 1);
      }
    }
    setTimeout(() => setShowExplain(true), 500);
  }

  function nextQuestion() {
    if (idx + 1 >= questions.length) {
      finishQuiz(isBoss ? bossHealth <= 0 : correctCount >= Math.ceil(questions.length / 2));
      return;
    }
    sound.play('whoosh');
    setIdx((i) => i + 1);
    setSelected(null);
    setLocked(false);
    setShowHint(false);
    setShowExplain(false);
  }

  async function finishQuiz(win: boolean) {
    if (finished) return;
    setFinished(true);
    setVictory(win);
    if (win) { setBurst((b) => b + 1); sound.play('win'); } else { sound.play('lose'); }
    const stars = win ? (correctCount >= questions.length ? 3 : correctCount >= Math.ceil(questions.length / 2) ? 2 : 1) : 0;
    await completeLevel(world!.id, level, stars, 'mixed', correctCount, questions.length, isBoss && win);
  }

  const subjInfo = SUBJECTS.find((s) => s.id === 'maths')!; // mixed subjects
  const progress = ((idx) / questions.length) * 100;

  // Results screen
  if (finished) {
    const stars = victory ? (correctCount >= questions.length ? 3 : correctCount >= Math.ceil(questions.length / 2) ? 2 : 1) : 0;
    return (
      <AnimatedBackground
        gradient={victory ? ['#66BB6A', '#43A047', '#1B5E20'] : ['#BDBDBD', '#757575', '#424242']}
        variant={victory ? 'stars' : 'clouds'}
      >
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-8xl mb-4">
            {victory ? '🎉' : '💪'}
          </motion.div>
          <h1 className="font-heading text-3xl font-black text-white text-shadow-lg text-center">
            {victory ? (isBoss ? 'Boss Defeated!' : 'Level Complete!') : 'Try Again!'}
          </h1>
          <p className="text-white/90 font-semibold mt-2 text-center">
            {victory ? 'You earned Knowledge Crystals!' : 'Keep practicing, explorer!'}
          </p>

          {/* Stars */}
          <div className="flex gap-3 my-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.2, type: 'spring' }}
              >
                <Star size={56} color={i < stars ? '#FFD54F' : 'rgba(255,255,255,0.4)'} fill={i < stars ? '#FFD54F' : 'transparent'} />
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="w-full max-w-sm space-y-2 mb-6">
            <ResultStat icon={<Check color="#43A047" size={20} />} text={`${correctCount}/${questions.length} correct`} />
            {isBoss && <ResultStat icon={<Zap color="#C62828" size={20} />} text={`Boss power: ${bossPower}`} />}
            {victory && <ResultStat icon={<Coins color="#FFB300" size={20} />} text={`+${correctCount * 5 + (isBoss ? 50 : 0)} coins`} />}
            {victory && isBoss && <ResultStat icon={<Trophy color="#FFB300" size={20} />} text="+1 trophy" />}
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={() => { sound.play('tap'); navigate(`/world/${world.id}`); }}
              className="flex-1 py-4 rounded-full bg-white/20 border-2 border-white/30 text-white font-bold"
            >
              World Map
            </button>
            <button
              onClick={() => { sound.play('whoosh'); navigate(`/quiz/${world.id}/${level}`); }}
              className="flex-1 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-heading font-black shadow-lg"
            >
              Play Again
            </button>
          </div>
        </div>
        <ParticleBurst trigger={burst} />
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground gradient={world.bgGradient} variant="bubbles">
      <div className="min-h-screen px-4 pt-12 pb-10 max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { sound.play('tap'); navigate(`/world/${world.id}`); }} className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <ChevronLeft color="white" size={24} />
          </button>
          <div className="flex-1">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
          </div>
          <span className="text-white font-bold text-sm">{idx + 1}/{questions.length}</span>
        </div>

        {/* Boss health / Lives */}
        {isBoss ? (
          <div className="glass-dark rounded-2xl p-3 mb-4 flex items-center gap-3">
            <motion.div animate={{ x: [0, -3, 3, 0] }} transition={{ duration: 0.2, repeat: locked && selected !== q.answer ? 1 : 0 }}>
              <span className="text-4xl">{world.boss.emoji}</span>
            </motion.div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">{world.boss.name}</p>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden mt-1">
                <motion.div
                  animate={{ width: `${bossHealth}%` }}
                  className="h-full bg-red-500 rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-1 bg-red-600/80 px-2 py-1 rounded-full">
              <Zap size={14} color="white" fill="white" />
              <span className="text-white text-sm font-black">{bossPower}</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 justify-center mb-4">
            {[0, 1, 2].map((i) => (
              <Heart key={i} size={22} color={i < lives ? '#E53935' : 'rgba(255,255,255,0.4)'} fill={i < lives ? '#E53935' : 'transparent'} />
            ))}
          </div>
        )}

        {/* Difficulty badge */}
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1 rounded-full text-white text-xs font-black uppercase" style={{ backgroundColor: difficulty === 'easy' ? '#43A047' : difficulty === 'medium' ? '#FF8F00' : '#C62828' }}>
            {difficulty} • Level {level}
          </span>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/97 rounded-3xl p-6 shadow-2xl mb-5"
          >
            <div className="inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full mb-4">
              <span className="text-base">{subjInfo.emoji}</span>
              <span className="text-amber-700 text-sm font-bold">{subjInfo.name}</span>
            </div>
            <p className="text-gray-800 font-heading text-xl font-bold leading-relaxed">{q.prompt}</p>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answer;
            const isSelected = i === selected;
            let style = 'bg-white/95 border-2 border-white/30';
            let letterBg = 'bg-amber-100 text-gray-700';
            if (locked) {
              if (isCorrect) { style = 'bg-green-100 border-2 border-green-500'; letterBg = 'bg-green-500 text-white'; }
              else if (isSelected) { style = 'bg-red-100 border-2 border-red-500'; letterBg = 'bg-red-500 text-white'; }
            }
            return (
              <motion.button
                key={i}
                whileTap={{ scale: locked ? 1 : 0.97 }}
                disabled={locked}
                onClick={() => handleAnswer(i)}
                className={`w-full p-4 rounded-2xl shadow-md flex items-center gap-3 ${style}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black ${letterBg}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="flex-1 text-left text-gray-800 font-bold text-base">{opt}</span>
                {locked && isCorrect && <Check color="#43A047" size={22} />}
                {locked && isSelected && !isCorrect && <X color="#C62828" size={22} />}
              </motion.button>
            );
          })}
        </div>

        {/* Hint */}
        {!locked && (
          <button onClick={() => { sound.play('tap'); setShowHint((s) => !s); }} className="flex items-center gap-2 mx-auto mb-3">
            <Lightbulb size={20} color="#FFD54F" fill={showHint ? '#FFD54F' : 'transparent'} />
            <span className="text-amber-300 font-bold text-sm">{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>
        )}
        {showHint && !locked && (
          <div className="bg-amber-500/20 border border-amber-400 rounded-2xl p-3 mb-4">
            <p className="text-amber-100 font-semibold text-sm">💡 {q.hint}</p>
          </div>
        )}

        {/* Explanation */}
        <AnimatePresence>
          {showExplain && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/97 rounded-2xl p-5 shadow-xl"
            >
              <p className="font-bold text-lg mb-2" style={{ color: selected === q.answer ? '#43A047' : '#C62828' }}>
                {selected === q.answer ? '✅ Correct!' : '❌ Not quite!'}
              </p>
              <p className="text-gray-700 font-medium text-sm leading-relaxed mb-4">{q.explanation}</p>
              <button
                onClick={nextQuestion}
                className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-heading font-black shadow-lg"
              >
                {idx + 1 >= questions.length ? 'See Results' : 'Next Question →'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ParticleBurst trigger={burst} />
    </AnimatedBackground>
  );
}

function ResultStat({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/95 rounded-2xl px-4 py-3 shadow-md">
      {icon}
      <span className="text-gray-800 font-bold">{text}</span>
    </div>
  );
}
