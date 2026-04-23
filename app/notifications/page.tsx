"use client";

import Shell from "@/components/swiftpay/shell";
import { useState } from "react";
import { Bell, CheckCircle2, AlertCircle, Clock, RefreshCw, Send, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotifCategory = "KYC" | "Quote" | "Compliance" | "Routing" | "Payout" | "Refund";
type NotifStatus = "Unread" | "Read" | "Dismissed";

interface Notification {
  id: string;
  remitId?: string;
  message: string;
  category: NotifCategory;
  status: NotifStatus;
  date: string;
  time: string;
  refundSource?: "Customer Initiated" | "Compliance Hold" | "System Error" | "Partner Failure";
  processedBy?: string;
  expectedCompletion?: string;
  refundAmount?: string;
}

const INITIAL_NOTIFS: Notification[] = [
  { id: "N001", remitId: "TXN-2024-48100", message: "Your transfer of $500 to Ravi Kumar has been successfully paid out.", category: "Payout", status: "Unread", date: "Apr 12, 2026", time: "2:34 PM" },
  { id: "N002", remitId: "TXN-2024-48082", message: "Transaction TXN-2024-48082 is on compliance hold. Please upload additional documents.", category: "Compliance", status: "Unread", date: "Apr 12, 2026", time: "1:12 PM" },
  { id: "N003", message: "Your KYC document (Source of Funds) has been approved. Full KYC level achieved.", category: "KYC", status: "Unread", date: "Apr 11, 2026", time: "5:45 PM" },
  { id: "N004", remitId: "TXN-2024-48055", message: "Rate lock for TXN-2024-48055 has expired. Please get a new quote.", category: "Quote", status: "Read", date: "Apr 11, 2026", time: "3:20 PM" },
  { id: "N005", remitId: "TXN-2024-47990", message: "Your transfer to Maria Santos is now being routed to the payout partner.", category: "Routing", status: "Read", date: "Apr 10, 2026", time: "11:05 AM" },
  { id: "N006", remitId: "TXN-2024-47902", message: "Refund of $250 for cancelled transaction TXN-2024-47902 has been initiated.", category: "Refund", status: "Read", date: "Apr 9, 2026", time: "4:15 PM", refundSource: "Customer Initiated", processedBy: "Operations Team", expectedCompletion: "Apr 14, 2026", refundAmount: "$250.00" },
  { id: "N007", message: "Document (Address Proof) uploaded is awaiting verification. We'll notify you once reviewed.", category: "KYC", status: "Read", date: "Apr 8, 2026", time: "9:30 AM" },
];

const CATEGORY_CONFIG: Record<NotifCategory, { icon: React.ReactNode; className: string; bg: string }> = {
  KYC: { icon: <Shield className="w-4 h-4" />, className: "text-[oklch(0.38_0.12_240)]", bg: "bg-[oklch(0.55_0.15_240)]/15" },
  Quote: { icon: <Clock className="w-4 h-4" />, className: "text-[oklch(0.45_0.10_60)]", bg: "bg-[oklch(0.78_0.14_75)]/15" },
  Compliance: { icon: <AlertCircle className="w-4 h-4" />, className: "text-destructive", bg: "bg-destructive/10" },
  Routing: { icon: <RefreshCw className="w-4 h-4" />, className: "text-[oklch(0.38_0.12_240)]", bg: "bg-[oklch(0.55_0.15_240)]/15" },
  Payout: { icon: <CheckCircle2 className="w-4 h-4" />, className: "text-[oklch(0.35_0.12_155)]", bg: "bg-[oklch(0.58_0.14_155)]/15" },
  Refund: { icon: <Send className="w-4 h-4" />, className: "text-muted-foreground", bg: "bg-muted" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<"All" | NotifStatus>("All");

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, status: "Read" as NotifStatus })));
  const dismiss = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, status: "Dismissed" as NotifStatus } : n));

  const displayed = notifs.filter((n) => {
    if (filter === "All") return n.status !== "Dismissed";
    return n.status === filter;
  });

  const unreadCount = notifs.filter((n) => n.status === "Unread").length;

  return (
    <Shell title="Notifications" subtitle="Status updates, KYC requests, rate expiry, payout confirmations">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {(["All", "Unread", "Read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn("text-xs font-medium px-3 py-1.5 rounded-lg transition-colors", filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}
              >
                {f} {f === "Unread" && unreadCount > 0 && <span className="ml-1 bg-primary-foreground/20 text-primary-foreground rounded-full px-1.5">{unreadCount}</span>}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs">Mark All Read</Button>
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          {displayed.length === 0 && (
            <div className="flex flex-col items-center py-20 gap-3">
              <Bell className="w-10 h-10 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No notifications</p>
            </div>
          )}
          {displayed.map((n) => {
            const cfg = CATEGORY_CONFIG[n.category];
            return (
              <div
                key={n.id}
                className={cn("flex items-start gap-4 p-4 rounded-xl border transition-colors", n.status === "Unread" ? "bg-primary/5 border-primary/20" : "bg-card border-border")}
              >
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5", cfg.bg, cfg.className)}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded", cfg.bg, cfg.className)}>{n.category}</span>
                    {n.remitId && <span className="text-xs font-mono text-muted-foreground">{n.remitId}</span>}
                    {n.status === "Unread" && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{n.message}</p>
                  
                  {/* Refund details */}
                  {n.category === "Refund" && (n.refundSource || n.processedBy || n.expectedCompletion) && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {n.refundAmount && (
                          <div>
                            <span className="text-muted-foreground block mb-0.5">Refund Amount</span>
                            <span className="font-semibold text-foreground">{n.refundAmount}</span>
                          </div>
                        )}
                        {n.refundSource && (
                          <div>
                            <span className="text-muted-foreground block mb-0.5">Initiated By</span>
                            <span className="font-semibold text-foreground">{n.refundSource}</span>
                          </div>
                        )}
                        {n.processedBy && (
                          <div>
                            <span className="text-muted-foreground block mb-0.5">Processed By</span>
                            <span className="font-semibold text-foreground">{n.processedBy}</span>
                          </div>
                        )}
                        {n.expectedCompletion && (
                          <div>
                            <span className="text-muted-foreground block mb-0.5">Expected By</span>
                            <span className="font-semibold text-foreground">{n.expectedCompletion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">{n.date} at {n.time}</p>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
