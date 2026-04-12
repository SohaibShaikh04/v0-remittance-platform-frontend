"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, XCircle, RefreshCw } from "lucide-react";

export type TxStatus = "Paid" | "Queued" | "ComplianceHold" | "Routing" | "Cancelled" | "Refunded" | "Validated";

const STATUS_CONFIG: Record<TxStatus, { label: string; icon: React.ReactNode; className: string }> = {
  Paid: { label: "Paid", icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: "bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)]" },
  Queued: { label: "Queued", icon: <Clock className="w-3.5 h-3.5" />, className: "bg-[oklch(0.78_0.14_75)]/15 text-[oklch(0.45_0.10_60)]" },
  ComplianceHold: { label: "On Hold", icon: <AlertCircle className="w-3.5 h-3.5" />, className: "bg-destructive/10 text-destructive" },
  Routing: { label: "Routing", icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" />, className: "bg-[oklch(0.55_0.15_240)]/15 text-[oklch(0.38_0.12_240)]" },
  Cancelled: { label: "Cancelled", icon: <XCircle className="w-3.5 h-3.5" />, className: "bg-muted text-muted-foreground" },
  Refunded: { label: "Refunded", icon: <RefreshCw className="w-3.5 h-3.5" />, className: "bg-muted text-muted-foreground" },
  Validated: { label: "Validated", icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: "bg-[oklch(0.55_0.15_240)]/15 text-[oklch(0.38_0.12_240)]" },
};

export interface Transaction {
  id: string;
  date: string;
  beneficiary: string;
  country: string;
  flag: string;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  rate: number;
  status: TxStatus;
  purpose: string;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: "TXN-2024-48291", date: "Apr 12, 2026", beneficiary: "Ravi Kumar", country: "India", flag: "🇮🇳", sendAmount: 500, sendCurrency: "USD", receiveAmount: 41725, receiveCurrency: "INR", rate: 83.45, status: "Paid", purpose: "Family Support" },
  { id: "TXN-2024-47182", date: "Apr 10, 2026", beneficiary: "Priya Sharma", country: "India", flag: "🇮🇳", sendAmount: 250, sendCurrency: "USD", receiveAmount: 20862.5, receiveCurrency: "INR", rate: 83.45, status: "Routing", purpose: "Education" },
  { id: "TXN-2024-46103", date: "Apr 8, 2026", beneficiary: "Ahmed Al-Farsi", country: "UAE", flag: "🇦🇪", sendAmount: 1000, sendCurrency: "USD", receiveAmount: 3673, receiveCurrency: "AED", rate: 3.673, status: "ComplianceHold", purpose: "Business Payment" },
  { id: "TXN-2024-45089", date: "Apr 5, 2026", beneficiary: "Maria Santos", country: "Philippines", flag: "🇵🇭", sendAmount: 300, sendCurrency: "USD", receiveAmount: 17016, receiveCurrency: "PHP", rate: 56.72, status: "Queued", purpose: "Family Support" },
  { id: "TXN-2024-44011", date: "Apr 1, 2026", beneficiary: "Wei Zhang", country: "Singapore", flag: "🇸🇬", sendAmount: 750, sendCurrency: "USD", receiveAmount: 1005.75, receiveCurrency: "SGD", rate: 1.341, status: "Paid", purpose: "Savings" },
  { id: "TXN-2024-43008", date: "Mar 28, 2026", beneficiary: "Pedro Garcia", country: "Mexico", flag: "🇲🇽", sendAmount: 200, sendCurrency: "USD", receiveAmount: 3464, receiveCurrency: "MXN", rate: 17.32, status: "Cancelled", purpose: "Medical" },
];

interface TransactionListProps {
  transactions?: Transaction[];
  limit?: number;
  showHeader?: boolean;
}

export default function TransactionList({ transactions = SAMPLE_TRANSACTIONS, limit, showHeader = true }: TransactionListProps) {
  const displayed = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {showHeader && (
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
          <button className="text-xs text-primary hover:underline font-medium">View All</button>
        </div>
      )}
      <div className="divide-y divide-border">
        {displayed.map((tx) => {
          const s = STATUS_CONFIG[tx.status];
          return (
            <div key={tx.id} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
              {/* Flag + Initial */}
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg shrink-0 border border-border">
                {tx.flag}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground truncate">{tx.beneficiary}</p>
                  <span className="text-xs text-muted-foreground hidden sm:block">· {tx.country}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground font-mono">{tx.id}</span>
                  <span className="text-xs text-muted-foreground">· {tx.date}</span>
                </div>
              </div>

              {/* Amounts */}
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-sm font-bold text-foreground">
                  -{tx.sendAmount.toLocaleString()} {tx.sendCurrency}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tx.receiveAmount.toLocaleString()} {tx.receiveCurrency}
                </p>
              </div>

              {/* Status */}
              <div className="shrink-0">
                <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full", s.className)}>
                  {s.icon}
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
