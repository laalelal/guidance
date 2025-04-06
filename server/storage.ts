import { users, type User, type InsertUser, type QuizAnswer, type QuizResult } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

const PostgresSessionStore = connectPg(session);
import { pool } from "./db";

// Storage interface for user operations
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Password reset
  createPasswordResetToken(email: string): Promise<string | null>;
  verifyResetToken(token: string): Promise<User | undefined>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  
  // Quiz operations
  saveQuizResults(userId: number, results: QuizResult): Promise<User | undefined>;
  getQuizResults(userId: number): Promise<QuizResult | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

// PostgreSQL database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  async createPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    // Generate a random token
    const token = randomBytes(32).toString('hex');
    const now = new Date();
    const expiry = new Date(now.getTime() + 3600000); // 1 hour from now

    // Update user with reset token
    await db
      .update(users)
      .set({
        resetToken: token,
        resetTokenExpiry: expiry,
      })
      .where(eq(users.id, user.id));

    return token;
  }

  async verifyResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, token));
    
    if (!user) return undefined;
    
    // Check if token is expired
    if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) {
      return undefined;
    }
    
    return user;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.verifyResetToken(token);
    if (!user) return false;
    
    const [updatedUser] = await db
      .update(users)
      .set({
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(users.id, user.id))
      .returning();
    
    return !!updatedUser;
  }

  async saveQuizResults(userId: number, results: QuizResult): Promise<User | undefined> {
    // Calculate recommended stream based on quiz results and academic marks
    const user = await this.getUser(userId);
    if (!user) return undefined;

    // Update user with quiz results
    const [updatedUser] = await db
      .update(users)
      .set({
        quizTaken: true,
        logicalScore: results.logicalScore,
        mathQuizScore: results.mathQuizScore,
        verbalScore: results.verbalScore,
        quizResults: results,
        recommendedStream: results.recommendedStream
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async getQuizResults(userId: number): Promise<QuizResult | undefined> {
    const user = await this.getUser(userId);
    if (!user || !user.quizTaken || !user.quizResults) return undefined;
    
    return user.quizResults as QuizResult;
  }
}

export const storage = new DatabaseStorage();
