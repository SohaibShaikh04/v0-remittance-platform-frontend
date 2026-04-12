"use client";

import { Shield, CheckCircle2, Upload, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KYC_STEPS = [
  { label: "Identity Verified", description: "Passport / National ID", done: true },
  { label: "Address Verified", description: "Utility bill or bank statement", done: true },
  { label: "Source of Funds", description: "Salary slip or bank statement", done: false },
  { label: "Enhanced Due Diligence", description: "Required for transfers > $10,000", done: false },
];

export default function KycStatusCard() {
  const completed = KYC_STEPS.filter((s) => s.done).length;
  const total = KYC_STEPS.length;
  const level = completed >= 4 ? "Enhanced" : completed >= 2 ? "Full" : "Minimal";
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">KYC Verification</h3>
        </div>
        <span className={cn(
          "text-xs font-semibold px-2 py-0.5 rounded-full",
          completed >= 2 ? "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" : "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]"
        )}>
          {level} KYC
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{completed} of {total} completed</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {KYC_STEPS.map((step) => (
          <div key={step.label} className={cn("flex items-center gap-3 p-3 rounded-xl", step.done ? "bg-[oklch(0.58_0.14_155)]/10" : "bg-muted")}>
            {step.done
              ? <CheckCircle2 className="w-4 h-4 text-[oklch(0.58_0.14_155)] shrink-0" />
              : <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className={cn("text-xs font-semibold", step.done ? "text-[oklch(0.35_0.12_155)]" : "text-foreground")}>{step.label}</p>
              <p className="text-xs text-muted-foreground truncate">{step.description}</p>
            </div>
            {!step.done && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 shrink-0">
                <Upload className="w-3 h-3" /> Upload
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
