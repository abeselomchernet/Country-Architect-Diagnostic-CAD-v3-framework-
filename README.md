# CAD v3 Policy Architect Explorer

An intelligent, full-stack decision-support dashboard for the **Country Architect Diagnostic (CAD) v3 Framework**, tailored for simulating macroeconomic policies, evaluating grassroots inclusion, and tracking supervisor-adequate stability thresholds.

---

## 🚀 Key Architectural Modules

*   **Module A: Archetype Matrix & Scatters**: Core visual analysis of country vectors ($GSV$ vs. $ITC$) plotting developmental trajectories.
*   **Module B: Transmission Chain Timeline**: Live policy simulator mapping policy triggers -> micro infrastructure -> macro outcomes.
*   **Module C: Abebe et al. Stability Risk Meter**: Monitors premature load-bearing thresholds (access vs. digital payment active-usage spreads) backed by microprudential capital adequacies.
*   **Module D: Diagnostic Multi-layer Radar**: Interactive six-layer radar index providing raw measurement drill-downs.
*   **Module E: AI "Policy Architect" Co-pilot**: Deep conversational proxy querying the latest CAD manuscripts and panels using Gemini (server-side).
*   **Frozen 2021 Baselines Reports**: Instant structured results validation, featuring one-click **CSV data exports** and a print-ready **Executive Summary PDF generator**.

---

## 🛠️ Commands Registry

All scripts leverage low-overhead setups with hot-reloading for development and pre-compiled builds for lightning-fast container cold-starts.

| Script Command | Purpose |
| :--- | :--- |
| `npm install` | Restores dev and runtime packages safely. |
| `npm run dev` | Boots backend Express server and mounts Vite asset proxy in real-time. |
| `npm run build` | Compiles frontend assets and bundles server-side TS to `dist/server.cjs`. |
| `npm start` | Launches compiled production system in standalone Node.js environment. |
| `npm run lint` | Runs strict TypeScript type check verification. |
| `npm run test:smoke` | Spawns background servers locally and runs full-end E2E tests for verify integrity. |

---

## 🧪 E2E Smoke Testing

The codebase includes an **automated, self-contained, and dependency-free E2E Smoke Test** located in `/tests/smoke.test.ts`.

Unlike heavyweight automated tests that require external browser binaries (e.g. Chrome, Puppeteer) which frequently fail inside container environments, this testing suite:
1. Spawns the server on `PORT 3000` programmatically.
2. Polls until the server is fully ready.
3. Tests the frontend static server routing (`/`).
4. Verifies the dynamic `/api/health` configuration values.
5. Simulates requests to the `/api/chat` model proxy to verify exception handling with missing API secrets.
6. Gracefully shuts down and terminates the background process cleanly.

Run it locally with:
```bash
npm run test:smoke
```

---

## 📦 Setting Up GitHub and Push Repository

To sync your project workspace with GitHub, use the following commands in your computer's terminal:

### 1. Initialize Git and Stage Files
```bash
# Initialize git in workspace root
git init -b main

# Stage all files except those in .gitignore (node_modules, dist, .env)
git add .

# Create the initial commit
git commit -m "feat: implement CAD v3 Policy Architect Explorer with E2E smoke tests and CI/CD"
```

### 2. Connect to GitHub and Push
Create a **New Repository** on GitHub (do not add a README, license, or `.gitignore` since they are already fully configured in this directory), then copy the Remote URL:

```bash
# Add connection pointing to your GitHub Repo
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push changes safely to main branch
git push -u origin main
```

---

## 🔄 GitHub Actions CI/CD Pipeline

We have fully configured a production-ready Continuous Integration workflow located in **`.github/workflows/main.yml`**.

On every single **push** or **pull request** to `main` or `master` branches, GitHub will:
1. Spin up a clean `ubuntu-latest` runner virtual machine.
2. Set up the stable **Node.js 20** runtime environment with local npm package caching.
3. Install production-matched packages cleanly with `npm install`.
4. Validate script modules for syntax regressions using `npm run lint`.
5. Pre-compile full production-ready asset layers via `npm run build`.
6. Launch the background instance and run E2E assertions with `npm run test:smoke`.

*(Optional)* To let the CI/CD pipeline run full-fidelity chats, you can add your `GEMINI_API_KEY` into your GitHub repository settings under **Settings -> Secrets and variables -> Actions -> Repository secrets**.

---

## 🔐 Environment Variables

Setup your environment file to handle confidential credentials securely. Never commit secrets directly into code workspace.

```bash
# Copy template file
cp .env.example .env
```

Open `.env` and configure:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
