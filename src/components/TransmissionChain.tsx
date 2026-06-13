import React, { useState, useEffect } from "react";
import { policyEvents, PolicyEvent, countryPanels, CountryData } from "../data";
import { Zap, ArrowRight, LineChart } from "lucide-react";

interface TransmissionChainProps {
  selectedCountry: string;
  selectedYear: number;
}

interface WhatIfScenario {
  id: string;
  name: string;
  country: string;
  policy: string;
  impactPath: string[];
  baselineMetrics: Record<string, string>;
  simulatedMetrics: Record<string, string>;
  technicalPrediction: string;
}

const WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: "scen-sl-ips",
    name: "Sierra Leone: Launch Full Phase 2 Instant Payment Interoperability",
    country: "Sierra Leone",
    policy: "Bank of Sierra Leone mandates direct cross-network clearing and instant settlements for micro-wallets using modern payment switches.",
    impactPath: [
      "1. Legal Event: Inter-wallet clearance directive published.",
      "2. Infrastructure Layer: Digital ID registries and telecom towers synchronized.",
      "3. Institutional: Payment Interoperability rating changes from No to Yes.",
      "4. Grassroots velocity: Active digital payment use rises from 18.0% to 48.0%.",
      "5. Enterprise Outcome: SME default rate chokes as trade frequency doubles."
    ],
    baselineMetrics: {
      "Payment Interoperability": "No (Fragmented)",
      "Active digital payments (%)": "18.0%",
      "ITC Score": "3.10 / 10",
      "SME Lending (% GDP)": "5.0%"
    },
    simulatedMetrics: {
      "Payment Interoperability": "Yes (Interoperable)",
      "Active digital payments (%)": "48.0% (Simulated)",
      "ITC Score": "4.55 / 10 (Simulated)",
      "SME Lending (% GDP)": "8.5% (Simulated)"
    },
    technicalPrediction: "Empirical baseline parameters indicate that Sierra Leone's structural dependency on external catalytic funding can be cut by ~40% within 18 months of full launch, because transaction velocity boosts domestic banking reserves and frees up self-funded capital reserves."
  },
  {
    id: "scen-et-cred",
    name: "Ethiopia: Implement Real-Time Digital Credit Bureau Standards",
    country: "Ethiopia",
    policy: "National Bank of Ethiopia establishes a licensed API framework linking mobile wallet history with commercial credit registries.",
    impactPath: [
      "1. Legal Event: API registration sandbox directive.",
      "2. Infrastructure Layer: Mobilization of digital ID (national standard Ethio ID).",
      "3. Institutional: Credit Bureau coverage jumps from 25.0% to 75.0%.",
      "4. Grassroots velocity: Access-usage gap settles as interest obstacles lower.",
      "5. Enterprise Outcome: Productive SME lending to GDP surges by 5 percentage points."
    ],
    baselineMetrics: {
      "Credit Bureau Coverage": "25.0% (Low)",
      "SME Credit Constraints": "High Constraints",
      "Access-to-Finance obstacles": "32.0% (Severe Obstacle)",
      "SME Lending (% GDP)": "11.0%"
    },
    simulatedMetrics: {
      "Credit Bureau Coverage": "75.0% (Digitized)",
      "SME Credit Constraints": "Moderate-Low Constraints",
      "Access-to-Finance obstacles": "14.5% (Obstacle Lowered)",
      "SME Lending (% GDP)": "16.0% (Simulated Boosted)"
    },
    technicalPrediction: "By creating real-time risk proxies from mobile money flows, Ethiopia can bypass the historical physical collateral hurdle. This maps right into a 1.45x increase in credit translation efficiency."
  },
  {
    id: "scen-ke-grid",
    name: "Kenya: Universal Power Grid Upgrades & Outage Backstops",
    country: "Kenya",
    policy: "Ministry of Energy and CBK pool resources to deploy grid backups and energy insurance credit lines for micro-enterprise tech nodes.",
    impactPath: [
      "1. Legal Event: DFI-subsidized energy infrastructure backing lines.",
      "2. Infrastructure Layer: Power grid outage rate drops from 80.0% to 12.0%.",
      "3. Institutional: Technology adoption surges to 95.0% across regional firms.",
      "4. Grassroots velocity: Active digital receipts velocity reaches 91.0%.",
      "5. Enterprise Outcome: SME productive translation efficiency reaches peak execution."
    ],
    baselineMetrics: {
      "Outage affected enterprises": "80.0%",
      "SME Lending (% GDP)": "15.0%",
      "Technology adoption (%)": "88.0%",
      "ITC Score": "5.60 / 10"
    },
    simulatedMetrics: {
      "Outage affected enterprises": "12.0% (Resilient Grid)",
      "SME Lending (% GDP)": "22.5% (Simulated Boost)",
      "Technology adoption (%)": "95.0% (Simulated Peak)",
      "ITC Score": "6.85 / 10 (Simulated)"
    },
    technicalPrediction: "Removing infrastructure constraints boosts SME operational cash positions. Our model simulates a 50% decrease in collateral hurdles because firms can demonstrate uninhibited revenue outputs from automated telemetry."
  }
];

export const TransmissionChain: React.FC<TransmissionChainProps> = ({
  selectedCountry,
  selectedYear,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);

  // Reset simulation and event when country changes to prevent cross-country referencing errors
  useEffect(() => {
    setActiveSimulationId(null);
    setSelectedEventId(null);
  }, [selectedCountry]);

  // Filter events for the current country leading up to or on the current year
  const countryEvents = policyEvents
    .filter((e) => e.country === selectedCountry)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Active or highlighted event
  const currentEvent = selectedEventId
    ? policyEvents.find((e) => e.id === selectedEventId)
    : countryEvents.length > 0
    ? countryEvents[countryEvents.length - 1]
    : null;

  // Active what if scenarios
  const activeScenarios = WHAT_IF_SCENARIOS.filter((s) => s.country === selectedCountry);

  return (
    <div id="policy-transmission-card" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          Module B: Policy Transmission & "What-If" Simulator
        </h2>
        <p className="text-xs text-slate-500">
          Trace physical impact chains of legal mandates or simulate predictive scenarios
        </p>
      </div>

      {/* Historical Milestones Selection Grid */}
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-2.5">
        Historical Events Timeline for {selectedCountry}
      </h3>
      {countryEvents.length === 0 ? (
        <p className="text-xs text-slate-400 italic mb-4">No events logged for {selectedCountry}.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
          {countryEvents.map((ev) => {
            const isHighlighted = currentEvent?.id === ev.id;
            return (
              <button
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                  isHighlighted
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm font-semibold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className={`${isHighlighted ? "text-slate-300" : "text-slate-400"} font-mono text-[9px]`}>
                  {ev.date}
                </div>
                <div className="truncate font-sans leading-tight mt-0.5">{ev.title}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* 5-Stage Policy Transmission Visualizer */}
      {currentEvent && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h4 className="text-xs font-bold text-slate-700 uppercase">
              Current Focus: {currentEvent.title} ({currentEvent.date})
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {currentEvent.description}
          </p>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {[
                { label: "1. Policy Action", name: currentEvent.type, val: "Event Enacted" },
                { label: "2. Infrastructure Impact", name: "Layer 4 Adjustment", val: "Towers / ID Standardized" },
                { label: "3. Institutional Reform", name: "Layer 3 Calibration", val: "Oversight / Clearance" },
                { label: "4. Grassroots Velocity", name: "Layer 1 Reaction", val: "Accounts / Savings Shift" },
                { label: "5. Credit Translation", name: "Layer 6 Outcome", val: currentEvent.expectedEffect }
              ].map((step, idx) => (
                <div
                  key={`step-${idx}`}
                  className="bg-white border border-slate-250 p-2.5 rounded-lg text-center flex flex-col items-center justify-between"
                >
                  <span className="text-[9px] font-bold text-slate-400 block uppercase mb-1">
                    {step.label}
                  </span>
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {step.name}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 italic block leading-tight">
                    {step.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WHAT IF PLANNING SIMULATOR */}
      <div className="mt-auto border-t border-slate-100 pt-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-2.5 flex items-center gap-1.5">
          <LineChart className="w-4 h-4 text-indigo-500" />
          "What-If" Policy Architect Simulator
        </h3>

        {activeScenarios.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No scenarios currently mapped for {selectedCountry}. Try selecting Ethiopia or Sierra Leone.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              {activeScenarios.map((scen) => {
                const isActive = activeSimulationId === scen.id;
                return (
                  <button
                    key={scen.id}
                    onClick={() => setActiveSimulationId(isActive ? null : scen.id)}
                    className={`flex-1 text-center py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100"
                        : "bg-white border-slate-250 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {isActive ? "Simulation Active" : "Simulate Scenario"}
                  </button>
                );
              })}
            </div>

            {activeSimulationId && activeScenarios.some((s) => s.id === activeSimulationId) && (
              (() => {
                const scen = activeScenarios.find((s) => s.id === activeSimulationId)!;
                return (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4.5 animate-fadeIn">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase mb-1">
                      {scen.name}
                    </h4>
                    <p className="text-xs text-indigo-750 mb-3.5 leading-relaxed italic">
                      "Proposal: {scen.policy}"
                    </p>

                    {/* Impact Path Flow */}
                    <div className="space-y-1.5 mb-4 border-l-2 border-indigo-300 pl-4 py-1">
                      <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1 tracking-wider">
                        Expected Dynamic Impact Chain:
                      </div>
                      {scen.impactPath.map((path, idx) => (
                        <div key={idx} className="text-xs text-indigo-800 leading-tight">
                          {path}
                        </div>
                      ))}
                    </div>

                    {/* Projections Comparative Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-lg border border-indigo-100 mb-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                          Historical Baseline (2024 / 2025)
                        </div>
                        {Object.entries(scen.baselineMetrics).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-xs py-1 border-b border-slate-50 last:border-0">
                            <span className="text-slate-500 text-[11px]">{key}</span>
                            <span className="font-mono font-medium text-slate-800">{val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-l border-slate-100 pl-4">
                        <div className="text-[10px] uppercase font-bold text-indigo-500 mb-1.5">
                          Simulated Macro Projections
                        </div>
                        {Object.entries(scen.simulatedMetrics).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-xs py-1 border-b border-slate-50 last:border-0">
                            <span className="text-indigo-600 text-[11px] font-medium">{key}</span>
                            <span className="font-mono font-bold text-indigo-700">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech prediction sentence */}
                    <div className="text-xs text-indigo-800 bg-indigo-50 border-t border-indigo-100 pt-3 leading-relaxed">
                      <span className="font-bold block text-[10px] uppercase text-indigo-600 mb-0.5">
                        Technical Predictive Analysis (Abebe model aligned):
                      </span>
                      {scen.technicalPrediction}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}
      </div>
    </div>
  );
};
