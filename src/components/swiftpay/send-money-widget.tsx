import { useState, useEffect } from "react";
import { ArrowRightLeft, Lock, Info, ChevronDown, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "INR", flag: "🇮🇳", name: "Indian Rupee" },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar" },
  { code: "PHP", flag: "🇵🇭", name: "Philippine Peso" },
  { code: "BDT", flag: "🇧🇩", name: "Bangladeshi Taka" },
  { code: "NPR", flag: "🇳🇵", name: "Nepalese Rupee" },
  { code: "MXN", flag: "🇲🇽", name: "Mexican Peso" },
];

const FX_RATES: Record<string, Record<string, number>> = {
  USD: { EUR: 0.9218, GBP: 0.7892, INR: 83.45, AED: 3.673, SGD: 1.341, PHP: 56.72, BDT: 110.2, NPR: 132.8, MXN: 17.32 },
  EUR: { USD: 1.0848, GBP: 0.8562, INR: 90.51, AED: 3.984, SGD: 1.454, PHP: 61.53, BDT: 119.5, NPR: 144.1, MXN: 18.79 },
  GBP: { USD: 1.267, EUR: 1.168, INR: 105.7, AED: 4.652, SGD: 1.699, PHP: 71.87, BDT: 139.6, NPR: 168.3, MXN: 21.94 },
  INR: { USD: 0.01198, EUR: 0.01105, GBP: 0.00947, AED: 0.04402, SGD: 0.01607, PHP: 0.6798, BDT: 1.321, NPR: 1.591, MXN: 0.2077 },
  AED: { USD: 0.2723, EUR: 0.2510, GBP: 0.2150, INR: 22.72, SGD: 0.3651, PHP: 15.44, BDT: 30.00, NPR: 36.16, MXN: 4.716 },
  SGD: { USD: 0.7457, EUR: 0.6877, GBP: 0.5886, INR: 62.23, AED: 2.739, PHP: 42.30, BDT: 82.17, NPR: 99.03, MXN: 12.92 },
  PHP: { USD: 0.01763, EUR: 0.01625, GBP: 0.01391, INR: 1.470, AED: 0.06477, SGD: 0.02364, BDT: 1.943, NPR: 2.342, MXN: 0.3055 },
  BDT: { USD: 0.009075, EUR: 0.008368, GBP: 0.007163, INR: 0.7571, AED: 0.03333, SGD: 0.01217, PHP: 0.5148, NPR: 1.206, MXN: 0.1573 },
  NPR: { USD: 0.007528, EUR: 0.006940, GBP: 0.005942, INR: 0.6285, AED: 0.02765, SGD: 0.01010, PHP: 0.4270, BDT: 0.8295, MXN: 0.1305 },
  MXN: { USD: 0.05774, EUR: 0.05322, GBP: 0.04558, INR: 4.816, AED: 0.2120, SGD: 0.07742, PHP: 3.274, BDT: 6.358, NPR: 7.663 },
};

function getFee(amount: number): number {
  if (amount < 200) return 1.99;
  if (amount < 500) return 2.99;
  if (amount < 2000) return 4.99;
  return 9.99;
}

type Step = "quote" | "beneficiary" | "review" | "success";

export default function SendMoneyWidget() {
  const [sendCurrency, setSendCurrency] = useState("USD");
  const [receiveCurrency, setReceiveCurrency] = useState("INR");
  const [sendAmount, setSendAmount] = useState("500");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [rateLocked, setRateLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [step, setStep] = useState<Step>("quote");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState<"send" | "receive" | null>(null);

  const fromCur = CURRENCIES.find((c) => c.code === sendCurrency)!;
  const toCur = CURRENCIES.find((c) => c.code === receiveCurrency)!;
  const midRate = sendCurrency === receiveCurrency ? 1 : (FX_RATES[sendCurrency]?.[receiveCurrency] ?? 1);
  const margin = 0.002;
  const offeredRate = midRate * (1 - margin);
  const fee = getFee(Number(sendAmount) || 0);

  useEffect(() => {
    const amt = Number(sendAmount) || 0;
    setReceiveAmount((amt * offeredRate).toFixed(2));
  }, [sendAmount, offeredRate]);

  useEffect(() => {
    if (!rateLocked) return;
    setLockTimer(120);
    const interval = setInterval(() => {
      setLockTimer((t) => {
        if (t <= 1) { setRateLocked(false); clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLocked]);

  const swapCurrencies = () => {
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(sendCurrency);
  };

  if (step === "success") {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-[oklch(0.58_0.14_155)]/15 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[oklch(0.58_0.14_155)]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Transfer Initiated!</h3>
          <p className="text-muted-foreground text-sm mt-1">Your transfer of {fromCur.flag} {sendAmount} {sendCurrency} is being processed.</p>
        </div>
        <div className="w-full bg-muted rounded-xl p-4 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reference No.</span>
            <span className="font-mono font-semibold text-foreground">TXN-2024-{Math.floor(Math.random() * 90000) + 10000}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated delivery</span>
            <span className="font-semibold text-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 1–2 business days</span>
          </div>
        </div>
        <Button className="w-full" onClick={() => setStep("quote")}>Send Another Transfer</Button>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h3 className="font-bold text-lg text-foreground">Review Your Transfer</h3>
        <div className="space-y-3">
          {[
            { label: "You send", value: `${fromCur.flag} ${sendAmount} ${sendCurrency}` },
            { label: "Recipient gets", value: `${toCur.flag} ${receiveAmount} ${receiveCurrency}` },
            { label: "Exchange rate", value: `1 ${sendCurrency} = ${offeredRate.toFixed(4)} ${receiveCurrency}` },
            { label: "Transfer fee", value: `$${fee.toFixed(2)}` },
            { label: "Total you pay", value: `${fromCur.flag} ${(Number(sendAmount) + fee).toFixed(2)} ${sendCurrency}` },
            { label: "Payout mode", value: "Bank Account" },
            { label: "Delivery time", value: "1–2 business days" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-semibold text-foreground">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("beneficiary")}>Back</Button>
          <Button className="flex-1 bg-primary text-primary-foreground" onClick={() => setStep("success")}>Confirm Transfer</Button>
        </div>
      </div>
    );
  }

  if (step === "beneficiary") {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h3 className="font-bold text-lg text-foreground">Select Beneficiary</h3>
        <div className="space-y-2">
          {[
            { name: "Ravi Kumar", bank: "SBI — ****4521", country: "🇮🇳 India" },
            { name: "Priya Sharma", bank: "HDFC — ****7823", country: "🇮🇳 India" },
          ].map((b) => (
            <button
              key={b.name}
              onClick={() => setStep("review")}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-secondary transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {b.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.bank} · {b.country}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
            </button>
          ))}
          <button
            onClick={() => setStep("review")}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-border hover:border-primary hover:bg-secondary transition-colors text-center justify-center text-sm text-muted-foreground"
          >
            + Add New Beneficiary
          </button>
        </div>
        <Button variant="outline" className="w-full" onClick={() => setStep("quote")}>Back</Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-bold text-foreground">Send Money</h2>
        {rateLocked && (
          <Badge className="gap-1 bg-[oklch(0.58_0.14_155)]/15 text-[oklch(0.35_0.12_155)] hover:bg-[oklch(0.58_0.14_155)]/15">
            <Lock className="w-3 h-3" /> Rate locked {lockTimer}s
          </Badge>
        )}
      </div>

      {/* Send amount */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">You Send</label>
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <input
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="w-full bg-muted rounded-xl px-3 md:px-4 py-2 md:py-3 text-lg md:text-xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowCurrencyPicker(showCurrencyPicker === "send" ? null : "send")}
              className="flex items-center gap-2 bg-muted rounded-xl px-3 md:px-4 py-2 md:py-3 font-semibold text-foreground hover:bg-border transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-lg">{fromCur.flag}</span>
              <span className="text-sm">{fromCur.code}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {showCurrencyPicker === "send" && (
              <CurrencyPicker
                currencies={CURRENCIES.filter((c) => c.code !== receiveCurrency)}
                onSelect={(code) => { setSendCurrency(code); setShowCurrencyPicker(null); }}
                onClose={() => setShowCurrencyPicker(null)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Rate row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <button
          onClick={swapCurrencies}
          className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">
            1 {sendCurrency} = <span className="font-semibold text-foreground">{offeredRate.toFixed(4)} {receiveCurrency}</span>
          </span>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Receive amount */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Recipient Gets</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-xl font-bold text-foreground">
              {receiveAmount || "0.00"}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowCurrencyPicker(showCurrencyPicker === "receive" ? null : "receive")}
              className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3 font-semibold text-foreground hover:bg-border transition-colors"
            >
              <span className="text-lg">{toCur.flag}</span>
              <span className="text-sm">{toCur.code}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {showCurrencyPicker === "receive" && (
              <CurrencyPicker
                currencies={CURRENCIES.filter((c) => c.code !== sendCurrency)}
                onSelect={(code) => { setReceiveCurrency(code); setShowCurrencyPicker(null); }}
                onClose={() => setShowCurrencyPicker(null)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Transfer fee</span>
          <span className="font-medium text-foreground">${fee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Mid-market rate</span>
          <span className="font-medium text-foreground">{midRate.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Our rate</span>
          <span className="font-medium text-foreground">{offeredRate.toFixed(4)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-semibold">
          <span className="text-foreground">Total you pay</span>
          <span className="text-foreground">${(Number(sendAmount) + fee).toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!rateLocked && (
          <Button
            variant="outline"
            className="flex-1 gap-1.5"
            onClick={() => setRateLocked(true)}
            disabled={!sendAmount || Number(sendAmount) <= 0}
          >
            <Lock className="w-4 h-4" /> Lock Rate
          </Button>
        )}
        <Button
          className="flex-1 bg-primary text-primary-foreground"
          onClick={() => setStep("beneficiary")}
          disabled={!sendAmount || Number(sendAmount) <= 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function CurrencyPicker({ currencies, onSelect, onClose }: { currencies: typeof CURRENCIES; onSelect: (code: string) => void; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">
        <div className="max-h-60 overflow-y-auto py-1">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => onSelect(c.code)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left"
            >
              <span className="text-lg">{c.flag}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{c.code}</p>
                <p className="text-xs text-muted-foreground">{c.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
