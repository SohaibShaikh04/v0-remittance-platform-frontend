"use client";

import Shell from "@/components/swiftpay/shell";
import StatCard from "@/components/swiftpay/stat-card";
import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle, Clock, Send, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const QUEUE_DATA = [
  { corridor: "US→IN", pending: 24, processing: 8, paid: 142 },
  { corridor: "US→PH", pending: 12, processing: 4, paid: 87 },
  { corridor: "UK→IN", pending: 18, processing: 6, paid: 103 },
  { corridor: "SG→PH", pending: 6, processing: 2, paid: 64 },
  { corridor: "US→MX", pending: 9, processing: 3, paid: 55 },
  { corridor: "AE→PK", pending: 15, processing: 7, paid: 76 },
];

const VOLUME_CHART = [
  { day: "Mon", volume: 128000 },
  { day: "Tue", volume: 142000 },
  { day: "Wed", volume: 165000 },
  { day: "Thu", volume: 138000 },
  { day: "Fri", volume: 189000 },
  { day: "Sat", volume: 95000 },
  { day: "Sun", volume: 74000 },
];

const QUEUED_ITEMS = [
  { id: "TXN-2024-48200", customer: "Arjun Mehta", corridor: "US→IN", amount: "$1,200", waitTime: "2h 15m", stage: "Validation" },
  { id: "TXN-2024-48199", customer: "Rosa Fernandez", corridor: "US→MX", amount: "$450", waitTime: "1h 40m", stage: "Compliance" },
  { id: "TXN-2024-48198", customer: "Lim Jae-won", corridor: "SG→PH", amount: "$800", waitTime: "45m", stage: "Routing" },
  { id: "TXN-2024-48197", customer: "Ibrahim Al-Sayed", corridor: "AE→EG", amount: "$3,000", waitTime: "3h 05m", stage: "Compliance" },
  { id: "TXN-2024-48196", customer: "Fatima Zahra", corridor: "UK→MA", amount: "$650", waitTime: "55m", stage: "Validation" },
];

const STAGE_COLORS: Record<string, string> = {
  Validation: "bg-[oklch(0.55_0.15_240)]/15 text-[oklch(0.38_0.12_240)]",
  Compliance: "bg-destructive/10 text-destructive",
  Routing: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
  Paid: "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]",
};

export default function OperationsPage() {
  return (
    <Shell title="Operations Dashboard" subtitle="Transaction queues, corridors, and processing status" role="Operations Officer">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="In Queue" value="84" sub="Awaiting processing" icon={<Clock className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Processing" value="30" sub="Active right now" icon={<RefreshCw className="w-4 h-4 text-muted-foreground" />} accent />
          <StatCard label="Paid Today" value="527" sub="Successfully settled" change={5} icon={<CheckCircle2 className="w-4 h-4 text-primary-foreground" />} />
          <StatCard label="Failed / Held" value="9" sub="Requires attention" change={-2} icon={<AlertCircle className="w-4 h-4 text-muted-foreground" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Volume chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Weekly Transfer Volume (USD)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={VOLUME_CHART} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.895 0.012 220)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(0.50 0.015 230)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "oklch(0.50 0.015 230)" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid oklch(0.895 0.012 220)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Volume"]}
                />
                <Bar dataKey="volume" fill="oklch(0.46 0.12 196)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Corridor breakdown */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Corridor Queue Status</h3>
            <div className="space-y-3">
              {QUEUE_DATA.map((q) => {
                const total = q.pending + q.processing + q.paid;
                const pendingPct = Math.round((q.pending / total) * 100);
                return (
                  <div key={q.corridor}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-foreground">{q.corridor}</span>
                      <span className="text-muted-foreground">{q.pending} pending</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex gap-0.5">
                      <div className="h-full bg-destructive/70 rounded-full" style={{ width: `${Math.round((q.pending / total) * 100)}%` }} />
                      <div className="h-full bg-[oklch(0.78_0.14_75)]" style={{ width: `${Math.round((q.processing / total) * 100)}%` }} />
                      <div className="h-full bg-[oklch(0.58_0.14_155)]" style={{ width: `${Math.round((q.paid / total) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive/70 inline-block" /> Pending</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[oklch(0.78_0.14_75)] inline-block" /> Processing</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[oklch(0.58_0.14_155)] inline-block" /> Paid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Queue table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Active Queue</h3>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
          <div className="divide-y divide-border">
            {QUEUED_ITEMS.map((item) => (
              <div key={item.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.customer}</p>
                    <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{item.corridor}</span>
                    <span className="text-xs text-muted-foreground">· {item.amount}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Clock className="w-3 h-3" /> {item.waitTime}</span>
                  </div>
                </div>
                <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0", STAGE_COLORS[item.stage])}>
                  {item.stage}
                </span>
                <Button variant="ghost" size="sm" className="shrink-0 h-7 text-xs gap-1">
                  Process <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
