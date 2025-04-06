import { pgTable, text, serial, integer, boolean, numeric } from "drizzle-orm/pg-core";
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
  email: text("email").notNull(),
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
  // Preferences
  preferredStream: text("preferred_stream"),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegistrationStep1 = z.infer<typeof registrationStep1Schema>;
export type RegistrationStep2 = z.infer<typeof registrationStep2Schema>;
export type RegistrationStep3 = z.infer<typeof registrationStep3Schema>;
