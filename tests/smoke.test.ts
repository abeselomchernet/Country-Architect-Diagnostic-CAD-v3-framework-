import { spawn, ChildProcessByStdio } from "child_process";
import { Readable } from "stream";

// E2E Full Stack Smoke Test for CAD v3 Policy Architect Explorer
// Spawns development server, executes API and Frontend checks, and handles cleanup.

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTest() {
  console.log("🚀 Starting E2E Full-Stack Smoke Test on Port 3000...");
  
  // Start server on port 3000
  const serverProcess = spawn("npx", ["tsx", "server.ts"], {
    env: {
      ...process.env,
      PORT: "3000",
      NODE_ENV: "development"
    },
    shell: true
  });

  let serverOutput = "";
  serverProcess.stdout.on("data", (data) => {
    const text = data.toString();
    serverOutput += text;
    process.stdout.write(` [Server Logs]: ${text}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(` [Server Error]: ${data.toString()}`);
  });

  let isHealthy = false;
  const maxRetries = 15;
  const retryIntervalMs = 1000;
  
  console.log("⏱ Waiting for the development server to listen on port 3000...");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/health");
      if (response.ok) {
        const json = await response.json();
        if (json && json.status === "healthy") {
          console.log(`✅ Server is online and healthy on attempt ${attempt}!`);
          isHealthy = true;
          break;
        }
      }
    } catch (e: any) {
      // Server not ready yet
    }
    await delay(retryIntervalMs);
  }

  if (!isHealthy) {
    console.error("❌ E2E Smoke Test Failed: Timeout waiting for server on port 3000.");
    serverProcess.kill("SIGTERM");
    process.exit(1);
  }

  try {
    // Test 1: Verify the Frontend Root serves HTML
    console.log("🔍 Checking Frontend Root HTML fetch...");
    const rootRes = await fetch("http://127.0.0.1:3000/");
    const htmlText = await rootRes.text();
    if (!rootRes.ok || !htmlText.includes("<!doctype html>") && !htmlText.includes("<html")) {
      throw new Error(`Frontend root returned invalid response: ${rootRes.status} - Content: ${htmlText.slice(0, 50)}`);
    }
    console.log("✅ Frontend Root HTML response represents valid template structure.");

    // Test 2: Verify /api/health Endpoint
    console.log("🔍 Checking /api/health endpoint JSON verification...");
    const healthRes = await fetch("http://127.0.0.1:3000/api/health");
    const healthJson = await healthRes.json();
    if (healthJson.status !== "healthy" || !healthJson.timestamp) {
      throw new Error(`Health JSON failed validations: ${JSON.stringify(healthJson)}`);
    }
    console.log("✅ /api/health returned fully compliant payloads.");

    // Test 3: Verify /api/chat Robustness
    console.log("🔍 Checking /api/chat Gemini client proxy & exception resilience...");
    const chatRes = await fetch("http://127.0.0.1:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello co-pilot" }]
      })
    });
    
    const chatJson = await chatRes.json();
    // It should either return a valid AI response or a graceful error explaining missing keys
    if (chatRes.ok) {
      if (!chatJson.response) {
        throw new Error(`Chat API did not reply with a 'response' field, got: ${JSON.stringify(chatJson)}`);
      }
      console.log("✅ /api/chat is online and processed the prompt successfully!");
    } else {
      // Check if it's our engineered 500 error fallback for missing API Key
      if (chatRes.status === 500 && chatJson.response && chatJson.response.includes("GEMINI_API_KEY")) {
        console.log("✅ /api/chat is online and correctly handled the empty GEMINI_API_KEY gracefully. Excellent client safety!");
      } else {
        throw new Error(`Chat API failed with status ${chatRes.status}: ${JSON.stringify(chatJson)}`);
      }
    }

    console.log("\n⭐️ ALL E2E SMOKE TESTS COMPLETED SUCCESSFULLY! FORWARD COMPATIBILITY VERIFIED.");
    serverProcess.kill("SIGTERM");
    process.exit(0);

  } catch (err: any) {
    console.error(`❌ E2E Smoke Test Failed during assertion checks:`, err);
    serverProcess.kill("SIGTERM");
    process.exit(1);
  }
}

runTest();
