import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { countryPanels, policyEvents } from "./src/data.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser, getSavedScenarios, saveScenario, deleteSavedScenario } from "./src/db/queries.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required yet not supplied.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Relational User Registration Sync
app.post("/api/users", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || "";
    if (!uid) {
      return res.status(400).json({ error: "Invalid registration user data" });
    }
    const user = await getOrCreateUser(uid, email);
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to register user to Cloud SQL database" });
  }
});

// Get Secured Policy Scenarios
app.get("/api/scenarios", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || "";
    if (!uid) {
      return res.status(401).json({ error: "Authentication credentials mismatch" });
    }
    const user = await getOrCreateUser(uid, email);
    const scenarios = await getSavedScenarios(user.id);
    res.json(scenarios);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load policy scenarios" });
  }
});

// Save Scenarios to SQL Database
app.post("/api/scenarios", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || "";
    if (!uid) {
      return res.status(401).json({ error: "Authentication credentials mismatch" });
    }
    const user = await getOrCreateUser(uid, email);
    const { country, year, notes, gsvVal, itcVal } = req.body;
    if (!country || !year || !notes) {
      return res.status(400).json({ error: "Missing required scenario values" });
    }
    const saved = await saveScenario(user.id, {
      country,
      year: Number(year),
      notes,
      gsvVal: String(gsvVal),
      itcVal: String(itcVal),
    });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save scenario" });
  }
});

// Delete Specific Scenario record
app.delete("/api/scenarios/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || "";
    if (!uid) {
      return res.status(401).json({ error: "Authentication credentials mismatch" });
    }
    const user = await getOrCreateUser(uid, email);
    const id = Number(req.params.id);
    const deleted = await deleteSavedScenario(user.id, id);
    res.json(deleted);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete saved scenario" });
  }
});

// Full-fidelity CAD v3 Chat Assistant Proxy
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    const systemInstruction = `
You are the CAD v3 "Policy Architect Co-Pilot", a highly specialized decision-support AI. Your purpose is to assist central banks, development finance institutions (DFIs), monetary regulators, and researchers in diagnosing macroeconomic conditions, evaluating system viability, and simulating policy transmission chains.

You are fully grounded in the Country Architect Diagnostic (CAD) v3 framework and the 2021-2025 multi-country validation cohort (Ethiopia, Kenya, Rwanda, and Sierra Leone), spanning six discrete layers of indicators.

Key structural concepts you support:
1. Grassroots System Viability (GSV): Household digital participation, formal retail account ownership, digital receipts, mobile wallets adoption.
2. Institutional Translation Capacity (ITC): Systemic capacity to convert retail digital velocity into productive SME lending and private credit depth. Highly critical as the decisive mediating variable.
3. Premature Load-Bearing: A dangerous condition documented by Chernet (2026) and Abebe et al. (2024), where retail financial inclusion outpaces macroprudential capital backstops and supervision. In Ethiopia, account ownership grew exponentially to 63% by 2024 (139M accounts), but active digital payment usage lagged at 21%, creating a massive 35-42 percentage point access-usage spread. Crossing the ~30.3% to 35.1% inclusion threshold without solid capital buffers triggers severe default and stability warnings.
4. Catalytic Dependence: Seen in fragile systems (e.g. Sierra Leone) where digital or national switch infrastructure relies heavily on external project funding (e.g., $12M IDA loan) rather than self-sustaining domestic mechanisms, resulting in strategic delays and vulnerability.
5. High-Execution Model: (e.g. Rwanda) which couples balanced high GSV with high ITC to minimize policy-to-market translation leakage using centralized SACCO automation (e.g. Umurenge) and payment switches (e.g. eKash).

CAD v3 frozen 2021 baselines:
- Ethiopia: GSV 4.6, ITC 2.1, Composite 3.35 (Archetype: Transitional / Premature Load-Bearing)
- Kenya: GSV 4.8, ITC 4.5, Composite 4.65 (Archetype: Mature / Segmented)
- Rwanda: GSV 4.7, ITC 4.8, Composite 4.75 (Archetype: High-Execution)
- Sierra Leone: GSV 3.9, ITC 2.4, Composite 3.15 (Archetype: Catalytic-Dependent)

Dataset context:
- Country Panels: ${JSON.stringify(countryPanels)}
- Historical policy milestones in database: ${JSON.stringify(policyEvents)}

Conversation guidelines:
- Be authoritative, extremely professional, and data-driven. Speak objectively and with institutional composure.
- Incorporate specific numbers, rates (e.g. the 35 percentage point access-usage gap in Ethiopia, the 125% average firm collateral in Kenya, or the 39.4% microfinance asset expansion with NPL drop to 3.5% in Rwanda) and structural principles in your arguments.
- If asked for simulated impacts (e.g., "What if Sierra Leone launches Instant Payment Switch in 2026?", or "What if Ethiopia implements a digital credit bureau update?"), map the simulated path downstream: Policy Event -> Infrastructure -> Institutional Capacity -> Grassroots Velocity -> SME Credit Translation Outcome, predicting improvements versus historical baselines.
- Keep the response structured, clear, and action-oriented. Suggest actionable regulatory roadmaps.
`;

    const ai = getAiClient();
    
    // Convert message history to format expected by @google/genai SDK (models/gemini-2.5-flash)
    // Using systems instructions in config
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: formattedMessages,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });

    return res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini Proxy Error:", error);
    // Graceful error fallback if API key is unconfigured or failed
    if (error.message && error.message.includes("API_KEY")) {
      return res.status(500).json({
        response: "I am ready to act as your Policy Architect Co-Pilot, but the server is missing the `GEMINI_API_KEY` secret. Please click the 'Settings' icon (gear) in the AI Studio sidebar and add your `GEMINI_API_KEY` under 'Secrets' to enable full conversational intelligence!\n\nFor now, I can still assist with standard diagnostic calculations."
      });
    }
    return res.status(500).json({
      error: "Internal server error during chat processing",
      response: "Sorry, I encountered an issue communicating with the AI model. Please verify your connection or retry shortly."
    });
  }
});

// Serve frontend with Vite configuration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CAD v3 Policy Architect server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error("Failed to start CAD server:", err);
});
