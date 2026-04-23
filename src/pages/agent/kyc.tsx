import { useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { Upload, Check } from 'lucide-react';

export default function AgentKYC() {
  const [level, setLevel] = useState('basic');
  const [documents, setDocuments] = useState({
    id: false,
    address: false,
    selfie: false,
  });

  const handleUpload = (docType: string) => {
    setDocuments((prev) => ({ ...prev, [docType]: true }));
  };

  return (
    <>
      <Topbar title="Assisted KYC Capture" subtitle="Upload and verify customer documents" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* KYC Level */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">KYC Level</h2>
            <div className="grid grid-cols-2 gap-4">
              {['basic', 'standard', 'enhanced'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    level === l ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Customer Information</h2>
            <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-border rounded-lg bg-background" />
            <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-border rounded-lg bg-background" />
            <input type="tel" placeholder="Phone" className="w-full px-4 py-2 border border-border rounded-lg bg-background" />
            <select className="w-full px-4 py-2 border border-border rounded-lg bg-background">
              <option>Select Country</option>
              <option>India</option>
              <option>Philippines</option>
              <option>UAE</option>
            </select>
          </div>

          {/* Documents */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Documents</h2>
            <div className="space-y-3">
              {Object.entries(documents).map(([docType, uploaded]) => (
                <div key={docType} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="capitalize font-medium">{docType === 'id' ? 'ID Document' : docType === 'address' ? 'Address Proof' : 'Selfie'}</span>
                  </div>
                  {uploaded ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <button
                      onClick={() => handleUpload(docType)}
                      className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
                    >
                      Upload
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
            Submit KYC
          </button>
        </div>
      </main>
    </>
  );
}
