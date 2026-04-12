import Shell from "@/components/swiftpay/shell";
import SendMoneyWidget from "@/components/swiftpay/send-money-widget";
import TransactionList from "@/components/swiftpay/transaction-list";
import KycStatusCard from "@/components/swiftpay/kyc-status-card";
import StatCard from "@/components/swiftpay/stat-card";
import { Send, DollarSign, Globe, Clock } from "lucide-react";

export default function CustomerHome() {
  return (
    <Shell
      title="Send Money"
      subtitle="Fast, secure international transfers"
      role="Customer"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Sent"
            value="$12,840"
            sub="This year"
            change={18}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
          />
          <StatCard
            label="Transactions"
            value="47"
            sub="All time"
            change={12}
            icon={<Send className="w-4 h-4 text-muted-foreground" />}
          />
          <StatCard
            label="Countries"
            value="6"
            sub="Corridors used"
            icon={<Globe className="w-4 h-4 text-muted-foreground" />}
          />
          <StatCard
            label="Avg. Delivery"
            value="1.2 days"
            sub="Based on last 10 txns"
            icon={<Clock className="w-4 h-4 text-muted-foreground" />}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send widget + KYC */}
          <div className="space-y-5">
            <SendMoneyWidget />
            <KycStatusCard />
          </div>

          {/* Transaction list */}
          <div className="lg:col-span-2">
            <TransactionList />
          </div>
        </div>
      </div>
    </Shell>
  );
}
