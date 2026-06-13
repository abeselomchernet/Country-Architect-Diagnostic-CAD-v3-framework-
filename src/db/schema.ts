import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Users table linked to Firebase Auth UID
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved Policy Scenarios/Notes table
export const savedScenarios = pgTable("saved_scenarios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  country: text("country").notNull(),
  year: integer("year").notNull(),
  notes: text("notes").notNull(),
  gsvVal: text("gsv_val").notNull(),
  itcVal: text("itc_val").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations definitions
export const usersRelations = relations(users, ({ many }) => ({
  savedScenarios: many(savedScenarios),
}));

export const savedScenariosRelations = relations(savedScenarios, ({ one }) => ({
  user: one(users, {
    fields: [savedScenarios.userId],
    references: [users.id],
  }),
}));
