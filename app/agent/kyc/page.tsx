"use client";

import Shell from "@/components/swiftpay/shell";
import { useState } from "react";
import { Upload, CheckCircle2, Camera, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KYC_LEVELS = [
  { level: "Minimal", description: "Basic verification for small transfers", limit: "Up to $500/day", docs: ["Government ID (front)"] },
  { level: "Full", description: "Standard verification for regular use", limit: "Up to $5,000/day", docs: ["Government ID (front + back)", "Address Proof", "Selfie"] },
  { level: "Enhanced", description: "Enhanced for large transfers", limit: "Up to $50,000/day", docs: ["Government ID", "Address Proof", "Selfie", "Source of Funds", "Declaration"] },
];

const DOC_FIELDS = [
  { id: "id_front", label: "Government ID (Front)", icon: <FileText className="w-4 h-4" />, required: true },
  { id: "id_back", label: "Government ID (Back)", icon: <FileText className="w-4 h-4" />, required: true },
  { id: "address", label: "Address Proof", icon: <FileText className="w-4 h-4" />, required: true },
  { id: "selfie", label: "Live Selfie / Photo", icon: <Camera className="w-4 h-4" />, required: true },
  { id: "sof", label: "Source of Funds", icon: <FileText className="w-4 h-4" />, required: false },
];

export default function AgentKycPage() {
  const [selectedLevel, setSelectedLevel] = useState("Full");
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({ name: "", dob: "", nationality: "", idType: "Passport", idNumber: "", phone: "" });

  const toggle = (id: string) => setUploaded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <Shell title="KYC Capture" subtitle="Capture and verify customer identity documents" role="Agent">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* KYC Level selector */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Select KYC Level</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {KYC_LEVELS.map((l) => (
              <button
                key={l.level}
                onClick={() => setSelectedLevel(l.level)}
                className={cn("p-4 rounded-xl border text-left transition-colors", selectedLevel === l.level ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40")}
              >
                <p className={cn("font-bold text-sm", selectedLevel === l.level ? "text-primary" : "text-foreground")}>{l.level}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l.description}</p>
                <p className="text-xs font-semibold text-foreground mt-2">{l.limit}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Customer info form */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Customer Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name", placeholder: "As per ID" },
              { key: "dob", label: "Date of Birth", placeholder: "DD/MM/YYYY" },
              { key: "nationality", label: "Nationality", placeholder: "e.g. Indian" },
              { key: "idNumber", label: "ID Number", placeholder: "Passport / National ID" },
              { key: "phone", label: "Phone Number", placeholder: "+1 555-0000" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-muted-foreground block mb-1">{f.label}</label>
                <input
                  className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={f.placeholder}
                  value={(formData as any)[f.key]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">ID Type</label>
              <select
                className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.idType}
                onChange={(e) => setFormData((prev) => ({ ...prev, idType: e.target.value }))}
              >
                {["Passport", "National ID", "Driver's License", "Voter ID"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Document uploads */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-foreground mb-1">Document Upload</h3>
          {DOC_FIELDS.map((doc) => (
            <div
              key={doc.id}
              className={cn("flex items-center gap-3 p-3.5 rounded-xl border transition-colors", uploaded[doc.id] ? "border-[oklch(0.58_0.14_155)]/30 bg-[oklch(0.58_0.14_155)]/5" : "border-dashed border-border bg-muted/50")}
            >
              <span className={cn("shrink-0", uploaded[doc.id] ? "text-[oklch(0.58_0.14_155)]" : "text-muted-foreground")}>{doc.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold", uploaded[doc.id] ? "text-[oklch(0.35_0.12_155)]" : "text-foreground")}>{doc.label}</p>
                <p className="text-xs text-muted-foreground">{doc.required ? "Required" : "Optional"}</p>
              </div>
              {uploaded[doc.id]
                ? <CheckCircle2 className="w-5 h-5 text-[oklch(0.58_0.14_155)] shrink-0" />
                : <Button variant="outline" size="sm" className="gap-1.5 text-xs shrink-0" onClick={() => toggle(doc.id)}>
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </Button>
              }
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline">Save Draft</Button>
          <Button className="bg-primary text-primary-foreground">Submit KYC</Button>
        </div>
      </div>
    </Shell>
  );
}
