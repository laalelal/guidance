import { db } from './db';
import { users } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function initializeDatabase() {
  console.log('Creating tables if they do not exist...');
  
  try {
    // Drop and create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        mobile_number TEXT,
        dob TEXT,
        gender TEXT,
        email TEXT NOT NULL UNIQUE,
        city TEXT,
        state TEXT,
        school_name TEXT,
        school_board TEXT,
        percentage NUMERIC,
        math_marks INTEGER,
        science_marks INTEGER,
        english_marks INTEGER,
        hindi_marks INTEGER,
        social_science_marks INTEGER,
        preferred_stream TEXT,
        reset_token TEXT,
        reset_token_expiry TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase().catch(console.error);