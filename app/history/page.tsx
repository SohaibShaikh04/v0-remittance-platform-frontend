import Shell from "@/components/swiftpay/shell";
import TransactionList from "@/components/swiftpay/transaction-list";
import StatCard from "@/components/swiftpay/stat-card";
import { Send, DollarSign, Globe, CheckCircle2 } from "lucide-react";

export default function HistoryPage() {
  return (
    <Shell title="Transaction History" subtitle="All your past remittances" role="Customer">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Sent" value="$12,840" sub="All time" change={18} icon={<DollarSign className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Transactions" value="47" sub="All time" change={12} icon={<Send className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Countries" value="6" sub="Corridors used" icon={<Globe className="w-4 h-4 text-muted-foreground" />} />
          <StatCard label="Success Rate" value="94.7%" sub="Last 30 days" change={1.2} icon={<CheckCircle2 className="w-4 h-4 text-muted-foreground" />} accent />
        </div>
        <TransactionList showHeader={false} />
      </div>
    </Shell>
  );
}
