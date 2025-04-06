import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { sendEmail, generatePasswordResetEmail } from "./email-service";
import { forgotPasswordSchema, resetPasswordSchema } from "@shared/schema";
import { hashPassword } from "./auth";

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

  const httpServer = createServer(app);
  return httpServer;
}

// Function to generate career recommendations based on user's academic profile
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

  // If Commerce is preferred stream
  if (user.preferredStream === "Commerce") {
    recommendations.push({
      title: "Business & Finance",
      icon: "briefcase",
      color: "orange",
      description: "Based on your preference for Commerce, careers in accounting, financial planning, business administration, or entrepreneurship might be suitable."
    });
  }

  // If Arts is preferred stream
  if (user.preferredStream === "Arts") {
    recommendations.push({
      title: "Creative & Liberal Arts",
      icon: "palette",
      color: "purple",
      description: "With your interest in Arts, consider exploring fields like design, fine arts, literature, philosophy, or cultural studies."
    });
  }

  // If no specific recommendations based on scores
  if (recommendations.length === 0) {
    recommendations.push({
      title: "Career Exploration",
      icon: "compass",
      color: "gray",
      description: "Consider taking career aptitude tests and exploring a variety of fields to discover your interests and strengths."
    });
  }

  return recommendations;
}
