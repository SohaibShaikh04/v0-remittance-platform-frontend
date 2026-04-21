import { useState } from 'react';
import { Topbar } from '@/components/swiftpay/topbar';
import { Search, Users, FileCheck, Send } from 'lucide-react';

export default function AgentPortal() {
  const [step, setStep] = useState('search'); // search, kyc, initiate, receipt

  return (
    <>
      <Topbar title="Agent Console" subtitle="Assisted customer onboarding and transactions" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex gap-4 mb-8">
            {['search', 'kyc', 'initiate', 'receipt'].map((s, i) => {
              const steps = [
                { id: 'search', label: 'Lookup Customer', icon: Search },
                { id: 'kyc', label: 'Verify KYC', icon: FileCheck },
                { id: 'initiate', label: 'Initiate Transfer', icon: Send },
                { id: 'receipt', label: 'Confirm Receipt', icon: Users },
              ];
              const current = steps[i];
              const StepIcon = current.icon;
              const isActive = step === current.id;
              const isPassed = ['search', 'kyc', 'initiate', 'receipt'].indexOf(step) >= i;

              return (
                <button
                  key={current.id}
                  onClick={() => setStep(current.id)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    isActive ? 'border-primary bg-primary/5' : isPassed ? 'border-success bg-success/5' : 'border-border'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-primary text-primary-foreground' : isPassed ? 'bg-success text-success-foreground' : 'bg-muted'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center">{current.label}</span>
                </button>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="bg-card border border-border rounded-xl p-6">
            {step === 'search' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Search Customer</h2>
                <input
                  type="text"
                  placeholder="Enter customer name or ID..."
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                  onKeyPress={(e) => e.key === 'Enter' && setStep('kyc')}
                />
                <button
                  onClick={() => setStep('kyc')}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Continue to KYC
                </button>
              </div>
            )}

            {step === 'kyc' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Verify KYC</h2>
                <p className="text-sm text-muted-foreground">Review and verify customer documents</p>
                <button
                  onClick={() => setStep('initiate')}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  KYC Verified - Continue
                </button>
              </div>
            )}

            {step === 'initiate' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Initiate Transfer</h2>
                <input type="number" placeholder="Amount" className="w-full px-4 py-2 border border-border rounded-lg bg-background" />
                <select className="w-full px-4 py-2 border border-border rounded-lg bg-background">
                  <option>USD</option>
                  <option>INR</option>
                  <option>PHP</option>
                </select>
                <button
                  onClick={() => setStep('receipt')}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Submit Transfer
                </button>
              </div>
            )}

            {step === 'receipt' && (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                  <Send className="w-6 h-6 text-success" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Transfer Complete</h2>
                <p className="text-sm text-muted-foreground">Transaction ID: TXN-2024-XXXXX</p>
                <button
                  onClick={() => setStep('search')}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Start New Transfer
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
