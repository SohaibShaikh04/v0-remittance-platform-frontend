"use client";

import Shell from "@/components/swiftpay/shell";
import StatCard from "@/components/swiftpay/stat-card";
import { useState } from "react";
import { TrendingUp, Lock, RefreshCw, Edit2, Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CORRIDORS = [
  { id: 1, from: "USD", to: "INR", midRate: 83.45, marginBps: 150, offeredRate: 83.20, spread: 0.25, lockEnabled: true, lockWindowMins: 15, status: "Active" },
  { id: 2, from: "USD", to: "PHP", midRate: 56.72, marginBps: 120, offeredRate: 56.60, spread: 0.12, lockEnabled: true, lockWindowMins: 10, status: "Active" },
  { id: 3, from: "USD", to: "AED", midRate: 3.673, marginBps: 80, offeredRate: 3.670, spread: 0.003, lockEnabled: false, lockWindowMins: 0, status: "Active" },
  { id: 4, from: "GBP", to: "INR", midRate: 105.7, marginBps: 180, offeredRate: 105.51, spread: 0.19, lockEnabled: true, lockWindowMins: 20, status: "Active" },
  { id: 5, from: "SGD", to: "PHP", midRate: 42.30, marginBps: 100, offeredRate: 42.26, spread: 0.04, lockEnabled: false, lockWindowMins: 0, status: "Paused" },
  { id: 6, from: "AED", to: "PKR", midRate: 77.22, marginBps: 200, offeredRate: 76.92, spread: 0.30, lockEnabled: true, lockWindowMins: 15, status: "Active" },
];

const RATE_HISTORY = [
  { time: "09:00", usdInr: 83.20, usdPhp: 56.55 },
  { time: "10:00", usdInr: 83.35, usdPhp: 56.62 },
  { time: "11:00", usdInr: 83.18, usdPhp: 56.48 },
  { time: "12:00", usdInr: 83.45, usdPhp: 56.72 },
  { time: "13:00", usdInr: 83.52, usdPhp: 56.80 },
  { time: "14:00", usdInr: 83.40, usdPhp: 56.69 },
  { time: "15:00", usdInr: 83.28, usdPhp: 56.61 },
];

const RATE_LOCKS = [
  { id: "LK-001", customer: "Ravi Kumar", corridor: "USD→INR", rate: 83.20, locked: "Apr 12, 14:32", expiry: "Apr 12, 14:47", status: "Active" },
  { id: "LK-002", customer: "Priya Sharma", corridor: "USD→INR", rate: 83.15, locked: "Apr 12, 13:10", expiry: "Apr 12, 13:25", status: "Expired" },
  { id: "LK-003", customer: "Maria Santos", corridor: "USD→PHP", rate: 56.60, locked: "Apr 12, 14:55", expiry: "Apr 12, 15:05", status: "Active" },
];

export default function TreasuryPage() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMargin, setEditMargin] = useState("");
  const [corridors, setCorridors] = useState(CORRIDORS);

  const saveMargin = (id: number) => {
    setCorridors((prev) =>
      prev.map((c) => c.id === id ? { ...c, marginBps: Number(editMargin) || c.marginBps, offeredRate: +(c.midRate * (1 - (Number(editMargin) || c.marginBps) / 10000)).toFixed(4) } : c)
    );
    setEditingId(null);
  };

  return (
    <Shell title="Treasury / FX Console" subtitle="Manage exchange rates, margins, and rate lock policies" role="Treasury Dealer">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Corridors" value="5" sub="1 paused" icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Active Rate Locks" value="2" sub="Expiring soon" icon={<Lock className="w-4 h-4 text-muted-foreground" />} accent />
          <StatCard label="Avg. Margin" value="138 bps" sub="Across corridors" change={5} icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="FX Revenue" value="$18,420" sub="This month" change={12} icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Rate chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Live Rate Feed (Today)</h3>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={RATE_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.895 0.012 220)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "oklch(0.50 0.015 230)" }} />
                <YAxis yAxisId="inr" domain={["auto", "auto"]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.50 0.015 230)" }} tickFormatter={(v) => v.toFixed(1)} orientation="left" />
                <YAxis yAxisId="php" domain={["auto", "auto"]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.50 0.015 230)" }} tickFormatter={(v) => v.toFixed(1)} orientation="right" />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.895 0.012 220)", borderRadius: 12, fontSize: 12 }} />
                <Line yAxisId="inr" type="monotone" dataKey="usdInr" stroke="oklch(0.46 0.12 196)" strokeWidth={2.5} dot={false} name="USD/INR" />
                <Line yAxisId="php" type="monotone" dataKey="usdPhp" stroke="oklch(0.78 0.14 75)" strokeWidth={2.5} dot={false} name="USD/PHP" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-0.5 bg-primary inline-block" /> USD/INR</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-0.5 bg-[oklch(0.78_0.14_75)] inline-block" /> USD/PHP</span>
            </div>
          </div>

          {/* Rate locks */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Active Rate Locks</h3>
            <div className="space-y-3">
              {RATE_LOCKS.map((lock) => (
                <div key={lock.id} className={cn("p-3 rounded-xl border", lock.status === "Active" ? "border-primary/30 bg-primary/5" : "border-border bg-muted")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{lock.customer}</span>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", lock.status === "Active" ? "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" : "bg-muted text-muted-foreground")}>
                      {lock.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>{lock.corridor} @ <span className="font-semibold text-foreground">{lock.rate}</span></p>
                    <p>Locked: {lock.locked}</p>
                    <p>Expires: {lock.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Corridor margins table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Corridor Margin Configuration</h3>
            <Button size="sm" className="gap-1.5 text-xs bg-primary text-primary-foreground">
              <Plus className="w-3.5 h-3.5" /> Add Corridor
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Corridor", "Mid Rate", "Margin (bps)", "Offered Rate", "Spread", "Rate Lock", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {corridors.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-foreground">{c.from}/{c.to}</td>
                    <td className="px-5 py-3 font-mono text-foreground">{c.midRate}</td>
                    <td className="px-5 py-3">
                      {editingId === c.id ? (
                        <input
                          type="number"
                          value={editMargin}
                          onChange={(e) => setEditMargin(e.target.value)}
                          className="w-20 bg-muted rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      ) : (
                        <span className="font-mono font-semibold text-foreground">{c.marginBps}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground">{c.offeredRate}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{c.spread}</td>
                    <td className="px-5 py-3">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", c.lockEnabled ? "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" : "bg-muted text-muted-foreground")}>
                        {c.lockEnabled ? `${c.lockWindowMins}m window` : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", c.status === "Active" ? "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" : "bg-muted text-muted-foreground")}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {editingId === c.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => saveMargin(c.id)} className="p-1 rounded hover:bg-[oklch(0.58_0.14_155)]/10 text-[oklch(0.35_0.12_155)]"><Save className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditingId(null)} className="p-1 rounded hover:bg-muted text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingId(c.id); setEditMargin(String(c.marginBps)); }} className="p-1 rounded hover:bg-muted text-muted-foreground">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}
