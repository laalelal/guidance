import { pgTable, text, serial, integer, boolean, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema with authentication information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  // Personal Info
  fullName: text("full_name").notNull(),
  mobileNumber: text("mobile_number"),
  dob: text("dob"),
  gender: text("gender"),
  email: text("email").notNull().unique(),
  city: text("city"),
  state: text("state"),
  // Academic Info
  schoolName: text("school_name"),
  schoolBoard: text("school_board"),
  percentage: numeric("percentage"),
  // Subject Marks
  mathMarks: integer("math_marks"),
  scienceMarks: integer("science_marks"),
  englishMarks: integer("english_marks"),
  hindiMarks: integer("hindi_marks"),
  socialScienceMarks: integer("social_science_marks"),
  // Quiz Results
  quizTaken: boolean("quiz_taken").default(false),
  logicalScore: integer("logical_score"),
  mathQuizScore: integer("math_quiz_score"),
  verbalScore: integer("verbal_score"),
  quizResults: jsonb("quiz_results").$type<Record<string, any>>(),
  // Stream Recommendations
  recommendedStream: text("recommended_stream"),
  // Preferences
  preferredStream: text("preferred_stream"),
  // Password reset fields
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
});

// Schema for user registration - first step (personal info)
export const registrationStep1Schema = createInsertSchema(users)
  .pick({
    fullName: true,
    mobileNumber: true,
    dob: true,
    gender: true,
    email: true,
    city: true,
    state: true,
    username: true,
    password: true,
  })
  .extend({
    confirmPassword: z.string(),
  });

// Schema for user registration - second step (academic info)
export const registrationStep2Schema = createInsertSchema(users).pick({
  schoolName: true,
  schoolBoard: true,
  percentage: true,
  mathMarks: true,
  scienceMarks: true,
  englishMarks: true,
  hindiMarks: true,
  socialScienceMarks: true,
});

// Schema for user registration - third step (preferred stream)
export const registrationStep3Schema = createInsertSchema(users).pick({
  preferredStream: true,
});

// Insert user schema for registration
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Schema for forgot password request
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Schema for reset password
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Quiz question schema
export const quizQuestionSchema = z.object({
  id: z.number(),
  category: z.enum(['logical', 'math', 'verbal']),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
});

// Quiz answer schema
export const quizAnswerSchema = z.object({
  questionId: z.number(),
  selectedOption: z.number(),
});

// Complete quiz submission schema
export const quizSubmissionSchema = z.object({
  answers: z.array(quizAnswerSchema),
});

// Quiz result schema
export const quizResultSchema = z.object({
  logicalScore: z.number(),
  mathQuizScore: z.number(),
  verbalScore: z.number(),
  totalScore: z.number(),
  answers: z.array(quizAnswerSchema),
  recommendedStream: z.enum(['Science', 'Commerce', 'Arts']),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegistrationStep1 = z.infer<typeof registrationStep1Schema>;
export type RegistrationStep2 = z.infer<typeof registrationStep2Schema>;
export type RegistrationStep3 = z.infer<typeof registrationStep3Schema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type QuizAnswer = z.infer<typeof quizAnswerSchema>;
export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;
export type QuizResult = z.infer<typeof quizResultSchema>;
