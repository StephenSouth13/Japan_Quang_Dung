import { db } from "./db";
import { users, courses, registrations, quizzes, quizAttempts, cmsPages } from "../shared/schema";
import { eq, desc } from "drizzle-orm";
import type { User, InsertUser, Course, InsertCourse, Registration, InsertRegistration, Quiz, InsertQuiz, QuizAttempt, InsertQuizAttempt, CmsPage, InsertCmsPage } from "../shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;

  // Courses  
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(insertCourse: InsertCourse): Promise<Course>;
  updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined>;

  // Registrations
  getAllRegistrations(): Promise<Registration[]>;
  getRegistration(registrationId: string): Promise<Registration | undefined>;
  createRegistration(insertRegistration: InsertRegistration): Promise<Registration>;
  updateRegistrationStatus(registrationId: string, status: string): Promise<Registration | undefined>;

  // Quizzes
  getAllQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(insertQuiz: InsertQuiz): Promise<Quiz>;
  updateQuiz(id: number, updates: Partial<Quiz>): Promise<Quiz | undefined>;

  // Quiz Attempts
  getQuizAttempts(quizId?: number): Promise<QuizAttempt[]>;
  createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt>;

  // CMS Pages
  getAllCmsPages(): Promise<CmsPage[]>;
  getCmsPage(pageId: string): Promise<CmsPage | undefined>;
  createCmsPage(insertPage: InsertCmsPage): Promise<CmsPage>;
  updateCmsPage(pageId: string, updates: Partial<CmsPage>): Promise<CmsPage | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Courses
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined> {
    const [course] = await db.update(courses).set(updates).where(eq(courses.id, id)).returning();
    return course || undefined;
  }

  // Registrations
  async getAllRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations).orderBy(desc(registrations.createdAt));
  }

  async getRegistration(registrationId: string): Promise<Registration | undefined> {
    const [registration] = await db.select().from(registrations).where(eq(registrations.registrationId, registrationId));
    return registration || undefined;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db.insert(registrations).values(insertRegistration).returning();
    return registration;
  }

  async updateRegistrationStatus(registrationId: string, status: string): Promise<Registration | undefined> {
    const updates: any = { status };
    if (status === 'confirmed') {
      updates.paymentConfirmedAt = new Date();
    }
    
    const [registration] = await db.update(registrations)
      .set(updates)
      .where(eq(registrations.registrationId, registrationId))
      .returning();
    return registration || undefined;
  }

  // Quizzes
  async getAllQuizzes(): Promise<Quiz[]> {
    return await db.select().from(quizzes).orderBy(desc(quizzes.createdAt));
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(insertQuiz).returning();
    return quiz;
  }

  async updateQuiz(id: number, updates: Partial<Quiz>): Promise<Quiz | undefined> {
    const [quiz] = await db.update(quizzes).set(updates).where(eq(quizzes.id, id)).returning();
    return quiz || undefined;
  }

  // Quiz Attempts
  async getQuizAttempts(quizId?: number): Promise<QuizAttempt[]> {
    if (quizId) {
      return await db.select().from(quizAttempts).where(eq(quizAttempts.quizId, quizId)).orderBy(desc(quizAttempts.completedAt));
    }
    return await db.select().from(quizAttempts).orderBy(desc(quizAttempts.completedAt));
  }

  async createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db.insert(quizAttempts).values(insertAttempt).returning();
    return attempt;
  }

  // CMS Pages
  async getAllCmsPages(): Promise<CmsPage[]> {
    return await db.select().from(cmsPages).orderBy(desc(cmsPages.updatedAt));
  }

  async getCmsPage(pageId: string): Promise<CmsPage | undefined> {
    const [page] = await db.select().from(cmsPages).where(eq(cmsPages.pageId, pageId));
    return page || undefined;
  }

  async createCmsPage(insertPage: InsertCmsPage): Promise<CmsPage> {
    const [page] = await db.insert(cmsPages).values(insertPage).returning();
    return page;
  }

  async updateCmsPage(pageId: string, updates: Partial<CmsPage>): Promise<CmsPage | undefined> {
    const [page] = await db.update(cmsPages).set(updates).where(eq(cmsPages.pageId, pageId)).returning();
    return page || undefined;
  }
}

export const storage = new DatabaseStorage();