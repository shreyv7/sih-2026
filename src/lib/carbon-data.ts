/**
 * Single coherent synthetic demo dataset for the Carbon Autopilot prototype.
 * All values are modeled/demo values — not live campus data.
 */

export type Confidence = "High" | "Medium" | "Low";

export type Building = {
  id: string;
  name: string;
  type: "Academic" | "Hostel" | "Healthcare" | "Utility" | "Sports";
  energyMWh: number;
  tco2e: number;
  trendPct: number;
  coverage: number;
  status: "Needs attention" | "On track" | "Moderate confidence";
  intensity: number; // 0..1 relative emissions intensity
  breakdown: { hvac: number; lighting: number; plug: number };
  sources: string[];
  anomalies: string[];
  nextAction: string;
};

export const buildings: Building[] = [
  {
    id: "hostel-c",
    name: "Hostel Block C",
    type: "Hostel",
    energyMWh: 182,
    tco2e: 96,
    trendPct: 12,
    coverage: 92,
    status: "Needs attention",
    intensity: 0.94,
    breakdown: { hvac: 58, lighting: 17, plug: 25 },
    sources: ["Main meter history", "Occupancy schedule", "Baseline model"],
    anomalies: ["Night HVAC load 41% above expected (01:00–05:00)"],
    nextAction: "Shift overnight HVAC start-up by 90 minutes",
  },
  {
    id: "academic-a",
    name: "Academic Block A",
    type: "Academic",
    energyMWh: 241,
    tco2e: 118,
    trendPct: -6,
    coverage: 98,
    status: "On track",
    intensity: 0.72,
    breakdown: { hvac: 49, lighting: 24, plug: 27 },
    sources: ["Sub-meter feed", "Timetable schedule", "Baseline model"],
    anomalies: ["Weekend baseload 18% above expected"],
    nextAction: "Enable weekend setback on AHU-2 and AHU-4",
  },
  {
    id: "academic-b",
    name: "Academic Block B",
    type: "Academic",
    energyMWh: 196,
    tco2e: 91,
    trendPct: -3,
    coverage: 94,
    status: "On track",
    intensity: 0.61,
    breakdown: { hvac: 46, lighting: 26, plug: 28 },
    sources: ["Sub-meter feed", "Baseline model"],
    anomalies: [],
    nextAction: "Continue monitoring · no action required",
  },
  {
    id: "hostel-d",
    name: "Hostel Block D",
    type: "Hostel",
    energyMWh: 158,
    tco2e: 78,
    trendPct: 4,
    coverage: 88,
    status: "Moderate confidence",
    intensity: 0.66,
    breakdown: { hvac: 54, lighting: 19, plug: 27 },
    sources: ["Main meter history", "Estimated plug load"],
    anomalies: ["Water heating overlap with peak grid intensity"],
    nextAction: "Move water heating to low-intensity window",
  },
  {
    id: "library",
    name: "Library",
    type: "Academic",
    energyMWh: 134,
    tco2e: 61,
    trendPct: -4,
    coverage: 76,
    status: "Moderate confidence",
    intensity: 0.48,
    breakdown: { hvac: 51, lighting: 29, plug: 20 },
    sources: ["Main meter history", "Estimated lighting split"],
    anomalies: [],
    nextAction: "LED retrofit on reading floors 2–4",
  },
  {
    id: "hospital",
    name: "Hospital",
    type: "Healthcare",
    energyMWh: 388,
    tco2e: 191,
    trendPct: 2,
    coverage: 96,
    status: "On track",
    intensity: 0.88,
    breakdown: { hvac: 62, lighting: 14, plug: 24 },
    sources: ["Sub-meter feed", "Baseline model"],
    anomalies: [],
    nextAction: "Chiller sequencing review (scheduled)",
  },
  {
    id: "utility-plant",
    name: "Utility Plant",
    type: "Utility",
    energyMWh: 302,
    tco2e: 164,
    trendPct: 7,
    coverage: 90,
    status: "Needs attention",
    intensity: 1,
    breakdown: { hvac: 71, lighting: 8, plug: 21 },
    sources: ["Plant SCADA export", "Grid intensity feed", "Baseline model"],
    anomalies: ["High-carbon operating window detected (18:00–21:00)"],
    nextAction: "Shift chiller pre-cooling out of peak intensity window",
  },
  {
    id: "sports",
    name: "Sports Complex",
    type: "Sports",
    energyMWh: 87,
    tco2e: 41,
    trendPct: -9,
    coverage: 71,
    status: "Moderate confidence",
    intensity: 0.34,
    breakdown: { hvac: 33, lighting: 44, plug: 23 },
    sources: ["Main meter history", "Estimated lighting split"],
    anomalies: [],
    nextAction: "Floodlight scheduling review",
  },
];

export const kpis = {
  monthlyEmissions: 1284,
  monthlyDeltaPct: -8.4,
  verifiedSavings: 186,
  verifiedDeltaPct: 24,
  activeAnomalies: 4,
  highPriorityAnomalies: 2,
  actionsInProgress: 7,
};

export type Alert = {
  id: string;
  buildingId: string;
  building: string;
  headline: string;
  cause: string;
  impact: string;
  confidence: Confidence;
  severity: "high" | "medium";
  evidence: { label: string; value: string }[];
  recommendation: string;
};

export const alerts: Alert[] = [
  {
    id: "a1",
    buildingId: "hostel-c",
    building: "Hostel Block C",
    headline: "Night HVAC load 41% above expected",
    cause: "Low overnight occupancy + unchanged HVAC schedule",
    impact: "~38 tCO₂e/year",
    confidence: "High",
    severity: "high",
    evidence: [
      { label: "Occupancy", value: "Low (12% of design)" },
      { label: "Weather", value: "Within normal range" },
      { label: "HVAC load", value: "+46% vs baseline" },
      { label: "Overnight baseline", value: "Exceeded 6 of last 7 nights" },
    ],
    recommendation: "Shift the overnight HVAC schedule by 90 minutes",
  },
  {
    id: "a2",
    buildingId: "academic-a",
    building: "Academic Block A",
    headline: "Weekend baseload anomaly",
    cause: "AHU-2 and AHU-4 running without weekend setback",
    impact: "~19 tCO₂e/year",
    confidence: "Medium",
    severity: "high",
    evidence: [
      { label: "Occupancy", value: "Near zero (Sat–Sun)" },
      { label: "Baseload", value: "+18% vs expected" },
      { label: "Coverage", value: "98% metered" },
    ],
    recommendation: "Apply weekend setback schedule to AHU-2 / AHU-4",
  },
  {
    id: "a3",
    buildingId: "utility-plant",
    building: "Utility Plant",
    headline: "High-carbon operating window detected",
    cause: "Chiller pre-cooling overlaps the highest grid-intensity hours",
    impact: "~24 tCO₂e/year",
    confidence: "Medium",
    severity: "medium",
    evidence: [
      { label: "Grid intensity", value: "Peak 18:00–21:00" },
      { label: "Plant load", value: "72% of daily total in window" },
      { label: "Thermal storage", value: "Available capacity 31%" },
    ],
    recommendation: "Shift pre-cooling to the 02:00–05:00 low-intensity window",
  },
];

export type Intervention = {
  id: string;
  name: string;
  building: string;
  costLakh: number; // ₹ lakh
  reductionMin: number;
  reductionMax: number;
  savingLakh: number; // ₹ lakh / year
  payback: string;
  paybackMonths: number;
  confidence: Confidence;
  evidence: string[];
};

export const interventions: Intervention[] = [
  {
    id: "hvac",
    name: "HVAC schedule shift",
    building: "Hostel Block C",
    costLakh: 1.2,
    reductionMin: 38,
    reductionMax: 52,
    savingLakh: 1.6,
    payback: "4 months",
    paybackMonths: 4,
    confidence: "High",
    evidence: ["Meter history", "Occupancy schedule", "Baseline model"],
  },
  {
    id: "led",
    name: "LED retrofit",
    building: "Library · Academic B",
    costLakh: 6.8,
    reductionMin: 54,
    reductionMax: 71,
    savingLakh: 4.4,
    payback: "18 months",
    paybackMonths: 18,
    confidence: "High",
    evidence: ["Lighting inventory", "Estimated run hours"],
  },
  {
    id: "solar",
    name: "Rooftop solar",
    building: "Academic Block A",
    costLakh: 14,
    reductionMin: 92,
    reductionMax: 120,
    savingLakh: 3.4,
    payback: "4.1 years",
    paybackMonths: 49,
    confidence: "Medium",
    evidence: ["Roof area survey", "Modeled generation profile"],
  },
  {
    id: "plug",
    name: "Smart plug rollout",
    building: "Hostel C · Hostel D",
    costLakh: 2.4,
    reductionMin: 21,
    reductionMax: 30,
    savingLakh: 2.05,
    payback: "14 months",
    paybackMonths: 14,
    confidence: "Medium",
    evidence: ["Plug-load estimate", "Vacancy patterns"],
  },
  {
    id: "behavior",
    name: "Behavioral campaign",
    building: "Campus-wide",
    costLakh: 0.4,
    reductionMin: 8,
    reductionMax: 14,
    savingLakh: 1.45,
    payback: "< 3 months",
    paybackMonths: 3,
    confidence: "Low",
    evidence: ["Historical dataset", "Pilot response rate"],
  },
];

/** Deterministic demo series: actual vs expected baseline vs forecast band. */
export function energySeries(
  period: "24h" | "7d" | "30d",
  buildingId: string,
): {
  t: string;
  actual: number | null;
  baseline: number;
  forecast: number | null;
  bandLow: number | null;
  bandHigh: number | null;
  anomaly?: boolean;
}[] {
  const b = buildings.find((x) => x.id === buildingId);
  const scale = b ? b.energyMWh / 1688 : 1;
  const points = period === "24h" ? 24 : period === "7d" ? 7 : 30;
  const cut = Math.round(points * 0.75);

  return Array.from({ length: points }, (_, i) => {
    const phase = period === "24h" ? i : i * 3.1;
    const daily = Math.sin(((phase - 5) / (period === "24h" ? 24 : 12)) * Math.PI * 2);
    const baseRaw = 100 + daily * 26 + ((i * 37) % 11);
    const baseline = round(baseRaw * (scale ? 0.4 + scale * 3.4 : 1));
    const drift = ((i * 53) % 17) - 8;
    const isAnomaly =
      (buildingId === "hostel-c" || buildingId === "all") &&
      ((period === "24h" && (i === 2 || i === 3 || i === 4)) ||
        (period !== "24h" && i === Math.round(points * 0.45)));
    const actualRaw = baseline + drift + (isAnomaly ? baseline * 0.41 : 0);
    const label =
      period === "24h"
        ? `${String(i).padStart(2, "0")}:00`
        : period === "7d"
          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]
          : `D${i + 1}`;

    if (i > cut) {
      const f = round(baseline * 1.02);
      return {
        t: label,
        actual: null,
        baseline,
        forecast: f,
        bandLow: round(f * 0.93),
        bandHigh: round(f * 1.08),
      };
    }
    return {
      t: label,
      actual: round(actualRaw),
      baseline,
      forecast: i === cut ? round(baseline * 1.02) : null,
      bandLow: i === cut ? round(baseline * 0.95) : null,
      bandHigh: i === cut ? round(baseline * 1.05) : null,
      anomaly: isAnomaly,
    };
  });
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}

/** Baseline vs simulated emissions for the Action Lab what-if chart. */
export function whatIfSeries(annualReduction: number) {
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const monthly = annualReduction / 12;
  return months.map((m, i) => {
    const baseline = 108 + Math.sin((i / 12) * Math.PI * 2) * 9 + ((i * 29) % 5);
    const ramp = Math.min(1, i / 4);
    return {
      t: m,
      baseline: Math.round(baseline * 10) / 10,
      simulated: Math.round((baseline - monthly * ramp) * 10) / 10,
    };
  });
}

export type LedgerEntry = {
  id: string;
  date: string;
  building: string;
  intervention: string;
  predicted: number;
  verified: number;
  status: "Verified" | "Partially verified" | "Monitoring";
  auditId: string;
  baselineMWh: number;
  actualMWh: number;
  errorPct: number;
};

export const ledger: LedgerEntry[] = [
  {
    id: "v1",
    date: "18 Aug",
    building: "Hostel C",
    intervention: "HVAC schedule shift",
    predicted: 12.1,
    verified: 11.3,
    status: "Verified",
    auditId: "CA-2026-0818-4F91",
    baselineMWh: 214,
    actualMWh: 187,
    errorPct: 6.8,
  },
  {
    id: "v2",
    date: "02 Aug",
    building: "Library",
    intervention: "LED retrofit (floor 2)",
    predicted: 6.4,
    verified: 6.9,
    status: "Verified",
    auditId: "CA-2026-0802-11C7",
    baselineMWh: 96,
    actualMWh: 80,
    errorPct: 7.8,
  },
  {
    id: "v3",
    date: "21 Jul",
    building: "Academic A",
    intervention: "Weekend setback",
    predicted: 9.2,
    verified: 7.1,
    status: "Partially verified",
    auditId: "CA-2026-0721-8B32",
    baselineMWh: 141,
    actualMWh: 124,
    errorPct: 22.8,
  },
  {
    id: "v4",
    date: "09 Jul",
    building: "Hostel D",
    intervention: "Water heating shift",
    predicted: 4.8,
    verified: 4.6,
    status: "Verified",
    auditId: "CA-2026-0709-2A55",
    baselineMWh: 72,
    actualMWh: 63,
    errorPct: 4.2,
  },
  {
    id: "v5",
    date: "27 Jun",
    building: "Campus-wide",
    intervention: "Behavioral campaign",
    predicted: 3.1,
    verified: 2.2,
    status: "Monitoring",
    auditId: "CA-2026-0627-77D0",
    baselineMWh: 58,
    actualMWh: 54,
    errorPct: 29,
  },
];

export function verificationSeries(entry: LedgerEntry) {
  const weeks = ["W-6", "W-5", "W-4", "W-3", "W-2", "W-1", "W0", "W+1", "W+2", "W+3", "W+4", "W+5"];
  const pre = entry.baselineMWh / 8;
  const post = entry.actualMWh / 8;
  return weeks.map((w, i) => {
    const wobble = ((i * 41) % 7) / 10 - 0.3;
    const isPost = i >= 6;
    return {
      t: w,
      actual: Math.round((isPost ? post : pre) * 10 + wobble * 10) / 10,
      predictedLow: isPost ? Math.round((post * 0.94 + wobble) * 10) / 10 : null,
      predictedHigh: isPost ? Math.round((post * 1.06 + wobble) * 10) / 10 : null,
      baseline: Math.round((pre + wobble) * 10) / 10,
    };
  });
}

export type AskAnswer = {
  q: string;
  answer: string;
  evidence: { label: string; value: string }[];
  explanation: string;
  action: string;
  sources: string;
  confidence: Confidence;
};

export const askAnswers: AskAnswer[] = [
  {
    q: "Why did Hostel C spike last night?",
    answer:
      "Hostel C used 41% more energy than its expected overnight baseline between 1:00–5:00 AM.",
    evidence: [
      { label: "Occupancy", value: "Low" },
      { label: "Weather", value: "Within normal range" },
      { label: "HVAC load", value: "+46%" },
      { label: "Historical overnight baseline", value: "Exceeded" },
    ],
    explanation: "The HVAC schedule remained active during a low-occupancy period.",
    action: "Shift the overnight HVAC schedule by 90 minutes.",
    sources: "meter history · occupancy schedule · baseline model",
    confidence: "High",
  },
  {
    q: "What's our best action under ₹10L?",
    answer:
      "Under ₹10L, the highest-reduction portfolio is HVAC schedule shift + smart plug rollout + behavioral campaign, at ₹4.0L invested.",
    evidence: [
      { label: "Portfolio cost", value: "₹4.0L of ₹10L budget" },
      { label: "Expected reduction", value: "67–96 tCO₂e/year" },
      { label: "Estimated saving", value: "₹5.1L/year" },
      { label: "Blended payback", value: "9 months" },
    ],
    explanation:
      "Schedule and control changes dominate on cost-effectiveness; the LED retrofit only enters the portfolio above ₹7L.",
    action: "Open the portfolio in Action Lab and send it for approval.",
    sources: "intervention library · baseline model · simulated optimizer",
    confidence: "Medium",
  },
  {
    q: "Which building has the biggest opportunity?",
    answer:
      "Utility Plant carries the largest addressable reduction at ~24 tCO₂e/year from load timing alone, followed by Hostel C at ~38 tCO₂e/year from schedule changes.",
    evidence: [
      { label: "Utility Plant intensity", value: "Highest on campus" },
      { label: "Peak-window load", value: "72% of daily total" },
      { label: "Hostel C trend", value: "↑ 12% month on month" },
      { label: "Data coverage", value: "90% / 92%" },
    ],
    explanation:
      "Both opportunities are timing-related, so they need no new hardware and carry short payback.",
    action: "Prioritize Hostel C first — higher confidence and a 4-month payback.",
    sources: "meter history · grid intensity feed · baseline model",
    confidence: "High",
  },
  {
    q: "Are we on track for the quarterly target?",
    answer:
      "Yes — 186 tCO₂e verified against a 240 tCO₂e quarterly target, with 5 weeks remaining.",
    evidence: [
      { label: "Verified to date", value: "186 tCO₂e" },
      { label: "Target", value: "240 tCO₂e" },
      { label: "In-flight actions", value: "7 (3 awaiting approval)" },
      { label: "Projected close", value: "231–248 tCO₂e" },
    ],
    explanation:
      "Approving the three pending actions moves the projection above target; delaying them by two weeks does not.",
    action: "Clear the pending approvals this week.",
    sources: "verification ledger · intervention pipeline · simulated forecast",
    confidence: "Medium",
  },
];
