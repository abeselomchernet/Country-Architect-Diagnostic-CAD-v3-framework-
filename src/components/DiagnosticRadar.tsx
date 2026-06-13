import React, { useState } from "react";
import { countryPanels, CountryData } from "../data";
import { Layers, ChevronRight, Check } from "lucide-react";

interface DiagnosticRadarProps {
  selectedCountry: string;
  selectedYear: number;
}

const LAYERS_INFO = [
  { id: "layer1", name: "Layer 1 (Household / Demand)", desc: "Retail inclusion, account registry, payment access" },
  { id: "layer2", name: "Layer 2 (Firm / SME obstacles)", desc: "SME bank loan share, collateral barriers, informality" },
  { id: "layer3", name: "Layer 3 (Institutional / Regulatory)", desc: "Capital ratios, supervisor grades, interbank switches" },
  { id: "layer4", name: "Layer 4 (Infrastructure / ID)", desc: "Network reliability, electricity, national digital ID standard" },
  { id: "layer6", name: "Layer 6 (Credit Outcomes)", desc: "Cashless GDP index, active accounts, productive SME loans" }
];

export const DiagnosticRadar: React.FC<DiagnosticRadarProps> = ({
  selectedCountry,
  selectedYear,
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>("layer1");

  // Get nearest index or interpolate
  const getNearestData = (country: string, targetYear: number): CountryData => {
    const records = countryPanels.filter((r) => r.country === country);
    return records.reduce((prev, curr) => {
      return Math.abs(curr.year - targetYear) < Math.abs(prev.year - targetYear)
        ? curr
        : prev;
    });
  };

  const data = getNearestData(selectedCountry, selectedYear);

  // Compute average scores for each of the 5 layers out of 10
  // Layer 1
  const s1 = (data.layers.layer1.account_ownership / 10 +
              data.layers.layer1.mobile_money_ownership / 10 +
              data.layers.layer1.digital_payment_use / 10 +
              data.layers.layer1.formal_savings / 10) / 4 * 10; // Out of 10
  
  // Layer 2
  const s2 = (data.layers.layer2.firms_with_bank_loan / 10 +
              (100 - data.layers.layer2.access_to_finance_obstacles) / 10 + // inverse
              (100 - data.layers.layer2.credit_constraints) / 10 + // inverse
              (100 - data.layers.layer2.informality_rate) / 10) / 4 * 10; // Out of 10

  // Layer 3
  const s3 = (data.layers.layer3.capital_adequacy / 10 +
              (100 - data.layers.layer3.npl_ratio) / 10 + // inverse
              data.layers.layer3.credit_bureau_coverage / 10 +
              (data.layers.layer3.payment_interoperability ? 10 : 0) +
              data.layers.layer3.banking_assets_gdp / 10) / 5; // Out of 10

  // Layer 4
  const s4 = (data.layers.layer4.mobile_coverage / 10 +
              data.layers.layer4.internet_penetration / 10 +
              data.layers.layer4.electricity_access / 10 +
              data.layers.layer4.digital_id_use / 10) / 4 * 10; // Out of 10

  // Layer 6 (Outcomes)
  const s6 = (data.layers.layer6.sme_lending_gdp +
              data.layers.layer6.active_account_use_rate / 10 +
              data.layers.layer6.cashless_transactions_gdp / 35.0) / 3 * 10; // Out of 10 (normalized outcomes indicator)

  const scores: Record<string, number> = {
    layer1: s1,
    layer2: s2,
    layer3: s3,
    layer4: s4,
    layer6: s6
  };

  // Math coordinates for 5-sided Radar Chart
  // Center is at 150, 150. Radius max is 100
  const cx = 150;
  const cy = 150;
  const rMax = 100;
  const numSteps = 5;

  const pointsCount = 5;
  const getRadarCoordinates = (index: number, score: number) => {
    // Score is 0 - 10
    const value = Math.max(0, Math.min(10, score));
    const angle = (2 * Math.PI * index) / pointsCount - Math.PI / 2;
    const r = (value / 10) * rMax;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle
    };
  };

  // Generate radar outline paths
  const radarPoints = LAYERS_INFO.map((layer, idx) => {
    const score = scores[layer.id];
    return getRadarCoordinates(idx, score);
  });

  let radarPointsStr = "";
  radarPoints.forEach((p, idx) => {
    radarPointsStr += `${idx === 0 ? "M" : "L"} ${p.x} ${p.y} `;
  });
  if (radarPointsStr) radarPointsStr += "Z";

  // Grid background pentagons (at levels 2, 4, 6, 8, 10 out of 10)
  const gridSteps = [2, 4, 6, 8, 10];

  // Dynamic Analysis of local operational bottlenecks
  // Locate which non-outcome layer has the lowest score
  const nonOutcomeLayers = ["layer1", "layer2", "layer3", "layer4"];
  const bottleneckLayerId = nonOutcomeLayers.reduce((prev, curr) => {
    return scores[curr] < scores[prev] ? curr : prev;
  });

  const bottleneckInfo = LAYERS_INFO.find((l) => l.id === bottleneckLayerId)!;
  const bottleneckScore = scores[bottleneckLayerId];

  // Raw indicator lists for selected layer drilldown
  const getRawIndicatorsList = () => {
    switch (selectedLayerId) {
      case "layer1":
        return [
          { name: "Account Ownership at formal bank (%)", raw: `${data.layers.layer1.account_ownership.toFixed(1)}%`, norm: (data.layers.layer1.account_ownership / 10).toFixed(2), type: "Direct" },
          { name: "Mobile Wallet Ownership (%)", raw: `${data.layers.layer1.mobile_money_ownership.toFixed(1)}%`, norm: (data.layers.layer1.mobile_money_ownership / 10).toFixed(2), type: "Direct" },
          { name: "Digital Payment Use (past 12 months %)", raw: `${data.layers.layer1.digital_payment_use.toFixed(1)}%`, norm: (data.layers.layer1.digital_payment_use / 10).toFixed(2), type: "Direct" },
          { name: "Formal Savings Behavior (%)", raw: `${data.layers.layer1.formal_savings.toFixed(1)}%`, norm: (data.layers.layer1.formal_savings / 10).toFixed(2), type: "Direct" }
        ];
      case "layer2":
        return [
          { name: "SME Share of formal Bank Loans (%)", raw: `${data.layers.layer2.firms_with_bank_loan.toFixed(1)}%`, norm: (data.layers.layer2.firms_with_bank_loan / 10).toFixed(2), type: "Direct" },
          { name: "SME Access-to-Finance Obstacles (%)", raw: `${data.layers.layer2.access_to_finance_obstacles.toFixed(1)}%`, norm: ((100 - data.layers.layer2.access_to_finance_obstacles) / 10).toFixed(2), type: "Inverse" },
          { name: "Credit Constraint Backlogs (%)", raw: `${data.layers.layer2.credit_constraints.toFixed(1)}%`, norm: ((100 - data.layers.layer2.credit_constraints) / 10).toFixed(2), type: "Inverse" },
          { name: "Enterprise Informality Rate (%)", raw: `${data.layers.layer2.informality_rate.toFixed(1)}%`, norm: ((100 - data.layers.layer2.informality_rate) / 10).toFixed(2), type: "Inverse" }
        ];
      case "layer3":
        return [
          { name: "Capital Adequacy Ratio (CAR %)", raw: `${data.layers.layer3.capital_adequacy.toFixed(1)}%`, norm: (data.layers.layer3.capital_adequacy / 10).toFixed(2), type: "Direct" },
          { name: "Non-Performing Loans (NPL %)", raw: `${data.layers.layer3.npl_ratio.toFixed(1)}%`, norm: ((100 - data.layers.layer3.npl_ratio) / 10).toFixed(2), type: "Inverse" },
          { name: "Credit Bureau Registries Coverage (%)", raw: `${data.layers.layer3.credit_bureau_coverage.toFixed(1)}%`, norm: (data.layers.layer3.credit_bureau_coverage / 10).toFixed(2), type: "Direct" },
          { name: "Real-Time Interoperator Interoperability", raw: data.layers.layer3.payment_interoperability ? "Yes (Active)" : "No (Closed-loop)", norm: data.layers.layer3.payment_interoperability ? "10.00" : "0.00", type: "Binary" },
          { name: "Total Banking Assets (% of GDP)", raw: `${data.layers.layer3.banking_assets_gdp.toFixed(1)}%`, norm: (data.layers.layer3.banking_assets_gdp / 10).toFixed(2), type: "Direct" }
        ];
      case "layer4":
        return [
          { name: "Mobile Cellular Towers Coverage (%)", raw: `${data.layers.layer4.mobile_coverage.toFixed(1)}%`, norm: (data.layers.layer4.mobile_coverage / 10).toFixed(2), type: "Direct" },
          { name: "Household Internet Penetration (%)", raw: `${data.layers.layer4.internet_penetration.toFixed(1)}%`, norm: (data.layers.layer4.internet_penetration / 10).toFixed(2), type: "Direct" },
          { name: "Firms with Stable Grid Electricity (%)", raw: `${data.layers.layer4.electricity_access.toFixed(1)}%`, norm: (data.layers.layer4.electricity_access / 10).toFixed(2), type: "Direct" },
          { name: "National Digital ID Adoption (%)", raw: `${data.layers.layer4.digital_id_use.toFixed(1)}%`, norm: (data.layers.layer4.digital_id_use / 10).toFixed(2), type: "Direct" }
        ];
      case "layer6":
      default:
        return [
          { name: "SME Productive Credit (% of GDP)", raw: `${data.layers.layer6.sme_lending_gdp.toFixed(1)}%`, norm: data.layers.layer6.sme_lending_gdp.toFixed(2), type: "Direct (0-10 index scale)" },
          { name: "Active / Nominal Account Usage Ratio (%)", raw: `${data.layers.layer6.active_account_use_rate.toFixed(1)}%`, norm: (data.layers.layer6.active_account_use_rate / 10).toFixed(2), type: "Direct" },
          { name: "Cashless Retail Transactions (% of GDP)", raw: `${data.layers.layer6.cashless_transactions_gdp.toFixed(1)}%`, norm: (data.layers.layer6.cashless_transactions_gdp / 35.0).toFixed(2), type: "Ratio scaled max 350%" }
        ];
    }
  };

  return (
    <div id="multilayer-radar-card" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Module D: Multi-Layer Diagnostic Radar & Drilldown
          </h2>
          <p className="text-xs text-slate-500">
            Click radar axes or lists below to unpack six database layers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Drawing Panel */}
        <div className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/50 p-2 rounded-xl border border-slate-100">
          <div className="relative w-full max-w-[280px] aspect-square">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Background rings pentagons */}
              {gridSteps.map((step) => {
                const sPoints = LAYERS_INFO.map((_, idx) => getRadarCoordinates(idx, step));
                let pathStr = "";
                sPoints.forEach((p, idx) => {
                  pathStr += `${idx === 0 ? "M" : "L"} ${p.x} ${p.y} `;
                });
                if (pathStr) pathStr += "Z";
                return (
                  <path
                    key={step}
                    d={pathStr}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                );
              })}

              {/* Angle Axes Guides */}
              {LAYERS_INFO.map((_, idx) => {
                const outer = getRadarCoordinates(idx, 10);
                return (
                  <line
                    key={idx}
                    x1={cx}
                    y1={cy}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="#cbd5e1"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Data Pentagon Shape */}
              <path
                d={radarPointsStr}
                fill="rgba(59, 130, 246, 0.15)"
                stroke="#2563eb"
                strokeWidth="2.5"
                className="transition-all duration-500"
              />

              {/* Interactable Points */}
              {radarPoints.map((p, idx) => {
                const layer = LAYERS_INFO[idx];
                const isActive = selectedLayerId === layer.id;
                return (
                  <g
                    key={`point-${idx}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? "6" : "4"}
                      fill={isActive ? "#1d4ed8" : "#3b82f6"}
                      stroke="#white"
                      strokeWidth="1.5"
                      className="hover:scale-150 transition-all duration-200"
                    />
                    <text
                      x={cx + (rMax + 24) * Math.cos(p.angle)}
                      y={cy + (rMax + 22) * Math.sin(p.angle) + 4}
                      textAnchor="middle"
                      className={`text-[8.5px] font-bold ${
                        isActive ? "fill-slate-900 scale-105" : "fill-slate-400 font-semibold"
                      }`}
                    >
                      {`L${layer.id === "layer6" ? "6" : layer.id.charAt(5)}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 select-none">
            Plot centered on {selectedCountry} — {selectedYear}
          </span>
        </div>

        {/* Drilldown List */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          <div className="flex flex-col gap-2">
            {LAYERS_INFO.map((layer) => {
              const isActive = selectedLayerId === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`text-left w-full p-2.5 rounded-lg border text-xs flex justify-between items-center transition-all ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white font-semibold"
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div>
                    <div className="font-semibold">{layer.name}</div>
                    <div className={`text-[10px] ${isActive ? "text-slate-300" : "text-slate-400"} mt-0.5 truncate max-w-[280px]`}>
                      {layer.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold bg-slate-200/50 text-slate-800 px-1.5 py-0.5 rounded ml-2">
                      {scores[layer.id].toFixed(1)}/10
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Raw Indicator Drilldown Table */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          Raw Observations and Calculated Scores: {LAYERS_INFO.find((l) => l.id === selectedLayerId)?.name}
        </h3>
        
        <div className="border border-slate-100 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs bg-white">
            <thead className="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-2">Indicator Field Name</th>
                <th className="px-4 py-2">Observed Raw Value</th>
                <th className="px-4 py-2">Normalisation Method</th>
                <th className="px-4 py-2 text-right">Provisional Grade (0-10)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {getRawIndicatorsList().map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 font-medium">{item.name}</td>
                  <td className="px-4 py-2.5 font-mono">{item.raw}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-[10px] italic">{item.type}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">{item.norm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Spearman Pipeline Bottleneck Analysis */}
      <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4.5 mt-5">
        <h4 className="text-xs font-bold text-amber-800 uppercase mb-1">
          CAD v3 Dynamic Bottleneck Diagnostic:
        </h4>
        <p className="text-xs text-amber-900 leading-relaxed font-sans">
          The pipeline identifies **{bottleneckInfo.name}** as the most depressing bottleneck blocking credit translation outcomes in {selectedCountry} during {selectedYear}. With a score of only <span className="font-semibold font-mono">{bottleneckScore.toFixed(1)}/10</span>, credit channels will stay choked until policy directives are launched to strengthen these specific institutional and digital backstops.
        </p>
      </div>
    </div>
  );
};
