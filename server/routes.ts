import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { sendEmail, generatePasswordResetEmail } from "./email-service";
import { forgotPasswordSchema, resetPasswordSchema, quizSubmissionSchema } from "@shared/schema";
import { hashPassword } from "./auth";
import { allQuizQuestions, getQuizQuestionsByCategory } from "./quiz-data";
import { processQuizResults } from "./quiz-recommendation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Forgot password route
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal if the email exists or not
        return res.status(200).json({ message: "If your email is registered, you will receive a password reset link." });
      }
      
      const token = await storage.createPasswordResetToken(email);
      
      if (!token) {
        return res.status(500).json({ message: "Failed to create password reset token" });
      }
      
      // Get base URL from request
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const emailOptions = generatePasswordResetEmail(email, token, baseUrl);
      
      const emailSent = await sendEmail(emailOptions);
      
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send password reset email" });
      }
      
      return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(400).json({ message: "Invalid request" });
    }
  });
  
  // Verify reset token
  app.get("/api/verify-reset-token/:token", async (req, res) => {
    const { token } = req.params;
    const user = await storage.verifyResetToken(token);
    
    if (!user) {
      return res.status(400).json({ valid: false, message: "Invalid or expired token" });
    }
    
    return res.status(200).json({ valid: true });
  });
  
  // Reset password
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      
      // Hash the new password
      const hashedPassword = await hashPassword(password);
      
      const success = await storage.resetPassword(token, hashedPassword);
      
      if (!success) {
        return res.status(400).json({ message: "Failed to reset password. Token may be invalid or expired." });
      }
      
      return res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(400).json({ message: "Invalid request" });
    }
  });

  // Career guidance recommendations based on user data
  app.get("/api/recommendations", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user;
    const recommendations = generateRecommendations(user);
    
    res.json(recommendations);
  });

  // Get all quiz questions
  app.get("/api/quiz/questions", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Return all quiz questions with the correct answers removed
    const sanitizedQuestions = allQuizQuestions.map(question => ({
      id: question.id,
      category: question.category,
      question: question.question,
      options: question.options
    }));
    
    res.json(sanitizedQuestions);
  });

  // Get quiz questions by category
  app.get("/api/quiz/questions/:category", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { category } = req.params;
    
    if (category !== 'logical' && category !== 'math' && category !== 'verbal') {
      return res.status(400).json({ message: "Invalid category" });
    }
    
    // Return category-specific questions with correct answers removed
    const questions = getQuizQuestionsByCategory(category as 'logical' | 'math' | 'verbal')
      .map(question => ({
        id: question.id,
        category: question.category,
        question: question.question,
        options: question.options
      }));
    
    res.json(questions);
  });

  // Submit quiz answers and get results
  app.post("/api/quiz/submit", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { answers } = quizSubmissionSchema.parse(req.body);
      const user = req.user;
      
      // Process quiz results
      const quizResults = processQuizResults(answers, user);
      
      // Save quiz results to user's profile
      const updatedUser = await storage.saveQuizResults(user.id, quizResults);
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to save quiz results" });
      }
      
      // Return quiz results
      res.status(200).json(quizResults);
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(400).json({ message: "Invalid quiz submission" });
    }
  });

  // Get user's quiz results
  app.get("/api/quiz/results", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user.id;
    const quizResults = await storage.getQuizResults(userId);
    
    if (!quizResults) {
      return res.status(404).json({ message: "No quiz results found" });
    }
    
    res.json(quizResults);
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Function to generate career recommendations based on user's academic profile and quiz results
function generateRecommendations(user: Express.User) {
  const recommendations = [];

  // Math + Science score determines engineering/technical aptitude
  const mathScienceAvg = (user.mathMarks && user.scienceMarks) 
    ? (user.mathMarks + user.scienceMarks) / 2 
    : 0;

  // Language skills (English + Hindi)
  const languageAvg = (user.englishMarks && user.hindiMarks) 
    ? (user.englishMarks + user.hindiMarks) / 2 
    : 0;

  // Social aptitude
  const socialScore = user.socialScienceMarks || 0;
  
  // Quiz scores (if available)
  const logicalScore = user.logicalScore || 0;
  const mathQuizScore = user.mathQuizScore || 0;
  const verbalScore = user.verbalScore || 0;
  
  // The user has taken the quiz
  if (user.quizTaken) {
    // If recommended stream is available from quiz results, prioritize it
    if (user.recommendedStream) {
      // Science stream recommendation
      if (user.recommendedStream === 'Science') {
        recommendations.push({
          title: "Science Stream",
          icon: "microscope",
          color: "blue",
          description: "Based on your academic performance and aptitude test results, Science stream is highly recommended. This can lead to careers in Engineering, Medicine, Research, and more."
        });
        
        // Add specific careers based on math and logical scores
        if (mathQuizScore >= 7 && logicalScore >= 7) {
          recommendations.push({
            title: "Engineering & Technology",
            icon: "cogs",
            color: "primary",
            description: "Your strong performance in Mathematics and Logical Reasoning indicates an aptitude for Engineering disciplines. Consider Computer Science, Electronics, or Mechanical Engineering."
          });
        }
        
        if (mathQuizScore >= 6 && user.scienceMarks && user.scienceMarks >= 75) {
          recommendations.push({
            title: "Medical Sciences",
            icon: "heartbeat",
            color: "red",
            description: "Your science scores and aptitude test results suggest you might excel in Medical fields such as MBBS, Dentistry, or Allied Health Sciences."
          });
        }
      }
      
      // Commerce stream recommendation
      else if (user.recommendedStream === 'Commerce') {
        recommendations.push({
          title: "Commerce Stream",
          icon: "chart-line",
          color: "green",
          description: "Based on your academic performance and aptitude test results, Commerce stream is highly recommended. This can lead to careers in Business, Finance, Accounting, and more."
        });
        
        // Add specific careers based on math and logical scores
        if (mathQuizScore >= 6 && logicalScore >= 7) {
          recommendations.push({
            title: "Finance & Banking",
            icon: "university",
            color: "emerald",
            description: "Your strong math skills and logical reasoning abilities indicate an aptitude for careers in Banking, Financial Analysis, or Investment Management."
          });
        }
        
        if (logicalScore >= 6 && verbalScore >= 6) {
          recommendations.push({
            title: "Business Management",
            icon: "briefcase",
            color: "orange",
            description: "Your balanced aptitude in logical reasoning and verbal skills suggests you would excel in Business Management, Marketing, or Entrepreneurship."
          });
        }
      }
      
      // Arts/Humanities stream recommendation
      else if (user.recommendedStream === 'Arts') {
        recommendations.push({
          title: "Arts/Humanities Stream",
          icon: "book-open",
          color: "purple",
          description: "Based on your academic performance and aptitude test results, Arts/Humanities stream is highly recommended. This can lead to careers in Media, Law, Design, Social Sciences, and more."
        });
        
        // Add specific careers based on verbal and logical scores
        if (verbalScore >= 7) {
          recommendations.push({
            title: "Communication & Media",
            icon: "comment-dots",
            color: "indigo",
            description: "Your strong verbal skills indicate an aptitude for careers in Journalism, Content Creation, Public Relations, or Mass Communication."
          });
        }
        
        if (verbalScore >= 6 && logicalScore >= 6) {
          recommendations.push({
            title: "Law & Policy",
            icon: "gavel",
            color: "amber",
            description: "Your combination of verbal proficiency and logical reasoning suggests you might excel in Law, Public Policy, or Government Services."
          });
        }
      }
    }
  } 
  // User hasn't taken the quiz yet, use academic scores only
  else {
    // If Math and Science scores are high
    if (mathScienceAvg >= 80) {
      recommendations.push({
        title: "Engineering",
        icon: "graduation-cap",
        color: "primary",
        description: "Based on your strong performance in Mathematics and Science, you might consider pursuing engineering. Popular fields include Computer Science, Electrical Engineering, and Mechanical Engineering."
      });
      
      recommendations.push({
        title: "Data Science",
        icon: "chart-line",
        color: "green",
        description: "With strong mathematics skills, you could consider the growing field of data science, which combines statistics, computing, and domain expertise to extract insights from data."
      });
    }

    // If Science score is high
    if (user.scienceMarks && user.scienceMarks >= 80) {
      recommendations.push({
        title: "Pure Sciences",
        icon: "flask",
        color: "secondary",
        description: "Your academic profile shows an aptitude for scientific subjects. You might want to explore careers in Physics, Chemistry, or related scientific research fields."
      });
    }

    // If Language skills are high
    if (languageAvg >= 80) {
      recommendations.push({
        title: "Communication & Media",
        icon: "comments",
        color: "blue",
        description: "Your strong language skills indicate you might excel in fields like journalism, content creation, public relations, or corporate communications."
      });
    }

    // If Social Science score is high
    if (socialScore >= 80) {
      recommendations.push({
        title: "Social Sciences",
        icon: "users",
        color: "yellow",
        description: "Your performance in Social Science suggests you might be interested in fields like sociology, psychology, political science, or international relations."
      });
    }

    // If user selected a preferred stream
    if (user.preferredStream) {
      if (user.preferredStream === "Commerce") {
        recommendations.push({
          title: "Business & Finance",
          icon: "briefcase",
          color: "orange",
          description: "Based on your preference for Commerce, careers in accounting, financial planning, business administration, or entrepreneurship might be suitable."
        });
      } else if (user.preferredStream === "Arts") {
        recommendations.push({
          title: "Creative & Liberal Arts",
          icon: "palette",
          color: "purple",
          description: "With your interest in Arts, consider exploring fields like design, fine arts, literature, philosophy, or cultural studies."
        });
      }
    }
  }

  // If no specific recommendations based on scores
  if (recommendations.length === 0) {
    recommendations.push({
      title: "Career Exploration",
      icon: "compass",
      color: "gray",
      description: "Consider taking our career aptitude quiz to get personalized recommendations based on your strengths and interests."
    });
  }

  return recommendations;
}
