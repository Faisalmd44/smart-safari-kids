export type Subject = 'maths' | 'english' | 'science' | 'geography' | 'reasoning';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface World {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: [string, string, string];
  bgGradient: [string, string, string];
  boss: { name: string; emoji: string };
  levelsPerDifficulty: number; // x3 difficulties = total levels per world
  premium: boolean;
  storyChapter: number;
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
}

export interface SubjectInfo {
  id: Subject;
  name: string;
  emoji: string;
  color: string;
}

export const SUBJECTS: SubjectInfo[] = [
  { id: 'maths', name: 'Maths', emoji: '🔢', color: '#1976D2' },
  { id: 'english', name: 'English', emoji: '📖', color: '#43A047' },
  { id: 'science', name: 'Science', emoji: '🔬', color: '#8E24AA' },
  { id: 'geography', name: 'Geography', emoji: '🌍', color: '#FF8F00' },
  { id: 'reasoning', name: 'Reasoning', emoji: '🧩', color: '#E53935' },
];

export const WORLDS: World[] = [
  {
    id: 'jungle',
    name: 'Jungle Journey',
    emoji: '🌴',
    description: 'Trek through the lush green jungle!',
    gradient: ['#66BB6A', '#43A047', '#2E7D32'],
    bgGradient: ['#81C784', '#43A047', '#1B5E20'],
    boss: { name: 'Vine Viper', emoji: '🐍' },
    levelsPerDifficulty: 42,
    premium: false,
    storyChapter: 1,
  },
  {
    id: 'mountain',
    name: 'Misty Mountains',
    emoji: '🏔️',
    description: 'Climb the snowy mountain peaks!',
    gradient: ['#90A4AE', '#607D8B', '#37474F'],
    bgGradient: ['#B0BEC5', '#78909C', '#455A64'],
    boss: { name: 'Frost Gorilla', emoji: '🦍' },
    levelsPerDifficulty: 42,
    premium: false,
    storyChapter: 2,
  },
  {
    id: 'ocean',
    name: 'Ocean Odyssey',
    emoji: '🌊',
    description: 'Dive into the deep blue sea!',
    gradient: ['#4FC3F7', '#0288D1', '#01579B'],
    bgGradient: ['#81D4FA', '#039BE5', '#0277BD'],
    boss: { name: 'Tentacle Terror', emoji: '🐙' },
    levelsPerDifficulty: 42,
    premium: false,
    storyChapter: 3,
  },
  {
    id: 'desert',
    name: 'Desert Dash',
    emoji: '🏜️',
    description: 'Race across the golden sands!',
    gradient: ['#FFD54F', '#FFB300', '#E65100'],
    bgGradient: ['#FFE082', '#FFB300', '#FF6F00'],
    boss: { name: 'Sand Scorpion', emoji: '🦂' },
    levelsPerDifficulty: 42,
    premium: false,
    storyChapter: 4,
  },
  {
    id: 'arctic',
    name: 'Arctic Adventure',
    emoji: '❄️',
    description: 'Slide across the frozen tundra!',
    gradient: ['#81D4FA', '#4FC3F7', '#0288D1'],
    bgGradient: ['#E1F5FE', '#81D4FA', '#039BE5'],
    boss: { name: 'Blizzard Bear', emoji: '🐻‍❄️' },
    levelsPerDifficulty: 42,
    premium: false,
    storyChapter: 5,
  },
  {
    id: 'savanna',
    name: 'Savanna Safari',
    emoji: '🦒',
    description: 'Roam the wild African plains!',
    gradient: ['#FFB74D', '#FF9800', '#E65100'],
    bgGradient: ['#FFCC80', '#FFA726', '#EF6C00'],
    boss: { name: 'Storm Guardian', emoji: '⛈️' },
    levelsPerDifficulty: 42,
    premium: false,
    storyChapter: 6,
  },
  {
    id: 'volcano',
    name: 'Volcano Valley',
    emoji: '🌋',
    description: 'Brave the fiery volcanic lands!',
    gradient: ['#FF8A65', '#FF5722', '#BF360C'],
    bgGradient: ['#FFAB91', '#FF7043', '#D84315'],
    boss: { name: 'Magma Monster', emoji: '🐲' },
    levelsPerDifficulty: 42,
    premium: true,
    storyChapter: 7,
  },
  {
    id: 'space',
    name: 'Cosmic Quest',
    emoji: '🚀',
    description: 'Blast off to the final frontier!',
    gradient: ['#B39DDB', '#7E57C2', '#4527A0'],
    bgGradient: ['#D1C4E9', '#9575CD', '#512DA8'],
    boss: { name: 'Galaxy Goblin', emoji: '👾' },
    levelsPerDifficulty: 42,
    premium: true,
    storyChapter: 8,
  },
];

export const CHARACTERS: Character[] = [
  { id: 'leo', name: 'Leo Lion', emoji: '🦁', role: 'Brave Leader', color: '#FFB300' },
  { id: 'milo', name: 'Milo Monkey', emoji: '🐵', role: 'Clever Climber', color: '#8D6E63' },
  { id: 'polly', name: 'Polly Parrot', emoji: '🦜', role: 'Word Wizard', color: '#43A047' },
  { id: 'ellie', name: 'Ellie Elephant', emoji: '🐘', role: 'Memory Master', color: '#1976D2' },
  { id: 'penny', name: 'Penny Panda', emoji: '🐼', role: 'Peaceful Puzzler', color: '#37474F' },
  { id: 'finn', name: 'Finn Fox', emoji: '🦊', role: 'Quick Thinker', color: '#FF5722' },
  { id: 'ruby', name: 'Ruby Rabbit', emoji: '🐰', role: 'Speedy Solver', color: '#EC407A' },
  { id: 'hoot', name: 'Hoot Owl', emoji: '🦉', role: 'Wise Guide', color: '#5D4037' },
];

export const AVATARS = [
  { id: 'leo', emoji: '🦁', name: 'Leo' },
  { id: 'milo', emoji: '🐵', name: 'Milo' },
  { id: 'rio', emoji: '🦜', name: 'Rio' },
  { id: 'ellie', emoji: '🐘', name: 'Ellie' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'foxy', emoji: '🦊', name: 'Foxy' },
];

export const STICKERS = [
  '🦁','🐵','🦜','🐘','🐼','🦊','🐰','🦉','🐯','🦒',
  '🦛','🐊','🦏','🦓','🐃','🦘','🦨','🦔','🐢','🦅',
  '🦜','🐬','🐳','🦈','🐠','🦭','🐙','🦀','🦞','🦐',
  '🦋','🐝','🐞','🦗','🕷️','🦂','🐌','🐜','🐛','🪲',
];

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

export const BADGES: Badge[] = [
  { id: 'first_steps', name: 'First Steps', emoji: '👣', desc: 'Complete your first level' },
  { id: 'streak_3', name: 'On Fire!', emoji: '🔥', desc: '3-day streak' },
  { id: 'streak_7', name: 'Week Warrior', emoji: '⚡', desc: '7-day streak' },
  { id: 'quiz_master', name: 'Quiz Master', emoji: '🎓', desc: 'Answer 100 questions correctly' },
  { id: 'boss_slayer', name: 'Boss Slayer', emoji: '⚔️', desc: 'Defeat your first boss' },
  { id: 'world_explorer', name: 'World Explorer', emoji: '🗺️', desc: 'Unlock 3 worlds' },
  { id: 'star_collector', name: 'Star Collector', emoji: '⭐', desc: 'Earn 50 stars' },
  { id: 'coin_rich', name: 'Treasure Hunter', emoji: '💰', desc: 'Collect 500 coins' },
  { id: 'gem_hunter', name: 'Crystal Keeper', emoji: '💎', desc: 'Collect 20 gems' },
  { id: 'champion', name: 'Safari Champion', emoji: '🏆', desc: 'Defeat all 8 bosses' },
];

export const STORY_CHAPTERS = [
  {
    chapter: 1,
    title: 'The Knowledge Crystals',
    text: 'Welcome to Safari Island! It was a peaceful home for all the animals... until a playful purple storm cloud swept across the sky and hid the magical Knowledge Crystals! Without them, the animals have forgotten everything they knew.',
  },
  {
    chapter: 2,
    title: 'The Journey Begins',
    text: 'Leo Lion has gathered his bravest friends. Together, you must travel across 8 incredible worlds — from the deep jungle to outer space — to find every glowing crystal and bring wisdom back to the island!',
  },
  {
    chapter: 3,
    title: 'The Misty Mountains',
    text: 'You\'ve conquered the jungle! But the Misty Mountains await, and the Frost Gorilla guards the next crystal. Stay sharp — the questions get trickier as you climb higher!',
  },
  {
    chapter: 4,
    title: 'Into the Deep',
    text: 'The ocean holds many secrets! Dive deep, answer questions about the sea, and defeat the Tentacle Terror to claim the Ocean Crystal. The animals are counting on you!',
  },
  {
    chapter: 5,
    title: 'The Desert Dash',
    text: 'Halfway there! The scorching desert is home to the Sand Scorpion. Stay cool under pressure and prove your knowledge to win the Desert Crystal!',
  },
  {
    chapter: 6,
    title: 'The Frozen North',
    text: 'Brrr! The Arctic is freezing, but the Blizzard Bear won\'t give up the Arctic Crystal easily. Wrap up warm and show what you know!',
  },
  {
    chapter: 7,
    title: 'The Great Savanna',
    text: 'You\'re almost at the final challenge! A swirling purple cloud waits in the savanna, keeping the crystals safe. This is where the cloud hid them — it\'s time to find them all!',
  },
  {
    chapter: 8,
    title: 'The Final Frontier',
    text: 'The last crystal was taken to space! Board the rocket, zoom past the stars, and face the Galaxy Goblin. Recover the final crystal and save Safari Island forever!',
  },
];

export function classToDifficulty(classNum: number): Difficulty {
  if (classNum <= 2) return 'easy';
  if (classNum <= 4) return 'medium';
  return 'hard';
}

export function getLevelDifficulty(levelNum: number): Difficulty {
  const perDiff = 42;
  if (levelNum <= perDiff) return 'easy';
  if (levelNum <= perDiff * 2) return 'medium';
  return 'hard';
}

export function getTotalLevels(): number {
  return WORLDS.length * 42 * 3; // 8 worlds x 126 levels = 1008 levels
}

export function getWorldLevels(worldId: string): number {
  const world = WORLDS.find((w) => w.id === worldId);
  return world ? world.levelsPerDifficulty * 3 : 0;
}
