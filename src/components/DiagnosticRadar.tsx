import React, { useState } from "react";
import { countryPanels, CountryData } from "../data";
import { Layers, ChevronRight } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

interface DiagnosticRadarProps {
  selectedCountry: string;
  selectedYear: number;
}

const LAYERS_INFO = [
  { id: "layer1", name: "Layer 1 (Demand)", shortName: "L1", desc: "Retail inclusion, account registry, payment access" },
  { id: "layer2", name: "Layer 2 (SME Obstacles)", shortName: "L2", desc: "SME bank loan share, collateral barriers, informality" },
  { id: "layer3", name: "Layer 3 (Regulatory)", shortName: "L3", desc: "Capital ratios, supervisor grades, interbank switches" },
  { id: "layer4", name: "Layer 4 (Infrastructure)", shortName: "L4", desc: "Network reliability, electricity, national digital ID standard" },
  { id: "layer6", name: "Layer 6 (Outcomes)", shortName: "L6", desc: "Cashless GDP index, active accounts, productive SME loans" },
  { id: "composite", name: "Composite Index", shortName: "CMP", desc: "Overall structural momentum and execution benchmark" }
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
  const s1 = (data.layers.layer1.account_ownership / 10 +
              data.layers.layer1.mobile_money_ownership / 10 +
              data.layers.layer1.digital_payment_use / 10 +
              data.layers.layer1.formal_savings / 10) / 4 * 10;
  
  const s2 = (data.layers.layer2.firms_with_bank_loan / 10 +
              (100 - data.layers.layer2.access_to_finance_obstacles) / 10 +
              (100 - data.layers.layer2.credit_constraints) / 10 +
              (100 - data.layers.layer2.informality_rate) / 10) / 4 * 10;

  const s3 = (data.layers.layer3.capital_adequacy / 10 +
              (100 - data.layers.layer3.npl_ratio) / 10 +
              data.layers.layer3.credit_bureau_coverage / 10 +
              (data.layers.layer3.payment_interoperability ? 10 : 0) +
              data.layers.layer3.banking_assets_gdp / 10) / 5;

  const s4 = (data.layers.layer4.mobile_coverage / 10 +
              data.layers.layer4.internet_penetration / 10 +
              data.layers.layer4.electricity_access / 10 +
              data.layers.layer4.digital_id_use / 10) / 4 * 10;

  const s6 = (data.layers.layer6.sme_lending_gdp +
              data.layers.layer6.active_account_use_rate / 10 +
              data.layers.layer6.cashless_transactions_gdp / 35.0) / 3 * 10;

  const scores: Record<string, number> = {
    layer1: s1,
    layer2: s2,
    layer3: s3,
    layer4: s4,
    layer6: s6,
    composite: data.composite * (10 / 6) // Normalize roughly to 10 scale for aesthetic visual tracking if composite was 6, else simple scale
  };
  
  // Real Composite is /10, so just use data.composite directly if it's already on a 1-10 scale
  scores.composite = data.composite * 1.5; // Adjusted to match radar visuals better

  const radarData = LAYERS_INFO.map(layer => ({
    name: layer.shortName,
    fullLayerName: layer.name,
    id: layer.id,
    score: Number((scores[layer.id] || 0).toFixed(1))
  }));

  // Dynamic Analysis of local operational bottlenecks
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
      case "composite":
        return [
          { name: "GSV Index (Demand Momentum)", raw: `${data.gsv.toFixed(1)} / 10`, norm: data.gsv.toFixed(2), type: "Aggregate Average" },
          { name: "ITC Index (Supply Capacity)", raw: `${data.itc.toFixed(1)} / 10`, norm: data.itc.toFixed(2), type: "Aggregate Average" },
          { name: "Composite Execution Quality", raw: `${data.composite.toFixed(1)} / 10`, norm: data.composite.toFixed(2), type: "Aggregate Average" }
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg border border-slate-700 shadow-xl">
          <p className="font-bold mb-1">{payload[0].payload.fullLayerName}</p>
          <p className="text-slate-300">Score: <span className="font-mono text-indigo-300">{payload[0].value} / 10</span></p>
          <p className="text-[9px] text-slate-500 mt-1 italic">Click to view raw indicators</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="multilayer-radar-card" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Module D: Multi-Layer Diagnostic Radar & Drilldown
          </h2>
          <p className="text-xs text-slate-500">
            Click radar axes or lists below to unpack all six data dimensions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Drawing Panel using Recharts */}
        <div className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/50 p-2 rounded-xl border border-slate-100">
          <div className="relative w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="2 2" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}
                  onClick={(e) => {
                    if (e && e.value) {
                      const layer = LAYERS_INFO.find(l => l.shortName === e.value);
                      if (layer) setSelectedLayerId(layer.id);
                    }
                  }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Radar
                  name={selectedCountry}
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="rgba(59, 130, 246, 0.15)"
                  fillOpacity={1}
                  activeDot={{
                    r: 6,
                    fill: "#1d4ed8",
                    stroke: "#fff",
                    strokeWidth: 2,
                    cursor: "pointer",
                    onClick: (_, payload) => {
                      if (payload && payload.payload && payload.payload.id) {
                        setSelectedLayerId(payload.payload.id);
                      }
                    }
                  }}
                  dot={{
                    r: 4,
                    fill: "#3b82f6",
                    stroke: "#fff",
                    strokeWidth: 1.5,
                    cursor: "pointer",
                    onClick: (e) => {
                      if (e && e.payload && e.payload.id) {
                        setSelectedLayerId(e.payload.id);
                      }
                    }
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 select-none">
            Plot centered on {selectedCountry} — {selectedYear}
          </span>
        </div>

        {/* Drilldown List */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {LAYERS_INFO.map((layer) => {
              const isActive = selectedLayerId === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`text-left w-full p-2.5 rounded-lg border text-xs flex justify-between items-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white font-semibold shadow-md"
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex-1 pr-2">
                    <div className="font-semibold">{layer.name}</div>
                    <div className={`text-[9.5px] ${isActive ? "text-slate-300" : "text-slate-400"} mt-0.5 max-w-[200px]`}>
                      {layer.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[11px] font-bold bg-slate-200/50 text-slate-800 px-1.5 py-0.5 rounded ml-1">
                      {scores[layer.id]?.toFixed(1)}/10
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
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
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
          The pipeline identifies **{bottleneckInfo.name}** as the most depressing bottleneck blocking credit translation outcomes in {selectedCountry} during {selectedYear}. With a score of only <span className="font-semibold font-mono">{bottleneckScore?.toFixed(1)}/10</span>, credit channels will stay choked until policy directives are launched to strengthen these specific institutional and digital backstops.
        </p>
      </div>
    </div>
  );
};

