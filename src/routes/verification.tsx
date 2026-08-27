import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import {
  ConfidenceBadge,
  PageHeader,
  Panel,
  PanelHeader,
  Stat,
  StatusBadge,
} from "@/components/carbon/primitives";
import { verificationLedger, verificationScenarios } from "@/lib/carbon-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "Verification · Carbon Autopilot" },
      {
        name: "description",
        content: "Predicted versus realized savings, audit ledger, and verification status.",
      },
    ],
  }),
  component: VerificationRoute,
});

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

function VerificationRoute() {
  const [selectedId, setSelectedId] = useState(verificationScenarios[0]?.id ?? "");
  const scenario = useMemo(
    () => verificationScenarios.find((item) => item.id === selectedId) ?? verificationScenarios[0],
    [selectedId],
  );

  if (!scenario) return null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader title="Verification" subtitle="Did the intervention actually work?" />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <PanelHeader
            title={`${scenario.title} · ${scenario.building}`}
            subtitle="Normalized post-intervention performance"
          />
          <div className="space-y-5 p-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Stat label="Baseline" value={`${scenario.baselineMWh} MWh`} />
              <Stat label="Normalized actual" value={`${scenario.verifiedMWh} MWh`} />
              <Stat
                label="Verified saving"
                value={`${scenario.baselineMWh - scenario.verifiedMWh} MWh`}
                tone="good"
              />
              <Stat
                label="Prediction error"
                value={`${scenario.predictionErrorPct}%`}
                tone="forecast"
              />
            </div>
            <div className="grid gap-4 rounded-md border border-primary/25 bg-primary/8 p-4 sm:grid-cols-3">
              <Stat label="Predicted" value={`${scenario.predictedTco2e} tCO₂e`} />
              <Stat label="Verified" value={`${scenario.verifiedTco2e} tCO₂e`} tone="good" />
              <div className="space-y-2">
                <p className="label-xs">Status</p>
                <StatusBadge status={scenario.status} />
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Verified savings to date"
            subtitle="Calculated from normalized post-intervention performance"
          />
          <div className="space-y-4 p-5">
            <p className="num text-4xl font-semibold tracking-tight text-foreground">186 tCO₂e</p>
            <p className="num text-lg text-muted-foreground">₹21.4L estimated realized savings</p>
            <ConfidenceBadge level={scenario.status === "Verified" ? "High" : "Medium"} />
            <div className="rounded-md border border-border bg-elevated/50 p-4 text-sm text-muted-foreground">
              Audit ID · <span className="num text-foreground">{scenario.auditId}</span>
            </div>
            <div className="space-y-2">
              {verificationScenarios.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-3 py-3 text-left transition-colors",
                    item.id === scenario.id
                      ? "border-primary/35 bg-primary/10"
                      : "border-border bg-card hover:border-border-strong",
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.building}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </button>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <PanelHeader
            title="Predicted vs realized savings"
            subtitle="Predicted savings range, actual normalized result, and intervention start marker"
          />
          <div className="p-5">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart
                data={scenario.series}
                margin={{ top: 4, right: 12, bottom: 0, left: -18 }}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={46}
                  unit=" t"
                />
                <Tooltip
                  content={<VerificationTooltip />}
                  cursor={{ stroke: "var(--border-strong)" }}
                />
                <Area
                  dataKey="predictedHigh"
                  stroke="none"
                  fill="var(--forecast)"
                  fillOpacity={0.14}
                />
                <Area
                  dataKey="predictedLow"
                  stroke="none"
                  fill="var(--background)"
                  fillOpacity={1}
                />
                <Line
                  dataKey="predictedHigh"
                  stroke="var(--forecast)"
                  strokeWidth={1.7}
                  dot={false}
                  strokeDasharray="5 4"
                  name="Predicted range high"
                />
                <Line
                  dataKey="predictedLow"
                  stroke="var(--forecast)"
                  strokeWidth={1.7}
                  dot={false}
                  strokeDasharray="5 4"
                  name="Predicted range low"
                />
                <Line
                  dataKey="actual"
                  stroke="var(--primary)"
                  strokeWidth={2.4}
                  dot={false}
                  name="Actual normalized"
                />
                <ReferenceLine
                  x="Start"
                  stroke="var(--attention)"
                  strokeDasharray="4 4"
                  label={{ value: "Intervention start", fill: "var(--attention)", fontSize: 11 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Verification ledger" subtitle="Transaction-style audit view" />
          <div className="space-y-3 p-5">
            {verificationLedger.map((entry) => (
              <div
                key={entry.auditId}
                className="rounded-md border border-border bg-elevated/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {entry.date} · {entry.building}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{entry.intervention}</p>
                  </div>
                  <StatusBadge status={entry.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="label-xs">Predicted</p>
                    <p className="num mt-1 text-foreground">{entry.predicted}</p>
                  </div>
                  <div>
                    <p className="label-xs">Verified</p>
                    <p className="num mt-1 text-foreground">{entry.verified}</p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Audit ID · <span className="num text-foreground">{entry.auditId}</span>
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function VerificationTooltip({ active, payload, label }: TooltipState) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((entry, index) => (
        <p key={`${entry.dataKey}-${entry.name || index}`} className="num flex items-center gap-2 text-muted-foreground">
          <span
            className="size-1.5 rounded-full"
            style={{ background: entry.stroke || entry.fill }}
          />
          {entry.name}
          <span className="ml-auto font-medium text-foreground">{entry.value} tCO₂e</span>
        </p>
      ))}
    </div>
  );
}
