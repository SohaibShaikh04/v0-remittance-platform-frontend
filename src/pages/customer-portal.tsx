import { useEffect, useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import SendMoneyWidget from '@/components/swiftpay/send-money-widget';
import TransactionList from '@/components/swiftpay/transaction-list';
import KYCStatusCard from '@/components/swiftpay/kyc-status-card';
import StatCard from '@/components/swiftpay/stat-card';
import { apiClient } from '@/lib/api-client';
import { TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CustomerPortal() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, kycData] = await Promise.all([
          apiClient.getTransactions(5),
          apiClient.getKYCStatus(),
        ]);
        setTransactions(txData);
        setKycStatus(kycData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Topbar title="Send Money" subtitle="Instant international transfers with best FX rates" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <StatCard icon={TrendingUp} label="Total Sent" value="$5,250" color="primary" />
              <StatCard icon={CheckCircle2} label="Successful Transfers" value="12" color="success" />
              <StatCard icon={AlertCircle} label="Exchange Rate" value="1 USD = 83.45 INR" color="info" />
            </div>

            {/* KYC Status */}
            {kycStatus && <KYCStatusCard status={kycStatus} />}
          </div>

          {/* Send Money Widget */}
          <SendMoneyWidget />

          {/* Recent Transactions */}
          {!loading && <TransactionList transactions={transactions} showHeader limit={5} />}
        </div>
      </main>
    </>
  );
}
