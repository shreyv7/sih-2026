import { cn } from "@/lib/utils";
import type { Confidence } from "@/lib/carbon-data";
import type { ReactNode } from "react";

export function Panel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("panel", className)} {...props}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function ConfidenceBadge({ level }: { level: Confidence }) {
  const tone =
    level === "High"
      ? "text-primary border-primary/35 bg-primary/10"
      : level === "Medium"
        ? "text-attention border-attention/35 bg-attention/10"
        : "text-muted-foreground border-border-strong bg-muted/40";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tone,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      Confidence · {level}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Needs attention": "text-attention border-attention/35 bg-attention/10",
    "On track": "text-primary border-primary/35 bg-primary/10",
    "Moderate confidence": "text-muted-foreground border-border-strong bg-muted/40",
    Verified: "text-primary border-primary/35 bg-primary/10",
    "Partially verified": "text-attention border-attention/35 bg-attention/10",
    Monitoring: "text-forecast border-forecast/35 bg-forecast/10",
    Pending: "text-attention border-attention/35 bg-attention/10",
    Approved: "text-primary border-primary/35 bg-primary/10",
    Rejected: "text-destructive border-destructive/35 bg-destructive/10",
    "Data requested": "text-forecast border-forecast/35 bg-forecast/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        map[status] ?? "text-muted-foreground border-border-strong bg-muted/40",
      )}
    >
      {status}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaTone = "neutral",
  note,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "good" | "bad" | "neutral";
  note?: string;
}) {
  return (
    <Panel className="min-w-[210px] flex-1 px-5 py-4">
      <p className="label-xs">{label}</p>
      <p className="num mt-2.5 text-[28px] leading-none font-semibold tracking-tight text-foreground">
        {value}
        {unit ? (
          <span className="ml-1.5 text-sm font-medium text-muted-foreground">{unit}</span>
        ) : null}
      </p>
      <p className="mt-2 text-xs">
        {delta ? (
          <span
            className={cn(
              "num font-medium",
              deltaTone === "good"
                ? "text-primary"
                : deltaTone === "bad"
                  ? "text-attention"
                  : "text-muted-foreground",
            )}
          >
            {delta}
          </span>
        ) : null}
        {note ? (
          <span className="text-muted-foreground">
            {delta ? " · " : ""}
            {note}
          </span>
        ) : null}
      </p>
    </Panel>
  );
}

export function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "attention" | "forecast";
}) {
  return (
    <div>
      <p className="label-xs">{label}</p>
      <p
        className={cn(
          "num mt-1 text-lg font-semibold tracking-tight",
          tone === "good"
            ? "text-primary"
            : tone === "attention"
              ? "text-attention"
              : tone === "forecast"
                ? "text-forecast"
                : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function EvidencePanel({
  items,
  sources,
  className,
}: {
  items: { label: string; value: string }[];
  sources?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border border-border bg-elevated/60 p-3", className)}>
      <p className="label-xs">Evidence</p>
      <dl className="mt-2 space-y-1.5">
        {items.map((e) => (
          <div key={e.label} className="flex items-baseline justify-between gap-4 text-xs">
            <dt className="text-muted-foreground">{e.label}</dt>
            <dd className="num text-right font-medium text-foreground">{e.value}</dd>
          </div>
        ))}
      </dl>
      {sources ? (
        <p className="mt-3 border-t border-border pt-2 text-[11px] text-muted-foreground">
          Sources · {sources}
        </p>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}
