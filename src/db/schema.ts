import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ===== TENANTS TABLE =====
export const tenants = pgTable("tenants", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// ===== USERS TABLE (CONSOLIDADO) =====
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  email_verified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  tenant_id: varchar("tenant_id", { length: 255 }).references(() => tenants.id),
  created_at: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updated_at: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// ===== SESSIONS TABLE =====
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expires_at: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// ===== ACCOUNTS TABLE =====
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  account_id: text("account_id").notNull(),
  provider_id: text("provider_id").notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  id_token: text("id_token"),
  access_token_expires_at: timestamp("access_token_expires_at"),
  refresh_token_expires_at: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

// ===== VERIFICATIONS TABLE =====
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").$defaultFn(() => new Date()),
  updated_at: timestamp("updated_at").$defaultFn(() => new Date()),
});

// ===== PATIENTS TABLE =====
export const patients = pgTable("patients", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  birth_date: varchar("birth_date", { length: 10 }).notNull(),
  gender: varchar("gender", { length: 20 }),
  cpf: varchar("cpf", { length: 14 }),
  responsible_cpf: varchar("responsible_cpf", { length: 14 }),
  cep: varchar("cep", { length: 10 }),
  address: text("address"),
  house_number: varchar("house_number", { length: 20 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  neighborhood: varchar("neighborhood", { length: 100 }),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  tenant_id: varchar("tenant_id", { length: 255 })
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// ===== RELATIONS =====
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  patients: many(patients),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  tenant: one(tenants, {
    fields: [users.tenant_id],
    references: [tenants.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.user_id],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));

export const patientsRelations = relations(patients, ({ one }) => ({
  tenant: one(tenants, {
    fields: [patients.tenant_id],
    references: [tenants.id],
  }),
}));
