import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  twoFactorEnabled: boolean("two_factor_enabled"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  identificationNumber: text("identification_number").notNull().unique(),
  language: text("language").default("es").notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const appointmentTypeEnum = pgEnum("appointment_type", [
  "in-person",
  "virtual",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "available",
  "booked",
]);

export const appointment = pgTable("appointment", {
  id: text("id").primaryKey(),
  start: timestamp("start", { mode: "date" }).notNull(),
  end: timestamp("end", { mode: "date" }).notNull(),
  status: appointmentStatusEnum("status").notNull(),
  patientId: text("patient_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  type: appointmentTypeEnum("type"),
  meetingLink: text("meeting_link"),
  location: text("location"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const notification = pgTable("notification", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  preview: text("preview").notNull(),
  content: text("content").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const maritalStatusEnum = pgEnum("marital_status", [
  "single",
  "married",
  "divorced",
  "widowed",
  "separated",
]);

export const personalInfo = pgTable("personal_info", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  age: integer("age").notNull(),
  profession: text("profession").notNull(),
  occupation: text("occupation").notNull(),
  maritalStatus: maritalStatusEnum("marital_status").notNull(),
  hasChildren: boolean("has_children").notNull().default(false),
  numMale: integer("num_male").notNull().default(0),
  numFemale: integer("num_female").notNull().default(0),
  cSections: boolean("c_sections").notNull().default(false),
  abortions: boolean("abortions").notNull().default(false),
  placeOfResidence: text("place_of_residence").notNull(),
  city: text("city").notNull(),
  homePhoneNumber: text("home_phone_number"),
  celularPhoneNumber: text("celular_phone_number").notNull(),
  workPhoneNumber: text("work_phone_number"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const bloodTypeEnum = pgEnum("blood_type", ["O", "A", "AB", "B"]);

export const rhFactorEnum = pgEnum("rh_factor", ["+", "-"]);

export const religionEnum = pgEnum("religion", [
  "evangelical christian",
  "catholic",
  "others",
]);

export const medicalInfo = pgTable("medical_info", {
  id: text("id").primaryKey(),
  patientId: text("patient_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  bloodType: bloodTypeEnum("blood_type").notNull(),
  rhFactor: rhFactorEnum("rh_factor").notNull(),
  hasAllergies: boolean("has_allergies").notNull().default(false),
  allergyDetails: text("allergy_details"),
  religion: religionEnum("religion").notNull(),
  allowsTransfusions: boolean("allows_transfusions").notNull().default(false),
  alcohol: boolean("alcohol").notNull().default(false),
  drugs: boolean("drugs").notNull().default(false),
  hasChronicIllness: boolean("has_chronic_illness").notNull().default(false),
  chronicIllnessDetails: text("chronic_illness_details"),
  hasHealthInsurance: boolean("has_health_insurance").notNull().default(false),
  healthInsuranceProvider: text("health_insurance_provider"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const relationshipEnum = pgEnum("relationship", [
  "parent",
  "sibling",
  "spouse",
  "friend",
  "other",
]);

export const emergencyContact = pgTable("emergency_contact", {
  id: text("id").primaryKey(),
  patientId: text("patient_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  relationship: relationshipEnum("relationship").notNull(),
  homePhoneNumber: text("home_phone_number"),
  celularPhoneNumber: text("celular_phone_number").notNull(),
  workPhoneNumber: text("work_phone_number"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
