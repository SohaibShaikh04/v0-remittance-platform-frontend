"use client";

import Shell from "@/components/swiftpay/shell";
import { useState } from "react";
import { Plus, Search, Edit2, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BENEFICIARIES = [
  { id: "BEN-001", name: "Ravi Kumar", country: "India", flag: "🇮🇳", bank: "State Bank of India", mode: "Account", accountNo: "****4521", ifsc: "SBIN0001234", status: "Verified" },
  { id: "BEN-002", name: "Priya Sharma", country: "India", flag: "🇮🇳", bank: "HDFC Bank", mode: "Account", accountNo: "****7823", ifsc: "HDFC0001234", status: "Verified" },
  { id: "BEN-003", name: "Maria Santos", country: "Philippines", flag: "🇵🇭", bank: "GCash", mode: "MobileWallet", accountNo: "+63 912 345 6789", ifsc: "GCASH", status: "Verified" },
  { id: "BEN-004", name: "Ahmed Al-Farsi", country: "UAE", flag: "🇦🇪", bank: "Emirates NBD", mode: "Account", accountNo: "****0091", ifsc: "EBILAEAD", status: "Pending" },
  { id: "BEN-005", name: "Pedro Garcia", country: "Mexico", flag: "🇲🇽", bank: "BBVA Mexico", mode: "Account", accountNo: "****5512", ifsc: "BCMRMXMM", status: "Verified" },
];

const MODE_COLORS: Record<string, string> = {
  Account: "bg-[oklch(0.55_0.15_240)]/15 text-[oklch(0.38_0.12_240)]",
  MobileWallet: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
  CashPickup: "bg-muted text-muted-foreground",
};

export default function BeneficiariesPage() {
  const [search, setSearch] = useState("");

  const filtered = BENEFICIARIES.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell title="Beneficiaries" subtitle="Manage your saved recipients" role="Customer">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
              placeholder="Search beneficiaries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="gap-1.5 bg-primary text-primary-foreground shrink-0"><Plus className="w-4 h-4" /> Add Beneficiary</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-xl shrink-0">
                  {b.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground truncate">{b.name}</p>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full shrink-0", b.status === "Verified" ? "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" : "bg-muted text-muted-foreground")}>
                      {b.status === "Verified" ? <CheckCircle2 className="w-3 h-3 inline mr-0.5" /> : <Clock className="w-3 h-3 inline mr-0.5" />}
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.country}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide", MODE_COLORS[b.mode])}>{b.mode}</span>
                    <span className="text-xs text-muted-foreground">{b.bank}</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-1">{b.accountNo}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 text-xs gap-1">
                  <Plus className="w-3.5 h-3.5" /> Send Money
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
