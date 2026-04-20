"use client";

import { useState } from "react";
import { X, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefundRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  amount: number;
  currency: string;
  beneficiary: string;
  payoutMethod: "Bank Transfer" | "Mobile Money" | "Cash Pickup";
  corridor: string;
}

export default function RefundRequestModal({
  isOpen,
  onClose,
  transactionId,
  amount,
  currency,
  beneficiary,
  payoutMethod,
  corridor,
}: RefundRequestModalProps) {
  const [step, setStep] = useState<"reason" | "confirmation" | "submitted">("reason");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [notes, setNotes] = useState("");

  const refundReasons = [
    { id: "wrong-amount", label: "Sent wrong amount", icon: "❌" },
    { id: "wrong-beneficiary", label: "Wrong beneficiary selected", icon: "👤" },
    { id: "duplicate", label: "Duplicate transaction", icon: "📋" },
    { id: "change-mind", label: "Changed my mind", icon: "💭" },
    { id: "beneficiary-request", label: "Beneficiary requested refund", icon: "📞" },
    { id: "other", label: "Other reason", icon: "❓" },
  ];

  // Refund timeline based on payout method
  const refundTimelines: Record<string, { days: number; date: string }> = {
    "Bank Transfer": { days: 3, date: "Apr 14, 2026" },
    "Mobile Money": { days: 1, date: "Apr 10, 2026" },
    "Cash Pickup": { days: 5, date: "Apr 16, 2026" },
  };

  const timeline = refundTimelines[payoutMethod] || refundTimelines["Bank Transfer"];

  const handleSubmit = () => {
    if (!selectedReason) return;
    setStep("submitted");
    setTimeout(() => {
      onClose();
      setStep("reason");
      setSelectedReason("");
      setNotes("");
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Request Refund</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "reason" && (
            <div className="space-y-4">
              {/* Transaction Summary */}
              <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="font-mono text-sm text-foreground">{transactionId}</p>
                <div className="pt-2 border-t border-border/50 mt-2 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Refund Amount</span>
                  <span className="font-bold text-foreground">{amount} {currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">To {beneficiary}</span>
                  <span className="text-xs text-muted-foreground">{payoutMethod}</span>
                </div>
              </div>

              {/* Refund Timeline Info */}
              <div className="bg-[oklch(0.55_0.15_240)]/5 border border-[oklch(0.55_0.15_240)]/20 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[oklch(0.55_0.15_240)] mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">Expected Timeline</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Since you're using <span className="font-medium text-foreground">{payoutMethod}</span>, your refund will be completed in <span className="font-semibold">{timeline.days} business days</span> by <span className="font-semibold text-foreground">{timeline.date}</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-3">
                  Why are you requesting a refund?
                </label>
                <div className="space-y-2">
                  {refundReasons.map((reason) => (
                    <button
                      key={reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg border-2 transition-colors flex items-center gap-3",
                        selectedReason === reason.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <span className="text-lg">{reason.icon}</span>
                      <span className="text-sm font-medium text-foreground">{reason.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Additional notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us more about why you need a refund..."
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>

              {/* Warning */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">
                  <strong>Note:</strong> Once submitted, you cannot cancel this refund request. Your money will be refunded to your original payment method.
                </p>
              </div>
            </div>
          )}

          {step === "confirmation" && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Refund Approved</h3>
                <p className="text-sm text-muted-foreground">
                  Your refund request has been submitted. You'll receive {amount} {currency} by {timeline.date}.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refund Amount</span>
                  <span className="font-semibold text-foreground">{amount} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-semibold text-foreground">$0.00</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-muted-foreground">You will receive</span>
                  <span className="font-bold text-foreground">{amount} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected by</span>
                  <span className="font-semibold text-foreground">{timeline.date}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                A confirmation email has been sent. You can track your refund status in the Notifications tab.
              </p>
            </div>
          )}

          {step === "submitted" && (
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4 animate-pulse" />
              <h3 className="font-semibold text-foreground mb-2">Refund Submitted</h3>
              <p className="text-sm text-muted-foreground">Closing in a moment...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "reason" && (
          <div className="px-6 py-4 border-t border-border flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep("confirmation")}
              disabled={!selectedReason}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Continue
            </button>
          </div>
        )}

        {step === "confirmation" && (
          <div className="px-6 py-4 border-t border-border flex gap-3">
            <button
              onClick={() => setStep("reason")}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Confirm Refund
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
