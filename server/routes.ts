import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

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
