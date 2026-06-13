import { eq, and } from "drizzle-orm";
import { db } from "./index.ts";
import { users, savedScenarios } from "./schema.ts";

export interface ScenarioInput {
  country: string;
  year: number;
  notes: string;
  gsvVal: string;
  itcVal: string;
}

// Get or Create user mapping Firebase UID to local SQL database primary key ID
export async function getOrCreateUser(uid: string, email: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database query failed in getOrCreateUser:", error);
    throw new Error("Unable to retrieve or register user session details.", { cause: error });
  }
}

// Get saved scenarios for a given user
export async function getSavedScenarios(userId: number) {
  try {
    const result = await db
      .select()
      .from(savedScenarios)
      .where(eq(savedScenarios.userId, userId))
      .orderBy(savedScenarios.createdAt);
    return result;
  } catch (error) {
    console.error("Database query failed in getSavedScenarios:", error);
    throw new Error("Unable to fetch saved database policy records.", { cause: error });
  }
}

// Save a new scenario
export async function saveScenario(userId: number, input: ScenarioInput) {
  try {
    const result = await db
      .insert(savedScenarios)
      .values({
        userId,
        country: input.country,
        year: input.year,
        notes: input.notes,
        gsvVal: input.gsvVal,
        itcVal: input.itcVal,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database query failed in saveScenario:", error);
    throw new Error("Unable to record policy scenario to database.", { cause: error });
  }
}

// Delete a saved scenario
export async function deleteSavedScenario(userId: number, scenarioId: number) {
  try {
    const result = await db
      .delete(savedScenarios)
      .where(
        and(
          eq(savedScenarios.id, scenarioId),
          eq(savedScenarios.userId, userId)
        )
      )
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database query failed in deleteSavedScenario:", error);
    throw new Error("Unable to delete policy scenario from database.", { cause: error });
  }
}
