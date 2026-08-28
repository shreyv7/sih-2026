import { useState, useMemo, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Layers,
  Percent,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  getBuildingDeepDiveData,
  type Intervention,
} from "@/lib/carbon-data";
import { useCarbon } from "@/lib/carbon-store";
import { cn } from "@/lib/utils";

interface BuildingDeepDiveProps {
  buildingId?: string;
  onJumpToSection?: (sectionId: string) => void;
}

type TooltipEntry = {
  dataKey?: string;
  name?: string;
  value?: number | string | null;
  stroke?: string;
  fill?: string;
};

type TooltipState = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
};

export function BuildingDeepDive({
  buildingId = "ab3",
  onJumpToSection,
}: BuildingDeepDiveProps) {
  const { addApproval, setApprovalsOpen } = useCarbon();

  // Load building specific data
  const data = useMemo(() => getBuildingDeepDiveData(buildingId), [buildingId]);
  const {
    specs,
    monthlyData,
    hourlyProfile,
    anomalyDetails,
    interventions,
    verification,
    askCarbonQA,
  } = data;

  // State for Section 1: Visual switcher (Monthly vs 24-hr)
  const [measurementTab, setMeasurementTab] = useState<"monthly" | "hourly">("hourly");

  // State for Section 3: Action Lab optimizer
  const [budget, setBudget] = useState<number>(3.0);
  const [selectedInterventionIds, setSelectedInterventionIds] = useState<string[]>([]);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // Initialize selected interventions whenever building changes
  useEffect(() => {
    setSelectedInterventionIds(interventions.slice(0, 3).map((item) => item.id));
    setActiveQuery("");
    setInputPrompt("");
    setApprovalSubmitted(false);
  }, [buildingId, interventions]);

  // State for Section 5: Ask Carbon Prompt
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [activeQuery, setActiveQuery] = useState<string>("");

  // Computed for Action Lab
  const activeInterventions = useMemo(
    () =>
      interventions.filter((item) =>
        selectedInterventionIds.includes(item.id)
      ),
    [interventions, selectedInterventionIds]
  );

  const totalCost = useMemo(
    () => activeInterventions.reduce((sum, item) => sum + item.costLakh, 0),
    [activeInterventions]
  );

  const totalReduction = useMemo(
    () =>
      activeInterventions.reduce(
        (sum, item) => sum + (item.reductionMin + item.reductionMax) / 2,
        0
      ),
    [activeInterventions]
  );

  const totalSavings = useMemo(
    () => activeInterventions.reduce((sum, item) => sum + item.savingLakh, 0),
    [activeInterventions]
  );

  // What-if simulated data
  const whatIfSeries = useMemo(() => {
    const baselineMax = Math.max(...monthlyData.map((m) => m.totalKWh / 1000 * 0.8), 30);
    const ratio = Math.min(totalReduction / (specs.carbonFootprintTCO2e || 80), 0.55);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return months.map((m, i) => {
      const monthMetric = monthlyData.find((item) => item.month === m);
      const base = monthMetric ? Number((monthMetric.gridKWh * 0.8 / 1000).toFixed(1)) : 25;
      const ramp = Math.min(1, (i + 1) / 3.5);
      return {
        month: m,
        baseline: base,
        simulated: Number((base * (1 - ratio * ramp)).toFixed(1)),
      };
    });
  }, [monthlyData, specs.carbonFootprintTCO2e, totalReduction]);

  const toggleIntervention = (id: string) => {
    setSelectedInterventionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setApprovalSubmitted(false);
  };

  const handleSendForApproval = () => {
    const first = activeInterventions[0];
    addApproval({
      title:
        activeInterventions.length === 1
          ? first?.name ?? `${specs.name} Optimization Action`
          : `${specs.name} Portfolio (${activeInterventions.length} Actions)`,
      building: specs.name,
      reductionMin: Math.round(totalReduction * 0.9),
      reductionMax: Math.round(totalReduction * 1.1),
      savingLakh: Number(totalSavings.toFixed(2)),
      confidence: "High",
      evidence: [
        `${specs.name} Telemetry Ingestion`,
        "SCADA / Sub-meter feeds",
        "Calibrated M&V Baseline",
      ],
    });
    setApprovalSubmitted(true);
    setTimeout(() => {
      setApprovalsOpen(true);
    }, 600);
  };

  const activeQA = useMemo(() => {
    if (!activeQuery) return null;
    const q = activeQuery.toLowerCase().trim();
    const matched = askCarbonQA.find((item) => item.question === activeQuery);
    if (matched) return matched;

    if (q.includes("chiller") || q.includes("ac") || q.includes("overnight") || q.includes("dec") || q.includes("aug") || q.includes("sunday")) {
      return askCarbonQA[0]!;
    }
    if (q.includes("solar") || q.includes("load") || q.includes("rooftop") || q.includes("generation") || q.includes("offset")) {
      return askCarbonQA[1]!;
    }
    if (q.includes("carbon") || q.includes("reduction") || q.includes("opportunity") || q.includes("saving") || q.includes("footprint")) {
      return askCarbonQA[2]!;
    }

    return {
      question: activeQuery,
      summary: `${specs.name} has an audited baseline footprint of ${specs.carbonFootprintTCO2e} tCO₂e/yr. Across 4 prioritized energy & HVAC interventions, it has an addressable reduction opportunity with payback under 12 months.`,
      explanation: `Telemetry indicates peak loads are driven by HVAC and cooling, offset by the ${specs.solarCapacityKWp} kWp rooftop solar installation.`,
      recommendation: `Deploy high-confidence actions for ${specs.name} to maximize grid tariff savings.`,
      confidence: "High",
      sources: [`${specs.name} Sub-metering`, "Telemetry Feed"],
      evidence: [],
    };
  }, [activeQuery, askCarbonQA, specs]);


  return (
    <div className="space-y-10 pb-16">
      {/* ========================================================================= */}
      {/* SECTION 1: CARBON-LOOP™ MEASUREMENT (Measure) */}
      {/* ========================================================================= */}
      <section
        id="section-measurement"
        className="scroll-mt-6 rounded-3xl border border-white/10 bg-slate-950/75 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition hover:border-white/20"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
              <Activity className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  STAGE 1 · CONTINUOUS MEASUREMENT
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Telemetry Active
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Energy & Carbon Baseload Telemetry · {specs.name}
              </h3>
            </div>
          </div>

          {/* Switcher: 24h Profile vs Monthly Seasons */}
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMeasurementTab("hourly")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer",
                measurementTab === "hourly"
                  ? "bg-emerald-400 text-slate-950 shadow"
                  : "text-slate-300 hover:text-white"
              )}
            >
              24-Hour Profile
            </button>
            <button
              type="button"
              onClick={() => setMeasurementTab("monthly")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-semibold transition cursor-pointer",
                measurementTab === "monthly"
                  ? "bg-emerald-400 text-slate-950 shadow"
                  : "text-slate-300 hover:text-white"
              )}
            >
              12-Month Trend
            </button>
          </div>
        </div>

        {/* Top 4 Metric KPI Strip */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Carbon Footprint
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-white">
              {specs.carbonFootprintTCO2e}{" "}
              <span className="text-xs font-normal text-slate-400">tCO₂e/yr</span>
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <TrendingUp className="size-3" />
              <span>Scope 2 Baseline</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Annual Energy
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-white">
              {specs.annualGridEnergyMWh}{" "}
              <span className="text-xs font-normal text-slate-400">MWh/yr</span>
            </p>
            <p className="mt-1 text-[11px] text-emerald-400 font-medium">
              Rate: ₹{specs.electricityRateINR}/kWh
            </p>
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Observed EPI Benchmark
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-white">
              {specs.observedEPI}{" "}
              <span className="text-xs font-normal text-slate-400">kWh/m²</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              ECBC Ref: {specs.benchmarkEPI} kWh/m²
            </p>
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Rooftop Solar Yield
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-400">
              {specs.solarCapacityKWp} <span className="text-xs font-normal text-slate-400">kWp</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-300">
              Grid-Tied Rooftop PV
            </p>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="mt-5 rounded-2xl border border-white/8 bg-slate-900/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              {measurementTab === "hourly"
                ? "24-Hour Diurnal Power Flow (Building Load kW vs Solar Output kW vs Grid Draw)"
                : "12-Month Energy Profile (Grid Draw vs Rooftop Solar vs Average Temp)"}
            </span>
            <span className="text-[11px] text-slate-400">
              {measurementTab === "hourly"
                ? `Peak Load: ${Math.max(...hourlyProfile.map((h) => h.buildingLoadKW))} kW`
                : `Annual Load: ${monthlyData.reduce((sum, m) => sum + m.totalKWh, 0).toLocaleString()} kWh`}
            </span>
          </div>

          {measurementTab === "hourly" ? (
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={hourlyProfile} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.3} vertical={false} />
                  <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" kW" width={50} />
                  <Tooltip content={<CustomHourlyTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="solarKW"
                    name="Solar Generation"
                    fill="#38bdf8"
                    fillOpacity={0.25}
                    stroke="#38bdf8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="buildingLoadKW"
                    name="Building Load"
                    stroke="#34d399"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expectedGridKW"
                    name="Net Grid Draw"
                    stroke="#f59e0b"
                    strokeWidth={1.8}
                    strokeDasharray="4 3"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.3} vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="k" width={40} tickFormatter={(v) => `${(v / 1000).toFixed(0)}`} />
                  <Tooltip content={<CustomMonthlyTooltip />} />
                  <Bar dataKey="gridKWh" name="Grid Electricity" fill="#38bdf8" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="solarKWh" name="Solar Self-Consumed" fill="#34d399" radius={[4, 4, 0, 0]} stackId="a" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Load Breakdown and Asset Profile Specifications */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Load Split */}
          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Sub-load Distribution</span>
              <span className="text-[10px] text-slate-400">Primary Systems</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                  <span>HVAC & Cooling Systems</span>
                  <span className="font-bold text-amber-400">58%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "58%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                  <span>Power, Plug & Equipment Loads</span>
                  <span className="font-bold text-cyan-400">24%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: "24%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                  <span>Interior & Exterior Lighting</span>
                  <span className="font-bold text-emerald-400">18%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: "18%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Specs */}
          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5 flex flex-col justify-between text-xs space-y-1">
            <span className="font-semibold text-slate-300">Building Hardware Specs ({specs.name})</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="rounded-lg bg-black/30 p-2 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Structure Type</span>
                <strong className="text-white truncate block">{specs.type}</strong>
              </div>
              <div className="rounded-lg bg-black/30 p-2 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Floors</span>
                <strong className="text-white">{specs.floors} Levels</strong>
              </div>
              <div className="rounded-lg bg-black/30 p-2 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Built-up Area</span>
                <strong className="text-white">{specs.builtUpAreaM2.toLocaleString()} m²</strong>
              </div>
              <div className="rounded-lg bg-black/30 p-2 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Solar PV</span>
                <strong className="text-emerald-300">{specs.solarCapacityKWp} kWp Array</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ROOT CAUSE DIAGNOSIS & ANOMALY ENGINE (Detect & Diagnose) */}
      {/* ========================================================================= */}
      <section
        id="section-diagnosis"
        className="scroll-mt-6 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-950/80 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition hover:border-amber-500/50"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400">
                  STAGE 2 · DETECT & DIAGNOSE
                </span>
                <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                  Active Anomaly Flagged
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {anomalyDetails.title} ({anomalyDetails.eventId})
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Incident Window</span>
            <span className="text-xs font-bold text-amber-300">
              {anomalyDetails.timestamp}
            </span>
          </div>
        </div>

        {/* Narrative & Anomaly Difference */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12 items-center">
          <div className="space-y-3 lg:col-span-8">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-xs font-semibold text-amber-300">
                Root Cause Synthesis (Hardware-Agnostic Analytical Engine)
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
                {anomalyDetails.rootCause}
              </p>
            </div>

            {/* Evidence Signals Matrix */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {anomalyDetails.evidenceSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-xl border border-white/6 bg-black/40 p-2.5"
                >
                  <p className="text-[10px] text-slate-400">{signal.label}</p>
                  <p className="mt-1 text-xs font-bold text-white">{signal.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Impact Badge */}
          <div className="rounded-2xl border border-amber-500/30 bg-black/60 p-4 lg:col-span-4 space-y-3 text-center">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                Baseline Deviation
              </p>
              <p className="text-3xl font-extrabold text-amber-300">
                +{anomalyDetails.deviationPct}%
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {anomalyDetails.actualEnergyKWh} kWh vs {anomalyDetails.expectedBaselineKWh} kWh baseline
              </p>
            </div>

            <div className="border-t border-white/10 pt-2.5">
              <p className="text-[10px] uppercase text-slate-400">Avoidable Financial Loss</p>
              <p className="text-lg font-bold text-white">
                {anomalyDetails.avoidableCostLossINR}
              </p>
            </div>
          </div>
        </div>

        {/* Telemetry Debug Log */}
        <div className="mt-4 rounded-xl border border-white/6 bg-black/50 p-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="font-mono text-emerald-400">telemetry_ingestion ({specs.name})</span>
            <span>Canonical Data Schema · Tier 1 IoT/BMS</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 font-mono text-[10px]">
            {Object.entries(anomalyDetails.telemetryFields).map(([key, val]) => (
              <div key={key} className="rounded bg-white/4 p-1.5">
                <span className="text-slate-500 block truncate">{key}</span>
                <span className="text-slate-200 font-semibold truncate">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: ACTION LAB & BUDGET OPTIMIZATION (Optimize & Execute) */}
      {/* ========================================================================= */}
      <section
        id="section-actions"
        className="scroll-mt-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-950/90 to-cyan-950/20 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition hover:border-cyan-500/50"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                  STAGE 3 · ACTION LAB & SIMULATION
                </span>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                  Closed-Loop Optimizer
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Prioritized Interventions & What-If Forecast
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Selected Portfolio Impact</span>
            <span className="text-xs font-bold text-emerald-400 ml-1.5">
              -{totalReduction.toFixed(1)} tCO₂e/yr
            </span>
          </div>
        </div>

        {/* Budget Controller Slider */}
        <div className="mt-5 rounded-2xl border border-white/8 bg-slate-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Institutional Budget Constraint
              </p>
              <p className="text-2xl font-bold text-white">
                ₹{(budget * 100000).toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-slate-400">
                  (Selected CAPEX: ₹{totalCost.toFixed(2)}L)
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/30 px-3 py-1.5 text-center">
                <span className="text-[10px] text-slate-400 block">Annual Bill Savings</span>
                <span className="text-sm font-bold text-emerald-300">₹{totalSavings.toFixed(2)}L/yr</span>
              </div>
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 px-3 py-1.5 text-center">
                <span className="text-[10px] text-slate-400 block">Payback Period</span>
                <span className="text-sm font-bold text-cyan-300">
                  {totalCost > 0 && totalSavings > 0
                    ? `${((totalCost / totalSavings) * 12).toFixed(0)} Months`
                    : "Immediate"}
                </span>
              </div>
            </div>
          </div>

          <input
            type="range"
            min="0.5"
            max="10"
            step="0.1"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-emerald-400"
          />
        </div>

        {/* 2-Column: Intervention Cards on Left, What-If Chart on Right */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Interventions Selection List */}
          <div className="space-y-2.5 lg:col-span-7">
            <p className="text-xs font-semibold text-slate-300">
              Ranked Candidate Interventions (Toggle to simulate):
            </p>
            {interventions.map((item) => {
              const isSelected = selectedInterventionIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleIntervention(item.id)}
                  className={cn(
                    "w-full rounded-2xl border p-3.5 text-left transition cursor-pointer flex flex-col gap-2",
                    isSelected
                      ? "border-emerald-400/40 bg-emerald-950/25 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                      : "border-white/8 bg-white/4 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-4 rounded-full flex items-center justify-center text-[9px] font-bold border",
                          isSelected
                            ? "bg-emerald-400 border-emerald-300 text-slate-950"
                            : "border-white/20 text-transparent"
                        )}
                      >
                        ✓
                      </span>
                      <strong className="text-xs sm:text-sm text-white font-semibold">
                        {item.name}
                      </strong>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">
                      -{item.reductionMin}–{item.reductionMax} tCO₂e
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1 border-t border-white/5">
                    <div>
                      <span className="text-slate-500 block text-[10px]">CAPEX</span>
                      <strong className="text-white">₹{item.costLakh}L</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Annual Save</span>
                      <strong className="text-emerald-300">₹{item.savingLakh}L/yr</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Payback</span>
                      <strong className="text-cyan-300">{item.payback}</strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* What-If Curve & CTA */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/8 bg-slate-900/60 p-4 lg:col-span-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Simulated Trajectory (tCO₂e)</span>
                <span className="text-emerald-400 font-bold">
                  -{totalReduction.toFixed(0)} tCO₂e/yr Net Drop
                </span>
              </div>
              <div className="h-[170px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={whatIfSeries} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.25} vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" t" />
                    <Tooltip content={<CustomWhatIfTooltip />} />
                    <Area type="monotone" dataKey="baseline" stroke="#64748b" fill="#334155" fillOpacity={0.2} strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="simulated" stroke="#34d399" strokeWidth={2.5} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Approval Action Button */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <Button
                type="button"
                disabled={activeInterventions.length === 0}
                onClick={handleSendForApproval}
                className={cn(
                  "w-full h-11 rounded-xl font-bold transition shadow-lg cursor-pointer flex items-center justify-center gap-2",
                  approvalSubmitted
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:from-emerald-300 hover:to-cyan-300"
                )}
              >
                {approvalSubmitted ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    <span>Sent to Approvals Panel</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Send {activeInterventions.length} Actions for Human Approval</span>
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-slate-400">
                Human-in-the-loop: Requires Facility Manager authorization before execution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MEASUREMENT & VERIFICATION (Verify & Learn) */}
      {/* ========================================================================= */}
      <section
        id="section-verification"
        className="scroll-mt-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-950/90 to-emerald-950/20 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition hover:border-emerald-500/50"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  STAGE 4 · MEASUREMENT & VERIFICATION
                </span>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Post-Intervention Verified
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {verification.title}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Audit Proof Ledger</span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {verification.auditId}
            </span>
          </div>
        </div>

        {/* Verification Cards */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Off-Hours Baseline
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-300">
              {verification.baselineBreakOffHoursKWh}{" "}
              <span className="text-xs font-normal text-slate-500">kWh/day</span>
            </p>
            <p className="mt-1 text-[10px] text-slate-400">Unconstrained operation</p>
          </div>

          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-950/20 p-3.5">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
              Normalized Actual
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-300">
              {verification.verifiedBreakOffHoursKWh}{" "}
              <span className="text-xs font-normal text-emerald-400">kWh/day</span>
            </p>
            <p className="mt-1 text-[11px] font-bold text-emerald-400">
              -{verification.dropPct}% Verified Drop
            </p>
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Realized Annual Save
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-white">
              ₹{(verification.annualCostSavedINR).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              {verification.annualEnergySavedKWh.toLocaleString()} kWh/yr saved
            </p>
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/4 p-3.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Prediction Accuracy
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-cyan-400">
              {100 - verification.predictionErrorPct}%
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              Error: {verification.predictionErrorPct}% vs Forecast
            </p>
          </div>
        </div>

        {/* Verification Timeline Chart */}
        <div className="mt-5 rounded-2xl border border-white/8 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span>Pre vs Post Intervention M&V Trajectory (Off-Hours kWh)</span>
            <span className="text-emerald-400">Intervention Start Marked</span>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={verification.series} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.25} vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit=" kWh" />
                <Tooltip content={<CustomVerificationTooltip />} />
                <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.8} dot={false} name="Expected Baseline" />
                <Line type="monotone" dataKey="actual" stroke="#34d399" strokeWidth={2.8} dot={{ fill: "#34d399", r: 3 }} name="Actual Measured" />
                <ReferenceLine x="Start" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Intervention Deployed", fill: "#f59e0b", fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: CONTEXTUAL INTELLIGENCE / PROMPT AI */}
      {/* ========================================================================= */}
      <section
        id="section-ask"
        className="scroll-mt-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-950/90 to-indigo-950/20 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition hover:border-indigo-500/50 flex flex-col justify-between"
      >
        {/* Chatbot Header */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300 border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Bot className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-400">
                  STAGE 5 · EVIDENCE-GROUNDED AI
                </span>
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                  Deterministic Provenance
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Contextual Intelligence for {specs.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Assistant Active</span>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="my-5 min-h-[140px] space-y-4">
          {!activeQA ? (
            /* Initial Welcoming Bot Message */
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Bot className="size-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-slate-900/90 border border-white/10 px-4 py-3 text-sm text-slate-300 shadow-md max-w-2xl leading-relaxed">
                <p>
                  Hello! Ask me any question regarding {specs.name}'s energy consumption, solar generation, HVAC diagnostics, or carbon reduction opportunities. Select a standard prompt below or type your question to begin.
                </p>
              </div>
            </div>
          ) : (
            /* Q&A Chat Conversation */
            <div className="space-y-4">
              {/* User Question (Right aligned) */}
              <div className="flex items-start justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-2.5 text-sm text-white shadow-md max-w-[85%] leading-relaxed">
                  <p className="font-medium">{activeQA.question}</p>
                </div>
              </div>

              {/* Bot Answer (Left aligned) */}
              <div className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mt-0.5">
                  <Bot className="size-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-slate-900/90 border border-indigo-500/30 p-4 text-sm text-slate-200 shadow-md space-y-2.5 max-w-[90%] backdrop-blur-md">
                  <p className="font-medium text-white leading-relaxed">{activeQA.summary}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeQA.explanation}</p>
                  {activeQA.recommendation && (
                    <div className="mt-2 rounded-xl border border-emerald-500/20 bg-emerald-950/25 p-3 text-xs text-emerald-200">
                      <strong className="text-emerald-400 font-semibold block mb-0.5">Recommended Action:</strong>
                      {activeQA.recommendation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Area: Standard Prompts & Input Box */}
        <div className="mt-auto border-t border-indigo-500/20 pt-4 space-y-3">
          {/* Standard Prompts Chips */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-slate-400">Standard Prompts:</p>
            <div className="flex flex-wrap gap-2">
              {askCarbonQA.map((item) => (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => {
                    setInputPrompt(item.question);
                    setActiveQuery(item.question);
                  }}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition cursor-pointer text-left",
                    activeQuery === item.question
                      ? "border-indigo-400/60 bg-indigo-500/25 text-white shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  )}
                >
                  {item.question}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputPrompt.trim()) {
                setActiveQuery(inputPrompt.trim());
              }
            }}
            className="relative flex items-center pt-1"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Ask about ${specs.name} energy, anomalies, solar sync, reduction...`}
                className="w-full rounded-2xl border border-indigo-500/30 bg-slate-900/80 py-3.5 pl-4 pr-24 text-sm text-white placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 backdrop-blur-md"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-95 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <span>Ask</span>
                <Send className="size-3.5" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

// Tooltips
function CustomHourlyTooltip({ active, payload, label }: TooltipState) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-slate-950/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <p className="font-bold text-white mb-1.5">Time: {label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="size-2 rounded-full" style={{ background: p.stroke || p.fill }} />
            {p.name}:
          </span>
          <span className="font-bold text-white font-mono">{p.value} kW</span>
        </div>
      ))}
    </div>
  );
}

function CustomMonthlyTooltip({ active, payload, label }: TooltipState) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-slate-950/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <p className="font-bold text-white mb-1.5">Month: {label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="size-2 rounded-full" style={{ background: p.stroke || p.fill }} />
            {p.name}:
          </span>
          <span className="font-bold text-white font-mono">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value} kWh
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomWhatIfTooltip({ active, payload, label }: TooltipState) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-slate-950/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <p className="font-bold text-white mb-1.5">Month: {label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="size-2 rounded-full" style={{ background: p.stroke || p.fill }} />
            {p.name === "baseline" ? "Historical Baseline" : "Simulated Path"}:
          </span>
          <span className="font-bold text-white font-mono">{p.value} tCO₂e</span>
        </div>
      ))}
    </div>
  );
}

function CustomVerificationTooltip({ active, payload, label }: TooltipState) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-slate-950/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      <p className="font-bold text-white mb-1.5">Interval: {label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="size-2 rounded-full" style={{ background: p.stroke || p.fill }} />
            {p.name}:
          </span>
          <span className="font-bold text-white font-mono">{p.value} kWh</span>
        </div>
      ))}
    </div>
  );
}
