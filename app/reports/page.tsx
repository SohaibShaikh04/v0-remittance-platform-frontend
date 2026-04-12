"use client";

import Shell from "@/components/swiftpay/shell";
import StatCard from "@/components/swiftpay/stat-card";
import { BarChart3, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const MONTHLY_VOLUME = [
  { month: "Nov", volume: 1420000, txns: 1840 },
  { month: "Dec", volume: 1680000, txns: 2120 },
  { month: "Jan", volume: 1540000, txns: 1980 },
  { month: "Feb", volume: 1820000, txns: 2340 },
  { month: "Mar", volume: 2100000, txns: 2680 },
  { month: "Apr", volume: 1950000, txns: 2490 },
];

const CORRIDOR_MIX = [
  { name: "US→IN", value: 38 },
  { name: "US→PH", value: 22 },
  { name: "UK→IN", value: 16 },
  { name: "AE→PK", value: 12 },
  { name: "SG→PH", value: 8 },
  { name: "Others", value: 4 },
];

const COLORS = ["oklch(0.46 0.12 196)", "oklch(0.78 0.14 75)", "oklch(0.58 0.14 155)", "oklch(0.55 0.15 260)", "oklch(0.65 0.18 30)", "oklch(0.70 0 0)"];

const REPORTS_LIST = [
  { name: "Monthly Remittance Register - Apr 2026", date: "Apr 12, 2026", type: "Regulatory", size: "2.4 MB" },
  { name: "Corridor Volume Report - Q1 2026", date: "Apr 1, 2026", type: "Operational", size: "1.8 MB" },
  { name: "LRS Utilization Report - Mar 2026", date: "Apr 1, 2026", type: "Regulatory", size: "980 KB" },
  { name: "Exception & Rejection KPIs - Mar 2026", date: "Apr 1, 2026", type: "Compliance", size: "640 KB" },
  { name: "FX Revenue Report - Q1 2026", date: "Apr 1, 2026", type: "Financial", size: "1.1 MB" },
];

const TYPE_COLORS: Record<string, string> = {
  Regulatory: "bg-destructive/10 text-destructive",
  Operational: "bg-[oklch(0.55_0.15_240)]/15 text-[oklch(0.38_0.12_240)]",
  Compliance: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]",
  Financial: "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]",
};

export default function ReportsPage() {
  return (
    <Shell title="Reports & Analytics" subtitle="Operational MIS, corridor volumes, and regulatory packs" role="Admin">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Volume" value="$10.5M" sub="Last 6 months" change={14} icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />} accent />
          <StatCard label="Transactions" value="13,450" sub="Last 6 months" change={9} icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Avg. Ticket" value="$781" sub="Per transaction" change={5} icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Reject Rate" value="3.1%" sub="Last 30 days" change={-0.4} icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Volume bar chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Monthly Transfer Volume & Transactions</h3>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Calendar className="w-3.5 h-3.5" /> Last 6 Months</Button>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MONTHLY_VOLUME} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.895 0.012 220)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(0.50 0.015 230)" }} />
                <YAxis yAxisId="vol" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.50 0.015 230)" }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <YAxis yAxisId="txn" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.50 0.015 230)" }} tickFormatter={(v) => `${v.toLocaleString()}`} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.895 0.012 220)", borderRadius: 12, fontSize: 12 }} />
                <Bar yAxisId="vol" dataKey="volume" fill="oklch(0.46 0.12 196)" radius={[6, 6, 0, 0]} name="Volume (USD)" />
                <Bar yAxisId="txn" dataKey="txns" fill="oklch(0.78 0.14 75)" radius={[6, 6, 0, 0]} name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Corridor Mix</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={CORRIDOR_MIX} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {CORRIDOR_MIX.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid oklch(0.895 0.012 220)" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Report downloads */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Generated Reports</h3>
            <Button size="sm" className="gap-1.5 text-xs bg-primary text-primary-foreground">
              Generate New Report
            </Button>
          </div>
          <div className="divide-y divide-border">
            {REPORTS_LIST.map((r) => (
              <div key={r.name} className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.date} · {r.size}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLORS[r.type]}`}>{r.type}</span>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs shrink-0">
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
