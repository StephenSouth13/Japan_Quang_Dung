import { pgTable, text, serial, timestamp, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("student"), // student, teacher, admin
  createdAt: timestamp("created_at").defaultNow(),
  lastSignInAt: timestamp("last_sign_in_at")
});

// Courses table  
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  level: varchar("level", { length: 50 }).notNull(), // N5, N4, N3, N2, N1
  price: varchar("price", { length: 50 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  capacity: integer("capacity").default(20),
  enrolledCount: integer("enrolled_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Registrations table
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  registrationId: varchar("registration_id", { length: 100 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  courseTitle: varchar("course_title", { length: 255 }).notNull(),
  coursePrice: varchar("course_price", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending_payment"), // pending_payment, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  paymentConfirmedAt: timestamp("payment_confirmed_at")
});

// Quiz table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  description: text("description"),
  questions: text("questions"), // JSON string of questions
  timeLimit: integer("time_limit").default(30), // in minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Quiz attempts table
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  userId: integer("user_id").references(() => users.id),
  userEmail: varchar("user_email", { length: 255 }),
  userName: varchar("user_name", { length: 255 }),
  answers: text("answers"), // JSON string of answers
  score: integer("score"),
  totalQuestions: integer("total_questions"),
  completedAt: timestamp("completed_at").defaultNow()
});

// CMS Pages table
export const cmsPages = pgTable("cms_pages", {
  id: serial("id").primaryKey(),
  pageId: varchar("page_id", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  content: text("content"),
  status: varchar("status", { length: 50 }).default("draft"), // draft, published
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Relations
export const registrationsRelations = relations(registrations, ({ one }) => ({
  course: one(courses, {
    fields: [registrations.courseId],
    references: [courses.id]
  })
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  registrations: many(registrations)
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id]
  }),
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id]
  })
}));

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  attempts: many(quizAttempts)
}));

export const usersRelations = relations(users, ({ many }) => ({
  quizAttempts: many(quizAttempts)
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

export type CmsPage = typeof cmsPages.$inferSelect;
export type InsertCmsPage = typeof cmsPages.$inferInsert;