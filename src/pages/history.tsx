import { Topbar } from '@/components/swiftpay/topbar';
import TransactionList from '@/components/swiftpay/transaction-list';

export default function HistoryPage() {
  return (
    <>
      <Topbar title="Transaction History" subtitle="View all your past transactions" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <TransactionList />
        </div>
      </main>
    </>
  );
}
