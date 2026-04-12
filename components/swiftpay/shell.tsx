import SidebarNav from "./sidebar-nav";
import Topbar from "./topbar";

interface ShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  role?: string;
}

export default function Shell({ children, title, subtitle, role }: ShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} subtitle={subtitle} role={role} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
