import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  PageHeader,
  Panel,
  PanelHeader,
  Stat,
} from "@/components/carbon/primitives";
import { actionSimulation, interventions, optimizePortfolio } from "@/lib/carbon-data";
import { useCarbon } from "@/lib/carbon-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/action-lab")({
  head: () => ({
    meta: [
      { title: "Action Lab · Carbon Autopilot" },
      {
        name: "description",
        content: "Simulated intervention optimization, what-if planning, and approval handoff.",
      },
    ],
  }),
  component: ActionLabRoute,
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

function ActionLabRoute() {
  const { addApproval, focusIntervention, setApprovalsOpen, setFocusIntervention } = useCarbon();
  const [budget, setBudget] = useState(4);
  const recommended = useMemo(() => optimizePortfolio(budget), [budget]);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    recommended.selected.map((item) => item.id),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setSelectedIds(recommended.selected.map((item) => item.id));
  }, [recommended]);

  useEffect(() => {
    if (focusIntervention) {
      setSelectedIds((current) =>
        current.includes(focusIntervention) ? current : [focusIntervention, ...current],
      );
      setFocusIntervention(null);
    }
  }, [focusIntervention, setFocusIntervention]);

  const selectedInterventions = useMemo(
    () => interventions.filter((item) => selectedIds.includes(item.id)),
    [selectedIds],
  );
  const selectedSummary = useMemo(() => optimizePortfolio(999, selectedIds), [selectedIds]);
  const simulation = useMemo(() => actionSimulation(selectedIds), [selectedIds]);

  const toggleIntervention = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const submitApproval = () => {
    const first = selectedInterventions[0];
    addApproval({
      title:
        selectedInterventions.length <= 1
          ? (first?.name ?? "Portfolio recommendation")
          : `Portfolio recommendation (${selectedInterventions.length} actions)`,
      building:
        selectedInterventions.length <= 1
          ? (first?.building ?? "MAHE · Manipal")
          : "MAHE · Manipal",
      reductionMin: selectedSummary.reductionMin,
      reductionMax: selectedSummary.reductionMax,
      savingLakh: Number(selectedSummary.savingLakh.toFixed(1)),
      confidence: selectedSummary.confidence,
      evidence: Array.from(new Set(selectedInterventions.flatMap((item) => item.evidence))),
    });
    setConfirmOpen(false);
    setApprovalsOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader title="Action Lab" subtitle="Find the highest-impact actions for your budget." />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
        <Panel>
          <PanelHeader
            title="Available budget"
            subtitle="Simulated optimizer for the presentation prototype"
          />
          <div className="space-y-5 p-5">
            <div>
              <p className="num text-4xl font-semibold tracking-tight text-foreground">
                ₹{(budget * 100000).toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Move the slider to rebalance the recommended portfolio.
              </p>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.2"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat
                label="Expected annual reduction"
                value={`${recommended.reductionMin} tCO₂e`}
                tone="good"
              />
              <Stat
                label="Estimated annual savings"
                value={`₹${recommended.savingLakh.toFixed(1)}L`}
              />
              <div>
                <p className="label-xs">Portfolio confidence</p>
                <div className="mt-2">
                  <ConfidenceBadge level={recommended.confidence} />
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Recommended portfolio"
            subtitle="Optimized for carbon reduction under current budget"
          />
          <div className="space-y-4 p-5">
            {recommended.selected.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-elevated/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.building}</p>
                </div>
                <div className="text-right">
                  <p className="num text-sm font-medium text-foreground">
                    {item.reductionMin}-{item.reductionMax} tCO₂e
                  </p>
                  <p className="num text-xs text-muted-foreground">₹{item.costLakh.toFixed(1)}L</p>
                </div>
              </div>
            ))}
            <div className="grid gap-4 rounded-md border border-primary/25 bg-primary/8 p-4 sm:grid-cols-3">
              <Stat label="Invested" value={`₹${recommended.spent.toFixed(1)}L`} />
              <Stat
                label="Impact range"
                value={`${recommended.reductionMin}-${recommended.reductionMax} tCO₂e`}
                tone="good"
              />
              <Stat label="Savings" value={`₹${recommended.savingLakh.toFixed(1)}L/year`} />
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <Panel>
          <PanelHeader title="Interventions" subtitle="Select the actions you want to simulate" />
          <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-1">
            {interventions.map((item) => {
              const active = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleIntervention(item.id)}
                  className={cn(
                    "rounded-lg border px-4 py-4 text-left transition-colors",
                    active
                      ? "border-primary/35 bg-primary/10"
                      : "border-border bg-elevated/40 hover:border-border-strong",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.building}</p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {active ? "Selected" : "Add"}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Stat label="Cost" value={`₹${item.costLakh.toFixed(1)}L`} />
                    <Stat
                      label="Reduction"
                      value={`${item.reductionMin}-${item.reductionMax} tCO₂e`}
                      tone="good"
                    />
                    <Stat label="Payback" value={item.payback} />
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Baseline vs simulated emissions"
            subtitle="Changing interventions updates the post-intervention trajectory"
          />
          <div className="space-y-4 p-5">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={simulation} margin={{ top: 4, right: 12, bottom: 0, left: -18 }}>
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
                  width={44}
                  unit=" t"
                />
                <Tooltip
                  content={<SimulationTooltip />}
                  cursor={{ stroke: "var(--border-strong)" }}
                />
                <Area dataKey="baseline" stroke="none" fill="var(--muted)" fillOpacity={0.18} />
                <Line
                  dataKey="baseline"
                  stroke="var(--muted-foreground)"
                  strokeWidth={1.7}
                  dot={false}
                  name="Baseline"
                />
                <Line
                  dataKey="simulated"
                  stroke="var(--primary)"
                  strokeWidth={2.4}
                  dot={false}
                  name="Simulated"
                />
              </ComposedChart>
            </ResponsiveContainer>

            <div className="grid gap-4 sm:grid-cols-3">
              <Stat
                label="Payback"
                value={
                  selectedSummary.avgPaybackMonths
                    ? `${selectedSummary.avgPaybackMonths} months`
                    : "N/A"
                }
              />
              <Stat
                label="Impact range"
                value={`${selectedSummary.reductionMin}-${selectedSummary.reductionMax} tCO₂e/year`}
                tone="good"
              />
              <div>
                <p className="label-xs">Confidence</p>
                <div className="mt-2">
                  <ConfidenceBadge level={selectedSummary.confidence} />
                </div>
              </div>
            </div>

            <EvidencePanel
              items={[
                { label: "Selected actions", value: selectedInterventions.length.toString() },
                { label: "Budget used", value: `₹${selectedSummary.spent.toFixed(1)}L` },
                { label: "Annual savings", value: `₹${selectedSummary.savingLakh.toFixed(1)}L` },
              ]}
              sources="optimizer simulation · meter history · baseline model"
            />

            <Button
              className="w-full"
              disabled={selectedInterventions.length === 0}
              onClick={() => setConfirmOpen(true)}
            >
              Send recommendation for approval
            </Button>
          </div>
        </Panel>
      </div>

      <Sheet open={confirmOpen} onOpenChange={setConfirmOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <SheetTitle>Submit recommendation</SheetTitle>
            <SheetDescription>Human approval is required before execution.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-5">
            <div className="rounded-md border border-border bg-elevated/50 p-4">
              <p className="text-sm font-medium text-foreground">
                {selectedInterventions.length === 1
                  ? selectedInterventions[0]?.name
                  : `${selectedInterventions.length} action portfolio`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Approver · Campus energy manager</p>
            </div>
            <div className="space-y-2">
              {selectedInterventions.map((item) => (
                <div key={item.id} className="rounded-md border border-border bg-card px-3 py-2">
                  <p className="text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.building}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Stat
                label="Expected impact"
                value={`${selectedSummary.reductionMin}-${selectedSummary.reductionMax} tCO₂e/year`}
                tone="good"
              />
              <Stat
                label="Estimated savings"
                value={`₹${selectedSummary.savingLakh.toFixed(1)}L/year`}
              />
            </div>
            <EvidencePanel
              items={[
                { label: "Confidence", value: selectedSummary.confidence },
                { label: "Budget used", value: `₹${selectedSummary.spent.toFixed(1)}L` },
              ]}
              sources={Array.from(
                new Set(selectedInterventions.flatMap((item) => item.evidence)),
              ).join(" · ")}
            />
            <Button className="w-full" onClick={submitApproval}>
              Submit
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SimulationTooltip({ active, payload, label }: TooltipState) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="num flex items-center gap-2 text-muted-foreground">
          <span
            className="size-1.5 rounded-full"
            style={{ background: entry.stroke || entry.fill }}
          />
          {entry.name}
          <span className="ml-auto font-medium text-foreground">{entry.value} t</span>
        </p>
      ))}
    </div>
  );
}
