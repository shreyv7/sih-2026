import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ConfidenceBadge,
  EvidencePanel,
  KpiCard,
  PageHeader,
  Panel,
  PanelHeader,
  Stat,
} from "@/components/carbon/primitives";
import { alerts, buildings, energySeries, kpis, type Alert } from "@/lib/carbon-data";
import { useCarbon } from "@/lib/carbon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center · Carbon Autopilot" },
      {
        name: "description",
        content:
          "Campus carbon operations command center: detect anomalies, diagnose causes and act on the highest-impact interventions.",
      },
      { property: "og:title", content: "Command Center · Carbon Autopilot" },
      {
        property: "og:description",
        content:
          "Detect, diagnose and act on campus emissions with evidence-backed recommendations.",
      },
    ],
  }),
  component: CommandCenter,
});

const periods = ["24h", "7d", "30d"] as const;

function CommandCenter() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("24h");
  const [buildingId, setBuildingId] = useState("all");
  const [openAlert, setOpenAlert] = useState<Alert | null>(null);
  const navigate = useNavigate();
  const { setFocusIntervention } = useCarbon();

  const data = useMemo(() => energySeries(period, buildingId), [period, buildingId]);
  const anomalyPoint = data.find((d) => d.anomaly);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Command Center"
        subtitle="Campus carbon operations · Today"
        right={
          <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Data updated 14 min ago
          </span>
        }
      />

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-4 md:px-0">
        <KpiCard
          label="Monthly emissions"
          value={kpis.monthlyEmissions.toLocaleString("en-IN")}
          unit="tCO₂e"
          delta={`↓ ${Math.abs(kpis.monthlyDeltaPct)}%`}
          deltaTone="good"
          note="vs last month"
        />
        <KpiCard
          label="Verified savings"
          value={String(kpis.verifiedSavings)}
          unit="tCO₂e"
          delta={`↑ ${kpis.verifiedDeltaPct}%`}
          deltaTone="good"
          note="this quarter"
        />
        <KpiCard
          label="Active anomalies"
          value={String(kpis.activeAnomalies)}
          delta={`${kpis.highPriorityAnomalies} high priority`}
          deltaTone="bad"
        />
        <KpiCard
          label="Actions in progress"
          value={String(kpis.actionsInProgress)}
          note="3 awaiting approval"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.9fr_1fr]">
        <Panel>
          <PanelHeader
            title="Energy use vs expected baseline"
            subtitle="Modeled baseline · simulated forecast band"
            right={
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  className="rounded-md border border-border bg-elevated px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-border-strong"
                >
                  <option value="all">All buildings</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <div className="flex rounded-md border border-border bg-elevated p-0.5">
                  {periods.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={cn(
                        "rounded px-2.5 py-1 text-xs transition-colors",
                        period === p
                          ? "bg-primary/15 font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
          <div className="px-2 pt-4 pb-3">
            <ResponsiveContainer width="100%" height={286}>
              <ComposedChart data={data} margin={{ top: 6, right: 16, bottom: 0, left: -12 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="t"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  interval="preserveStartEnd"
                  minTickGap={18}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  unit=" kW"
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border-strong)" }} />
                <Area
                  dataKey="bandHigh"
                  stroke="none"
                  fill="var(--forecast)"
                  fillOpacity={0.14}
                  connectNulls
                  isAnimationActive={false}
                />
                <Area
                  dataKey="bandLow"
                  stroke="none"
                  fill="var(--background)"
                  fillOpacity={1}
                  connectNulls
                  isAnimationActive={false}
                />
                <Line
                  dataKey="baseline"
                  stroke="var(--muted-foreground)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Expected baseline"
                />
                <Line
                  dataKey="actual"
                  stroke="var(--primary)"
                  strokeWidth={2.2}
                  dot={false}
                  name="Actual"
                />
                <Line
                  dataKey="forecast"
                  stroke="var(--forecast)"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={false}
                  connectNulls
                  name="Forecast"
                />
                {anomalyPoint ? (
                  <ReferenceDot
                    x={anomalyPoint.t}
                    y={anomalyPoint.actual ?? 0}
                    r={5}
                    fill="var(--destructive)"
                    stroke="var(--background)"
                    strokeWidth={2}
                    onClick={() => setOpenAlert(alerts[0])}
                    className="cursor-pointer"
                  />
                ) : null}
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 pt-2 text-[11px] text-muted-foreground">
              <Legend color="var(--primary)" label="Actual" />
              <Legend color="var(--muted-foreground)" label="Expected baseline" dashed />
              <Legend color="var(--forecast)" label="Forecast · High confidence" dashed />
              {anomalyPoint ? (
                <button
                  className="ml-auto text-destructive hover:underline"
                  onClick={() => setOpenAlert(alerts[0])}
                >
                  ● Anomaly detected — open detail
                </button>
              ) : null}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="What needs attention?" subtitle="3 highest-value signals" />
          <div className="divide-y divide-border">
            {alerts.map((a) => (
              <div key={a.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.building}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.headline}</p>
                  </div>
                  <span
                    className={cn(
                      "mt-1 size-2 shrink-0 rounded-full",
                      a.severity === "high" ? "bg-destructive" : "bg-attention",
                    )}
                  />
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <p>
                    <span className="label-xs">Likely cause</span>
                    <br />
                    <span className="text-foreground/90">{a.cause}</span>
                  </p>
                  <p>
                    <span className="label-xs">Potential impact</span>{" "}
                    <span className="num font-medium text-foreground">{a.impact}</span>
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <ConfidenceBadge level={a.confidence} />
                  <Button size="sm" variant="outline" onClick={() => setOpenAlert(a)}>
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <Panel>
          <PanelHeader
            title="Campus emissions intensity"
            subtitle="Relative intensity per building · modeled estimate"
          />
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
            {buildings.map((b) => (
              <Link
                key={b.id}
                to="/buildings"
                className="group rounded-md border border-border bg-elevated/50 p-3 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center justify-between">
                  <span className="label-xs">{b.type}</span>
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor:
                        b.intensity > 0.85
                          ? "var(--destructive)"
                          : b.intensity > 0.6
                            ? "var(--attention)"
                            : "var(--primary)",
                      opacity: 0.55 + b.intensity * 0.45,
                    }}
                  />
                </div>
                <p className="mt-2 text-[13px] leading-tight font-medium text-foreground">
                  {b.name}
                </p>
                <p className="num mt-1 text-xs text-muted-foreground">{b.tco2e} tCO₂e</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all group-hover:bg-primary"
                    style={{ width: `${Math.round(b.intensity * 100)}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel className="flex flex-col">
          <PanelHeader title="Best action right now" subtitle="Ranked by carbon per rupee" />
          <div className="flex flex-1 flex-col gap-4 p-5">
            <p className="text-lg leading-snug font-semibold tracking-tight text-foreground">
              Shift Hostel C HVAC start-up by 90 minutes
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Annual reduction" value="38–52 tCO₂e" tone="good" />
              <Stat label="Annual saving" value="₹1.6L" />
              <Stat label="Payback" value="4 months" />
              <Stat label="Cost" value="₹1.2L" />
            </div>
            <ConfidenceBadge level="High" />
            <EvidencePanel
              items={[
                { label: "Meter history", value: "92% coverage" },
                { label: "Occupancy schedule", value: "Low 01:00–05:00" },
                { label: "Baseline model", value: "Weather-normalized" },
              ]}
            />
            <Button
              className="mt-auto w-full"
              onClick={() => {
                setFocusIntervention("hvac");
                navigate({ to: "/action-lab" });
              }}
            >
              Open in Action Lab
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </Panel>
      </div>

      <AnomalyDrawer alert={openAlert} onClose={() => setOpenAlert(null)} />
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-0 w-4 border-t-2"
        style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid" }}
      />
      {label}
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload
        .filter((p: any) => p.value != null && p.name && !String(p.dataKey).startsWith("band"))
        .map((p: any) => (
          <p key={p.dataKey} className="num flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full" style={{ background: p.stroke }} />
            {p.name}
            <span className="ml-auto font-medium text-foreground">{p.value} kW</span>
          </p>
        ))}
    </div>
  );
}

function AnomalyDrawer({ alert, onClose }: { alert: Alert | null; onClose: () => void }) {
  const navigate = useNavigate();
  const { setFocusIntervention } = useCarbon();
  return (
    <Sheet open={!!alert} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-md"
      >
        {alert ? (
          <>
            <SheetHeader className="border-b border-border px-5 py-4 text-left">
              <SheetTitle>{alert.building}</SheetTitle>
              <SheetDescription>{alert.headline}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 p-5">
              <ConfidenceBadge level={alert.confidence} />
              <div>
                <p className="label-xs">Root cause</p>
                <p className="mt-1 text-sm text-foreground">{alert.cause}</p>
              </div>
              <EvidencePanel
                items={alert.evidence}
                sources="meter history · occupancy schedule · baseline model"
              />
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Potential impact" value={alert.impact} tone="good" />
                <Stat label="Detected" value="Last 7 nights" />
              </div>
              <div className="rounded-md border border-primary/25 bg-primary/8 p-4">
                <p className="label-xs">Recommended action</p>
                <p className="mt-1 text-sm font-medium text-foreground">{alert.recommendation}</p>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setFocusIntervention("hvac");
                  onClose();
                  navigate({ to: "/action-lab" });
                }}
              >
                Open in Action Lab
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
