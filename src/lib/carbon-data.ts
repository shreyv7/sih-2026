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
    id: "ab3",
    name: "Academic Block 3 (AB3)",
    type: "Academic",
    energyMWh: 342,
    tco2e: 168.4,
    trendPct: 8.4,
    coverage: 98,
    status: "Needs attention",
    intensity: 0.88,
    breakdown: { hvac: 62, lighting: 18, plug: 20 },
    sources: [
      "Main meter telemetry",
      "Sub-meter AHU feed",
      "Timetable schedule",
      "Solar inverter feed",
    ],
    anomalies: [
      "Night-time HVAC baseload spike (01:00–05:00 AM) on AHU-2 and AHU-4",
    ],
    nextAction:
      "Automated BMS setback schedule on AHU-2 & AHU-4 (Save 28.4 tCO₂e/yr)",
  },
  {
    id: "b14",
    name: "Hostel Block 14 (B14)",
    type: "Hostel",
    energyMWh: 596,
    tco2e: 289.0,
    trendPct: 8.7,
    coverage: 96,
    status: "Needs attention",
    intensity: 0.89,
    breakdown: { hvac: 54, lighting: 16, plug: 30 },
    sources: [
      "360-room Sub-meter Telemetry",
      "180 kWp Solar Inverter Feed",
      "Hostel Occupancy Register",
    ],
    anomalies: [
      "Overnight split-AC draw spike (01:00–05:00 AM) running at 88% active capacity (+45.1% deviation)",
    ],
    nextAction:
      "Overnight AC schedule adjustment to 18:00–04:00 (Save 16.8 tCO₂e/yr, immediate payback)",
  },
  {
    id: "kmc",
    name: "KMC Central Library",
    type: "Academic",
    energyMWh: 1518,
    tco2e: 1120.3,
    trendPct: 14.2,
    coverage: 99,
    status: "Needs attention",
    intensity: 0.95,
    breakdown: { hvac: 68, lighting: 18, plug: 14 },
    sources: [
      "MESCOM 11 kV Substation Feed",
      "120 kWp Solar PV Scada",
      "Chiller Plant SCADA Logs",
      "Turnstile Entry Logs",
    ],
    anomalies: [
      "Sunday closed-hours chiller baseload spike (02:00–06:00 AM at 165 kW vs 22 kW baseline)",
    ],
    nextAction:
      "BMS Scheduling Lock + Static Pressure Setpoint Reset (Save 25.9 tCO₂e/yr, ₹2.75L/yr)",
  },
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
    id: "ab3_fcu_isolation",
    name: "BMS Zone Isolation & Chiller Lockout",
    building: "Academic Block 3 (AB3)",
    costLakh: 1.1,
    reductionMin: 8.3,
    reductionMax: 11.2,
    savingLakh: 0.78,
    payback: "17 months",
    paybackMonths: 17,
    confidence: "High",
    evidence: ["Timetable calendar integration", "SCADA chiller lockout valve", "FCU zone sensors"],
  },
  {
    id: "b14_ac_schedule",
    name: "Overnight AC Schedule Optimization (18:00–04:00)",
    building: "Hostel Block 14 (B14)",
    costLakh: 0.0,
    reductionMin: 16.8,
    reductionMax: 20.2,
    savingLakh: 1.58,
    payback: "Immediate",
    paybackMonths: 1,
    confidence: "High",
    evidence: ["Room sub-meter telemetry", "Smart plug thermostat scripts", "Occupancy schedule"],
  },
  {
    id: "kmc_bms_lock",
    name: "BMS Closed-Hours Lockout & Static Pressure Reset",
    building: "KMC Central Library",
    costLakh: 0.85,
    reductionMin: 25.9,
    reductionMax: 31.2,
    savingLakh: 2.75,
    payback: "4 months",
    paybackMonths: 4,
    confidence: "High",
    evidence: ["SCADA chiller bypass logs", "Turnstile occupancy integration", "Static pressure reset algorithms"],
  },
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
    building: "Academic B",
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

export type VerificationScenario = {
  id: string;
  title: string;
  building: string;
  baselineMWh: number;
  actualMWh: number;
  verifiedMWh: number;
  predictedTco2e: number;
  verifiedTco2e: number;
  predictionErrorPct: number;
  status: "Verified" | "Partially verified" | "Monitoring";
  auditId: string;
  startLabel: string;
  series: {
    label: string;
    predictedLow: number;
    predictedHigh: number;
    actual: number;
  }[];
};

export const verificationScenarios: VerificationScenario[] = [
  {
    id: "verify-ab3",
    title: "BMS Zone Isolation & Chiller Lockout",
    building: "Academic Block 3 (AB3)",
    baselineMWh: 342,
    actualMWh: 332.2,
    verifiedMWh: 332.2,
    predictedTco2e: 8.3,
    verifiedTco2e: 8.3,
    predictionErrorPct: 4.8,
    status: "Verified",
    auditId: "AUD-2026-AB3-091",
    startLabel: "26 Dec",
    series: [
      { label: "W-2", predictedLow: 14.1, predictedHigh: 14.4, actual: 14.1 },
      { label: "W-1", predictedLow: 14.2, predictedHigh: 14.5, actual: 14.2 },
      { label: "Start", predictedLow: 2.2, predictedHigh: 2.8, actual: 2.4 },
      { label: "W+1", predictedLow: 1.4, predictedHigh: 2.2, actual: 1.7 },
      { label: "W+2", predictedLow: 1.2, predictedHigh: 1.9, actual: 1.5 },
    ],
  },
  {
    id: "verify-b14",
    title: "Overnight AC Schedule Optimization",
    building: "Hostel Block 14 (B14)",
    baselineMWh: 596,
    actualMWh: 576.2,
    verifiedMWh: 576.2,
    predictedTco2e: 16.8,
    verifiedTco2e: 16.8,
    predictionErrorPct: 3.2,
    status: "Verified",
    auditId: "AUD-2026-B14-042",
    startLabel: "18 Aug",
    series: [
      { label: "W-2", predictedLow: 17.8, predictedHigh: 18.2, actual: 18.0 },
      { label: "W-1", predictedLow: 17.9, predictedHigh: 18.3, actual: 18.0 },
      { label: "Start", predictedLow: 15.6, predictedHigh: 16.6, actual: 16.2 },
      { label: "W+1", predictedLow: 15.4, predictedHigh: 16.4, actual: 15.9 },
      { label: "W+2", predictedLow: 15.3, predictedHigh: 16.3, actual: 15.8 },
    ],
  },
  {
    id: "verify-kmc",
    title: "BMS Closed-Hours Lockout & Static Pressure Reset",
    building: "KMC Central Library",
    baselineMWh: 1518,
    actualMWh: 1485.6,
    verifiedMWh: 1485.6,
    predictedTco2e: 25.9,
    verifiedTco2e: 25.9,
    predictionErrorPct: 2.9,
    status: "Verified",
    auditId: "AUD-2026-KMC-118",
    startLabel: "14 Sep",
    series: [
      { label: "W-2", predictedLow: 16.2, predictedHigh: 16.8, actual: 16.5 },
      { label: "W-1", predictedLow: 16.3, predictedHigh: 16.7, actual: 16.4 },
      { label: "Start", predictedLow: 2.0, predictedHigh: 3.0, actual: 2.6 },
      { label: "W+1", predictedLow: 1.9, predictedHigh: 2.7, actual: 2.3 },
      { label: "W+2", predictedLow: 1.8, predictedHigh: 2.6, actual: 2.2 },
    ],
  },
  {
    id: "verify-hvac",
    title: "HVAC schedule shift",
    building: "Hostel C",
    baselineMWh: 214,
    actualMWh: 199,
    verifiedMWh: 187,
    predictedTco2e: 12.1,
    verifiedTco2e: 11.3,
    predictionErrorPct: 6.8,
    status: "Verified",
    auditId: "AUD-18AUG-HC-021",
    startLabel: "18 Aug",
    series: [
      { label: "Week -2", predictedLow: 10.8, predictedHigh: 12.4, actual: 12.9 },
      { label: "Week -1", predictedLow: 10.9, predictedHigh: 12.5, actual: 12.4 },
      { label: "Start", predictedLow: 10.7, predictedHigh: 12.3, actual: 12.1 },
      { label: "Week +1", predictedLow: 10.5, predictedHigh: 12.1, actual: 11.6 },
      { label: "Week +2", predictedLow: 10.2, predictedHigh: 11.8, actual: 11.3 },
    ],
  },
  {
    id: "verify-led",
    title: "LED retrofit",
    building: "Library",
    baselineMWh: 151,
    actualMWh: 134,
    verifiedMWh: 129,
    predictedTco2e: 8.4,
    verifiedTco2e: 7.6,
    predictionErrorPct: 9.5,
    status: "Partially verified",
    auditId: "AUD-11AUG-LIB-014",
    startLabel: "11 Aug",
    series: [
      { label: "Week -2", predictedLow: 7.8, predictedHigh: 8.8, actual: 8.9 },
      { label: "Week -1", predictedLow: 7.9, predictedHigh: 8.9, actual: 8.6 },
      { label: "Start", predictedLow: 7.7, predictedHigh: 8.7, actual: 8.4 },
      { label: "Week +1", predictedLow: 7.5, predictedHigh: 8.5, actual: 8.1 },
      { label: "Week +2", predictedLow: 7.3, predictedHigh: 8.3, actual: 7.6 },
    ],
  },
  {
    id: "verify-plant",
    title: "Pre-cooling window shift",
    building: "Utility Plant",
    baselineMWh: 286,
    actualMWh: 281,
    verifiedMWh: 276,
    predictedTco2e: 9.6,
    verifiedTco2e: 6.9,
    predictionErrorPct: 28.1,
    status: "Monitoring",
    auditId: "AUD-22AUG-UP-008",
    startLabel: "22 Aug",
    series: [
      { label: "Week -2", predictedLow: 8.9, predictedHigh: 10.5, actual: 10.2 },
      { label: "Week -1", predictedLow: 8.8, predictedHigh: 10.4, actual: 10.1 },
      { label: "Start", predictedLow: 8.7, predictedHigh: 10.3, actual: 9.8 },
      { label: "Week +1", predictedLow: 8.4, predictedHigh: 10.0, actual: 8.2 },
      { label: "Week +2", predictedLow: 8.2, predictedHigh: 9.8, actual: 6.9 },
    ],
  },
];

export const verificationLedger = [
  {
    date: "26 Dec",
    building: "Academic Block 3 (AB3)",
    intervention: "BMS Zone Isolation & Chiller Lockout",
    predicted: "8.3 tCO₂e",
    verified: "8.3 tCO₂e",
    status: "Verified" as const,
    auditId: "AUD-2026-AB3-091",
  },
  {
    date: "18 Aug",
    building: "Hostel Block 14 (B14)",
    intervention: "Overnight AC Schedule Optimization",
    predicted: "16.8 tCO₂e",
    verified: "16.8 tCO₂e",
    status: "Verified" as const,
    auditId: "AUD-2026-B14-042",
  },
  {
    date: "14 Sep",
    building: "KMC Central Library",
    intervention: "BMS Closed-Hours Lockout & Pressure Reset",
    predicted: "25.9 tCO₂e",
    verified: "25.9 tCO₂e",
    status: "Verified" as const,
    auditId: "AUD-2026-KMC-118",
  },
  {
    date: "18 Aug",
    building: "Hostel C",
    intervention: "HVAC schedule shift",
    predicted: "12.1 tCO₂e",
    verified: "11.3 tCO₂e",
    status: "Verified" as const,
    auditId: "AUD-18AUG-HC-021",
  },
  {
    date: "11 Aug",
    building: "Library",
    intervention: "LED retrofit",
    predicted: "8.4 tCO₂e",
    verified: "7.6 tCO₂e",
    status: "Partially verified" as const,
    auditId: "AUD-11AUG-LIB-014",
  },
  {
    date: "22 Aug",
    building: "Utility Plant",
    intervention: "Pre-cooling window shift",
    predicted: "9.6 tCO₂e",
    verified: "6.9 tCO₂e",
    status: "Monitoring" as const,
    auditId: "AUD-22AUG-UP-008",
  },
];

export type AskCarbonAnswer = {
  question: string;
  summary: string;
  explanation: string;
  recommendation: string;
  confidence: Confidence;
  sources: string[];
  evidence: { label: string; value: string }[];
};

export const askCarbonAnswers: AskCarbonAnswer[] = [
  {
    question: "Why did Hostel C spike last night?",
    summary:
      "Hostel C used 41% more energy than its expected overnight baseline between 1:00–5:00 AM.",
    explanation: "The HVAC schedule remained active during a low-occupancy period.",
    recommendation: "Shift the overnight HVAC schedule by 90 minutes.",
    confidence: "High",
    sources: ["Meter history", "Occupancy schedule", "Baseline model"],
    evidence: [
      { label: "Occupancy", value: "Low" },
      { label: "Weather", value: "Within normal range" },
      { label: "HVAC load", value: "+46%" },
      { label: "Historical overnight baseline", value: "Exceeded 6 of last 7 nights" },
    ],
  },
  {
    question: "What's our best action under ₹10L?",
    summary:
      "A portfolio of HVAC schedule shift, smart plug rollout, and behavioral campaign delivers the strongest carbon reduction under ₹10L.",
    explanation:
      "That bundle stays within budget while preserving quick payback and strong evidence coverage.",
    recommendation:
      "Send the ₹4.0L bundle for approval first, then hold the balance for LED scope validation.",
    confidence: "High",
    sources: ["Optimizer simulation", "Meter history", "Baseline model"],
    evidence: [
      { label: "Budget used", value: "₹4.0L" },
      { label: "Impact range", value: "67–96 tCO₂e/year" },
      { label: "Estimated savings", value: "₹5.1L/year" },
      { label: "Portfolio payback", value: "9 months" },
    ],
  },
  {
    question: "Which building has the biggest opportunity?",
    summary:
      "Hostel Block C is the clearest near-term opportunity because the anomaly is large, persistent, and supported by high coverage.",
    explanation:
      "It combines a 41% overnight spike with 92% data coverage and a low-cost intervention that can be executed quickly.",
    recommendation: "Prioritize the HVAC schedule shift before moving to broader retrofit work.",
    confidence: "High",
    sources: ["Alert ranking", "Coverage score", "Intervention model"],
    evidence: [
      { label: "Potential impact", value: "~38 tCO₂e/year" },
      { label: "Coverage", value: "92%" },
      { label: "Cost", value: "₹1.2L" },
      { label: "Payback", value: "4 months" },
    ],
  },
  {
    question: "Are we on track for the quarterly target?",
    summary:
      "Yes, the campus is currently ahead of the quarterly reduction target if the pending high-confidence actions are approved this month.",
    explanation:
      "Verified savings are already up 24% this quarter, and the pending intervention queue adds another modeled 70+ tCO₂e/year of reduction.",
    recommendation:
      "Approve the Hostel C action and continue monitoring Utility Plant verification.",
    confidence: "Medium",
    sources: ["Quarterly KPI rollup", "Approval queue", "Verification ledger"],
    evidence: [
      { label: "Verified savings", value: "186 tCO₂e" },
      { label: "Quarterly delta", value: "+24%" },
      { label: "Pending high-confidence actions", value: "3" },
      { label: "Target status", value: "Ahead by ~7%" },
    ],
  },
];

export function optimizePortfolio(budgetLakh: number, allowedIds?: string[]) {
  const pool = interventions
    .filter((item) => (allowedIds ? allowedIds.includes(item.id) : true))
    .slice()
    .sort(
      (a, b) =>
        (b.reductionMin + b.reductionMax) / (2 * b.costLakh) -
        (a.reductionMin + a.reductionMax) / (2 * a.costLakh),
    );

  const selected: Intervention[] = [];
  let spent = 0;

  for (const item of pool) {
    if (spent + item.costLakh <= budgetLakh + 1e-6) {
      selected.push(item);
      spent += item.costLakh;
    }
  }

  const reductionMin = selected.reduce((sum, item) => sum + item.reductionMin, 0);
  const reductionMax = selected.reduce((sum, item) => sum + item.reductionMax, 0);
  const savingLakh = selected.reduce((sum, item) => sum + item.savingLakh, 0);
  const avgPaybackMonths =
    selected.length > 0
      ? Math.round(
          selected.reduce((sum, item) => sum + item.paybackMonths * item.costLakh, 0) /
            selected.reduce((sum, item) => sum + item.costLakh, 0),
        )
      : 0;
  const confidence: Confidence =
    selected.length === 0
      ? "Low"
      : selected.every((item) => item.confidence === "High")
        ? "High"
        : selected.some((item) => item.confidence === "Low")
          ? "Medium"
          : "High";

  return {
    selected,
    spent,
    reductionMin,
    reductionMax,
    savingLakh,
    avgPaybackMonths,
    confidence,
  };
}

export function actionSimulation(selectedIds: string[]) {
  const selected = interventions.filter((item) => selectedIds.includes(item.id));
  const reduction = selected.reduce(
    (sum, item) => sum + (item.reductionMin + item.reductionMax) / 2,
    0,
  );
  const ratio = Math.min(reduction / 180, 0.32);

  return [
    { label: "Month 1", baseline: 118, simulated: Math.round(118 * (1 - ratio * 0.35)) },
    { label: "Month 2", baseline: 112, simulated: Math.round(112 * (1 - ratio * 0.55)) },
    { label: "Month 3", baseline: 109, simulated: Math.round(109 * (1 - ratio * 0.72)) },
    { label: "Month 4", baseline: 114, simulated: Math.round(114 * (1 - ratio * 0.84)) },
    { label: "Month 5", baseline: 121, simulated: Math.round(121 * (1 - ratio)) },
  ];
}

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
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const label: string =
      period === "24h"
        ? `${String(i).padStart(2, "0")}:00`
        : period === "7d"
          ? (dayNames[i] ?? `D${i + 1}`)
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
        anomaly: false,
      };
    }
    return {
      t: label,
      actual: round(actualRaw),
      baseline,
      forecast: i === cut ? round(baseline * 1.02) : null,
      bandLow: i === cut ? round(baseline * 0.95) : null,
      bandHigh: i === cut ? round(baseline * 1.05) : null,
      anomaly: Boolean(isAnomaly),
    };
  });
}


function round(n: number) {
  return Math.round(n * 10) / 10;
}

/** Baseline vs simulated emissions for the Action Lab what-if chart. */
export function whatIfSeries(annualReduction: number) {
  const months = [
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
  ];
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

// ==========================================
// AB3 Specific Deep-Dive Synthetic Data (from AB3.pdf)
// ==========================================

export interface AB3MonthlyMetric {
  month: string;
  totalKWh: number;
  solarKWh: number;
  gridKWh: number;
  gridBillINR: number;
  avgTempC: number;
  context: string;
}

export const ab3MonthlyData: AB3MonthlyMetric[] = [
  { month: "Jan", totalKWh: 28100, solarKWh: 10200, gridKWh: 17900, gridBillINR: 143200, avgTempC: 22.4, context: "Term 1" },
  { month: "Feb", totalKWh: 27200, solarKWh: 11200, gridKWh: 16000, gridBillINR: 128000, avgTempC: 23.6, context: "Term 1" },
  { month: "Mar", totalKWh: 30200, solarKWh: 12200, gridKWh: 18000, gridBillINR: 144000, avgTempC: 26.3, context: "Term 1" },
  { month: "Apr", totalKWh: 32600, solarKWh: 11900, gridKWh: 20700, gridBillINR: 165600, avgTempC: 28.6, context: "Term 1 (hot)" },
  { month: "May", totalKWh: 11700, solarKWh: 10700, gridKWh: 1000, gridBillINR: 8000, avgTempC: 29.4, context: "Summer break" },
  { month: "Jun", totalKWh: 19000, solarKWh: 7800, gridKWh: 11200, gridBillINR: 89600, avgTempC: 27.6, context: "Break → Term 2" },
  { month: "Jul", totalKWh: 29800, solarKWh: 6600, gridKWh: 23200, gridBillINR: 185600, avgTempC: 26.2, context: "Term 2 (monsoon)" },
  { month: "Aug", totalKWh: 30100, solarKWh: 7100, gridKWh: 23000, gridBillINR: 184000, avgTempC: 26.1, context: "Term 2 (monsoon)" },
  { month: "Sep", totalKWh: 29600, solarKWh: 8400, gridKWh: 21200, gridBillINR: 169600, avgTempC: 26.8, context: "Term 2" },
  { month: "Oct", totalKWh: 30800, solarKWh: 9900, gridKWh: 20900, gridBillINR: 167200, avgTempC: 26.2, context: "Term 2" },
  { month: "Nov", totalKWh: 33700, solarKWh: 10500, gridKWh: 23200, gridBillINR: 185600, avgTempC: 24.5, context: "Exam window" },
  { month: "Dec", totalKWh: 15200, solarKWh: 10700, gridKWh: 4500, gridBillINR: 36000, avgTempC: 22.9, context: "Winter break" },
];

export interface AB3HourlyLoad {
  hour: number;
  timeLabel: string;
  occupancyPct: number;
  chillerLoadingPct: number;
  buildingLoadKW: number;
  solarKW: number;
  expectedGridKW: number;
  tempC: number;
}

export const ab3HourlyProfile: AB3HourlyLoad[] = [
  { hour: 0, timeLabel: "00:00", occupancyPct: 2, chillerLoadingPct: 0, buildingLoadKW: 6, solarKW: 0, expectedGridKW: 6, tempC: 23.0 },
  { hour: 1, timeLabel: "01:00", occupancyPct: 2, chillerLoadingPct: 0, buildingLoadKW: 5, solarKW: 0, expectedGridKW: 5, tempC: 22.6 },
  { hour: 2, timeLabel: "02:00", occupancyPct: 2, chillerLoadingPct: 0, buildingLoadKW: 5, solarKW: 0, expectedGridKW: 5, tempC: 22.3 },
  { hour: 3, timeLabel: "03:00", occupancyPct: 2, chillerLoadingPct: 0, buildingLoadKW: 5, solarKW: 0, expectedGridKW: 5, tempC: 22.1 },
  { hour: 4, timeLabel: "04:00", occupancyPct: 2, chillerLoadingPct: 0, buildingLoadKW: 5, solarKW: 0, expectedGridKW: 5, tempC: 21.9 },
  { hour: 5, timeLabel: "05:00", occupancyPct: 2, chillerLoadingPct: 0, buildingLoadKW: 6, solarKW: 0, expectedGridKW: 6, tempC: 21.8 },
  { hour: 6, timeLabel: "06:00", occupancyPct: 5, chillerLoadingPct: 0, buildingLoadKW: 8, solarKW: 1, expectedGridKW: 7, tempC: 22.2 },
  { hour: 7, timeLabel: "07:00", occupancyPct: 18, chillerLoadingPct: 5, buildingLoadKW: 30, solarKW: 7, expectedGridKW: 23, tempC: 23.5 },
  { hour: 8, timeLabel: "08:00", occupancyPct: 55, chillerLoadingPct: 30, buildingLoadKW: 124, solarKW: 20, expectedGridKW: 104, tempC: 24.8 },
  { hour: 9, timeLabel: "09:00", occupancyPct: 85, chillerLoadingPct: 60, buildingLoadKW: 181, solarKW: 32, expectedGridKW: 149, tempC: 26.0 },
  { hour: 10, timeLabel: "10:00", occupancyPct: 95, chillerLoadingPct: 78, buildingLoadKW: 211, solarKW: 44, expectedGridKW: 167, tempC: 27.2 },
  { hour: 11, timeLabel: "11:00", occupancyPct: 98, chillerLoadingPct: 85, buildingLoadKW: 226, solarKW: 54, expectedGridKW: 172, tempC: 28.3 },
  { hour: 12, timeLabel: "12:00", occupancyPct: 90, chillerLoadingPct: 80, buildingLoadKW: 215, solarKW: 58, expectedGridKW: 157, tempC: 28.9 },
  { hour: 13, timeLabel: "13:00", occupancyPct: 92, chillerLoadingPct: 82, buildingLoadKW: 218, solarKW: 56, expectedGridKW: 162, tempC: 29.2 },
  { hour: 14, timeLabel: "14:00", occupancyPct: 96, chillerLoadingPct: 85, buildingLoadKW: 222, solarKW: 50, expectedGridKW: 172, tempC: 29.4 },
  { hour: 15, timeLabel: "15:00", occupancyPct: 94, chillerLoadingPct: 83, buildingLoadKW: 220, solarKW: 42, expectedGridKW: 178, tempC: 29.0 },
  { hour: 16, timeLabel: "16:00", occupancyPct: 85, chillerLoadingPct: 75, buildingLoadKW: 202, solarKW: 30, expectedGridKW: 172, tempC: 28.2 },
  { hour: 17, timeLabel: "17:00", occupancyPct: 60, chillerLoadingPct: 55, buildingLoadKW: 149, solarKW: 16, expectedGridKW: 133, tempC: 27.0 },
  { hour: 18, timeLabel: "18:00", occupancyPct: 35, chillerLoadingPct: 30, buildingLoadKW: 94, solarKW: 6, expectedGridKW: 88, tempC: 26.0 },
  { hour: 19, timeLabel: "19:00", occupancyPct: 22, chillerLoadingPct: 15, buildingLoadKW: 64, solarKW: 1, expectedGridKW: 63, tempC: 25.2 },
  { hour: 20, timeLabel: "20:00", occupancyPct: 12, chillerLoadingPct: 8, buildingLoadKW: 40, solarKW: 0, expectedGridKW: 40, tempC: 24.6 },
  { hour: 21, timeLabel: "21:00", occupancyPct: 6, chillerLoadingPct: 3, buildingLoadKW: 19, solarKW: 0, expectedGridKW: 19, tempC: 24.2 },
  { hour: 22, timeLabel: "22:00", occupancyPct: 3, chillerLoadingPct: 0, buildingLoadKW: 9, solarKW: 0, expectedGridKW: 9, tempC: 23.8 },
  { hour: 23, timeLabel: "23:00", occupancyPct: 2, chillerLoadingPct: 0, buildingLoadKW: 7, solarKW: 0, expectedGridKW: 7, tempC: 23.5 },
];

export const ab3ProfileSpecs = {
  name: "Academic Block 3 (AB3)",
  type: "Academic (Centralised Chiller + FCUs)",
  campus: "MIT Manipal, MAHE",
  coordinates: "13.35126° N, 74.79309° E",
  builtUpAreaM2: 3440,
  floors: 4,
  classroomsTotal: 16,
  seatingCapacity: 1920,
  chillerCapacityTR: 120,
  chillerPowerKW: 78,
  fcuUnitsCount: 32,
  solarCapacityKWp: 65,
  annualGridEnergyMWh: 342,
  observedEPI: 92.4,
  benchmarkEPI: 85.0,
  carbonFootprintTCO2e: 168.4,
  electricityRateINR: 8.0,
};

export const ab3AnomalyEventDetails = {
  eventId: "AB3_EVT_001",
  title: "Off-Hours Chiller Plant Parasitic Run",
  timestamp: "26 Dec 2026 · 09:00–13:00 (Winter Break)",
  status: "Needs attention",
  deviationPct: 609.1,
  actualEnergyKWh: 156,
  expectedBaselineKWh: 22,
  excessEnergyKWh: 134,
  avoidableCostLossINR: "₹3,85,000 / year",
  rootCause: "Classroom 3 (Floor 2) FCU thermostat left in active call state post-cleaning. Because the chiller plant is centralised without zone lockouts, the 120 TR screw compressor + chilled water pumps + cooling tower ran at 30% part-load for 4 hours to cool 1 empty room.",
  evidenceSignals: [
    { label: "Official Building Occupancy", value: "0% (Campus Closed for Break)" },
    { label: "Active FCU Calling Zones", value: "1 of 16 (Classroom 3, 2nd Flr)" },
    { label: "Chiller Plant Status", value: "ON (30% Loading / 42 kW draw)" },
    { label: "Solar Energy Export Window", value: "165 kWh (Underutilized)" },
  ],
  telemetryFields: {
    building_id: "MIT_AB3",
    power_factor: "0.91",
    chiller_status: "1 (Plant Active)",
    active_fcu_zones: "1 / 16",
    water_coolers_load_kWh: "0.4 kWh",
    solar_generation_kWh: "41.0 kWh",
  }
};

export const ab3InterventionPortfolio: Intervention[] = [
  {
    id: "ab3_fcu_isolation",
    name: "BMS Zone Isolation & Chiller Lockout",
    building: "Academic Block 3 (AB3)",
    costLakh: 1.1,
    reductionMin: 8.3,
    reductionMax: 11.2,
    savingLakh: 0.78,
    payback: "17 months",
    paybackMonths: 17,
    confidence: "High",
    evidence: ["Timetable calendar integration", "SCADA chiller lockout valve", "FCU zone sensors"],
  },
  {
    id: "ab3_night_setback",
    name: "Night HVAC Setback (AHU-2 & AHU-4)",
    building: "Academic Block 3 (AB3)",
    costLakh: 0.8,
    reductionMin: 28.4,
    reductionMax: 34.0,
    savingLakh: 3.2,
    payback: "Immediate",
    paybackMonths: 1,
    confidence: "High",
    evidence: ["Sub-meter AHU feed", "Occupancy schedule", "BMS setback scripts"],
  },
  {
    id: "ab3_solar_synced_loads",
    name: "Solar-Synced Lab & Chiller Pre-cool",
    building: "Academic Block 3 (AB3)",
    costLakh: 0.2,
    reductionMin: 14.8,
    reductionMax: 18.5,
    savingLakh: 1.4,
    payback: "2 months",
    paybackMonths: 2,
    confidence: "High",
    evidence: ["65 kWp solar inverter data", "Weather degree days", "Thermal mass retention"],
  },
  {
    id: "ab3_led_retrofit",
    name: "Classroom LED & Sensor Relays",
    building: "Academic Block 3 (AB3)",
    costLakh: 2.8,
    reductionMin: 24.2,
    reductionMax: 31.0,
    savingLakh: 2.1,
    payback: "16 months",
    paybackMonths: 16,
    confidence: "High",
    evidence: ["192 fixture inventory", "PIR occupancy telemetry"],
  },
];

export const ab3VerificationDetails = {
  id: "verify-ab3",
  title: "BMS Chiller Lockout & FCU Isolation",
  building: "Academic Block 3 (AB3)",
  auditId: "AUD-2026-AB3-091",
  status: "Verified" as const,
  baselineBreakOffHoursKWh: 142,
  verifiedBreakOffHoursKWh: 15,
  dropPct: 89.4,
  annualEnergySavedKWh: 9800,
  annualCostSavedINR: 78400,
  annualCO2eSaved: 8.3,
  predictionErrorPct: 4.8,
  series: [
    { label: "W-4 (Pre)", baseline: 142, actual: 140, predictedLow: null, predictedHigh: null },
    { label: "W-3 (Pre)", baseline: 144, actual: 143, predictedLow: null, predictedHigh: null },
    { label: "W-2 (Pre)", baseline: 139, actual: 141, predictedLow: null, predictedHigh: null },
    { label: "W-1 (Pre)", baseline: 143, actual: 142, predictedLow: null, predictedHigh: null },
    { label: "Start", baseline: 142, actual: 24, predictedLow: 18, predictedHigh: 28 },
    { label: "W+1", baseline: 140, actual: 17, predictedLow: 14, predictedHigh: 22 },
    { label: "W+2", baseline: 142, actual: 15, predictedLow: 12, predictedHigh: 19 },
    { label: "W+3", baseline: 141, actual: 14, predictedLow: 12, predictedHigh: 18 },
    { label: "W+4", baseline: 143, actual: 15, predictedLow: 12, predictedHigh: 18 },
  ],
};

export const ab3AskCarbonQA: AskCarbonAnswer[] = [
  {
    question: "Why did AB3 chiller plant run on Dec 26 during winter break?",
    summary:
      "AB3 consumed 156 kWh between 09:00–13:00 (vs 22 kWh standby baseline) because a single FCU in Classroom 3 remained in active cooling mode.",
    explanation:
      "Because the 120 TR screw chiller lacks an automated calendar lockout, one thermostat called the whole primary pump, condenser pump, and cooling tower loop into full operation.",
    recommendation:
      "Deploy AB3_INT_001 (BMS timetable lockout) to save ₹78,400/yr and 8.3 tCO₂e with payback in 17 months.",
    confidence: "High",
    sources: ["Sub-meter AHU-2/4 telemetry", "Academic timetable calendar", "Chiller SCADA plant log"],
    evidence: [
      { label: "Chiller State", value: "30% Part-Load (Active)" },
      { label: "Calling Zones", value: "1 / 16 (Classroom 3)" },
      { label: "Occupancy", value: "0% (Winter Break)" },
      { label: "Avoidable Waste", value: "+134 kWh in 4h" },
    ],
  },
  {
    question: "How does AB3's rooftop solar perform against building load?",
    summary:
      "AB3 generates an average of 9,800 kWh/month from its 65 kWp solar array, achieving 74% direct self-consumption.",
    explanation:
      "During term time peak lecture hours (11:00–15:00), solar generation peaks at ~54 kW, significantly shaving the 226 kW peak chiller draw.",
    recommendation:
      "Sync high-load lab experiments to the 11:30 AM–02:30 PM peak solar window to minimize net grid tariff exposure.",
    confidence: "High",
    sources: ["65 kWp Solar Inverter Telemetry", "Main Meter HT Sub-meter", "Manipal Weather Station"],
    evidence: [
      { label: "Solar Array Size", value: "65 kWp (144 panels)" },
      { label: "Self-Consumption", value: "74% avg" },
      { label: "Peak Solar Hour", value: "12:00 PM (~58 kW)" },
      { label: "Monsoon Floor", value: "110 kWh/day min" },
    ],
  },
  {
    question: "What is the total carbon reduction opportunity for AB3?",
    summary:
      "AB3 has a combined addressable reduction of 75.7 tCO₂e/year (approx. 45% of its total footprint) across 4 prioritized interventions.",
    explanation:
      "The highest ROI bundle includes Night HVAC setback (28.4 tCO₂e), Solar sync (14.8 tCO₂e), and BMS Chiller Lockout (8.3 tCO₂e), requiring just ₹2.1L total investment.",
    recommendation:
      "Bundle these 3 high-confidence actions into the active approval queue for immediate campus execution.",
    confidence: "High",
    sources: ["Portfolio Optimizer", "Building Asset Register", "Verified M&V Baseline"],
    evidence: [
      { label: "Annual Footprint", value: "168.4 tCO₂e/yr" },
      { label: "Target Reduction", value: "75.7 tCO₂e/yr" },
      { label: "Bundled Payback", value: "< 6 months" },
      { label: "Annual Net Savings", value: "₹7.48 Lakh / yr" },
    ],
  },
];

// ==========================================
// B14 Hostel Block 14 Deep-Dive Synthetic Data (from b14.pdf)
// ==========================================

export const b14MonthlyData: AB3MonthlyMetric[] = [
  { month: "Jan", totalKWh: 45500, solarKWh: 14500, gridKWh: 31000, gridBillINR: 248000, avgTempC: 22.1, context: "Term 1 start" },
  { month: "Feb", totalKWh: 43800, solarKWh: 15800, gridKWh: 28000, gridBillINR: 224000, avgTempC: 23.4, context: "Term 1" },
  { month: "Mar", totalKWh: 49200, solarKWh: 17100, gridKWh: 32100, gridBillINR: 256800, avgTempC: 26.0, context: "Term 1 (warm)" },
  { month: "Apr", totalKWh: 53600, solarKWh: 16800, gridKWh: 36800, gridBillINR: 294400, avgTempC: 28.3, context: "Pre-exam prep" },
  { month: "May", totalKWh: 60200, solarKWh: 15200, gridKWh: 45000, gridBillINR: 360000, avgTempC: 29.2, context: "Summer peak load" },
  { month: "Jun", totalKWh: 54800, solarKWh: 11200, gridKWh: 43600, gridBillINR: 348800, avgTempC: 27.4, context: "Term 2 start" },
  { month: "Jul", totalKWh: 47200, solarKWh: 9600, gridKWh: 37600, gridBillINR: 300800, avgTempC: 26.1, context: "Monsoon period" },
  { month: "Aug", totalKWh: 44800, solarKWh: 10100, gridKWh: 34700, gridBillINR: 277600, avgTempC: 26.0, context: "Term 2 (monsoon)" },
  { month: "Sep", totalKWh: 45100, solarKWh: 12100, gridKWh: 33000, gridBillINR: 264000, avgTempC: 26.7, context: "Normal term" },
  { month: "Oct", totalKWh: 46300, solarKWh: 14200, gridKWh: 32100, gridBillINR: 256800, avgTempC: 26.1, context: "Normal term" },
  { month: "Nov", totalKWh: 43800, solarKWh: 15100, gridKWh: 28700, gridBillINR: 229600, avgTempC: 24.4, context: "Exam window" },
  { month: "Dec", totalKWh: 42100, solarKWh: 15400, gridKWh: 26700, gridBillINR: 213600, avgTempC: 22.7, context: "Winter break floor" },
];

export const b14HourlyProfile: AB3HourlyLoad[] = [
  { hour: 0, timeLabel: "00:00", occupancyPct: 82, chillerLoadingPct: 55, buildingLoadKW: 175, solarKW: 0, expectedGridKW: 175, tempC: 24.0 },
  { hour: 1, timeLabel: "01:00", occupancyPct: 80, chillerLoadingPct: 52, buildingLoadKW: 168, solarKW: 0, expectedGridKW: 168, tempC: 23.6 },
  { hour: 2, timeLabel: "02:00", occupancyPct: 78, chillerLoadingPct: 50, buildingLoadKW: 161, solarKW: 0, expectedGridKW: 161, tempC: 23.3 },
  { hour: 3, timeLabel: "03:00", occupancyPct: 77, chillerLoadingPct: 48, buildingLoadKW: 157, solarKW: 0, expectedGridKW: 157, tempC: 23.1 },
  { hour: 4, timeLabel: "04:00", occupancyPct: 76, chillerLoadingPct: 46, buildingLoadKW: 154, solarKW: 0, expectedGridKW: 154, tempC: 22.9 },
  { hour: 5, timeLabel: "05:00", occupancyPct: 72, chillerLoadingPct: 42, buildingLoadKW: 149, solarKW: 0, expectedGridKW: 149, tempC: 22.8 },
  { hour: 6, timeLabel: "06:00", occupancyPct: 70, chillerLoadingPct: 35, buildingLoadKW: 145, solarKW: 5, expectedGridKW: 140, tempC: 23.1 },
  { hour: 7, timeLabel: "07:00", occupancyPct: 60, chillerLoadingPct: 25, buildingLoadKW: 138, solarKW: 18, expectedGridKW: 120, tempC: 24.0 },
  { hour: 8, timeLabel: "08:00", occupancyPct: 45, chillerLoadingPct: 18, buildingLoadKW: 128, solarKW: 34, expectedGridKW: 94, tempC: 25.0 },
  { hour: 9, timeLabel: "09:00", occupancyPct: 35, chillerLoadingPct: 12, buildingLoadKW: 118, solarKW: 48, expectedGridKW: 70, tempC: 26.0 },
  { hour: 10, timeLabel: "10:00", occupancyPct: 28, chillerLoadingPct: 10, buildingLoadKW: 112, solarKW: 62, expectedGridKW: 50, tempC: 27.0 },
  { hour: 11, timeLabel: "11:00", occupancyPct: 24, chillerLoadingPct: 9, buildingLoadKW: 109, solarKW: 72, expectedGridKW: 37, tempC: 28.0 },
  { hour: 12, timeLabel: "12:00", occupancyPct: 22, chillerLoadingPct: 8, buildingLoadKW: 108, solarKW: 78, expectedGridKW: 30, tempC: 28.7 },
  { hour: 13, timeLabel: "13:00", occupancyPct: 20, chillerLoadingPct: 8, buildingLoadKW: 107, solarKW: 82, expectedGridKW: 25, tempC: 29.1 },
  { hour: 14, timeLabel: "14:00", occupancyPct: 22, chillerLoadingPct: 9, buildingLoadKW: 110, solarKW: 80, expectedGridKW: 30, tempC: 29.4 },
  { hour: 15, timeLabel: "15:00", occupancyPct: 25, chillerLoadingPct: 10, buildingLoadKW: 113, solarKW: 72, expectedGridKW: 41, tempC: 29.0 },
  { hour: 16, timeLabel: "16:00", occupancyPct: 32, chillerLoadingPct: 12, buildingLoadKW: 120, solarKW: 60, expectedGridKW: 60, tempC: 28.0 },
  { hour: 17, timeLabel: "17:00", occupancyPct: 45, chillerLoadingPct: 18, buildingLoadKW: 132, solarKW: 45, expectedGridKW: 87, tempC: 27.0 },
  { hour: 18, timeLabel: "18:00", occupancyPct: 65, chillerLoadingPct: 30, buildingLoadKW: 148, solarKW: 28, expectedGridKW: 120, tempC: 26.0 },
  { hour: 19, timeLabel: "19:00", occupancyPct: 82, chillerLoadingPct: 48, buildingLoadKW: 165, solarKW: 12, expectedGridKW: 153, tempC: 25.1 },
  { hour: 20, timeLabel: "20:00", occupancyPct: 92, chillerLoadingPct: 62, buildingLoadKW: 186, solarKW: 4, expectedGridKW: 182, tempC: 24.6 },
  { hour: 21, timeLabel: "21:00", occupancyPct: 96, chillerLoadingPct: 68, buildingLoadKW: 198, solarKW: 1, expectedGridKW: 197, tempC: 24.2 },
  { hour: 22, timeLabel: "22:00", occupancyPct: 94, chillerLoadingPct: 66, buildingLoadKW: 190, solarKW: 0, expectedGridKW: 190, tempC: 24.0 },
  { hour: 23, timeLabel: "23:00", occupancyPct: 88, chillerLoadingPct: 60, buildingLoadKW: 182, solarKW: 0, expectedGridKW: 182, tempC: 23.8 },
];

export const b14ProfileSpecs = {
  name: "Hostel Block 14 (B14)",
  type: "Residential Student Hostel (360 Rooms + 180 kWp Solar)",
  campus: "MIT Manipal, MAHE",
  coordinates: "13.345226° N, 74.795507° E",
  builtUpAreaM2: 21882,
  floors: 12,
  roomsTotal: 360,
  residentsTotal: 720,
  splitAcUnitsCount: 360,
  solarCapacityKWp: 180,
  annualGridEnergyMWh: 433.5,
  observedEPI: 27.2,
  benchmarkEPI: 24.0,
  carbonFootprintTCO2e: 289.0,
  electricityRateINR: 8.0,
};

export const b14AnomalyEventDetails = {
  eventId: "B14_EVT_001",
  title: "Overnight Split-AC Unscheduled Overrun",
  timestamp: "18 Aug 2026 · 01:00–05:00",
  status: "Needs attention",
  deviationPct: 45.1,
  actualEnergyKWh: 235,
  expectedBaselineKWh: 162,
  excessEnergyKWh: 73,
  avoidableCostLossINR: "₹1,58,400 / year",
  rootCause: "Overnight AC operation reached 88% active capacity (vs 50% normal baseline) across 360 rooms during a cool coastal night (23.4°C ambient). Lack of centralized cutoffs resulted in continuous compressor running across empty and overcooled rooms.",
  evidenceSignals: [
    { label: "Active AC Operating Rate", value: "88% (vs 50% normal baseline)" },
    { label: "Overnight Temperature", value: "23.4°C (Comfortable)" },
    { label: "Excess Energy Draw", value: "+73 kWh in 4h (+45.1%)" },
    { label: "Avoidable Emissions", value: "0.06 tCO₂e in single night" },
  ],
  telemetryFields: {
    building_id: "MIT_B14",
    power_factor: "0.93",
    rooms_occupied: "360 / 360",
    ac_operating_pct: "88%",
    ac_setpoint: "22°C (Overcooled)",
    solar_generation_kWh: "0.0 kWh",
  }
};

export const b14InterventionPortfolio: Intervention[] = [
  {
    id: "b14_ac_schedule",
    name: "Overnight AC Schedule Optimization (18:00–04:00)",
    building: "Hostel Block 14 (B14)",
    costLakh: 0.0,
    reductionMin: 16.8,
    reductionMax: 20.2,
    savingLakh: 1.58,
    payback: "Immediate",
    paybackMonths: 1,
    confidence: "High",
    evidence: ["Room sub-meter telemetry", "Smart plug thermostat scripts", "Occupancy schedule"],
  },
  {
    id: "b14_solar_geysers",
    name: "Solar-Synced Heat Pump Water Heaters",
    building: "Hostel Block 14 (B14)",
    costLakh: 1.2,
    reductionMin: 12.0,
    reductionMax: 15.4,
    savingLakh: 1.14,
    payback: "13 months",
    paybackMonths: 13,
    confidence: "High",
    evidence: ["180 kWp solar peak window (11:00–14:00)", "24 water geysers log"],
  },
  {
    id: "b14_corridor_dimming",
    name: "Corridor & Common Area Smart Motion Dimming",
    building: "Hostel Block 14 (B14)",
    costLakh: 0.45,
    reductionMin: 7.3,
    reductionMax: 9.5,
    savingLakh: 0.69,
    payback: "8 months",
    paybackMonths: 8,
    confidence: "High",
    evidence: ["5,040 m² common corridor lighting", "PIR motion sensor inventory"],
  },
  {
    id: "b14_setpoint_lock",
    name: "24°C Standard AC Setpoint Enforcement",
    building: "Hostel Block 14 (B14)",
    costLakh: 0.2,
    reductionMin: 9.7,
    reductionMax: 12.5,
    savingLakh: 0.92,
    payback: "3 months",
    paybackMonths: 3,
    confidence: "High",
    evidence: ["360 split-AC microcontroller lock", "Room temperature baseline"],
  },
];

export const b14VerificationDetails = {
  id: "verify-b14",
  title: "Overnight AC Schedule Adjustment",
  building: "Hostel Block 14 (B14)",
  auditId: "AUD-2026-B14-042",
  status: "Verified" as const,
  baselineBreakOffHoursKWh: 180,
  verifiedBreakOffHoursKWh: 158,
  dropPct: 12.2,
  annualEnergySavedKWh: 19800,
  annualCostSavedINR: 158400,
  annualCO2eSaved: 16.8,
  predictionErrorPct: 3.2,
  series: [
    { label: "W-4 (Pre)", baseline: 180, actual: 179, predictedLow: null, predictedHigh: null },
    { label: "W-3 (Pre)", baseline: 182, actual: 181, predictedLow: null, predictedHigh: null },
    { label: "W-2 (Pre)", baseline: 178, actual: 180, predictedLow: null, predictedHigh: null },
    { label: "W-1 (Pre)", baseline: 180, actual: 180, predictedLow: null, predictedHigh: null },
    { label: "Start", baseline: 180, actual: 162, predictedLow: 156, predictedHigh: 166 },
    { label: "W+1", baseline: 179, actual: 159, predictedLow: 154, predictedHigh: 164 },
    { label: "W+2", baseline: 181, actual: 158, predictedLow: 153, predictedHigh: 163 },
    { label: "W+3", baseline: 180, actual: 157, predictedLow: 152, predictedHigh: 162 },
    { label: "W+4", baseline: 180, actual: 158, predictedLow: 153, predictedHigh: 163 },
  ],
};

export const b14AskCarbonQA: AskCarbonAnswer[] = [
  {
    question: "Why did B14 show abnormal power draw between 1 AM and 5 AM on Aug 18?",
    summary:
      "Hostel Block 14 drew 235 kWh (vs 162 kWh expected baseline) because 88% of room ACs operated continuously overnight despite 23.4°C ambient night temperatures.",
    explanation:
      "Without centralized cutoff timers or setpoint enforcement, split ACs across 360 rooms ran at maximum dual-compressor capacity throughout the early morning hours.",
    recommendation:
      "Deploy B14_INT_001 (Overnight AC schedule adjustment to 04:00 AM) to save ₹1,58,400/yr and 16.8 tCO₂e with immediate payback.",
    confidence: "High",
    sources: ["360 Room Sub-meter Feeds", "Hostel Occupancy Logs", "Weather Telemetry"],
    evidence: [
      { label: "AC Operating Rate", value: "88% (vs 50% baseline)" },
      { label: "Excess Draw", value: "+73 kWh (+45.1%)" },
      { label: "Outdoor Temp", value: "23.4°C" },
      { label: "Annual Waste", value: "19,800 kWh" },
    ],
  },
  {
    question: "How does B14's 180 kWp solar array offset hostel daytime baseline?",
    summary:
      "B14 generates an average of 13,508 kWh/month from its 180 kWp (400 panel) rooftop installation, achieving a 96% self-consumption rate.",
    explanation:
      "During peak daytime windows (11:00–15:00), solar generation peaks at 82 kW, substantially reducing daytime grid dependency from 110 kW to just 28 kW.",
    recommendation:
      "Shift water heating (24 geysers) and laundry washing cycles to the 11:30 AM–02:30 PM solar peak to maximize free solar power.",
    confidence: "High",
    sources: ["180 kW Inverter Telemetry", "Hostel Sub-station Meter", "Solar PV SCADA"],
    evidence: [
      { label: "Solar Capacity", value: "180 kWp (400 panels)" },
      { label: "Self-Consumption", value: "96%" },
      { label: "Peak Solar Hour", value: "13:00 (82 kW)" },
      { label: "Monthly Output", value: "13,508 kWh avg" },
    ],
  },
  {
    question: "What is the total carbon reduction opportunity for Hostel Block 14?",
    summary:
      "B14 has a combined addressable carbon reduction of 45.8 tCO₂e/year (approx. 16% of total footprint) across 4 high-payback interventions.",
    explanation:
      "The top-ranked portfolio includes Overnight AC timing (16.8 tCO₂e), Solar heat pump geysers (12.0 tCO₂e), 24°C setpoint enforcement (9.7 tCO₂e), and corridor sensor dimming (7.3 tCO₂e).",
    recommendation:
      "Submit the 4-intervention portfolio to the campus approval queue for immediate zero-disruption hostel deployment.",
    confidence: "High",
    sources: ["Hostel Energy Audit", "Portfolio Optimizer", "Building Asset Register"],
    evidence: [
      { label: "Annual Footprint", value: "289.0 tCO₂e/yr" },
      { label: "Addressable Reduction", value: "45.8 tCO₂e/yr" },
      { label: "Bundled Payback", value: "< 5 months" },
      { label: "Annual Net Savings", value: "₹4.33 Lakh / yr" },
    ],
  },
];

// ==========================================
// KMC Central Library Deep-Dive Synthetic Data (from kmc.pdf)
// ==========================================

export const kmcMonthlyData: AB3MonthlyMetric[] = [
  { month: "Jan", totalKWh: 118000, solarKWh: 11200, gridKWh: 106800, gridBillINR: 907800, avgTempC: 22.1, context: "Normal term" },
  { month: "Feb", totalKWh: 121500, solarKWh: 12400, gridKWh: 109100, gridBillINR: 927350, avgTempC: 23.4, context: "Normal term" },
  { month: "Mar", totalKWh: 134000, solarKWh: 13100, gridKWh: 120900, gridBillINR: 1027650, avgTempC: 26.0, context: "Pre-exam prep" },
  { month: "Apr", totalKWh: 148000, solarKWh: 12800, gridKWh: 135200, gridBillINR: 1149200, avgTempC: 28.3, context: "Summer + exam peak" },
  { month: "May", totalKWh: 152000, solarKWh: 11500, gridKWh: 140500, gridBillINR: 1194250, avgTempC: 29.2, context: "High ambient chiller peak" },
  { month: "Jun", totalKWh: 122000, solarKWh: 7600, gridKWh: 114400, gridBillINR: 972400, avgTempC: 27.4, context: "Monsoon vacation" },
  { month: "Jul", totalKWh: 108000, solarKWh: 6200, gridKWh: 101800, gridBillINR: 865300, avgTempC: 26.1, context: "Term break floor" },
  { month: "Aug", totalKWh: 124000, solarKWh: 7800, gridKWh: 116200, gridBillINR: 987700, avgTempC: 26.0, context: "Term 2 start" },
  { month: "Sep", totalKWh: 126000, solarKWh: 9100, gridKWh: 116900, gridBillINR: 993650, avgTempC: 26.7, context: "Normal term" },
  { month: "Oct", totalKWh: 129500, solarKWh: 10800, gridKWh: 118700, gridBillINR: 1008950, avgTempC: 26.1, context: "Normal term" },
  { month: "Nov", totalKWh: 142000, solarKWh: 11500, gridKWh: 130500, gridBillINR: 1109250, avgTempC: 24.4, context: "University exam month" },
  { month: "Dec", totalKWh: 109000, solarKWh: 11900, gridKWh: 97100, gridBillINR: 825350, avgTempC: 22.7, context: "Winter break floor" },
];

export const kmcHourlyProfile: AB3HourlyLoad[] = [
  { hour: 0, timeLabel: "00:00", occupancyPct: 0, chillerLoadingPct: 0, buildingLoadKW: 22, solarKW: 0, expectedGridKW: 22, tempC: 23.5 },
  { hour: 1, timeLabel: "01:00", occupancyPct: 0, chillerLoadingPct: 0, buildingLoadKW: 22, solarKW: 0, expectedGridKW: 22, tempC: 23.2 },
  { hour: 2, timeLabel: "02:00", occupancyPct: 0, chillerLoadingPct: 0, buildingLoadKW: 22, solarKW: 0, expectedGridKW: 22, tempC: 23.0 },
  { hour: 3, timeLabel: "03:00", occupancyPct: 0, chillerLoadingPct: 0, buildingLoadKW: 22, solarKW: 0, expectedGridKW: 22, tempC: 22.8 },
  { hour: 4, timeLabel: "04:00", occupancyPct: 0, chillerLoadingPct: 0, buildingLoadKW: 22, solarKW: 0, expectedGridKW: 22, tempC: 22.7 },
  { hour: 5, timeLabel: "05:00", occupancyPct: 0, chillerLoadingPct: 0, buildingLoadKW: 22, solarKW: 0, expectedGridKW: 22, tempC: 22.8 },
  { hour: 6, timeLabel: "06:00", occupancyPct: 5, chillerLoadingPct: 0, buildingLoadKW: 35, solarKW: 4, expectedGridKW: 31, tempC: 24.0 },
  { hour: 7, timeLabel: "07:00", occupancyPct: 10, chillerLoadingPct: 10, buildingLoadKW: 65, solarKW: 10, expectedGridKW: 55, tempC: 24.8 },
  { hour: 8, timeLabel: "08:00", occupancyPct: 20, chillerLoadingPct: 50, buildingLoadKW: 145, solarKW: 18, expectedGridKW: 127, tempC: 25.5 },
  { hour: 9, timeLabel: "09:00", occupancyPct: 50, chillerLoadingPct: 70, buildingLoadKW: 215, solarKW: 42, expectedGridKW: 173, tempC: 27.0 },
  { hour: 10, timeLabel: "10:00", occupancyPct: 75, chillerLoadingPct: 85, buildingLoadKW: 285, solarKW: 68, expectedGridKW: 217, tempC: 28.2 },
  { hour: 11, timeLabel: "11:00", occupancyPct: 85, chillerLoadingPct: 95, buildingLoadKW: 330, solarKW: 80, expectedGridKW: 250, tempC: 29.0 },
  { hour: 12, timeLabel: "12:00", occupancyPct: 90, chillerLoadingPct: 100, buildingLoadKW: 345, solarKW: 85, expectedGridKW: 260, tempC: 29.4 },
  { hour: 13, timeLabel: "13:00", occupancyPct: 90, chillerLoadingPct: 100, buildingLoadKW: 345, solarKW: 85, expectedGridKW: 260, tempC: 29.4 },
  { hour: 14, timeLabel: "14:00", occupancyPct: 88, chillerLoadingPct: 95, buildingLoadKW: 335, solarKW: 78, expectedGridKW: 257, tempC: 29.2 },
  { hour: 15, timeLabel: "15:00", occupancyPct: 85, chillerLoadingPct: 90, buildingLoadKW: 320, solarKW: 52, expectedGridKW: 268, tempC: 28.5 },
  { hour: 16, timeLabel: "16:00", occupancyPct: 85, chillerLoadingPct: 90, buildingLoadKW: 320, solarKW: 40, expectedGridKW: 280, tempC: 28.0 },
  { hour: 17, timeLabel: "17:00", occupancyPct: 80, chillerLoadingPct: 85, buildingLoadKW: 305, solarKW: 25, expectedGridKW: 280, tempC: 27.2 },
  { hour: 18, timeLabel: "18:00", occupancyPct: 75, chillerLoadingPct: 75, buildingLoadKW: 265, solarKW: 8, expectedGridKW: 257, tempC: 26.5 },
  { hour: 19, timeLabel: "19:00", occupancyPct: 65, chillerLoadingPct: 60, buildingLoadKW: 210, solarKW: 0, expectedGridKW: 210, tempC: 25.5 },
  { hour: 20, timeLabel: "20:00", occupancyPct: 65, chillerLoadingPct: 60, buildingLoadKW: 210, solarKW: 0, expectedGridKW: 210, tempC: 25.0 },
  { hour: 21, timeLabel: "21:00", occupancyPct: 50, chillerLoadingPct: 50, buildingLoadKW: 180, solarKW: 0, expectedGridKW: 180, tempC: 24.8 },
  { hour: 22, timeLabel: "22:00", occupancyPct: 25, chillerLoadingPct: 40, buildingLoadKW: 110, solarKW: 0, expectedGridKW: 110, tempC: 24.5 },
  { hour: 23, timeLabel: "23:00", occupancyPct: 15, chillerLoadingPct: 20, buildingLoadKW: 65, solarKW: 0, expectedGridKW: 65, tempC: 24.0 },
];

export const kmcProfileSpecs = {
  name: "KMC Central Library",
  type: "Health Sciences Central Library & Research Facility",
  campus: "KMC Manipal, MAHE",
  coordinates: "13.35590° N, 74.78710° E",
  builtUpAreaM2: 13950,
  floors: 5,
  seatingCapacity: 1300,
  airConditionedAreaM2: 11500,
  chillerCapacityTR: 300,
  chillerPowerKW: 210,
  solarCapacityKWp: 120,
  annualGridEnergyMWh: 1400.4,
  observedEPI: 108.8,
  benchmarkEPI: 95.0,
  carbonFootprintTCO2e: 1120.3,
  electricityRateINR: 8.5,
};

export const kmcAnomalyEventDetails = {
  eventId: "KMC_LIB_ANOM_04",
  title: "Closed-Hours Chiller Manual Override Run",
  timestamp: "Sunday · 02:00–06:00 (Building Closed)",
  status: "Needs attention",
  deviationPct: 650.0,
  actualEnergyKWh: 165,
  expectedBaselineKWh: 22,
  excessEnergyKWh: 143,
  avoidableCostLossINR: "₹2,75,400 / year",
  rootCause: "Chiller Unit #1 (150 TR) and primary chilled water pump failed to shut down at 23:30 closing due to a manual bypass on the BMS terminal. Ran at 165 kW across 4 unoccupied Sunday hours.",
  evidenceSignals: [
    { label: "Observed Night Draw", value: "165 kW (Expected 22 kW baseline)" },
    { label: "Turnstile Occupancy", value: "0 / 1,300 (Library Closed)" },
    { label: "Active Equipment", value: "Chiller #1 (150 TR) + Primary Pump" },
    { label: "Deviation Factor", value: "+650% over baseline" },
  ],
  telemetryFields: {
    building_id: "KMC_LIB",
    power_factor: "0.94",
    chiller_units_active: "1 / 2 (Manual Override)",
    primary_air_handling: "OFF",
    solar_generation_kWh: "0.0 kWh",
  }
};

export const kmcInterventionPortfolio: Intervention[] = [
  {
    id: "kmc_bms_lock",
    name: "BMS Closed-Hours Lockout & Static Pressure Reset",
    building: "KMC Central Library",
    costLakh: 0.85,
    reductionMin: 25.9,
    reductionMax: 31.2,
    savingLakh: 2.75,
    payback: "4 months",
    paybackMonths: 4,
    confidence: "High",
    evidence: ["SCADA chiller bypass logs", "Turnstile occupancy integration", "Static pressure reset algorithms"],
  },
  {
    id: "kmc_dcv_ventilation",
    name: "Demand-Controlled Ventilation (DCV) with CO₂ Sensors",
    building: "KMC Central Library",
    costLakh: 1.8,
    reductionMin: 19.7,
    reductionMax: 24.5,
    savingLakh: 2.09,
    payback: "10 months",
    paybackMonths: 10,
    confidence: "High",
    evidence: ["10 AHU damper telemetry", "Reading hall CO₂ sensors", "1,300 seat variable occupancy"],
  },
  {
    id: "kmc_daylight_harvesting",
    name: "Reading Hall LED Daylight Harvesting & Dimming",
    building: "KMC Central Library",
    costLakh: 0.6,
    reductionMin: 11.8,
    reductionMax: 14.6,
    savingLakh: 1.26,
    payback: "6 months",
    paybackMonths: 6,
    confidence: "High",
    evidence: ["1,400 recessed troffers", "Glazing perimeter lux sensors"],
  },
  {
    id: "kmc_free_cooling",
    name: "Server Room Free-Cooling Economizer Cycle",
    building: "KMC Central Library",
    costLakh: 0.95,
    reductionMin: 9.8,
    reductionMax: 12.4,
    savingLakh: 1.04,
    payback: "11 months",
    paybackMonths: 11,
    confidence: "High",
    evidence: ["250 thin client & server rack loads", "Coastal night ambient temp logs"],
  },
];

export const kmcVerificationDetails = {
  id: "verify-kmc",
  title: "BMS Closed-Hours Lockout & Static Pressure Reset",
  building: "KMC Central Library",
  auditId: "AUD-2026-KMC-118",
  status: "Verified" as const,
  baselineBreakOffHoursKWh: 165,
  verifiedBreakOffHoursKWh: 22,
  dropPct: 86.7,
  annualEnergySavedKWh: 32400,
  annualCostSavedINR: 275400,
  annualCO2eSaved: 25.9,
  predictionErrorPct: 2.9,
  series: [
    { label: "W-4 (Pre)", baseline: 165, actual: 164, predictedLow: null, predictedHigh: null },
    { label: "W-3 (Pre)", baseline: 168, actual: 166, predictedLow: null, predictedHigh: null },
    { label: "W-2 (Pre)", baseline: 162, actual: 165, predictedLow: null, predictedHigh: null },
    { label: "W-1 (Pre)", baseline: 165, actual: 164, predictedLow: null, predictedHigh: null },
    { label: "Start", baseline: 165, actual: 26, predictedLow: 20, predictedHigh: 30 },
    { label: "W+1", baseline: 164, actual: 23, predictedLow: 19, predictedHigh: 27 },
    { label: "W+2", baseline: 166, actual: 22, predictedLow: 18, predictedHigh: 26 },
    { label: "W+3", baseline: 165, actual: 21, predictedLow: 17, predictedHigh: 25 },
    { label: "W+4", baseline: 165, actual: 22, predictedLow: 18, predictedHigh: 26 },
  ],
};

export const kmcAskCarbonQA: AskCarbonAnswer[] = [
  {
    question: "Why did KMC Library chiller plant run on Sunday at 2 AM when closed?",
    summary:
      "KMC Library consumed 165 kW across 4 hours on Sunday morning (vs 22 kW baseline) because Chiller #1 and primary pumps remained locked ON after a manual maintenance bypass.",
    explanation:
      "The 150 TR screw chiller was left running with all reading halls unpopulated, wasting 143 kWh per hour under zero thermal cooling load.",
    recommendation:
      "Deploy KMC_LIB_INT_001 (BMS Closed-Hours Lockout) to save ₹2,75,400/yr and 25.9 tCO₂e with a 4-month payback.",
    confidence: "High",
    sources: ["SCADA Plant Log", "Turnstile Entry Database", "11 kV Substation Feeder"],
    evidence: [
      { label: "Observed Power", value: "165 kW" },
      { label: "Baseline Target", value: "22 kW" },
      { label: "Occupancy Count", value: "0 Occupants" },
      { label: "Avoidable Cost", value: "₹2.75L / year" },
    ],
  },
  {
    question: "How does the 120 kWp solar PV array contribute to KMC Library daytime peak?",
    summary:
      "The 120 kWp rooftop solar installation generates an average of 9,800 kWh/month, offsetting 25% of afternoon library peak air-conditioning load.",
    explanation:
      "Between 11:00 AM and 03:00 PM, solar generation peaks at 85 kW, directly buffering the 345 kW dual-chiller demand during high ambient heat periods.",
    recommendation:
      "Implement Demand-Controlled Ventilation (DCV) to compound peak solar savings by throttling unoccupied reading zones.",
    confidence: "High",
    sources: ["120 kWp Inverter SCADA", "Building Power Sub-meter", "Weather Station"],
    evidence: [
      { label: "Solar Array Size", value: "120 kWp" },
      { label: "Peak Generation", value: "85 kW (12:00–14:00)" },
      { label: "Monthly Output", value: "9,800 kWh" },
      { label: "Peak Offset Rate", value: "25% of 345 kW" },
    ],
  },
  {
    question: "What is the total carbon reduction opportunity for KMC Health Sciences Library?",
    summary:
      "KMC Central Library has a combined addressable carbon reduction of 67.2 tCO₂e/year (approx. 6% of total campus facility load) across 4 high-confidence interventions.",
    explanation:
      "The top-ROI portfolio combines BMS Closed-Hours Lockouts (25.9 tCO₂e), Demand-Controlled Ventilation (19.7 tCO₂e), Daylight Harvesting (11.8 tCO₂e), and Free-cooling Economizers (9.8 tCO₂e) with a bundled payback under 8 months.",
    recommendation:
      "Bundle these 4 verified measures into the central university capital approval queue for immediate net savings of ₹7.14 Lakh/yr.",
    confidence: "High",
    sources: ["Central Energy Audit", "Portfolio Optimizer", "M&V Baseline Ledger"],
    evidence: [
      { label: "Annual Footprint", value: "1,120.3 tCO₂e/yr" },
      { label: "Target Reduction", value: "67.2 tCO₂e/yr" },
      { label: "Bundled Payback", value: "< 8 months" },
      { label: "Annual Net Savings", value: "₹7.14 Lakh / yr" },
    ],
  },
];

// ==========================================
// Universal Building Deep-Dive Data Resolver
// ==========================================

export function getBuildingDeepDiveData(buildingId: string = "ab3") {
  const normalized = buildingId.toLowerCase();
  if (normalized === "b14" || normalized.includes("14") || normalized.includes("hostel-b14")) {
    return {
      buildingId: "b14",
      specs: b14ProfileSpecs,
      monthlyData: b14MonthlyData,
      hourlyProfile: b14HourlyProfile,
      anomalyDetails: b14AnomalyEventDetails,
      interventions: b14InterventionPortfolio,
      verification: b14VerificationDetails,
      askCarbonQA: b14AskCarbonQA,
    };
  }

  if (normalized === "kmc" || normalized.includes("library") || normalized.includes("health")) {
    return {
      buildingId: "kmc",
      specs: kmcProfileSpecs,
      monthlyData: kmcMonthlyData,
      hourlyProfile: kmcHourlyProfile,
      anomalyDetails: kmcAnomalyEventDetails,
      interventions: kmcInterventionPortfolio,
      verification: kmcVerificationDetails,
      askCarbonQA: kmcAskCarbonQA,
    };
  }

  // Default to AB3
  return {
    buildingId: "ab3",
    specs: ab3ProfileSpecs,
    monthlyData: ab3MonthlyData,
    hourlyProfile: ab3HourlyProfile,
    anomalyDetails: ab3AnomalyEventDetails,
    interventions: ab3InterventionPortfolio,
    verification: ab3VerificationDetails,
    askCarbonQA: ab3AskCarbonQA,
  };
}


