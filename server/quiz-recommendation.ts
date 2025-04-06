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

  // Group questions by category for easy reference
  const logicalQs = logicalQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q }), {});
  const mathQs = mathQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q }), {});
  const verbalQs = verbalQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q }), {});

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
  
  // Maximum possible scores
  const maxQuizCategoryScore = 10; // 10 questions per category
  const maxSubjectMarks = 100; // Assuming marks are out of 100
  
  // Normalize quiz scores (0-1 scale)
  const normalizedLogicalScore = scores.logicalScore / maxQuizCategoryScore;
  const normalizedMathScore = scores.mathQuizScore / maxQuizCategoryScore;
  const normalizedVerbalScore = scores.verbalScore / maxQuizCategoryScore;
  
  // Normalize academic scores (0-1 scale)
  const normalizedMathMarks = mathMarks / maxSubjectMarks;
  const normalizedScienceMarks = scienceMarks / maxSubjectMarks;
  const normalizedEnglishMarks = englishMarks / maxSubjectMarks;
  const normalizedHindiMarks = hindiMarks / maxSubjectMarks;
  const normalizedSocialScienceMarks = socialScienceMarks / maxSubjectMarks;
  
  // Weights for different factors
  const academicWeight = 0.6;
  const quizWeight = 0.35;
  const preferenceWeight = 0.05;
  
  // Calculate aptitude scores for each stream
  
  // Science stream aptitude
  const scienceAcademic = (normalizedMathMarks * 0.6) + (normalizedScienceMarks * 0.4);
  const scienceQuiz = (normalizedMathScore * 0.6) + (normalizedLogicalScore * 0.4);
  // Factor in preference - small boost if this is their preferred stream
  const sciencePreference = (user.preferredStream === 'Science') ? 1 : 0;
  
  // Commerce stream aptitude
  const commerceAcademic = (normalizedMathMarks * 0.5) + (normalizedSocialScienceMarks * 0.3) + (normalizedEnglishMarks * 0.2);
  const commerceQuiz = (normalizedLogicalScore * 0.6) + (normalizedMathScore * 0.3) + (normalizedVerbalScore * 0.1);
  const commercePreference = (user.preferredStream === 'Commerce') ? 1 : 0;
  
  // Arts stream aptitude
  const artsAcademic = (normalizedEnglishMarks * 0.4) + (normalizedHindiMarks * 0.2) + (normalizedSocialScienceMarks * 0.4);
  const artsQuiz = (normalizedVerbalScore * 0.6) + (normalizedLogicalScore * 0.3) + (normalizedMathScore * 0.1);
  const artsPreference = (user.preferredStream === 'Arts') ? 1 : 0;
  
  // Calculate weighted final scores for each stream
  const scienceAptitude = 
    (scienceAcademic * academicWeight) + 
    (scienceQuiz * quizWeight) + 
    (sciencePreference * preferenceWeight);
  
  const commerceAptitude = 
    (commerceAcademic * academicWeight) + 
    (commerceQuiz * quizWeight) + 
    (commercePreference * preferenceWeight);
  
  const artsAptitude = 
    (artsAcademic * academicWeight) + 
    (artsQuiz * quizWeight) + 
    (artsPreference * preferenceWeight);
  
  // Determine recommended stream based on highest aptitude score
  if (scienceAptitude >= commerceAptitude && scienceAptitude >= artsAptitude) {
    return 'Science';
  } else if (commerceAptitude >= scienceAptitude && commerceAptitude >= artsAptitude) {
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