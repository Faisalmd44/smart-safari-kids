import { Subject, Difficulty } from './gameData';

export interface Question {
  prompt: string;
  options: string[];
  answer: number;
  hint: string;
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct: number | string, distractors: (number | string)[]): { options: string[]; answer: number } {
  const opts = shuffle([correct, ...distractors]).map(String);
  return { options: opts, answer: opts.indexOf(String(correct)) };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============ MATHS ============
function genMath(diff: Difficulty): Question {
  if (diff === 'easy') {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    const op = pick(['+', '-']);
    const result = op === '+' ? a + b : a - b;
    const { options, answer } = makeOptions(result, [result + 1, result - 1, result + 2]);
    return {
      prompt: `What is ${a} ${op} ${b}?`,
      options,
      answer,
      hint: `Count on your fingers! ${a} ${op} ${b}`,
      explanation: `${a} ${op} ${b} = ${result}. Great counting!`,
    };
  }
  if (diff === 'medium') {
    const type = pick(['mul', 'div', 'word']);
    if (type === 'mul') {
      const a = randInt(2, 12);
      const b = randInt(2, 12);
      const result = a * b;
      const { options, answer } = makeOptions(result, [result + randInt(1, 5), result - randInt(1, 5), result + randInt(6, 10)]);
      return {
        prompt: `What is ${a} × ${b}?`,
        options,
        answer,
        hint: `Think of it as ${a} groups of ${b}.`,
        explanation: `${a} × ${b} = ${result}. Multiplication power!`,
      };
    }
    if (type === 'div') {
      const b = randInt(2, 12);
      const result = randInt(2, 12);
      const a = b * result;
      const { options, answer } = makeOptions(result, [result + 1, result - 1, result + 2]);
      return {
        prompt: `What is ${a} ÷ ${b}?`,
        options,
        answer,
        hint: `${a} divided into groups of ${b}.`,
        explanation: `${a} ÷ ${b} = ${result}. Perfect division!`,
      };
    }
    const price = randInt(2, 20);
    const qty = randInt(2, 5);
    const total = price * qty;
    const { options, answer } = makeOptions(total, [total + price, total - price, total + randInt(1, 5)]);
    return {
      prompt: `Sam buys ${qty} toys for $${price} each. How much in total?`,
      options,
      answer,
      hint: `Multiply the price by the number of toys.`,
      explanation: `${qty} × $${price} = $${total}. Smart shopping!`,
    };
  }
  const type = pick(['fractions', 'percent', 'algebra']);
  if (type === 'fractions') {
    const denom = randInt(2, 8);
    const num = randInt(1, denom - 1);
    const whole = randInt(10, 50);
    const result = Math.round((whole * num) / denom);
    const { options, answer } = makeOptions(result, [result + 1, result - 1, result + 2]);
    return {
      prompt: `What is ${num}/${denom} of ${whole}?`,
      options,
      answer,
      hint: `Divide by ${denom}, then multiply by ${num}.`,
      explanation: `${whole} ÷ ${denom} × ${num} = ${result}. Fraction master!`,
    };
  }
  if (type === 'percent') {
    const pct = pick([10, 20, 25, 50, 75]);
    const whole = pick([100, 200, 400, 80, 60, 120]);
    const result = Math.round((whole * pct) / 100);
    const { options, answer } = makeOptions(result, [result + 5, result - 5, result + 10]);
    return {
      prompt: `What is ${pct}% of ${whole}?`,
      options,
      answer,
      hint: `${pct}% means ${pct}/100. Multiply by ${whole}.`,
      explanation: `${whole} × ${pct}/100 = ${result}. Percentage pro!`,
    };
  }
  const x = randInt(2, 12);
  const coef = randInt(2, 6);
  const add = randInt(1, 20);
  const result = (coef * x + add);
  const { options, answer } = makeOptions(x, [x + 1, x - 1, x + 2]);
  return {
    prompt: `If ${coef}x + ${add} = ${result}, what is x?`,
    options,
    answer,
    hint: `Subtract ${add}, then divide by ${coef}.`,
    explanation: `${result} - ${add} = ${coef * x}, then ÷ ${coef} = ${x}. Algebra ace!`,
  };
}

// ============ ENGLISH ============
function genEnglish(diff: Difficulty): Question {
  const easySynonyms: [string, string[]][] = [
    ['Big', ['Large', 'Small', 'Tiny', 'Thin']],
    ['Happy', ['Joyful', 'Sad', 'Angry', 'Tired']],
    ['Fast', ['Quick', 'Slow', 'Late', 'Weak']],
    ['Smart', ['Clever', 'Dull', 'Lazy', 'Foolish']],
    ['Begin', ['Start', 'Stop', 'End', 'Pause']],
    ['Brave', ['Courageous', 'Scared', 'Shy', 'Weak']],
    ['Cold', ['Chilly', 'Hot', 'Warm', 'Boiling']],
    ['Loud', ['Noisy', 'Quiet', 'Silent', 'Soft']],
  ];
  const easyAntonyms: [string, string, string[]][] = [
    ['Hot', 'Cold', ['Warm', 'Cool', 'Freezing']],
    ['Up', 'Down', ['Left', 'Right', 'Over']],
    ['Day', 'Night', ['Morning', 'Evening', 'Noon']],
    ['Big', 'Small', ['Medium', 'Tiny', 'Large']],
    ['Happy', 'Sad', ['Glad', 'Joyful', 'Cheerful']],
    ['Open', 'Close', ['Shut', 'Lock', 'Seal']],
    ['Fast', 'Slow', ['Quick', 'Rapid', 'Speedy']],
    ['Light', 'Dark', ['Bright', 'Dim', 'Pale']],
  ];
  if (diff === 'easy') {
    const type = pick(['synonym', 'antonym', 'plural', 'rhyme']);
    if (type === 'synonym') {
      const [word, opts] = pick(easySynonyms);
      const correct = opts[0];
      const { options, answer } = makeOptions(correct, opts.slice(1));
      return {
        prompt: `Which word means the same as "${word}"?`,
        options,
        answer,
        hint: `Think of a word that means something similar.`,
        explanation: `"${correct}" means the same as "${word}".`,
      };
    }
    if (type === 'antonym') {
      const [word, correct, distractors] = pick(easyAntonyms);
      const { options, answer } = makeOptions(correct, distractors);
      return {
        prompt: `What is the opposite of "${word}"?`,
        options,
        answer,
        hint: `Think of a word that means the reverse.`,
        explanation: `"${correct}" is the opposite of "${word}".`,
      };
    }
    if (type === 'plural') {
      const words: [string, string][] = [['cat', 'cats'], ['dog', 'dogs'], ['box', 'boxes'], ['baby', 'babies'], ['leaf', 'leaves'], ['bus', 'buses'], ['city', 'cities'], ['tree', 'trees']];
      const [sing, plur] = pick(words);
      const { options, answer } = makeOptions(plur, [sing + 's', sing + 'es', sing.replace('y', 'ys')].filter((x) => x !== plur).slice(0, 3));
      return {
        prompt: `What is the plural of "${sing}"?`,
        options,
        answer,
        hint: `Most words just add "s" — but some are special!`,
        explanation: `The plural of "${sing}" is "${plur}".`,
      };
    }
    const rhymes: [string, string[]][] = [['cat', ['hat', 'dog', 'sun', 'bed']], ['tree', ['bee', 'car', 'cup', 'pen']], ['star', ['car', 'fish', 'book', 'milk']], ['moon', ['spoon', 'table', 'chair', 'door']]];
    const [word, opts] = pick(rhymes);
    const correct = opts[0];
    const { options, answer } = makeOptions(correct, opts.slice(1));
    return {
      prompt: `Which word rhymes with "${word}"?`,
      options,
      answer,
      hint: `Say the word out loud and listen to the ending sound.`,
      explanation: `"${correct}" rhymes with "${word}"!`,
    };
  }
  if (diff === 'medium') {
    const type = pick(['synonym', 'tense', 'article', 'sentence']);
    if (type === 'synonym') {
      const medSyn: [string, string[]][] = [
        ['Ancient', ['Old', 'New', 'Modern', 'Recent']],
        ['Difficult', ['Hard', 'Easy', 'Simple', 'Basic']],
        ['Famous', ['Well-known', 'Unknown', 'Hidden', 'Secret']],
        ['Gather', ['Collect', 'Scatter', 'Drop', 'Lose']],
        ['Voyage', ['Journey', 'Rest', 'Stop', 'Nap']],
      ];
      const [word, opts] = pick(medSyn);
      const correct = opts[0];
      const { options, answer } = makeOptions(correct, opts.slice(1));
      return {
        prompt: `Which word means the same as "${word}"?`,
        options,
        answer,
        hint: `Think of a word with a similar meaning.`,
        explanation: `"${correct}" is a synonym for "${word}".`,
      };
    }
    if (type === 'tense') {
      const verbs: [string, string, string][] = [['go', 'went', 'gone'], ['eat', 'ate', 'eaten'], ['run', 'ran', 'run'], ['see', 'saw', 'seen'], ['write', 'wrote', 'written'], ['swim', 'swam', 'swum']];
      const [base, past, _pastPart] = pick(verbs);
      const { options, answer } = makeOptions(past, [base + 'ed', base + 'd', base + 't'].filter((x) => x !== past).slice(0, 3));
      return {
        prompt: `What is the past tense of "${base}"?`,
        options,
        answer,
        hint: `This is an irregular verb — it doesn't just add "ed".`,
        explanation: `The past tense of "${base}" is "${past}".`,
      };
    }
    if (type === 'article') {
      const words: [string, string][] = [['apple', 'an'], ['elephant', 'an'], ['umbrella', 'an'], ['dog', 'a'], ['ball', 'a'], ['ice cream', 'an'], ['sun', 'the'], ['moon', 'the']];
      const [word, correct] = pick(words);
      const distractors = ['a', 'an', 'the'].filter((x) => x !== correct);
      const { options, answer } = makeOptions(correct, distractors);
      return {
        prompt: `Fill in the blank: "${correct === 'the' ? 'The' : correct === 'an' ? 'An' : 'A'} ___" — which article goes before "${word}"?`,
        options,
        answer,
        hint: `Use "an" before vowel sounds, "a" before consonant sounds.`,
        explanation: `We say "${correct} ${word}" because of how the word starts.`,
      };
    }
    const sentences: [string, string][] = [
      ['The cat ___ on the mat.', 'sat'],
      ['She ___ to school every day.', 'goes'],
      ['They ___ playing in the garden.', 'are'],
      ['I ___ an apple yesterday.', 'ate'],
      ['The sun ___ in the east.', 'rises'],
    ];
    const [sent, correct] = pick(sentences);
    const distractors = ['sit', 'go', 'is', 'eat', 'rise'].filter((x) => x !== correct).slice(0, 3);
    const { options, answer } = makeOptions(correct, distractors);
    return {
      prompt: `Fill in the blank: "${sent}"`,
      options,
      answer,
      hint: `Read the whole sentence and think about what makes sense.`,
      explanation: `The correct word is "${correct}".`,
    };
  }
  const type = pick(['idiom', 'analogy', 'grammar']);
  if (type === 'idiom') {
    const idioms: [string, string[]][] = [
      ['"Break a leg" means:', ['Good luck', 'Hurt yourself', 'Run fast', 'Stop moving']],
      ['"Piece of cake" means:', ['Very easy', 'Eat dessert', 'Share food', 'Bake something']],
      ['"Raining cats and dogs" means:', ['Raining heavily', 'Animals falling', 'Pets outside', 'Cloudy sky']],
      ['"Hit the books" means:', ['Study hard', 'Throw books', 'Close books', 'Buy books']],
      ['"Under the weather" means:', ['Feeling sick', 'Outside in rain', 'Below clouds', 'Cold and wet']],
    ];
    const [prompt, opts] = pick(idioms);
    const correct = opts[0];
    const { options, answer } = makeOptions(correct, opts.slice(1));
    return { prompt, options, answer, hint: `Idioms don't mean what the words literally say.`, explanation: `"${correct}" — idioms are figurative, not literal!` };
  }
  if (type === 'analogy') {
    const analogies: [string, string[]][] = [
      ['Hand is to Glove as Foot is to:', ['Shoe', 'Sock', 'Toe', 'Leg']],
      ['Bird is to Fly as Fish is to:', ['Swim', 'Water', 'Scale', 'Fin']],
      ['Doctor is to Hospital as Teacher is to:', ['School', 'Book', 'Student', 'Desk']],
      ['Hot is to Cold as Up is to:', ['Down', 'Left', 'Right', 'Side']],
    ];
    const [prompt, opts] = pick(analogies);
    const correct = opts[0];
    const { options, answer } = makeOptions(correct, opts.slice(1));
    return { prompt, options, answer, hint: `Find the relationship between the first pair.`, explanation: `The relationship is the same: ${correct}!` };
  }
  const { options, answer } = makeOptions('Because it was raining', ['Although it was raining', 'While it was raining', 'Since it was raining']);
  return {
    prompt: `Which is a cause-and-effect sentence?`,
    options,
    answer,
    hint: `Look for a reason + result structure.`,
    explanation: `"Because" shows cause and effect.`,
  };
}

// ============ SCIENCE ============
function genScience(diff: Difficulty): Question {
  if (diff === 'easy') {
    const qs: [string, string[]][] = [
      ['What do plants need to grow?', ['Sunlight and water', 'Darkness', 'Only soil', 'Candy']],
      ['Which animal lays eggs?', ['Chicken', 'Dog', 'Cow', 'Horse']],
      ['How many legs does a spider have?', ['8', '6', '4', '10']],
      ['What is the largest planet in our solar system?', ['Jupiter', 'Earth', 'Mars', 'Moon']],
      ['What do bees make?', ['Honey', 'Milk', 'Bread', 'Juice']],
      ['Which sense do you use to smell?', ['Nose', 'Eyes', 'Ears', 'Tongue']],
      ['What is ice made of?', ['Water', 'Rock', 'Sand', 'Glass']],
      ['Which is a mammal?', ['Dolphin', 'Shark', 'Crab', 'Snake']],
    ];
    const [prompt, opts] = pick(qs);
    const correct = opts[0];
    const { options, answer } = makeOptions(correct, opts.slice(1));
    return { prompt, options, answer, hint: `Think about what you've observed in nature.`, explanation: `${correct}!` };
  }
  if (diff === 'medium') {
    const qs: [string, string[]][] = [
      ['What gas do plants absorb from the air?', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium']],
      ['What is the center of an atom called?', ['Nucleus', 'Electron', 'Shell', 'Orbit']],
      ['Which planet is known as the Red Planet?', ['Mars', 'Venus', 'Mercury', 'Saturn']],
      ['What force keeps us on the ground?', ['Gravity', 'Magnetism', 'Friction', 'Wind']],
      ['What is the boiling point of water in Celsius?', ['100°C', '50°C', '0°C', '212°C']],
      ['Which organ pumps blood?', ['Heart', 'Lungs', 'Brain', 'Liver']],
      ['What do we call animals that eat only plants?', ['Herbivores', 'Carnivores', 'Omnivores', 'Insectivores']],
      ['What causes day and night?', ['Earth rotating', 'Sun moving', 'Moon blocking sun', 'Clouds moving']],
    ];
    const [prompt, opts] = pick(qs);
    const correct = opts[0];
    const { options, answer } = makeOptions(correct, opts.slice(1));
    return { prompt, options, answer, hint: `Think about your science lessons.`, explanation: `${correct}!` };
  }
  const qs: [string, string[]][] = [
    ['What is photosynthesis?', ['Plants making food from sunlight', 'Animals eating plants', 'Water flowing', 'Wind blowing']],
    ['What is the chemical symbol for water?', ['H2O', 'CO2', 'O2', 'NaCl']],
    ['Which blood cells fight infection?', ['White blood cells', 'Red blood cells', 'Platelets', 'Plasma']],
    ['What is the speed of light?', ['300,000 km/s', '1,000 km/s', '100 km/s', '1,000,000 km/s']],
    ['What causes a rainbow?', ['Light bending in water droplets', 'Paint in the sky', 'Colored clouds', 'Sun reflecting on ground']],
    ['What is an ecosystem?', ['A community of living things and their environment', 'A single animal', 'A type of weather', 'A kind of plant']],
    ['Which renewable energy uses sunlight?', ['Solar power', 'Coal power', 'Gas power', 'Nuclear power']],
    ['What is DNA?', ['The code that makes you who you are', 'A type of food', 'A kind of medicine', 'A weather pattern']],
  ];
  const [prompt, opts] = pick(qs);
  const correct = opts[0];
  const { options, answer } = makeOptions(correct, opts.slice(1));
  return { prompt, options, answer, hint: `This is advanced science — think carefully!`, explanation: `${correct}!` };
}

// ============ GEOGRAPHY ============
function genGeography(diff: Difficulty): Question {
  if (diff === 'easy') {
    const qs: [string, string[]][] = [
      ['What is the largest ocean?', ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean']],
      ['Which is a continent?', ['Africa', 'France', 'Brazil', 'Japan']],
      ['What do we call the land around a river?', ['Valley', 'Mountain', 'Desert', 'Island']],
      ['Which is the hottest place on Earth?', ['Desert', 'Mountain', 'Ocean', 'Forest']],
      ['What is the capital of the USA?', ['Washington D.C.', 'New York', 'Los Angeles', 'Chicago']],
      ['Which direction does a compass needle point?', ['North', 'Left', 'Down', 'Up']],
      ['What is the Earth shaped like?', ['A ball (sphere)', 'A box', 'A triangle', 'A plate']],
      ['Which is the largest country by area?', ['Russia', 'China', 'USA', 'India']],
    ];
    const [prompt, opts] = pick(qs);
    const correct = opts[0];
    const { options, answer } = makeOptions(correct, opts.slice(1));
    return { prompt, options, answer, hint: `Think about maps and globes.`, explanation: `${correct}!` };
  }
  if (diff === 'medium') {
    const qs: [string, string[]][] = [
      ['What is the longest river in the world?', ['Nile', 'Amazon', 'Mississippi', 'Thames']],
      ['Which continent is Egypt in?', ['Africa', 'Asia', 'Europe', 'Australia']],
      ['What is the capital of France?', ['Paris', 'London', 'Rome', 'Berlin']],
      ['Which ocean is between Africa and Australia?', ['Indian Ocean', 'Pacific Ocean', 'Atlantic Ocean', 'Arctic Ocean']],
      ['What is the tallest mountain in the world?', ['Mount Everest', 'K2', 'Kilimanjaro', 'Mont Blanc']],
      ['Which country has the most people?', ['India', 'USA', 'Brazil', 'Russia']],
      ['What is the imaginary line around the middle of Earth?', ['Equator', 'Border', 'Coast', 'Highway']],
      ['Which is the smallest continent?', ['Australia', 'Europe', 'Antarctica', 'Asia']],
    ];
    const [prompt, opts] = pick(qs);
    const correct = opts[0];
    const { options, answer } = makeOptions(correct, opts.slice(1));
    return { prompt, options, answer, hint: `Look at a world map in your mind.`, explanation: `${correct}!` };
  }
  const qs: [string, string[]][] = [
    ['What causes earthquakes?', ['Tectonic plates moving', 'Wind', 'Rain', 'Volcanoes only']],
    ['What is the Ring of Fire?', ['Area around the Pacific with many volcanoes', 'A ring in space', 'A forest fire', 'A type of storm']],
    ['Which country has the most time zones?', ['France (with territories)', 'Russia', 'USA', 'China']],
    ['What is a tsunami?', ['A giant ocean wave caused by underwater disturbance', 'A type of fish', 'A mountain', 'A kind of wind']],
    ['What is the driest desert in the world?', ['Atacama Desert', 'Sahara Desert', 'Gobi Desert', 'Mojave Desert']],
    ['Which country has the longest coastline?', ['Canada', 'Australia', 'Indonesia', 'Russia']],
    ['What is globalization?', ['Countries connecting through trade and culture', 'One country ruling all', 'A type of map', 'A weather pattern']],
    ['Which river flows through Egypt?', ['Nile', 'Amazon', 'Ganges', 'Yangtze']],
  ];
  const [prompt, opts] = pick(qs);
  const correct = opts[0];
  const { options, answer } = makeOptions(correct, opts.slice(1));
  return { prompt, options, answer, hint: `This requires deeper geography knowledge.`, explanation: `${correct}!` };
}

// ============ REASONING ============
function genReasoning(diff: Difficulty): Question {
  if (diff === 'easy') {
    const type = pick(['sequence', 'odd_one_out', 'pattern']);
    if (type === 'sequence') {
      const start = randInt(1, 5);
      const step = randInt(1, 3);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const next = start + step * 4;
      const { options, answer } = makeOptions(next, [next + 1, next - 1, next + step]);
      return {
        prompt: `What comes next? ${seq.join(', ')}, ___`,
        options,
        answer,
        hint: `What's the difference between each number?`,
        explanation: `Each number goes up by ${step}, so the answer is ${next}.`,
      };
    }
    if (type === 'odd_one_out') {
      const sets: [string, string, string, string, string][] = [
        ['Apple', 'Banana', 'Car', 'Orange', 'Grape'],
        ['Dog', 'Cat', 'Fish', 'Tree', 'Bird'],
        ['Red', 'Blue', 'Green', 'Square', 'Yellow'],
        ['Circle', 'Triangle', 'Square', 'Apple', 'Rectangle'],
      ];
      const items = pick(sets);
      const odd = items[3];
      const { options, answer } = makeOptions(odd, items.slice(0, 3));
      return {
        prompt: `Which one doesn't belong?`,
        options,
        answer,
        hint: `Three are similar — one is different.`,
        explanation: `"${odd}" doesn't belong with the others!`,
      };
    }
    const { options, answer } = makeOptions('▲', ['●', '■', '◆']);
    return {
      prompt: `Which shape has three sides?`,
      options,
      answer,
      hint: `Count the corners.`,
      explanation: `A triangle (▲) has 3 sides.`,
    };
  }
  if (diff === 'medium') {
    const type = pick(['sequence', 'logic', 'analogy']);
    if (type === 'sequence') {
      const start = randInt(2, 5);
      const ratio = pick([2, 3]);
      const seq = [start, start * ratio, start * ratio * 2, start * ratio * 4];
      const next = start * ratio * 8;
      const { options, answer } = makeOptions(next, [next / 2, next * 2, next + ratio]);
      return {
        prompt: `What comes next? ${seq.join(', ')}, ___`,
        options,
        answer,
        hint: `Each number is multiplied by the same amount.`,
        explanation: `Each number doubles, so the answer is ${next}.`,
      };
    }
    if (type === 'logic') {
      const { options, answer } = makeOptions('Tuesday', ['Monday', 'Wednesday', 'Friday']);
      return {
        prompt: `If today is Monday, what day is tomorrow?`,
        options,
        answer,
        hint: `What day comes after Monday?`,
        explanation: `After Monday comes Tuesday.`,
      };
    }
    const { options, answer } = makeOptions('Leaf', ['Flower', 'Root', 'Trunk', 'Plant']);
    return {
      prompt: `Finger is to Hand as Leaf is to:`,
      options,
      answer,
      hint: `What is a leaf part of?`,
      explanation: `A leaf is part of a plant, just as a finger is part of a hand.`,
    };
  }
  const type = pick(['series', 'deduction', 'spatial']);
  if (type === 'series') {
    const a = randInt(2, 6);
    const b = randInt(2, 6);
    const seq = [a, b, a + b, a + 2 * b, 2 * a + b];
    const next = 2 * a + 2 * b;
    const { options, answer } = makeOptions(next, [next - 1, next + 1, next - b]);
    return {
      prompt: `What comes next? ${seq.join(', ')}, ___`,
      options,
      answer,
      hint: `Look for a pattern where each number is the sum of previous ones.`,
      explanation: `This is a Fibonacci-like sequence. The answer is ${next}.`,
    };
  }
  if (type === 'deduction') {
    const { options, answer } = makeOptions('Alex is the tallest', ['Bob is the tallest', 'Cara is the tallest', 'Nobody is tall']);
    return {
      prompt: `Alex is taller than Bob. Bob is taller than Cara. Who is the tallest?`,
      options,
      answer,
      hint: `Write it out: Alex > Bob > Cara.`,
      explanation: `Alex > Bob > Cara, so Alex is tallest.`,
    };
  }
  const { options, answer } = makeOptions('6', ['4', '8', '12']);
  return {
    prompt: `A cube has how many edges?`,
    options,
    answer,
    hint: `Count the lines where two faces meet.`,
    explanation: `A cube has 12 edges, 8 corners, and 6 faces.`,
  };
}

const GENERATORS: Record<Subject, (d: Difficulty) => Question> = {
  maths: genMath,
  english: genEnglish,
  science: genScience,
  geography: genGeography,
  reasoning: genReasoning,
};

export function generateQuestion(subject: Subject, diff: Difficulty): Question {
  return GENERATORS[subject](diff);
}

export function generateQuiz(subject: Subject, diff: Difficulty, count: number): Question[] {
  return Array.from({ length: count }, () => generateQuestion(subject, diff));
}

export function generateMixedQuiz(diff: Difficulty, count: number): Question[] {
  const subjects: Subject[] = ['maths', 'english', 'science', 'geography', 'reasoning'];
  return Array.from({ length: count }, () => {
    const subj = pick(subjects);
    return generateQuestion(subj, diff);
  });
}
