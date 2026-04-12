"use client";

import Shell from "@/components/swiftpay/shell";
import StatCard from "@/components/swiftpay/stat-card";
import { useState } from "react";
import { UserCheck, Plus, Search, ArrowRight, CheckCircle2, Clock, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RECENT_CUSTOMERS = [
  { id: "CUST-1001", name: "Ravi Kumar", phone: "+1 555-0101", kyc: "Full", risk: "Low", lastTxn: "Apr 12, 2026" },
  { id: "CUST-1002", name: "Priya Sharma", phone: "+1 555-0102", kyc: "Full", risk: "Low", lastTxn: "Apr 10, 2026" },
  { id: "CUST-1003", name: "Ahmed Al-Farsi", phone: "+1 555-0103", kyc: "Minimal", risk: "High", lastTxn: "Apr 8, 2026" },
  { id: "CUST-1004", name: "Maria Santos", phone: "+1 555-0104", kyc: "Full", risk: "Low", lastTxn: "Apr 5, 2026" },
];

const RISK_COLORS: Record<string, string> = {
  Low: "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]",
  Medium: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
  High: "bg-destructive/10 text-destructive",
};

const KYC_COLORS: Record<string, string> = {
  Full: "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]",
  Minimal: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
  Enhanced: "bg-primary/15 text-primary",
  Pending: "bg-muted text-muted-foreground",
};

const STEPS = ["Customer Lookup", "KYC Verification", "Initiate Transfer", "Review & Print Receipt"];

export default function AgentPage() {
  const [step, setStep] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof RECENT_CUSTOMERS[0] | null>(null);
  const [searchVal, setSearchVal] = useState("");

  const filtered = RECENT_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    c.id.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <Shell title="Agent Console" subtitle="Assisted customer onboarding and transaction initiation" role="Agent">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Assisted Today" value="18" sub="Transactions" change={6} icon={<UserCheck className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="New KYC" value="4" sub="Captures today" icon={<FileText className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Volume Today" value="$12,400" sub="Assisted transfers" change={11} icon={<CheckCircle2 className="w-4 h-4 text-muted-foreground" />} accent />
          <StatCard label="Pending KYC" value="2" sub="Incomplete captures" icon={<Clock className="w-4 h-4 text-muted-foreground" />} />
        </div>

        {/* Stepper */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-0 mb-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", i < step ? "bg-[oklch(0.58_0.14_155)] text-white" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={cn("text-xs font-medium text-center leading-tight hidden sm:block", i === step ? "text-primary" : "text-muted-foreground")}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={cn("flex-1 h-0.5 mx-2", i < step ? "bg-[oklch(0.58_0.14_155)]" : "bg-border")} />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                    placeholder="Search by name or customer ID…"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                  />
                </div>
                <Button className="gap-1.5 bg-primary text-primary-foreground"><Plus className="w-4 h-4" /> New Customer</Button>
              </div>
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    className={cn("px-4 py-3.5 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer", selectedCustomer?.id === c.id && "bg-secondary")}
                    onClick={() => setSelectedCustomer(c)}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.id} · {c.phone}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", KYC_COLORS[c.kyc])}>{c.kyc} KYC</span>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", RISK_COLORS[c.risk])}>{c.risk} Risk</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 hidden md:block">Last: {c.lastTxn}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button disabled={!selectedCustomer} onClick={() => setStep(1)} className="gap-1.5">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 1 && selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{selectedCustomer.name[0]}</div>
                <div>
                  <p className="font-semibold text-foreground">{selectedCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCustomer.id} · {selectedCustomer.kyc} KYC · {selectedCustomer.risk} Risk</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Government ID", sub: "Passport or National ID", done: selectedCustomer.kyc !== "Minimal" },
                  { label: "Address Proof", sub: "Utility bill or bank statement", done: selectedCustomer.kyc === "Full" },
                  { label: "Selfie / Photo", sub: "Live photo capture", done: selectedCustomer.kyc !== "Minimal" },
                  { label: "Source of Funds", sub: "Salary slip or declaration", done: selectedCustomer.kyc === "Enhanced" },
                ].map((doc) => (
                  <div key={doc.label} className={cn("p-4 rounded-xl border flex items-center gap-3", doc.done ? "border-[oklch(0.58_0.14_155)]/30 bg-[oklch(0.58_0.14_155)]/5" : "border-border bg-card")}>
                    {doc.done
                      ? <CheckCircle2 className="w-5 h-5 text-[oklch(0.58_0.14_155)] shrink-0" />
                      : <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
                    }
                    <div>
                      <p className={cn("text-sm font-semibold", doc.done ? "text-[oklch(0.35_0.12_155)]" : "text-foreground")}>{doc.label}</p>
                      <p className="text-xs text-muted-foreground">{doc.sub}</p>
                    </div>
                    {!doc.done && <Button variant="outline" size="sm" className="ml-auto text-xs">Capture</Button>}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)} className="gap-1.5">Next <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 max-w-lg">
              <p className="text-sm text-muted-foreground">Initiating transfer for <span className="font-semibold text-foreground">{selectedCustomer?.name}</span></p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Send Amount", placeholder: "e.g. 500" },
                  { label: "Currency", placeholder: "USD" },
                  { label: "Beneficiary", placeholder: "Select beneficiary" },
                  { label: "Purpose", placeholder: "Family Support" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">{f.label}</label>
                    <input className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} className="gap-1.5">Create Transfer <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[oklch(0.58_0.14_155)]/15 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-[oklch(0.58_0.14_155)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Transfer Created</h3>
                <p className="text-sm text-muted-foreground mt-1">Reference: <span className="font-mono font-semibold">TXN-2024-48301</span></p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-1.5"><Printer className="w-4 h-4" /> Print Receipt</Button>
                <Button onClick={() => { setStep(0); setSelectedCustomer(null); }}>New Transaction</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
