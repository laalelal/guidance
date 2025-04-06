import { QuizAnswer, QuizResult, User } from "@shared/schema";
import { allQuizQuestions, logicalQuestions, mathQuestions, verbalQuestions } from "./quiz-data";

/**
 * Calculates scores for each section of the quiz
 * @param answers User's quiz answers
 * @returns Object containing scores for each category
 */
export function calculateQuizScores(answers: QuizAnswer[]): { 
  logicalScore: number;
  mathQuizScore: number;
  verbalScore: number;
  totalScore: number;
} {
  let logicalScore = 0;
  let mathQuizScore = 0;
  let verbalScore = 0;

  // Calculate score for each category
  answers.forEach(answer => {
    const question = allQuizQuestions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    // Award 1 point for correct answer
    if (question.correctAnswer === answer.selectedOption) {
      if (question.category === 'logical') logicalScore++;
      else if (question.category === 'math') mathQuizScore++;
      else if (question.category === 'verbal') verbalScore++;
    }
  });

  const totalScore = logicalScore + mathQuizScore + verbalScore;
  
  return {
    logicalScore,
    mathQuizScore, 
    verbalScore,
    totalScore
  };
}

/**
 * Determines the recommended academic stream based on quiz scores and academic marks
 * @param scores Quiz scores by category
 * @param user User data with academic marks
 * @returns Recommended stream (Science, Commerce, or Arts)
 */
export function determineRecommendedStream(
  scores: { 
    logicalScore: number; 
    mathQuizScore: number; 
    verbalScore: number; 
  }, 
  user: User
): 'Science' | 'Commerce' | 'Arts' {
  // Convert null or undefined to 0 for calculations
  const mathMarks = user.mathMarks || 0;
  const scienceMarks = user.scienceMarks || 0;
  const englishMarks = user.englishMarks || 0;
  const hindiMarks = user.hindiMarks || 0;
  const socialScienceMarks = user.socialScienceMarks || 0;
  
  // Weight for academic scores vs quiz scores (60% academic, 40% quiz)
  const academicWeight = 0.6;
  const quizWeight = 0.4;
  
  // Science aptitude = Math marks + Science marks + Math quiz score + Logical quiz score
  const scienceAptitude = 
    (academicWeight * (mathMarks + scienceMarks) / 2) + 
    (quizWeight * (scores.mathQuizScore * 10 + scores.logicalScore * 5));
  
  // Commerce aptitude = Math marks + Social Science marks + Math quiz score + Logical quiz score
  const commerceAptitude = 
    (academicWeight * (mathMarks + socialScienceMarks) / 2) + 
    (quizWeight * (scores.mathQuizScore * 5 + scores.logicalScore * 10));
  
  // Arts aptitude = English marks + Hindi marks + Social Science marks + Verbal quiz score
  const artsAptitude = 
    (academicWeight * (englishMarks + hindiMarks + socialScienceMarks) / 3) + 
    (quizWeight * (scores.verbalScore * 10));
  
  // Determine recommended stream based on highest aptitude score
  if (scienceAptitude > commerceAptitude && scienceAptitude > artsAptitude) {
    return 'Science';
  } else if (commerceAptitude > scienceAptitude && commerceAptitude > artsAptitude) {
    return 'Commerce';
  } else {
    return 'Arts';
  }
}

/**
 * Processes quiz answers and generates results including score and recommendations
 * @param answers User's quiz answers
 * @param user User data with academic marks
 * @returns Quiz results object
 */
export function processQuizResults(answers: QuizAnswer[], user: User): QuizResult {
  // Calculate scores for each section
  const scores = calculateQuizScores(answers);
  
  // Determine recommended stream based on scores and academic marks
  const recommendedStream = determineRecommendedStream(scores, user);
  
  // Return complete quiz result
  return {
    logicalScore: scores.logicalScore,
    mathQuizScore: scores.mathQuizScore,
    verbalScore: scores.verbalScore,
    totalScore: scores.totalScore,
    answers,
    recommendedStream
  };
}