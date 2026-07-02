import { mysqlTable, int, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  uid: varchar('uid', { length: 128 }).notNull().unique(), // Firebase Auth UID
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  country: varchar('country', { length: 100 }),
  role: varchar('role', { length: 50 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inquiries = mysqlTable('inquiries', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  country: varchar('country', { length: 100 }),
  jobTitle: varchar('job_title', { length: 255 }),
  type: varchar('type', { length: 100 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const demoRequests = mysqlTable('demo_requests', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  country: varchar('country', { length: 100 }),
  service: varchar('service', { length: 255 }).notNull(),
  requirements: text('requirements'),
  date: varchar('date', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = mysqlTable('events', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  date: varchar('date', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const eventRegistrations = mysqlTable('event_registrations', {
  id: int('id').primaryKey().autoincrement(),
  eventId: int('event_id').references(() => events.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  country: varchar('country', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const testimonials = mysqlTable('testimonials', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  rating: int('rating').notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const chatSessions = mysqlTable('chat_sessions', {
  id: int('id').primaryKey().autoincrement(),
  uid: varchar('uid', { length: 255 }).notNull(), // Guest session ID or Firebase UID
  createdAt: timestamp('created_at').defaultNow(),
});

export const chatMessages = mysqlTable('chat_messages', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: int('session_id').references(() => chatSessions.id).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
