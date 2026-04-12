"use client";

import Shell from "@/components/swiftpay/shell";
import StatCard from "@/components/swiftpay/stat-card";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, RefreshCw, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const BATCHES = [
  { id: "BATCH-2026-0412-01", corridor: "US→IN", period: "Apr 12, 2026", items: 48, sendAmount: "$52,400", payoutAmount: "₹4,370,380", status: "Reconciled" },
  { id: "BATCH-2026-0412-02", corridor: "US→PH", period: "Apr 12, 2026", items: 22, sendAmount: "$18,750", payoutAmount: "₱1,063,500", status: "Posted" },
  { id: "BATCH-2026-0411-01", corridor: "UK→IN", period: "Apr 11, 2026", items: 35, sendAmount: "£29,800", payoutAmount: "₹3,949,460", status: "Reconciled" },
  { id: "BATCH-2026-0411-02", corridor: "SG→PH", period: "Apr 11, 2026", items: 18, sendAmount: "S$14,200", payoutAmount: "₱601,756", status: "Open" },
  { id: "BATCH-2026-0410-01", corridor: "AE→PK", period: "Apr 10, 2026", items: 29, sendAmount: "AED 38,500", payoutAmount: "₨10,682,000", status: "Reconciled" },
];

const RECON_RECORDS = [
  { id: "RECON-001", refType: "PartnerAck", refId: "TXN-2024-48100", expected: "$1,200.00", actual: "$1,200.00", result: "Matched" },
  { id: "RECON-002", refType: "Instruction", refId: "TXN-2024-48050", expected: "$750.00", actual: "$748.20", result: "Mismatched" },
  { id: "RECON-003", refType: "Remit", refId: "TXN-2024-48030", expected: "$3,500.00", actual: "$3,500.00", result: "Matched" },
  { id: "RECON-004", refType: "PartnerAck", refId: "TXN-2024-47980", expected: "$200.00", actual: "$200.00", result: "Matched" },
  { id: "RECON-005", refType: "Instruction", refId: "TXN-2024-47920", expected: "$5,000.00", actual: "$4,995.00", result: "Mismatched" },
];

const BATCH_STATUS: Record<string, string> = {
  Reconciled: "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]",
  Posted: "bg-[oklch(0.55_0.15_240)]/15 text-[oklch(0.38_0.12_240)]",
  Open: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
};

export default function SettlementPage() {
  return (
    <Shell title="Settlement & Reconciliation" subtitle="Batch settlement tracking and partner reconciliation" role="Operations Officer">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open Batches" value="3" sub="Need settlement" icon={<RefreshCw className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Total Volume" value="$2.4M" sub="This month" change={11} icon={<DollarSign className="w-4 h-4 text-muted-foreground" />} accent />
          <StatCard label="Matched" value="94.8%" sub="Reconciliation rate" change={0.3} icon={<CheckCircle2 className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Mismatches" value="7" sub="Require review" icon={<AlertCircle className="w-4 h-4 text-muted-foreground" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Settlement batches */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Settlement Batches</h3>
              <Button variant="outline" size="sm" className="text-xs">New Batch</Button>
            </div>
            <div className="divide-y divide-border">
              {BATCHES.map((b) => (
                <div key={b.id} className="px-5 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{b.corridor}</span>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", BATCH_STATUS[b.status])}>{b.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">{b.id}</span>
                    <span>· {b.period}</span>
                    <span>· {b.items} items</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-muted-foreground">Send: <span className="font-semibold text-foreground">{b.sendAmount}</span></span>
                    <span className="text-muted-foreground">Payout: <span className="font-semibold text-foreground">{b.payoutAmount}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reconciliation */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Reconciliation Records</h3>
              <Button variant="outline" size="sm" className="text-xs gap-1"><RefreshCw className="w-3.5 h-3.5" /> Run Recon</Button>
            </div>
            <div className="divide-y divide-border">
              {RECON_RECORDS.map((r) => (
                <div key={r.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground font-mono">{r.refId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{r.refType}</span>
                      <span>· Expected: {r.expected}</span>
                      <span>· Actual: {r.actual}</span>
                    </div>
                  </div>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full shrink-0", r.result === "Matched" ? "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" : "bg-destructive/10 text-destructive")}>
                    {r.result === "Matched" ? <CheckCircle2 className="w-3 h-3 inline mr-0.5" /> : <AlertCircle className="w-3 h-3 inline mr-0.5" />}
                    {r.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
