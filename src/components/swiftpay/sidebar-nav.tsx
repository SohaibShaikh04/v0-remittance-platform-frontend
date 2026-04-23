import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Send,
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  TrendingUp,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  RefreshCw,
  Briefcase,
  UserCheck,
  CreditCard,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "secondary";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Customer Portal",
    items: [
      { label: "Send Money", href: "/", icon: <Send className="w-4 h-4" /> },
      { label: "Transaction History", href: "/history", icon: <FileText className="w-4 h-4" /> },
      { label: "Beneficiaries", href: "/beneficiaries", icon: <Users className="w-4 h-4" /> },
      { label: "Notifications", href: "/notifications", icon: <Bell className="w-4 h-4" />, badge: "3", badgeVariant: "default" },
    ],
  },
  {
    title: "Agent Console",
    items: [
      { label: "Agent Dashboard", href: "/agent", icon: <UserCheck className="w-4 h-4" /> },
      { label: "Assisted KYC", href: "/agent/kyc", icon: <Shield className="w-4 h-4" /> },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Compliance Workbench", href: "/compliance", icon: <AlertTriangle className="w-4 h-4" />, badge: "5", badgeVariant: "destructive" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Ops Dashboard", href: "/operations", icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: "Settlement & Recon", href: "/operations/settlement", icon: <RefreshCw className="w-4 h-4" /> },
    ],
  },
  {
    title: "Treasury & Admin",
    items: [
      { label: "FX / Treasury Console", href: "/treasury", icon: <TrendingUp className="w-4 h-4" /> },
      { label: "Admin Panel", href: "/admin", icon: <Settings className="w-4 h-4" /> },
      { label: "Reports", href: "/reports", icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
];

export default function SidebarNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-sidebar-border", collapsed && "justify-center px-0")}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Send className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-bold text-base text-sidebar-foreground tracking-tight">SwiftPay</span>
            <p className="text-[10px] text-sidebar-foreground/50 leading-none">Remittance Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant ?? "default"}
                              className="text-[10px] h-4 px-1.5 min-w-[16px] text-center"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-sidebar-border p-3 space-y-1", collapsed && "px-1")}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
        <button className={cn("w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors", collapsed && "justify-center")}>
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
