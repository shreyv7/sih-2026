import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge, StatusBadge } from "./primitives";
import { useCarbon } from "@/lib/carbon-store";

export function ApprovalsPanel() {
  const { approvals, approvalsOpen, setApprovalsOpen, setStatus } = useCarbon();

  return (
    <Sheet open={approvalsOpen} onOpenChange={setApprovalsOpen}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle>Approvals</SheetTitle>
          <SheetDescription>Human review required before high-impact actions</SheetDescription>
        </SheetHeader>

        <div className="space-y-3 p-5">
          {approvals.map((a) => (
            <div key={a.id} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {a.title} · {a.building}
                  </p>
                  <p className="num mt-1 text-xs text-muted-foreground">
                    Expected reduction · {a.reductionMin}–{a.reductionMax} tCO₂e/year
                  </p>
                  <p className="num text-xs text-muted-foreground">
                    Estimated saving · ₹{a.savingLakh.toFixed(1)}L/year
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>

              <div className="mt-3">
                <ConfidenceBadge level={a.confidence} />
              </div>

              <p className="mt-3 text-[11px] text-muted-foreground">
                Evidence · {a.evidence.join(" · ")}
              </p>

              {a.status === "Pending" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setStatus(a.id, "Approved")}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setStatus(a.id, "Data requested")}
                  >
                    Request data
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setStatus(a.id, "Rejected")}>
                    Reject
                  </Button>
                </div>
              ) : (
                <p className="mt-4 rounded-md border border-border bg-elevated/60 px-3 py-2 text-xs text-muted-foreground">
                  {a.status === "Approved"
                    ? "Approved · Execution task created"
                    : a.status === "Rejected"
                      ? "Rejected · No execution task created"
                      : "Data requested · Awaiting additional metering evidence"}
                </p>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
