import { QuizQuestion } from "../shared/schema";

// 10 Logical Reasoning questions
export const logicalQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'logical',
    question: "If all roses are flowers and some flowers fade quickly, which statement must be true?",
    options: [
      "All roses fade quickly",
      "Some roses fade quickly",
      "No roses fade quickly",
      "None of the above"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    category: 'logical',
    question: "If A > B and B > C, then:",
    options: [
      "A < C",
      "A = C",
      "A > C",
      "The relationship between A and C cannot be determined"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    category: 'logical',
    question: "Complete the pattern: 3, 6, 11, 18, ?",
    options: [
      "25",
      "27",
      "29",
      "31"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    category: 'logical',
    question: "If BAT = 23, and CAT = 24, then DOG = ?",
    options: [
      "26",
      "27",
      "36",
      "37"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    category: 'logical',
    question: "Which figure comes next in the sequence? □ → ⬡ → △ → ?",
    options: [
      "◯",
      "□",
      "△",
      "⬡"
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    category: 'logical',
    question: "All doctors are professionals. Some professionals are wealthy. Therefore:",
    options: [
      "All doctors are wealthy",
      "Some doctors are wealthy",
      "No doctors are wealthy",
      "None of the statements necessarily follows"
    ],
    correctAnswer: 3
  },
  {
    id: 7,
    category: 'logical',
    question: "Find the odd one out: Lion, Tiger, Leopard, Wolf, Cheetah",
    options: [
      "Lion",
      "Tiger",
      "Wolf",
      "Cheetah"
    ],
    correctAnswer: 2
  },
  {
    id: 8,
    category: 'logical',
    question: "If the day before yesterday was Thursday, what day will it be the day after tomorrow?",
    options: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Sunday"
    ],
    correctAnswer: 0
  },
  {
    id: 9,
    category: 'logical',
    question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?",
    options: [
      "Granddaughter",
      "Daughter",
      "Grandmother",
      "Daughter-in-law"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    category: 'logical',
    question: "What comes next in the sequence: 1, 4, 9, 16, 25, ?",
    options: [
      "30",
      "36",
      "40",
      "49"
    ],
    correctAnswer: 1
  }
];

// 10 Mathematics questions
export const mathQuestions: QuizQuestion[] = [
  {
    id: 11,
    category: 'math',
    question: "Solve for x: 2x + 8 = 16",
    options: [
      "x = 3",
      "x = 4",
      "x = 5",
      "x = 6"
    ],
    correctAnswer: 1
  },
  {
    id: 12,
    category: 'math',
    question: "If a rectangle has a length of 12 cm and a width of 8 cm, what is its area?",
    options: [
      "76 sq cm",
      "88 sq cm",
      "96 sq cm",
      "108 sq cm"
    ],
    correctAnswer: 2
  },
  {
    id: 13,
    category: 'math',
    question: "What is the value of √144?",
    options: [
      "10",
      "12",
      "14",
      "16"
    ],
    correctAnswer: 1
  },
  {
    id: 14,
    category: 'math',
    question: "The mean of 4, 8, 12, 16, and x is 10. What is the value of x?",
    options: [
      "8",
      "10",
      "12",
      "14"
    ],
    correctAnswer: 1
  },
  {
    id: 15,
    category: 'math',
    question: "If f(x) = 3x² - 2x + 5, what is f(2)?",
    options: [
      "9",
      "13",
      "15",
      "17"
    ],
    correctAnswer: 3
  },
  {
    id: 16,
    category: 'math',
    question: "Solve: (3 + 2) × (8 - 6) ÷ 2",
    options: [
      "2",
      "3",
      "5",
      "7"
    ],
    correctAnswer: 2
  },
  {
    id: 17,
    category: 'math',
    question: "A car travels 300 km in 5 hours. What is its average speed in km/h?",
    options: [
      "55",
      "60",
      "65",
      "70"
    ],
    correctAnswer: 1
  },
  {
    id: 18,
    category: 'math',
    question: "What is the probability of getting a sum of 8 when rolling two dice?",
    options: [
      "1/12",
      "1/9",
      "5/36",
      "1/6"
    ],
    correctAnswer: 2
  },
  {
    id: 19,
    category: 'math',
    question: "Which of the following is a prime number?",
    options: [
      "51",
      "57",
      "67",
      "91"
    ],
    correctAnswer: 2
  },
  {
    id: 20,
    category: 'math',
    question: "Simplify: (x² + 4x - 12) ÷ (x - 2) for x ≠ 2",
    options: [
      "x + 2",
      "x + 6",
      "x - 6",
      "x² + 2"
    ],
    correctAnswer: 1
  }
];

// 10 Verbal (English/GK) questions
export const verbalQuestions: QuizQuestion[] = [
  {
    id: 21,
    category: 'verbal',
    question: "Choose the word that is most nearly opposite in meaning to 'Benevolent':",
    options: [
      "Malevolent",
      "Beneficial",
      "Charitable",
      "Generous"
    ],
    correctAnswer: 0
  },
  {
    id: 22,
    category: 'verbal',
    question: "Which of the following sentences contains a grammatical error?",
    options: [
      "She worked diligently on her project",
      "They are going to the museum tomorrow",
      "He don't understand the instructions",
      "We have been waiting for hours"
    ],
    correctAnswer: 2
  },
  {
    id: 23,
    category: 'verbal',
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: [
      "Ernest Hemingway",
      "Harper Lee",
      "J.K. Rowling",
      "Mark Twain"
    ],
    correctAnswer: 1
  },
  {
    id: 24,
    category: 'verbal',
    question: "Which of the following is the capital of Australia?",
    options: [
      "Sydney",
      "Melbourne",
      "Canberra",
      "Perth"
    ],
    correctAnswer: 2
  },
  {
    id: 25,
    category: 'verbal',
    question: "Choose the correct spelling:",
    options: [
      "Recommandation",
      "Recomendation",
      "Recommendation",
      "Reccommendation"
    ],
    correctAnswer: 2
  },
  {
    id: 26,
    category: 'verbal',
    question: "Who is known as the 'Father of the Indian Constitution'?",
    options: [
      "Mahatma Gandhi",
      "Jawaharlal Nehru",
      "Dr. B.R. Ambedkar",
      "Sardar Vallabhbhai Patel"
    ],
    correctAnswer: 2
  },
  {
    id: 27,
    category: 'verbal',
    question: "Complete the analogy: Book is to Reading as Food is to ___",
    options: [
      "Cooking",
      "Eating",
      "Recipe",
      "Hungry"
    ],
    correctAnswer: 1
  },
  {
    id: 28,
    category: 'verbal',
    question: "Which planet is known as the 'Red Planet'?",
    options: [
      "Venus",
      "Mars",
      "Jupiter",
      "Saturn"
    ],
    correctAnswer: 1
  },
  {
    id: 29,
    category: 'verbal',
    question: "Choose the word that best completes the sentence: His speech was so _____ that it put everyone to sleep.",
    options: [
      "Riveting",
      "Monotonous",
      "Stimulating",
      "Provocative"
    ],
    correctAnswer: 1
  },
  {
    id: 30,
    category: 'verbal',
    question: "Which of the following is NOT a fundamental right guaranteed by the Indian Constitution?",
    options: [
      "Right to Equality",
      "Right to Freedom",
      "Right to Property",
      "Right to Constitutional Remedies"
    ],
    correctAnswer: 2
  }
];

// Combined array of all quiz questions
export const allQuizQuestions: QuizQuestion[] = [
  ...logicalQuestions,
  ...mathQuestions,
  ...verbalQuestions
];

// Function to get all quiz questions
export function getAllQuizQuestions(): QuizQuestion[] {
  return allQuizQuestions;
}

// Function to get quiz questions by category
export function getQuizQuestionsByCategory(category: 'logical' | 'math' | 'verbal'): QuizQuestion[] {
  return allQuizQuestions.filter(q => q.category === category);
}