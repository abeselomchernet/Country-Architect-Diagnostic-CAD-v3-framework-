import React, { useState, useEffect } from "react";
import { countryPanels, CountryData } from "../data";

interface ArchetypeMatrixProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const HISTORICAL_YEARS = [2011, 2014, 2017, 2021, 2024, 2025];

export const ArchetypeMatrix: React.FC<ArchetypeMatrixProps> = ({
  selectedYear,
  setSelectedYear,
  selectedCountry,
  setSelectedCountry,
}) => {
  const [showTrails, setShowTrails] = useState(true);

  // Get nearest index or interpolate
  const getNearestData = (country: string, targetYear: number): CountryData => {
    const records = countryPanels.filter((r) => r.country === country);
    // Find closest by year
    return records.reduce((prev, curr) => {
      return Math.abs(curr.year - targetYear) < Math.abs(prev.year - targetYear)
        ? curr
        : prev;
    });
  };

  // Convert scores (0-10) to percentage of SVG grid (padding left: 10%, right: 10%, top: 10%, bottom: 10%)
  const getCoordinates = (gsv: number, itc: number) => {
    const padding = 60;
    const width = 500;
    const height = 400;

    // X-axis: gsv: 0 -> 10 maps to padding -> width - padding
    const x = padding + (gsv / 10) * (width - 2 * padding);
    // Y-axis: itc: 0 -> 10 maps to height - padding -> padding (inverted chart coords)
    const y = height - padding - (itc / 10) * (height - 2 * padding);

    return { x, y };
  };

  const countries = ["Ethiopia", "Kenya", "Rwanda", "Sierra Leone"];

  // Colors for each country
  const countryColors: Record<string, { fill: string; border: string; bg: string }> = {
    Ethiopia: { fill: "#f59e0b", border: "#d97706", bg: "bg-amber-50" }, // Amber
    Kenya: { fill: "#10b981", border: "#059669", bg: "bg-emerald-50" }, // Emerald
    Rwanda: { fill: "#3b82f6", border: "#2563eb", bg: "bg-blue-50" }, // Blue
    "Sierra Leone": { fill: "#8b5cf6", border: "#7c3aed", bg: "bg-purple-50" }, // Purple
  };

  // Get active country details for the selected year
  const activeDetail = selectedCountry
    ? getNearestData(selectedCountry, selectedYear)
    : null;

  return (
    <div id="archetype-matrix-card" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Module A: GSV–ITC Archetype Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Demand System Viability (X) vs. Institutional Capacity (Y)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={showTrails}
              onChange={(e) => setShowTrails(e.target.checked)}
              className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
            />
            Show Historical Trails
          </label>
        </div>
      </div>

      {/* SVG Scatter Plot Container */}
      <div className="relative w-full aspect-[5/4] border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50">
        <svg viewBox="0 0 500 400" className="w-full h-full select-none">
          {/* Quadrant Fills */}
          {/* Top Right: Mature (GSV >= 4.0, ITC >= 3.0) */}
          <rect
            x={getCoordinates(4.0, 10).x}
            y={getCoordinates(10, 10).y}
            width={getCoordinates(10, 10).x - getCoordinates(4.0, 10).x}
            height={getCoordinates(10, 3.0).y - getCoordinates(10, 10).y}
            fill="#f0fdf4"
            opacity="0.8"
          />
          {/* Bottom Right: Premature Load-bearing (GSV >= 4.0, ITC < 3.0) */}
          <rect
            x={getCoordinates(4.0, 10).x}
            y={getCoordinates(10, 3.0).y}
            width={getCoordinates(10, 10).x - getCoordinates(4.0, 10).x}
            height={getCoordinates(10, 0).y - getCoordinates(10, 3.0).y}
            fill="#fffbeb"
            opacity="0.8"
          />
          {/* Top Left: Institutional Readiness (GSV < 4.0, ITC >= 3.0) */}
          <rect
            x={getCoordinates(0, 10).x}
            y={getCoordinates(10, 10).y}
            width={getCoordinates(4.0, 10).x - getCoordinates(0, 10).x}
            height={getCoordinates(10, 3.0).y - getCoordinates(10, 10).y}
            fill="#eff6ff"
            opacity="0.7"
          />
          {/* Bottom Left: Catalytic-Dependent (GSV < 4.0, ITC < 3.0) */}
          <rect
            x={getCoordinates(0, 10).x}
            y={getCoordinates(10, 3.0).y}
            width={getCoordinates(4.0, 10).x - getCoordinates(0, 10).x}
            height={getCoordinates(10, 0).y - getCoordinates(10, 3.0).y}
            fill="#f8fafc"
            opacity="0.8"
          />

          {/* Grid Division Lines */}
          <line
            x1={getCoordinates(4.0, 0).x}
            y1={getCoordinates(4.0, 10).y}
            x2={getCoordinates(4.0, 0).x}
            y2={getCoordinates(4.0, 0).y}
            stroke="#cbd5e1"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <line
            x1={getCoordinates(0, 3.0).x}
            y1={getCoordinates(4.0, 3.0).y}
            x2={getCoordinates(10, 3.0).x}
            y2={getCoordinates(4.0, 3.0).y}
            stroke="#cbd5e1"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />

          {/* Quadrant Labels */}
          <text x="320" y="50" fill="#15803d" className="text-[10px] font-medium tracking-wide">
            MATURE & HIGH EXECUTION
          </text>
          <text x="320" y="58" fill="#16a34a" className="text-[8px] opacity-70">
            Rwanda & Kenya (Aligned buffers)
          </text>

          <text x="320" y="345" fill="#b45309" className="text-[10px] font-medium tracking-wide">
            PREMATURE LOAD-BEARING
          </text>
          <text x="320" y="353" fill="#d97706" className="text-[8px] opacity-70">
            Ethiopia (Usage gaps & default risk)
          </text>

          <text x="80" y="50" fill="#1d4ed8" className="text-[10px] font-medium tracking-wide">
            INSTITUTIONAL READINESS
          </text>
          <text x="80" y="58" fill="#2563eb" className="text-[8px] opacity-70">
            Supervisory buffers ahead of retail
          </text>

          <text x="80" y="345" fill="#475569" className="text-[10px] font-medium tracking-wide">
            CATALYTIC-DEPENDENT / FRAGILE
          </text>
          <text x="80" y="353" fill="#64748b" className="text-[8px] opacity-70">
            Sierra Leone (Project-funded rails)
          </text>

          {/* Axes */}
          <line
            x1="60"
            y1="340"
            x2="440"
            y2="340"
            stroke="#475569"
            strokeWidth="1.5"
          />
          <line
            x1="60"
            y1="60"
            x2="60"
            y2="340"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text x="250" y="380" textAnchor="middle" className="text-xs font-semibold fill-slate-700">
            Grassroots System Viability (GSV) →
          </text>
          <text
            x="24"
            y="200"
            textAnchor="middle"
            transform="rotate(-90 24 200)"
            className="text-xs font-semibold fill-slate-700"
          >
            Institutional Translation Capacity (ITC) →
          </text>

          {/* Axis Scale ticks */}
          {[0, 2, 4, 6, 8, 10].map((t) => {
            const pos = getCoordinates(t, t);
            return (
              <React.Fragment key={t}>
                {/* X axis tick */}
                <line x1={pos.x} y1="340" x2={pos.x} y2="345" stroke="#475569" strokeWidth="1.5" />
                <text x={pos.x} y="360" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">
                  {t}
                </text>
                {/* Y axis tick */}
                <line x1="55" y1={pos.y} x2="60" y2={pos.y} stroke="#475569" strokeWidth="1.5" />
                <text x="45" y={pos.y + 3} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">
                  {t}
                </text>
              </React.Fragment>
            );
          })}

          {/* Draw Trails */}
          {showTrails &&
            countries.map((c) => {
              const records = countryPanels
                .filter((r) => r.country === c)
                .sort((a, b) => a.year - b.year);
              const points = records.map((r) => getCoordinates(r.gsv, r.itc));

              // Create polyline path string
              let pathStr = "";
              points.forEach((p, idx) => {
                pathStr += `${idx === 0 ? "M" : "L"} ${p.x} ${p.y} `;
              });

              return (
                <g key={`trail-${c}`} className="opacity-40">
                  <path
                    d={pathStr}
                    fill="none"
                    stroke={countryColors[c].fill}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  {points.map((p, idx) => (
                    <circle
                      key={`trail-dot-${c}-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r="2.5"
                      fill={countryColors[c].fill}
                      className="cursor-pointer"
                      title={`${c} ${records[idx].year}`}
                      onClick={() => {
                        setSelectedCountry(c);
                        setSelectedYear(records[idx].year);
                      }}
                    />
                  ))}
                </g>
              );
            })}

          {/* Draw Active Country Bubbles */}
          {countries.map((c) => {
            const data = getNearestData(c, selectedYear);
            const pos = getCoordinates(data.gsv, data.itc);
            const isSelected = selectedCountry === c;
            const colors = countryColors[c];

            return (
              <g
                key={`bubble-${c}`}
                className="transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => setSelectedCountry(c)}
              >
                {/* Glow representation if active */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="15"
                    fill={colors.fill}
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}
                {/* Main bubble */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? "9" : "7"}
                  fill={colors.fill}
                  stroke={isSelected ? "#1e293b" : colors.border}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  className="hover:scale-125 transition-transform duration-200"
                />
                {/* Label text */}
                <text
                  x={pos.x}
                  y={pos.y - 12}
                  textAnchor="middle"
                  className={`text-[9px] font-bold ${
                    isSelected ? "fill-slate-900" : "fill-slate-600 opacity-80"
                  }`}
                >
                  {c}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating absolute year indicator */}
        <div className="absolute top-3 right-3 bg-slate-900/95 text-white font-mono font-bold text-sm px-2.5 py-1 rounded-md shadow-md border border-slate-700">
          Year: {selectedYear}
        </div>
      </div>

      {/* Slider Controls */}
      <div className="mt-5 space-y-4">
        <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>Move baseline slider to track transmission:</span>
          <span className="font-semibold text-slate-700">Baseline Year: {selectedYear}</span>
        </div>
        <div className="relative">
          <input
            id="year-timeline-slider"
            type="range"
            min="2011"
            max="2025"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full accent-slate-700 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
          {/* Custom tick dots for main years */}
          <div className="flex justify-between px-1.5 mt-1">
            {HISTORICAL_YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`text-[10px] font-mono font-semibold transition-colors ${
                  selectedYear === y
                    ? "text-slate-900 font-bold"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Country Diagnostic Alert Box */}
        {activeDetail && (
          <div className={`mt-4 p-4 rounded-lg border leading-relaxed ${countryColors[selectedCountry].bg} border-slate-200 transition-all duration-300`}>
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {selectedCountry} — {selectedYear} Diagnostic Summary
              </span>
              <span className="text-[10px] font-bold bg-slate-800 text-white font-mono px-1.5 py-0.5 rounded">
                Score: {activeDetail.composite.toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Archetype Class</span>
                <span className="text-xs font-semibold text-slate-800 font-sans">
                  {activeDetail.archetype}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">GSV Score</span>
                <span className="text-xs font-mono font-semibold text-slate-800">
                  {activeDetail.gsv.toFixed(2)}/10
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">ITC Score</span>
                <span className="text-xs font-mono font-semibold text-slate-800">
                  {activeDetail.itc.toFixed(2)}/10
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2 italic font-serif">
              "{activeDetail.description}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
