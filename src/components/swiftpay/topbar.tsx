import { Bell, Search, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  title: string;
  subtitle?: string;
  role?: string;
}

export function Topbar({ title, subtitle, role = "Customer" }: TopbarProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-6 gap-4 shrink-0">
      {/* Left: Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 text-sm text-muted-foreground w-48 cursor-text">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs">Search transactions…</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg hover:bg-muted px-2 py-1 transition-colors">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-foreground leading-none">John Doe</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{role}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile & KYC</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
