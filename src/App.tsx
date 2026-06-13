import { useState } from "react";
import { countryPanels } from "./data";
import { ArchetypeMatrix } from "./components/ArchetypeMatrix";
import { TransmissionChain } from "./components/TransmissionChain";
import { StabilityMeter } from "./components/StabilityMeter";
import { DiagnosticRadar } from "./components/DiagnosticRadar";
import { PolicyCopilot } from "./components/PolicyCopilot";
import { Shield, BookOpen, Download, Printer, Database } from "lucide-react";
import { useAuth } from "./hooks/useAuth.ts";
import { SavedScenarios } from "./components/SavedScenarios.tsx";

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>("Ethiopia");
  const [selectedYear, setSelectedYear] = useState<number>(2021);

  const { user, token, loginWithGoogle, logout } = useAuth();

  const handleLoadScenario = (country: string, year: number) => {
    setSelectedCountry(country);
    setSelectedYear(year);
  };

  // Get active country's 2021 scores
  const getCountry2021Rec = (country: string) => {
    return countryPanels.find((r) => r.country === country && r.year === 2021)!;
  };

  const activeRecord = countryPanels.find(
    (r) => r.country === selectedCountry && r.year === selectedYear
  ) || getCountry2021Rec(selectedCountry);

  const countries = ["Ethiopia", "Kenya", "Rwanda", "Sierra Leone"];

  // CSV Export Engine
  const exportToCSV = () => {
    const countryRecords = countryPanels.filter((r) => r.country === selectedCountry);
    
    const headers = [
      "Country", "Year", "Archetype", "GSV Score", "ITC Score", "Composite Score",
      "Account Ownership (%)", "Mobile Money Ownership (%)", "Digital Payment Use (%)", "Formal Savings (%)",
      "Firms with Bank Loan (%)", "Access to Finance Obstacles (%)", "Credit Constraints (%)", "Informality Rate (%)",
      "Capital Adequacy Ratio (%)", "NPL Ratio (%)", "Bureau Coverage (%)", "Payment Interoperability", "Banking Assets (% GDP)",
      "Mobile Coverage (%)", "Internet Penetration (%)", "Electricity Access (%)", "Digital ID Use (%)",
      "SME Lending (% GDP)", "Active Account Use Rate (%)", "Cashless Transactions (% GDP)"
    ];
    
    const rows = countryRecords.map(r => [
      r.country,
      r.year,
      r.archetype,
      r.gsv,
      r.itc,
      r.composite,
      r.layers.layer1.account_ownership,
      r.layers.layer1.mobile_money_ownership,
      r.layers.layer1.digital_payment_use,
      r.layers.layer1.formal_savings,
      r.layers.layer2.firms_with_bank_loan,
      r.layers.layer2.access_to_finance_obstacles,
      r.layers.layer2.credit_constraints,
      r.layers.layer2.informality_rate,
      r.layers.layer3.capital_adequacy,
      r.layers.layer3.npl_ratio,
      r.layers.layer3.credit_bureau_coverage,
      r.layers.layer3.payment_interoperability ? "Yes" : "No",
      r.layers.layer3.banking_assets_gdp,
      r.layers.layer4.mobile_coverage,
      r.layers.layer4.internet_penetration,
      r.layers.layer4.electricity_access,
      r.layers.layer4.digital_id_use,
      r.layers.layer6.sme_lending_gdp,
      r.layers.layer6.active_account_use_rate,
      r.layers.layer6.cashless_transactions_gdp
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedCountry}_CAD_v3_Macro_Metrics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      {/* Premium Dashboard Header - HIDDEN ON PRINT */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white p-1.5 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-400 fill-indigo-400" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                CAD v3 Policy Architect Explorer
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Intelligent Macroeconomic Policy Simulation and Construct-Validation Diagnostic Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto flex-wrap">
            {/* Bidirectional Pills for Country Selection */}
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    selectedCountry === c
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Google Authentication Control */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              {user ? (
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full border border-slate-200"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center justify-center">
                      {(user.email || "P").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold text-slate-800 leading-none">
                      {user.displayName || "Authorized Client"}
                    </p>
                    <button
                      onClick={logout}
                      className="text-[9px] hover:underline text-rose-600 block hover:text-rose-800 leading-none mt-1 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-[11px] px-3  py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm hover:shadow-xs cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  Connect DB
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content - HIDDEN ON PRINT */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-6 print:hidden">
        
        {/* ROW 1: Modules A and C (The Matrix Scatter Plot & The Risk Meter) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-1 lg:col-span-7">
            <ArchetypeMatrix
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          </div>
          <div className="col-span-1 lg:col-span-5">
            <StabilityMeter
              selectedCountry={selectedCountry}
              selectedYear={selectedYear}
            />
          </div>
        </div>

        {/* ROW 2: Modules D and B (Diagnostic radar & Transmission timelines) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-1 lg:col-span-7">
            <DiagnosticRadar
              selectedCountry={selectedCountry}
              selectedYear={selectedYear}
            />
          </div>
          <div className="col-span-1 lg:col-span-5">
            <TransmissionChain
              selectedCountry={selectedCountry}
              selectedYear={selectedYear}
            />
          </div>
        </div>

        {/* ROW 3: Module E and 2021 Baseline Report Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-1 lg:col-span-7">
            <PolicyCopilot
              selectedCountry={selectedCountry}
              selectedYear={selectedYear}
            />
          </div>

          {/* Frozen 2021 expert findings brief & Saved Scenarios Ledger Stack */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            {/* Card 1: 2021 Frozen Baseline Report */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[440px] h-auto">
              <div>
                <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-700" />
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        2021 Frozen Baseline Report
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        CAD v3 Val-Construct calculations & metrics
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={exportToCSV}
                      title="Export country multi-year metrics to CSV file"
                      className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-indigo-600" />
                      CSV
                    </button>
                    <button
                      onClick={() => window.print()}
                      title="Export print-ready PDF summary docket"
                      className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 border border-indigo-200 text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      <Printer className="w-3 h-3 text-indigo-600" />
                      Print PDF
                    </button>
                  </div>
                </div>

                {/* Verified baseline statistics table */}
                <div className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50 mb-4">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Country Code</th>
                        <th className="px-3 py-2 text-center">GSV</th>
                        <th className="px-3 py-2 text-center">ITC</th>
                        <th className="px-3 py-2 text-right">Composite (Avg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium font-mono">
                      <tr className={selectedCountry === "Ethiopia" ? "bg-amber-50/50 font-bold" : ""}>
                        <td className="px-3 py-2 text-slate-900 font-semibold font-sans">Ethiopia</td>
                        <td className="px-3 py-2 text-center">4.6</td>
                        <td className="px-3 py-2 text-center">2.1</td>
                        <td className="px-3 py-2 text-right text-indigo-650">3.35</td>
                      </tr>
                      <tr className={selectedCountry === "Kenya" ? "bg-emerald-50/50 font-bold" : ""}>
                        <td className="px-3 py-2 text-slate-900 font-semibold font-sans">Kenya</td>
                        <td className="px-3 py-2 text-center">4.8</td>
                        <td className="px-3 py-2 text-center">4.5</td>
                        <td className="px-3 py-2 text-right text-indigo-650">4.65</td>
                      </tr>
                      <tr className={selectedCountry === "Rwanda" ? "bg-blue-50/50 font-bold" : ""}>
                        <td className="px-3 py-2 text-slate-900 font-semibold font-sans">Rwanda</td>
                        <td className="px-3 py-2 text-center">4.7</td>
                        <td className="px-3 py-2 text-center">4.8</td>
                        <td className="px-3 py-2 text-right text-indigo-650">4.75</td>
                      </tr>
                      <tr className={selectedCountry === "Sierra Leone" ? "bg-purple-50/50" : ""}>
                        <td className="px-3 py-2 text-slate-900 font-semibold font-sans">Sierra Leone</td>
                        <td className="px-3 py-2 text-center">3.9</td>
                        <td className="px-3 py-2 text-center">2.4</td>
                        <td className="px-3 py-2 text-right text-indigo-650">3.15</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Rules description */}
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Normalisation Rules
                    </span>
                    <ul className="text-[11px] text-slate-650 space-y-1 pl-4 list-disc font-sans leading-tight">
                      <li>Positive indicators: <code className="font-mono bg-slate-200/50 px-1 rounded text-[9.5px]">Value / 10</code></li>
                      <li>Inverse indicators: <code className="font-mono bg-slate-200/50 px-1 rounded text-[9.5px]">(100 - Value) / 10</code> (e.g. NPL, constraints)</li>
                      <li>Binary switches: <code className="font-mono bg-slate-200/50 px-1 rounded text-[9.5px]">Yes = 10, No = 0</code></li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block mb-0.5">
                      GSV Momentum Analysis (Ethiopia)
                    </span>
                    <p className="text-[10px] text-slate-700">
                      The single most significant policy event explaining Ethiopia's GSV momentum leading up to 2021 was the **NBE permitting licensing of non-bank telecom mobile money in 2020** (Directive ON補助/01/2020). This broke the state monopoly, giving rise to **Telebirr** and triggering an explosive surge in nominal accounts registration up to 43.5% (2021) and 63.0% (2024).
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2 mt-4 text-[9px] text-slate-400 italic font-mono text-center">
                Replication: CAD Validation Package • Chernet, June 2026
              </div>
            </div>

            {/* Card 2: Cloud SQL Policy Sandbox Saved Scenarios */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px]">
              <SavedScenarios
                user={user}
                token={token}
                activeCountry={selectedCountry}
                activeYear={selectedYear}
                activeGsv={activeRecord?.gsv || 0}
                activeItc={activeRecord?.itc || 0}
                onLoadScenario={handleLoadScenario}
              />
            </div>
          </div>
        </div>
        
      </main>

      {/* PRINT-ONLY EXECUTIVE DOSSIER FOR PDF GENERATION */}
      <div className="hidden print:block p-10 bg-white text-slate-950 font-sans max-w-4xl mx-auto leading-relaxed">
        <div className="border-b-4 border-slate-900 pb-5 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-slate-900">
              CAD v3 Country Diagnostics Docket
            </h1>
            <p className="text-xs font-semibold text-slate-550 uppercase tracking-wide">
              Official Assessment • {selectedCountry} ({selectedYear})
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-450">
            <div>Replication ID: CAD-v3-{selectedCountry.slice(0, 3).toUpperCase()}</div>
            <div>Date Generated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Executive summary card */}
        <div className="p-5 bg-slate-50 border border-slate-300 rounded-lg mb-6">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">Executive Overview</h2>
          <p className="text-xs text-slate-700 leading-relaxed mb-4">
            {activeRecord?.description || "Assessment of financial framework velocity and regulatory buffer adequacy."}
          </p>
          <div className="grid grid-cols-4 gap-4 mt-3">
            <div className="p-3 bg-white border border-slate-200 rounded text-center shadow-xs">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Framework Archetype</span>
              <span className="text-xs font-bold text-slate-800">{activeRecord?.archetype}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded text-center shadow-xs">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">GSV Score (Demand)</span>
              <span className="text-sm font-extrabold text-slate-900">{activeRecord?.gsv.toFixed(1)} / 10</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded text-center shadow-xs">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">ITC Score (Supply)</span>
              <span className="text-sm font-extrabold text-slate-900">{activeRecord?.itc.toFixed(1)} / 10</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded text-center shadow-xs">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Composite Index</span>
              <span className="text-sm font-extrabold text-indigo-700">{activeRecord?.composite.toFixed(2)} / 10</span>
            </div>
          </div>
        </div>

        {/* Detailed Layers Grid */}
        <div className="mb-6">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 pb-1 border-b-2 border-slate-300">Layered Indicator Breakdown</h2>
          <table className="w-full text-left text-[11px] border border-slate-300 divide-y divide-slate-300">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 border-r border-slate-300">Database Layer</th>
                <th className="px-4 py-2 border-r border-slate-300">Indicator Metric</th>
                <th className="px-4 py-2 text-right">Raw Obs.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {/* Layer 1 */}
              <tr>
                <td rowSpan={4} className="px-3 py-3 font-semibold border-r border-slate-300 bg-slate-50/50">Layer 1 (Demand / hh)</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Nominal Account Ownership</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer1.account_ownership.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Mobile Wallet Ownership</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer1.mobile_money_ownership.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Digital Retail Payment Use</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer1.digital_payment_use.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Formal Savings Rate</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer1.formal_savings.toFixed(1)}%</td>
              </tr>
              
              {/* Layer 2 */}
              <tr>
                <td rowSpan={4} className="px-3 py-3 font-semibold border-r border-slate-300 bg-slate-50/50">Layer 2 (Firm / SME obstacles)</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Firms with Bank Credit</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer2.firms_with_bank_loan.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Financial Obstacles Scale</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer2.access_to_finance_obstacles.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Credit Constraints Obstacle</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer2.credit_constraints.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Informality Ratio</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer2.informality_rate.toFixed(1)}%</td>
              </tr>

              {/* Layer 3 */}
              <tr>
                <td rowSpan={5} className="px-3 py-3 font-semibold border-r border-slate-300 bg-slate-50/50">Layer 3 (Institutional Regulatory)</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Capital Adequacy Ratio (CAR)</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer3.capital_adequacy.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Non-Performing Loans Ratio (NPL)</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer3.npl_ratio.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Bureau Registry Coverage</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer3.credit_bureau_coverage.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Real-time Interoperability</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer3.payment_interoperability ? "ACTIVE (10.0)" : "INACTIVE (0.0)"}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Banking Assets Ratio (% of GDP)</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer3.banking_assets_gdp.toFixed(1)}%</td>
              </tr>

              {/* Layer 4 */}
              <tr>
                <td rowSpan={4} className="px-3 py-3 font-semibold border-r border-slate-300 bg-slate-50/50">Layer 4 (Infrastructure)</td>
                <td className="px-3 py-1.5 border-r border-slate-200">Cellular Tower Location Reach</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer4.mobile_coverage.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Household Internet Penetration</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer4.internet_penetration.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Stable Grid Power Supply Reach</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer4.electricity_access.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">National ID Registry Penetration</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer4.digital_id_use.toFixed(1)}%</td>
              </tr>

              {/* Layer 6 */}
              <tr>
                <td rowSpan={3} className="px-3 py-3 font-semibold border-r border-slate-300 bg-slate-50/50">Layer 6 (Downstream Outcomes)</td>
                <td className="px-3 py-1.5 border-r border-slate-200">SME Productive Credit (% of GDP)</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer6.sme_lending_gdp.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Active vs Nominal Usage Ratio</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer6.active_account_use_rate.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-r border-slate-200">Cashless Turnover Ratio (% of GDP)</td>
                <td className="px-3 py-1.5 text-right font-mono">{activeRecord?.layers.layer6.cashless_transactions_gdp.toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Diagnostic Spreads & Abebe et al. Factors */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 border border-slate-300 rounded-lg bg-slate-50">
            <h3 className="text-xs font-bold text-slate-800 uppercase mb-2">Access-Usage Velocity Gap</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              For {selectedCountry} in {selectedYear}, the gap between nominal account registration ({activeRecord?.layers.layer1.account_ownership}%) and active digital payment usage ({activeRecord?.layers.layer1.digital_payment_use}%) represents a spread of <span className="font-bold">{(activeRecord ? activeRecord.layers.layer1.account_ownership - activeRecord.layers.layer1.digital_payment_use : 0).toFixed(1)} percentage points</span>. Extremely high gaps indicate premature load-bearing risk.
            </p>
          </div>
          <div className="p-4 border border-slate-300 rounded-lg bg-slate-50">
            <h3 className="text-xs font-bold text-slate-800 uppercase mb-2">Abebe et al. Premature Thresholds</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Supervisory Warning Buffer: {activeRecord ? (activeRecord.layers.layer1.account_ownership > (activeRecord.layers.layer3.capital_adequacy >= 15.0 ? 35.1 : 30.3) ? "CRITICALLY EXCEEDED. Retail registration velocity exceeds supervisory and structural clearing capacity buffer thresholds." : "SAFE ZONE. Nominal velocity resides within adequate regulatory supervisory limits.") : ""}
            </p>
          </div>
        </div>

        {/* Footer info for verification */}
        <div className="text-center text-[10px] text-slate-405 border-t border-slate-300 pt-4 mt-8 italic">
          This assessment represents official replication data for CAD Validation Research Working Protocol v3.0.<br />
          Author: Abeselom Chernet, June 2026. Aligned with National regulatory panels.
        </div>
      </div>
    </div>
  );
}
