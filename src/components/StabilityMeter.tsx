import React from "react";
import { countryPanels, CountryData } from "../data";
import { AlertTriangle, ShieldCheck, HelpCircle, Activity } from "lucide-react";

interface StabilityMeterProps {
  selectedCountry: string;
  selectedYear: number;
}

export const StabilityMeter: React.FC<StabilityMeterProps> = ({
  selectedCountry,
  selectedYear,
}) => {
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
  const accountPenetration = data.layers.layer1.account_ownership;
  const activeUsage = data.layers.layer1.digital_payment_use * 1.5; // active proxy
  const car = data.layers.layer3.capital_adequacy;
  const npl = data.layers.layer3.npl_ratio;
  const itc = data.itc;

  // WIDENING GAP (Account Ownership vs. Active Digital Payments)
  // For Ethiopia, the discrepancy is massive: e.g., 63% vs 21% active payments = 42 pp gap!
  // In our clean data layer, we show account ownership vs digital payment use
  const actualGap = accountPenetration - data.layers.layer1.digital_payment_use;

  // Dynamic Calculation of Abebe et al. Stability Risk Factor
  // 1. Threshold checks: Base threshold is 30.3%. High capital adequacy (>=15%) extends it to 35.1%
  const activeThreshold = car >= 15.0 ? 35.1 : 30.3;
  const hasCrossedThreshold = accountPenetration > activeThreshold;

  // 2. Risk score indexing (0 - 100)
  // Penalize high account ownership if ITC is low, NPL is high, and CAR is low
  let stabilityRisk = 0;
  if (hasCrossedThreshold) {
    const excessInclusion = accountPenetration - activeThreshold;
    const itcPenalty = (10 - itc) * 4; // Max 40 points
    const nplPenalty = npl * 2.5; // Max 25 points if NPL is high
    const carMitigation = car >= 15.0 ? -15 : 10; // CAR mitigate or penalize
    
    stabilityRisk = Math.min(
      98,
      Math.max(10, 30 + excessInclusion * 0.4 + itcPenalty + nplPenalty + carMitigation)
    );
  } else {
    // Under threshold, risk is derived purely from low macro adequacy & high NPLs
    stabilityRisk = Math.min(45, (10 - itc) * 2 + npl * 1.5);
  }

  // Determine Risk Category
  let riskLabel = "Low Risk";
  let riskColor = "bg-emerald-500 text-emerald-800 border-emerald-200";
  let ringColor = "stroke-emerald-500 fill-emerald-50";
  let riskTextCol = "text-emerald-600";
  let icon = <ShieldCheck className="w-5 h-5 text-emerald-600" />;

  if (stabilityRisk >= 75) {
    riskLabel = "CRITICAL LIMIT: PREMATURE LOAD-BEARING";
    riskColor = "bg-rose-50 text-rose-800 border-rose-200 animate-pulse";
    riskTextCol = "text-rose-600 font-bold";
    ringColor = "stroke-rose-600 fill-rose-50";
    icon = <AlertTriangle className="w-5 h-5 text-rose-600" />;
  } else if (stabilityRisk >= 50) {
    riskLabel = "MODERATE-HIGH: STABILITY RISK BUFFER SQUEEZE";
    riskColor = "bg-amber-50 text-amber-800 border-amber-200";
    riskTextCol = "text-amber-600 font-semibold";
    ringColor = "stroke-amber-500 fill-amber-50";
    icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
  } else if (stabilityRisk >= 30) {
    riskLabel = "MONITORED TRANSITIONAL BUFFER";
    riskColor = "bg-blue-50 text-blue-800 border-blue-200";
    riskTextCol = "text-blue-600";
    ringColor = "stroke-blue-500 fill-blue-50";
    icon = <Activity className="w-5 h-5 text-blue-600" />;
  }

  // SVG Gauge calculations
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stabilityRisk / 100) * circumference;

  return (
    <div id="stability-risk-card" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Module C: Stability Risk Meter
            </h2>
            <p className="text-xs text-slate-500">
              Abebe et al. (2024) Premature Load-Bearing Risk Tracker
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600">
            Lim: {activeThreshold}%
          </div>
        </div>

        {/* Visual Panel: SVG Gauge and Category Indicator */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-5">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-200 fill-none"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className={`fill-none transition-all duration-500 ease-out ${ringColor}`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono tracking-tight text-slate-800">
                {stabilityRisk.toFixed(0)}%
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold leading-tight">
                Risk Int.
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${riskColor}`}>
              {icon}
              {riskLabel}
            </div>
            
            {hasCrossedThreshold ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                Penetration <span className="font-semibold font-mono">({accountPenetration}%)</span> has crossed the regulatory warning barrier of <span className="font-semibold font-mono">{activeThreshold}%</span>. Low institutional capacity buffers <span className="font-semibold font-mono">({itc.toFixed(2)})</span> trigger stability signals.
              </p>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Penetration <span className="font-semibold font-mono">({accountPenetration}%)</span> resides safely below the warning frontier. Supervisory capacity is adequate for the current inclusion velocity.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* ACCESS VS USAGE VELOCITY SPREAD */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase mb-2">
            <span>The Access–Usage Spread</span>
            <span className="font-mono text-slate-800 font-bold text-xs bg-slate-200/60 px-2 py-0.5 rounded">
              Gap: {actualGap.toFixed(1)} pp
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-3.5 leading-relaxed">
            The gap between nominal accounts (access) and active digital transaction use (usage). Widening spreads reveal surface-level bubble registration without credit translation.
          </p>

          <div className="space-y-3.5">
            {/* ProgressBar 1: Nominal Accounts */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-600 font-semibold mb-1">
                <span>1. Nominal Account Ownership (Access)</span>
                <span className="font-mono">{accountPenetration.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${accountPenetration}%` }}
                />
              </div>
            </div>

            {/* ProgressBar 2: Digital Payment Use */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-600 font-semibold mb-1">
                <span>2. Digital Payment Use (Active Usage)</span>
                <span className="font-mono">{data.layers.layer1.digital_payment_use.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${data.layers.layer1.digital_payment_use}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* METRICS METERS */}
        <div id="stability-variables" className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg">
            <span className="text-[9px] text-slate-400 block font-bold uppercase">Capital Adequacy (CAR)</span>
            <span className={`text-xs font-bold font-mono ${car < 15.0 ? "text-amber-500" : "text-emerald-500"}`}>
              {car.toFixed(1)}%
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg">
            <span className="text-[9px] text-slate-400 block font-bold uppercase">Non-Performing Loans (NPL)</span>
            <span className={`text-xs font-bold font-mono ${npl > 8.0 ? "text-rose-500 font-bold" : "text-emerald-500"}`}>
              {npl.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
