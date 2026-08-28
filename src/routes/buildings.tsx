import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
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
  StatusBadge,
} from "@/components/carbon/primitives";
import { AB3BuildingModal } from "@/components/carbon/ab3-building-modal";
import { buildings, type Building } from "@/lib/carbon-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/buildings")({
  head: () => ({
    meta: [
      { title: "Buildings · Carbon Autopilot" },
      {
        name: "description",
        content: "Campus-wide building performance, coverage, confidence, and next actions.",
      },
    ],
  }),
  component: BuildingsRoute,
});

function BuildingsRoute() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Building | null>(null);
  const [modalBuildingId, setModalBuildingId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      buildings.filter(
        (building) =>
          (typeFilter === "all" || building.type === typeFilter) &&
          (statusFilter === "all" || building.status === statusFilter),
      ),
    [statusFilter, typeFilter],
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Buildings"
        subtitle="Campus-wide energy and carbon performance"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground outline-none focus:border-border-strong"
            >
              <option value="all">All types</option>
              <option value="Academic">Academic</option>
              <option value="Hostel">Hostel</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Utility">Utility</option>
              <option value="Sports">Sports</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground outline-none focus:border-border-strong"
            >
              <option value="all">All statuses</option>
              <option value="Needs attention">Needs attention</option>
              <option value="On track">On track</option>
              <option value="Moderate confidence">Moderate confidence</option>
            </select>
          </div>
        }
      />

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Campus building performance"
          subtitle={`${filtered.length} buildings shown · live telemetry & synthetic baseline`}
        />

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-elevated/60 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Building</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Energy</th>
                <th className="px-5 py-3 font-medium">tCO₂e</th>
                <th className="px-5 py-3 font-medium">Trend</th>
                <th className="px-5 py-3 font-medium">Data coverage</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((building) => {
                const hasDigitalTwin = ["ab3", "b14", "kmc"].includes(building.id);
                return (
                  <tr
                    key={building.id}
                    onClick={() => setSelected(building)}
                    className="cursor-pointer border-b border-border/80 transition-colors hover:bg-elevated/40"
                  >
                    <td className="px-5 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{building.name}</span>
                        {hasDigitalTwin && (
                          <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
                            3D Twin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{building.type}</td>
                    <td className="num px-5 py-4 text-foreground">{building.energyMWh} MWh</td>
                    <td className="num px-5 py-4 text-foreground">{building.tco2e} tCO₂e</td>
                    <td
                      className={cn(
                        "num px-5 py-4 font-medium",
                        building.trendPct > 0 ? "text-attention" : "text-primary",
                      )}
                    >
                      {building.trendPct > 0 ? "↑" : "↓"} {Math.abs(building.trendPct)}%
                    </td>
                    <td className="num px-5 py-4 text-foreground">{building.coverage}%</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={building.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {hasDigitalTwin ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalBuildingId(building.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition cursor-pointer"
                        >
                          <Cpu className="size-3" />
                          <span>3D Deep Dive</span>
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Details</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {filtered.map((building) => (
            <button
              key={building.id}
              onClick={() => setSelected(building)}
              className="panel w-full p-4 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{building.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{building.type}</p>
                </div>
                <StatusBadge status={building.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <Stat label="Energy" value={`${building.energyMWh} MWh`} />
                <Stat label="tCO₂e" value={`${building.tco2e}`} />
                <Stat
                  label="Trend"
                  value={`${building.trendPct > 0 ? "↑" : "↓"} ${Math.abs(building.trendPct)}%`}
                  tone={building.trendPct > 0 ? "attention" : "good"}
                />
                <Stat label="Coverage" value={`${building.coverage}%`} />
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-lg"
        >
          {selected ? (
            <>
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle>{selected.name}</SheetTitle>
                    <SheetDescription>{selected.type} building performance overview</SheetDescription>
                  </div>
                  {["ab3", "b14", "kmc"].includes(selected.id) && (
                    <Button
                      size="sm"
                      onClick={() => setModalBuildingId(selected.id)}
                      className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-semibold text-xs"
                    >
                      <Cpu className="size-3.5 mr-1" />
                      3D Twin View
                    </Button>
                  )}
                </div>
              </SheetHeader>
              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={selected.status} />
                  <ConfidenceBadge
                    level={
                      selected.coverage >= 90 ? "High" : selected.coverage >= 75 ? "Medium" : "Low"
                    }
                  />
                </div>

                <div className="rounded-md border border-border bg-elevated/50 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {selected.coverage}% data coverage ·{" "}
                    {selected.coverage < 85
                      ? "Some load components estimated"
                      : "Primarily metered performance"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Confidence is calculated using hardware-agnostic canonical ingestion streams.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Energy" value={`${selected.energyMWh} MWh`} />
                  <Stat label="Emissions" value={`${selected.tco2e} tCO₂e`} />
                </div>

                <Panel>
                  <PanelHeader
                    title="Load breakdown"
                    subtitle="HVAC / lighting / plug-load split"
                  />
                  <div className="space-y-4 p-5">
                    {[
                      { label: "HVAC", value: selected.breakdown.hvac, tone: "var(--attention)" },
                      {
                        label: "Lighting",
                        value: selected.breakdown.lighting,
                        tone: "var(--forecast)",
                      },
                      {
                        label: "Plug load",
                        value: selected.breakdown.plug,
                        tone: "var(--primary)",
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="num font-medium text-foreground">{item.value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.value}%`, backgroundColor: item.tone }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>

                <EvidencePanel
                  items={[
                    {
                      label: "Trend",
                      value: `${selected.trendPct > 0 ? "+" : ""}${selected.trendPct}% vs prior period`,
                    },
                    {
                      label: "Anomalies",
                      value:
                        selected.anomalies.length > 0
                          ? selected.anomalies.length.toString()
                          : "None",
                    },
                    { label: "Sources", value: `${selected.sources.length} inputs` },
                  ]}
                  sources={selected.sources.join(" · ")}
                />

                <div>
                  <p className="label-xs">Anomalies</p>
                  <div className="mt-2 space-y-2">
                    {selected.anomalies.length > 0 ? (
                      selected.anomalies.map((anomaly) => (
                        <div
                          key={anomaly}
                          className="rounded-md border border-attention/25 bg-attention/10 px-3 py-2 text-sm text-foreground"
                        >
                          {anomaly}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-md border border-border bg-elevated/40 px-3 py-2 text-sm text-muted-foreground">
                        No active anomalies in the current view.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-md border border-primary/25 bg-primary/8 p-4">
                  <p className="label-xs">Recommended next action</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{selected.nextAction}</p>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* 3D Digital Twin Modal */}
      {modalBuildingId && (
        <AB3BuildingModal
          isOpen={!!modalBuildingId}
          onClose={() => setModalBuildingId(null)}
          buildingId={modalBuildingId}
        />
      )}
    </div>
  );
}
