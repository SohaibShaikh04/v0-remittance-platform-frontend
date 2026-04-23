import { useEffect, useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { apiClient } from '@/lib/api-client';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const data = await apiClient.getBeneficiaries();
        setBeneficiaries(data);
      } catch (error) {
        console.error('Error fetching beneficiaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this beneficiary?')) {
      try {
        await apiClient.deleteBeneficiary(id);
        setBeneficiaries(beneficiaries.filter(b => b.id !== id));
      } catch (error) {
        console.error('Error deleting beneficiary:', error);
      }
    }
  };

  return (
    <>
      <Topbar title="Beneficiaries" subtitle="Manage your recipient accounts" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Add Beneficiary
          </button>

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beneficiaries.map((b) => (
                <div key={b.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{b.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{b.country}</p>
                    </div>
                    <Badge variant="secondary">{b.payoutMethod}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Account:</span> {b.accountNumber}</p>
                    <p><span className="text-muted-foreground">Bank:</span> {b.bankName}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
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
