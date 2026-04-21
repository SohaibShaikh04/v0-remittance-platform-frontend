import { useEffect, useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { apiClient } from '@/lib/api-client';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TreasuryPage() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await apiClient.getFXRates();
        setRates(data);
      } catch (error) {
        console.error('Error fetching rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const handleUpdateMargin = async (corridor: string, newMargin: number) => {
    try {
      await apiClient.updateMargin(corridor, newMargin);
      // Refetch rates
      const data = await apiClient.getFXRates();
      setRates(data);
    } catch (error) {
      console.error('Error updating margin:', error);
    }
  };

  return (
    <>
      <Topbar title="FX / Treasury Console" subtitle="Manage exchange rates and margin configuration" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {!loading && rates && (
            <div className="space-y-4">
              {rates.corridors?.map((corridor: any) => (
                <div key={corridor.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{corridor.pair}</h3>
                      <p className="text-xs text-muted-foreground">{corridor.volume} transactions today</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {corridor.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                      <span className={corridor.change > 0 ? 'text-success' : 'text-destructive'}>
                        {corridor.change}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Mid Rate:</span>
                      <p className="font-semibold">{corridor.rate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Margin:</span>
                      <input
                        type="number"
                        defaultValue={corridor.margin}
                        onBlur={(e) => handleUpdateMargin(corridor.pair, parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-muted border border-border rounded text-sm font-semibold"
                      />
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
