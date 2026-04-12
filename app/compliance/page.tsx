"use client";

import Shell from "@/components/swiftpay/shell";
import StatCard from "@/components/swiftpay/stat-card";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Clock, Eye, ChevronDown, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Severity = "Low" | "Medium" | "High";
type CheckResult = "Clear" | "Flag" | "Hold";
type Decision = "Approve" | "Hold" | "Reject" | "Pending";

interface ComplianceCase {
  id: string;
  remitId: string;
  customer: string;
  amount: string;
  corridor: string;
  checkType: string;
  result: CheckResult;
  severity: Severity;
  date: string;
  decision: Decision;
  notes?: string;
}

const CASES: ComplianceCase[] = [
  { id: "CC-001", remitId: "TXN-2024-48100", customer: "Ahmed Al-Farsi", amount: "$10,000 USD", corridor: "US→UAE", checkType: "Sanctions", result: "Hold", severity: "High", date: "Apr 12, 2026", decision: "Pending" },
  { id: "CC-002", remitId: "TXN-2024-48082", customer: "Khalid Rahimi", amount: "$7,500 USD", corridor: "US→PAK", checkType: "PEP", result: "Flag", severity: "Medium", date: "Apr 11, 2026", decision: "Pending" },
  { id: "CC-003", remitId: "TXN-2024-48055", customer: "Nikolai Petrov", amount: "$4,200 USD", corridor: "UK→RUS", checkType: "Geo", result: "Flag", severity: "High", date: "Apr 11, 2026", decision: "Pending" },
  { id: "CC-004", remitId: "TXN-2024-47990", customer: "Ravi Kumar", amount: "$500 USD", corridor: "US→IND", checkType: "AML", result: "Clear", severity: "Low", date: "Apr 10, 2026", decision: "Approve" },
  { id: "CC-005", remitId: "TXN-2024-47955", customer: "Maria Santos", amount: "$800 USD", corridor: "US→PHL", checkType: "Sanctions", result: "Clear", severity: "Low", date: "Apr 10, 2026", decision: "Approve" },
  { id: "CC-006", remitId: "TXN-2024-47902", customer: "Chen Wei", amount: "$15,000 USD", corridor: "SG→CHN", checkType: "AML", result: "Hold", severity: "High", date: "Apr 9, 2026", decision: "Pending" },
  { id: "CC-007", remitId: "TXN-2024-47880", customer: "Sofia Escobar", amount: "$2,500 USD", corridor: "US→MEX", checkType: "AML", result: "Flag", severity: "Medium", date: "Apr 9, 2026", decision: "Hold" },
];

const RESULT_CONFIG: Record<CheckResult, { className: string; icon: React.ReactNode }> = {
  Clear: { className: "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  Flag: { className: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  Hold: { className: "bg-destructive/10 text-destructive", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const SEVERITY_CONFIG: Record<Severity, string> = {
  Low: "bg-[oklch(0.58_0.14_155)]/10 text-[oklch(0.35_0.12_155)]",
  Medium: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
  High: "bg-destructive/10 text-destructive",
};

const DECISION_CONFIG: Record<Decision, string> = {
  Approve: "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]",
  Hold: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
  Reject: "bg-destructive/10 text-destructive",
  Pending: "bg-muted text-muted-foreground",
};

export default function CompliancePage() {
  const [selected, setSelected] = useState<ComplianceCase | null>(null);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [noteText, setNoteText] = useState("");
  const [filter, setFilter] = useState<"All" | CheckResult>("All");

  const pending = CASES.filter((c) => (decisions[c.id] ?? c.decision) === "Pending");
  const filtered = filter === "All" ? CASES : CASES.filter((c) => c.result === filter);

  const decide = (id: string, d: Decision) => {
    setDecisions((prev) => ({ ...prev, [id]: d }));
    setSelected(null);
  };

  return (
    <Shell title="Compliance Workbench" subtitle="KYC/AML screening, flags, and approvals" role="Compliance Analyst">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Pending Review" value={String(pending.length)} sub="Requires action" icon={<Clock className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="High Severity" value={String(CASES.filter((c) => c.severity === "High").length)} sub="Critical flags" icon={<AlertTriangle className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Cleared Today" value="12" sub="Approved cases" change={8} icon={<CheckCircle2 className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Rejection Rate" value="3.2%" sub="Last 30 days" change={-1} icon={<XCircle className="w-4 h-4 text-muted-foreground" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Cases table */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
              <h3 className="font-semibold text-foreground">Screening Queue</h3>
              <div className="flex items-center gap-2">
                {(["All", "Hold", "Flag", "Clear"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn("text-xs font-medium px-3 py-1 rounded-lg transition-colors", filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((c) => {
                const res = RESULT_CONFIG[c.result];
                const currentDecision = decisions[c.id] ?? c.decision;
                return (
                  <div
                    key={c.id}
                    className={cn("px-5 py-3.5 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer", selected?.id === c.id && "bg-secondary")}
                    onClick={() => setSelected(c)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{c.customer}</p>
                        <span className="text-xs text-muted-foreground font-mono">{c.remitId}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-muted-foreground">{c.amount}</span>
                        <span className="text-xs text-muted-foreground">· {c.corridor}</span>
                        <span className="text-xs text-muted-foreground">· {c.checkType}</span>
                        <span className="text-xs text-muted-foreground">· {c.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", SEVERITY_CONFIG[c.severity])}>
                        {c.severity}
                      </span>
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", res.className)}>
                        {res.icon} {c.result}
                      </span>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", DECISION_CONFIG[currentDecision])}>
                        {currentDecision}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="bg-card border border-border rounded-2xl p-5">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Case Details</h3>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Case ID", value: selected.id },
                    { label: "Transaction", value: selected.remitId },
                    { label: "Customer", value: selected.customer },
                    { label: "Amount", value: selected.amount },
                    { label: "Corridor", value: selected.corridor },
                    { label: "Check Type", value: selected.checkType },
                    { label: "Result", value: selected.result },
                    { label: "Severity", value: selected.severity },
                    { label: "Date", value: selected.date },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-semibold text-foreground">{value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Analyst Notes</label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                    className="w-full bg-muted rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Add compliance notes…"
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => decide(selected.id, "Reject")}>
                    Reject
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => decide(selected.id, "Hold")}>
                    Hold
                  </Button>
                  <Button size="sm" className="flex-1 bg-[oklch(0.46_0.12_155)] text-white hover:bg-[oklch(0.40_0.12_155)]" onClick={() => decide(selected.id, "Approve")}>
                    Approve
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Select a case to review details and make a decision</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
