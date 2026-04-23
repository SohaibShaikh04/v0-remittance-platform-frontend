import { useEffect, useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { apiClient } from '@/lib/api-client';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettlementPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await apiClient.getSettlementBatches();
        setBatches(data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return (
    <>
      <Topbar title="Settlement & Reconciliation" subtitle="Batch status and reconciliation records" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {!loading && (
            <div className="space-y-3">
              {batches.map((b) => (
                <div key={b.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{b.batchId}</h3>
                      <p className="text-xs text-muted-foreground">{b.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.status === 'Settled' ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-warning" />
                      )}
                      <span className="text-sm font-medium">{b.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-semibold">${b.amount}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transactions:</span>
                      <p className="font-semibold">{b.count}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Partner:</span>
                      <p className="font-semibold">{b.partner}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
