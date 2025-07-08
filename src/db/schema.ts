import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ===== BETTER AUTH TABLES =====
export const users = pgTable(
  "users",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false),
    image: varchar("image", { length: 255 }),
    crp: varchar("crp", { length: 20 }),
    role: varchar("role", { length: 50 }).default("psychologist"),
    tenantId: varchar("tenant_id").notNull(),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    tenantIdIdx: index("users_tenant_id_idx").on(table.tenantId),
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    expiresAt: timestamp("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    userId: varchar("user_id").notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    tokenIdx: index("sessions_token_idx").on(table.token),
  }),
);

export const accounts = pgTable(
  "accounts",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    userId: varchar("user_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: varchar("scope", { length: 255 }),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("accounts_user_id_idx").on(table.userId),
    providerAccountIdx: index("accounts_provider_account_idx").on(
      table.providerId,
      table.accountId,
    ),
  }),
);

export const verifications = pgTable(
  "verifications",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    identifierIdx: index("verifications_identifier_idx").on(table.identifier),
    valueIdx: index("verifications_value_idx").on(table.value),
  }),
);

// ===== BUSINESS LOGIC TABLES =====
export const tenants = pgTable(
  "tenants",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    domain: varchar("domain", { length: 255 }).unique(),
    plan: varchar("plan", { length: 50 }).default("basic"),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    domainIdx: index("tenants_domain_idx").on(table.domain),
  }),
);

export const patients = pgTable(
  "patients",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    birthDate: timestamp("birth_date").notNull(),
    gender: varchar("gender", { length: 20 }),
    address: text("address"),
    notes: text("notes"),
    active: boolean("active").default(true),
    tenantId: varchar("tenant_id").notNull(),
    userId: varchar("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    tenantIdIdx: index("patients_tenant_id_idx").on(table.tenantId),
    userIdIdx: index("patients_user_id_idx").on(table.userId),
    emailIdx: index("patients_email_idx").on(table.email),
  }),
);

export const appointments = pgTable(
  "appointments",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    date: timestamp("date").notNull(),
    duration: integer("duration").default(50),
    status: varchar("status", { length: 20 }).default("scheduled"), // scheduled, completed, cancelled, no_show
    notes: text("notes"),
    price: decimal("price", { precision: 10, scale: 2 }),
    paid: boolean("paid").default(false),
    tenantId: varchar("tenant_id").notNull(),
    patientId: varchar("patient_id").notNull(),
    userId: varchar("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    tenantIdIdx: index("appointments_tenant_id_idx").on(table.tenantId),
    patientIdIdx: index("appointments_patient_id_idx").on(table.patientId),
    userIdIdx: index("appointments_user_id_idx").on(table.userId),
    dateIdx: index("appointments_date_idx").on(table.date),
    statusIdx: index("appointments_status_idx").on(table.status),
  }),
);

export const annotations = pgTable(
  "annotations",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    type: varchar("type", { length: 50 }).default("general"), // general, session, observation
    tenantId: varchar("tenant_id").notNull(),
    userId: varchar("user_id").notNull(),
    appointmentId: varchar("appointment_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    tenantIdIdx: index("annotations_tenant_id_idx").on(table.tenantId),
    userIdIdx: index("annotations_user_id_idx").on(table.userId),
    appointmentIdIdx: index("annotations_appointment_id_idx").on(
      table.appointmentId,
    ),
    typeIdx: index("annotations_type_idx").on(table.type),
  }),
);

export const medicalRecords = pgTable(
  "medical_records",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    patientId: varchar("patient_id").notNull().unique(),
    tenantId: varchar("tenant_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    tenantIdIdx: index("medical_records_tenant_id_idx").on(table.tenantId),
    patientIdIdx: index("medical_records_patient_id_idx").on(table.patientId),
  }),
);

export const documents = pgTable(
  "documents",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: varchar("type", { length: 50 }).notNull(), // consent_form, contract, minor_authorization, report, prescription
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    signed: boolean("signed").default(false),
    signedAt: timestamp("signed_at"),
    medicalRecordId: varchar("medical_record_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    medicalRecordIdIdx: index("documents_medical_record_id_idx").on(
      table.medicalRecordId,
    ),
    typeIdx: index("documents_type_idx").on(table.type),
  }),
);

export const settings = pgTable(
  "settings",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value").notNull(),
    description: text("description"),
    tenantId: varchar("tenant_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    keyIdx: index("settings_key_idx").on(table.key),
    tenantIdIdx: index("settings_tenant_id_idx").on(table.tenantId),
  }),
);

// ===== RELATIONS =====
export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  patients: many(patients),
  appointments: many(appointments),
  annotations: many(annotations),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  patients: many(patients),
  appointments: many(appointments),
  annotations: many(annotations),
  medicalRecords: many(medicalRecords),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [patients.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecord: one(medicalRecords),
}));

export const appointmentsRelations = relations(
  appointments,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [appointments.tenantId],
      references: [tenants.id],
    }),
    patient: one(patients, {
      fields: [appointments.patientId],
      references: [patients.id],
    }),
    user: one(users, {
      fields: [appointments.userId],
      references: [users.id],
    }),
    annotations: many(annotations),
  }),
);

export const annotationsRelations = relations(annotations, ({ one }) => ({
  tenant: one(tenants, {
    fields: [annotations.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [annotations.userId],
    references: [users.id],
  }),
  appointment: one(appointments, {
    fields: [annotations.appointmentId],
    references: [appointments.id],
  }),
}));

export const medicalRecordsRelations = relations(
  medicalRecords,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [medicalRecords.tenantId],
      references: [tenants.id],
    }),
    patient: one(patients, {
      fields: [medicalRecords.patientId],
      references: [patients.id],
    }),
    documents: many(documents),
  }),
);

export const documentsRelations = relations(documents, ({ one }) => ({
  medicalRecord: one(medicalRecords, {
    fields: [documents.medicalRecordId],
    references: [medicalRecords.id],
  }),
}));
