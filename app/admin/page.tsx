"use client";

import Shell from "@/components/swiftpay/shell";
import StatCard from "@/components/swiftpay/stat-card";
import { useState } from "react";
import { Settings, Users, Globe, CreditCard, BarChart3, Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = ["Corridors", "Fee Rules", "Payout Modes", "Users", "Partners"] as const;
type Tab = typeof TABS[number];

const CORRIDORS_DATA = [
  { id: 1, from: "US", to: "IN", modes: "Account, CashPickup", dailyLimit: "$10,000", monthlyLimit: "$50,000", status: "Active" },
  { id: 2, from: "US", to: "PH", modes: "Account, MobileWallet", dailyLimit: "$5,000", monthlyLimit: "$25,000", status: "Active" },
  { id: 3, from: "UK", to: "IN", modes: "Account", dailyLimit: "£8,000", monthlyLimit: "£40,000", status: "Active" },
  { id: 4, from: "SG", to: "PH", modes: "Account, MobileWallet", dailyLimit: "S$7,000", monthlyLimit: "S$35,000", status: "Paused" },
  { id: 5, from: "AE", to: "PK", modes: "Account, CashPickup", dailyLimit: "AED 20,000", monthlyLimit: "AED 100,000", status: "Active" },
];

const FEE_RULES = [
  { id: 1, corridor: "US→IN", mode: "Account", type: "Tiered", value: "$2.99 / $4.99 / $9.99", status: "Active" },
  { id: 2, corridor: "US→PH", mode: "Account", type: "Flat", value: "$3.49", status: "Active" },
  { id: 3, corridor: "US→PH", mode: "MobileWallet", type: "Percent", value: "0.8%", status: "Active" },
  { id: 4, corridor: "UK→IN", mode: "Account", type: "Tiered", value: "£1.99 / £3.99 / £7.99", status: "Active" },
  { id: 5, corridor: "AE→PK", mode: "CashPickup", type: "Flat", value: "AED 5.00", status: "Paused" },
];

const USERS_DATA = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", kyc: "Full", status: "Active" },
  { id: 2, name: "Sarah Ahmed", email: "sarah@swiftpay.com", role: "Compliance Analyst", kyc: "N/A", status: "Active" },
  { id: 3, name: "Mike Chen", email: "mike@swiftpay.com", role: "Operations Officer", kyc: "N/A", status: "Active" },
  { id: 4, name: "Ana Rodriguez", email: "ana@swiftpay.com", role: "Agent", kyc: "N/A", status: "Active" },
  { id: 5, name: "David Kim", email: "david@swiftpay.com", role: "Treasury Dealer", kyc: "N/A", status: "Locked" },
  { id: 6, name: "Priya Shah", email: "priya@example.com", role: "Customer", kyc: "Minimal", status: "Active" },
];

const PARTNERS_DATA = [
  { id: 1, code: "INDAXIS", name: "Axis Bank India", corridor: "US→IN", mode: "Account", priority: 1, status: "Active" },
  { id: 2, code: "PHBDO", name: "BDO Philippines", corridor: "US→PH", mode: "Account", priority: 1, status: "Active" },
  { id: 3, code: "PHGCASH", name: "GCash Philippines", corridor: "US→PH", mode: "MobileWallet", priority: 1, status: "Active" },
  { id: 4, code: "AEENB", name: "Emirates NBD", corridor: "AE→PK", mode: "Account", priority: 1, status: "Active" },
];

const ROLE_COLORS: Record<string, string> = {
  Customer: "bg-secondary text-secondary-foreground",
  "Compliance Analyst": "bg-destructive/10 text-destructive",
  "Operations Officer": "bg-[oklch(0.55_0.15_240)]/15 text-[oklch(0.38_0.12_240)]",
  Agent: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
  "Treasury Dealer": "bg-primary/15 text-primary",
  Admin: "bg-primary/20 text-primary",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Corridors");

  return (
    <Shell title="Admin Panel" subtitle="Configure corridors, fees, users, payout modes, and partners" role="Admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Corridors" value="4" sub="1 paused" icon={<Globe className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Fee Rules" value="5" sub="Across corridors" icon={<CreditCard className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Total Users" value="6" sub="All roles" icon={<Users className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Partners" value="4" sub="Active connectors" icon={<Settings className="w-4 h-4 text-muted-foreground" />} accent />
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex border-b border-border px-5 gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn("py-3.5 px-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2", activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === "Corridors" && (
              <AdminTable
                headers={["From", "To", "Payout Modes", "Daily Limit", "Monthly Limit", "Status", ""]}
                rows={CORRIDORS_DATA.map((c) => [c.from, c.to, c.modes, c.dailyLimit, c.monthlyLimit, c.status])}
              />
            )}
            {activeTab === "Fee Rules" && (
              <AdminTable
                headers={["Corridor", "Payout Mode", "Fee Type", "Fee Value", "Status", ""]}
                rows={FEE_RULES.map((f) => [f.corridor, f.mode, f.type, f.value, f.status])}
              />
            )}
            {activeTab === "Users" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Email", "Role", "KYC Level", "Status", ""].map((h) => (
                        <th key={h} className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pr-5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {USERS_DATA.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 pr-5 font-semibold text-foreground">{u.name}</td>
                        <td className="py-3 pr-5 text-muted-foreground text-xs">{u.email}</td>
                        <td className="py-3 pr-5">
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", ROLE_COLORS[u.role] ?? "bg-muted text-muted-foreground")}>{u.role}</span>
                        </td>
                        <td className="py-3 pr-5 text-muted-foreground text-xs">{u.kyc}</td>
                        <td className="py-3 pr-5">
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", u.status === "Active" ? "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" : "bg-destructive/10 text-destructive")}>{u.status}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-muted rounded text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pt-4">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" /> Add User</Button>
                </div>
              </div>
            )}
            {activeTab === "Partners" && (
              <AdminTable
                headers={["Code", "Name", "Corridor", "Mode", "Priority", "Status", ""]}
                rows={PARTNERS_DATA.map((p) => [p.code, p.name, p.corridor, p.mode, String(p.priority), p.status])}
              />
            )}
            {activeTab === "Payout Modes" && (
              <div className="space-y-3">
                {["Account", "CashPickup", "MobileWallet"].map((mode) => (
                  <div key={mode} className="flex items-center justify-between p-4 rounded-xl bg-muted">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{mode}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {mode === "Account" && "Direct bank account credit"}
                        {mode === "CashPickup" && "Physical cash pickup at agent locations"}
                        {mode === "MobileWallet" && "Mobile wallet credit (GCash, bKash, etc.)"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]">Active</span>
                      <button className="p-1.5 hover:bg-border rounded-lg text-muted-foreground"><Edit2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function AdminTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th key={h} className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pr-5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/50 transition-colors">
              {row.map((cell, j) => {
                if (j === row.length - 1 && cell === "") {
                  return (
                    <td key={j} className="py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-muted rounded text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  );
                }
                const isStatus = cell === "Active" || cell === "Paused" || cell === "Locked";
                return (
                  <td key={j} className="py-3 pr-5">
                    {isStatus ? (
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cell === "Active" ? "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" : "bg-muted text-muted-foreground")}>{cell}</span>
                    ) : (
                      <span className={j === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}>{cell}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pt-4">
        <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" /> Add New</Button>
      </div>
    </div>
  );
}
