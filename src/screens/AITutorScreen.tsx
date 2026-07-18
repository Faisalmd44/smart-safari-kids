import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Volume2, Lightbulb, Sparkles, BookOpen, Check, X, ArrowRight } from 'lucide-react';
import { sound } from '../lib/sound';
import AnimatedBackground from '../components/AnimatedBackground';
import { WORLDS, SUBJECTS, type Subject, type Difficulty } from '../lib/gameData';
import { generateQuiz, type Question } from '../lib/questions';

interface TutorStep {
  type: 'encourage' | 'hint' | 'explain' | 'feedback';
  title: string;
  text: string;
  emoji: string;
}

function buildTutorSteps(q: Question, wasCorrect: boolean): TutorStep[] {
  const correctOption = q.options[q.answer];
  const steps: TutorStep[] = [];

  if (wasCorrect) {
    steps.push({
      type: 'feedback',
      title: 'Brilliant work!',
      text: `You got it right! The answer is "${correctOption}". ${q.explanation} You're becoming a true knowledge explorer!`,
      emoji: '🎉',
    });
  } else {
    steps.push({
      type: 'encourage',
      title: "Don't worry, explorer!",
      text: `That wasn't quite right, but that's how we learn! Every mistake makes your brain stronger. Let's figure this out together.`,
      emoji: '💪',
    });
    steps.push({
      type: 'hint',
      title: "Here's a little hint",
      text: q.hint,
      emoji: '💡',
    });
    steps.push({
      type: 'explain',
      title: "Let's understand why",
      text: `The correct answer is "${correctOption}". ${q.explanation} Next time you see a question like this, you'll know exactly what to do!`,
      emoji: '📚',
    });
    steps.push({
      type: 'feedback',
      title: "You're learning fast!",
      text: `Mistakes are just stepping stones to success. Keep going, and you'll be a Safari Champion in no time!`,
      emoji: '⭐',
    });
  }

  return steps;
}

export default function AITutorScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const worldId = params.get('world') || 'jungle';
  const levelNum = parseInt(params.get('level') || '1', 10);
  const difficulty: Difficulty = levelNum <= 14 ? 'easy' : levelNum <= 28 ? 'medium' : 'hard';

  const world = WORLDS.find((w) => w.id === worldId) || WORLDS[0];

  const questions = useMemo<Question[]>(() => {
    const subjects: Subject[] = ['maths', 'english', 'science', 'geography', 'reasoning'];
    const subj = subjects[Math.floor(Math.random() * subjects.length)];
    return generateQuiz(subj, difficulty, 5);
  }, [levelNum, difficulty]);

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [showTutor, setShowTutor] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[qIdx];
  const wasCorrect = selected === q?.answer;
  const steps = useMemo(() => (q ? buildTutorSteps(q, wasCorrect) : []), [q, wasCorrect]);
  const currentStep = steps[stepIdx];

  useEffect(() => {
    return () => sound.stopSpeaking();
  }, []);

  if (!q) return null;

  function handleAnswer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.answer;
    if (correct) {
      setCorrectCount((c) => c + 1);
      sound.play('success');
    } else {
      sound.play('error');
    }
    setTimeout(() => {
      setShowTutor(true);
      setStepIdx(0);
      speakStep(buildTutorSteps(q, correct)[0]);
    }, 400);
  }

  function speakStep(step: TutorStep) {
    sound.stopSpeaking();
    sound.speak(`${step.title}. ${step.text}`);
  }

  function nextStep() {
    sound.play('tap');
    if (stepIdx + 1 < steps.length) {
      const next = stepIdx + 1;
      setStepIdx(next);
      speakStep(steps[next]);
    } else {
      sound.stopSpeaking();
      nextQuestion();
    }
  }

  function nextQuestion() {
    if (qIdx + 1 >= questions.length) {
      setFinished(true);
      sound.play('win');
      return;
    }
    sound.play('whoosh');
    setQIdx((i) => i + 1);
    setSelected(null);
    setShowTutor(false);
    setStepIdx(0);
  }

  if (finished) {
    return (
      <AnimatedBackground gradient={world.bgGradient} variant="bubbles">
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-8xl mb-4">
            🎓
          </motion.div>
          <h1 className="font-heading text-3xl font-black text-white text-shadow-lg text-center mb-2">
            Tutoring Complete!
          </h1>
          <p className="text-white/90 font-semibold text-center mb-6">
            You answered {correctCount} out of {questions.length} correctly!
          </p>
          <div className="glass-dark rounded-3xl p-6 w-full max-w-sm mb-6">
            <p className="text-white font-bold text-center mb-2">
              {correctCount >= 4 ? "Amazing! You're a fast learner! 🌟" : correctCount >= 2 ? "Good effort! Keep practicing! 💪" : "Don't give up! Every try makes you stronger! 🌱"}
            </p>
          </div>
          <button
            onClick={() => { sound.play('tap'); navigate(`/world/${world.id}`); }}
            className="w-full max-w-sm py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-heading font-black shadow-lg"
          >
            Back to World
          </button>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground gradient={world.bgGradient} variant="bubbles">
      <div className="min-h-screen px-4 pt-12 pb-10 max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => { sound.stopSpeaking(); sound.play('tap'); navigate(`/world/${world.id}`); }}
            className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center"
          >
            <ChevronLeft color="white" size={24} />
          </button>
          <div className="flex-1">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
          </div>
          <span className="text-white font-bold text-sm">{qIdx + 1}/{questions.length}</span>
        </div>

        {/* AI Tutor banner */}
        <div className="glass-dark rounded-2xl p-3 mb-4 flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl"
          >
            🦉
          </motion.div>
          <div className="flex-1">
            <p className="text-white font-heading font-black text-sm">AI Tutor</p>
            <p className="text-white/70 text-xs">Hoot the Owl is here to help!</p>
          </div>
          <div className="flex items-center gap-1 bg-purple-600/80 px-3 py-1 rounded-full">
            <Sparkles size={14} color="white" />
            <span className="text-white text-xs font-bold">Active</span>
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIdx}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/97 rounded-3xl p-6 shadow-2xl mb-5"
          >
            <div className="inline-flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-full mb-4">
              <BookOpen size={14} color="#7E57C2" />
              <span className="text-purple-700 text-sm font-bold">AI Tutor Mode</span>
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
            let letterBg = 'bg-purple-100 text-gray-700';
            if (selected !== null) {
              if (isCorrect) { style = 'bg-green-100 border-2 border-green-500'; letterBg = 'bg-green-500 text-white'; }
              else if (isSelected) { style = 'bg-red-100 border-2 border-red-500'; letterBg = 'bg-red-500 text-white'; }
              else { style = 'bg-white/50 border-2 border-white/20 opacity-60'; }
            }
            return (
              <motion.button
                key={i}
                whileTap={{ scale: selected !== null ? 1 : 0.97 }}
                disabled={selected !== null}
                onClick={() => handleAnswer(i)}
                className={`w-full p-4 rounded-2xl shadow-md flex items-center gap-3 ${style}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black ${letterBg}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="flex-1 text-left text-gray-800 font-bold text-base">{opt}</span>
                {selected !== null && isCorrect && <Check color="#43A047" size={22} />}
                {selected !== null && isSelected && !isCorrect && <X color="#C62828" size={22} />}
              </motion.button>
            );
          })}
        </div>

        {/* Hint before answering */}
        {selected === null && (
          <button
            onClick={() => { sound.play('tap'); sound.speak(q.hint); }}
            className="flex items-center gap-2 mx-auto mb-3"
          >
            <Lightbulb size={20} color="#FFD54F" />
            <span className="text-amber-300 font-bold text-sm">Ask Tutor for a Hint</span>
          </button>
        )}

        {/* AI Tutor dialog */}
        <AnimatePresence>
          {showTutor && currentStep && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white/97 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl"
                >
                  {currentStep.emoji}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      currentStep.type === 'encourage' ? 'bg-orange-100 text-orange-700' :
                      currentStep.type === 'hint' ? 'bg-amber-100 text-amber-700' :
                      currentStep.type === 'explain' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {currentStep.type === 'encourage' ? 'Encouragement' :
                       currentStep.type === 'hint' ? 'Hint' :
                       currentStep.type === 'explain' ? 'Explanation' : 'Feedback'}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">
                      Step {stepIdx + 1}/{steps.length}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-gray-800">{currentStep.title}</h3>
                </div>
                <button
                  onClick={() => speakStep(currentStep)}
                  className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"
                  title="Listen"
                >
                  <Volume2 size={18} color="#7E57C2" />
                </button>
              </div>
              <p className="text-gray-700 font-medium text-base leading-relaxed mb-5">{currentStep.text}</p>

              {/* Step indicators */}
              <div className="flex justify-center gap-2 mb-4">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === stepIdx ? 'w-8 bg-purple-500' : i < stepIdx ? 'w-2 bg-purple-300' : 'w-2 bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-heading font-black shadow-lg flex items-center justify-center gap-2"
              >
                {stepIdx + 1 < steps.length ? 'Continue' : qIdx + 1 >= questions.length ? 'Finish' : 'Next Question'}
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedBackground>
  );
}
