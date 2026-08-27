import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Confidence } from "./carbon-data";

export type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Data requested";

export type Approval = {
  id: string;
  title: string;
  building: string;
  reductionMin: number;
  reductionMax: number;
  savingLakh: number;
  confidence: Confidence;
  evidence: string[];
  status: ApprovalStatus;
};

const initialApprovals: Approval[] = [
  {
    id: "ap1",
    title: "HVAC schedule shift",
    building: "Hostel C",
    reductionMin: 38,
    reductionMax: 52,
    savingLakh: 1.6,
    confidence: "High",
    evidence: ["Meter history", "Occupancy schedule", "Baseline model"],
    status: "Pending",
  },
  {
    id: "ap2",
    title: "Weekend setback · AHU-2 / AHU-4",
    building: "Academic Block A",
    reductionMin: 14,
    reductionMax: 21,
    savingLakh: 0.9,
    confidence: "Medium",
    evidence: ["Sub-meter feed", "Timetable schedule"],
    status: "Pending",
  },
  {
    id: "ap3",
    title: "Chiller pre-cooling window shift",
    building: "Utility Plant",
    reductionMin: 18,
    reductionMax: 24,
    savingLakh: 1.2,
    confidence: "Medium",
    evidence: ["Plant SCADA export", "Grid intensity feed"],
    status: "Pending",
  },
];

type Store = {
  approvals: Approval[];
  pendingCount: number;
  approvalsOpen: boolean;
  setApprovalsOpen: (v: boolean) => void;
  addApproval: (a: Omit<Approval, "id" | "status">) => void;
  setStatus: (id: string, status: ApprovalStatus) => void;
  focusIntervention: string | null;
  setFocusIntervention: (id: string | null) => void;
};

const Ctx = createContext<Store | null>(null);

export function CarbonProvider({ children }: { children: ReactNode }) {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [approvalsOpen, setApprovalsOpen] = useState(false);
  const [focusIntervention, setFocusIntervention] = useState<string | null>(null);

  const value = useMemo<Store>(
    () => ({
      approvals,
      pendingCount: approvals.filter((a) => a.status === "Pending").length,
      approvalsOpen,
      setApprovalsOpen,
      addApproval: (a) =>
        setApprovals((prev) => [
          { ...a, id: `ap${prev.length + 1}-${Date.now()}`, status: "Pending" },
          ...prev,
        ]),
      setStatus: (id, status) =>
        setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a))),
      focusIntervention,
      setFocusIntervention,
    }),
    [approvals, approvalsOpen, focusIntervention],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCarbon() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarbon must be used inside CarbonProvider");
  return ctx;
}
