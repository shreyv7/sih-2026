import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Building2,
  FlaskConical,
  Gauge,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCarbon } from "@/lib/carbon-store";
import { ApprovalsPanel } from "./approvals-panel";

const nav = [
  { to: "/", label: "Command Center", icon: Gauge },
  { to: "/buildings", label: "Buildings", icon: Building2 },
  { to: "/action-lab", label: "Action Lab", icon: FlaskConical },
  { to: "/verification", label: "Verification", icon: ShieldCheck },
  { to: "/ask", label: "Ask Carbon", icon: MessageSquareText },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { pendingCount, setApprovalsOpen } = useCarbon();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLandingRoute = pathname === "/";

  if (isLandingRoute) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — desktop */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-[68px]" : "w-[236px]",
        )}
      >
        <div className="flex items-center gap-2.5 px-4 py-5">
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
            <Activity className="size-4" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold tracking-tight text-sidebar-foreground">
                CARBON AUTOPILOT
              </p>
              <p className="truncate text-[10px] tracking-[0.14em] text-muted-foreground">
                MAHE · MANIPAL
              </p>
            </div>
          )}
        </div>

        <nav className="mt-2 flex-1 space-y-0.5 px-2.5">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className={cn("size-4 shrink-0", active && "text-primary")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border p-2.5">
          <button
            onClick={() => setApprovalsOpen(true)}
            className="flex w-full items-center gap-2.5 rounded-md border border-attention/25 bg-attention/10 px-2.5 py-2 text-left text-[12px] text-attention transition-colors hover:bg-attention/15"
          >
            <span className="num grid size-5 shrink-0 place-items-center rounded bg-attention/20 text-[11px] font-semibold">
              {pendingCount}
            </span>
            {!collapsed && (
              <span className="truncate">{pendingCount} actions awaiting approval</span>
            )}
          </button>
          <div className="flex items-center justify-between px-1">
            <button
              className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setCollapsed((c) => !c)}
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>
            {!collapsed && (
              <button
                className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Settings"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="size-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 pt-5 pb-24 md:px-8 md:pb-10">{children}</main>
        <MobileNav pathname={pathname} />
      </div>

      <ApprovalsPanel />
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-sm"
        >
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <SheetTitle>Prototype notes</SheetTitle>
            <SheetDescription>Presentation settings and dataset disclosures</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-5 text-sm text-muted-foreground">
            <div className="rounded-md border border-border bg-elevated/50 p-4">
              Demo campus: <span className="text-foreground">MAHE · Manipal</span>
            </div>
            <div className="rounded-md border border-border bg-elevated/50 p-4">
              Data source mode: <span className="text-foreground">Synthetic demo data</span>
            </div>
            <div className="rounded-md border border-border bg-elevated/50 p-4">
              Emission factors and savings are modeled to support the pitch flow, not live
              operations.
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function TopBar() {
  const { pendingCount, setApprovalsOpen } = useCarbon();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="md:hidden grid size-7 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
          <Activity className="size-3.5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-foreground">MAHE · Manipal</p>
          <p className="truncate text-[11px] text-muted-foreground">
            Demo campus · synthetic demo data
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 sm:flex">
          <span className="label-xs">Grid intensity</span>
          <span className="text-[12px] font-medium text-attention">Moderate</span>
          <span className="num text-[11px] text-muted-foreground">↑ 3.2% 24h</span>
        </div>
        <button
          onClick={() => setApprovalsOpen(true)}
          className="relative rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Approvals"
        >
          <Bell className="size-4" />
          {pendingCount > 0 && (
            <span className="num absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-attention text-[10px] font-semibold text-attention-foreground">
              {pendingCount}
            </span>
          )}
        </button>
        <span className="grid size-8 place-items-center rounded-full border border-border bg-elevated text-[11px] font-semibold text-foreground">
          SV
        </span>
      </div>
    </header>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-sidebar/95 backdrop-blur md:hidden">
      {nav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[10px]",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-4" />
            <span className="truncate px-1">{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
