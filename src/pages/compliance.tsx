import { useEffect, useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { apiClient } from '@/lib/api-client';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CompliancePage() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await apiClient.getComplianceCases(filter !== 'all' ? filter : undefined);
        setCases(data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [filter]);

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Medium':
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Topbar title="Compliance Workbench" subtitle="Review screening cases and manage approvals" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {!loading && (
            <div className="space-y-3">
              {cases.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                  {getIcon(c.severity)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{c.transactionId}</h3>
                    <p className="text-sm text-muted-foreground">{c.reason}</p>
                  </div>
                  <Badge variant={c.severity === 'High' ? 'destructive' : 'secondary'}>{c.severity}</Badge>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
