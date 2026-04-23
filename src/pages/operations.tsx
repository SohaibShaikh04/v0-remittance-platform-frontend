import { useEffect, useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { apiClient } from '@/lib/api-client';
import { BarChart3, Activity } from 'lucide-react';

export default function OperationsPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiClient.getOperationsMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <>
      <Topbar title="Operations Dashboard" subtitle="Monitor transaction flow and corridor metrics" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {!loading && metrics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <h3 className="text-sm text-muted-foreground font-medium">Weekly Volume</h3>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metrics.weeklyVolume}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <h3 className="text-sm text-muted-foreground font-medium">Transactions</h3>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metrics.transactionCount}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-success" />
                    <h3 className="text-sm text-muted-foreground font-medium">Success Rate</h3>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metrics.successRate}%</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
