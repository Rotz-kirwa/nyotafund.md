import { LayoutDashboard, Users, BarChart3, ClipboardList, Settings, ChevronLeft, ChevronRight, Zap, LogOut } from "lucide-react";
import { Logo } from "./Logo";

export type AdminPage = "overview" | "users" | "analytics" | "records" | "settings";

interface SidebarProps {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  collapsed: boolean;
  onToggle: () => void;
  totalTransactions: number;
  pendingCount: number;
  onLogout: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS: { id: AdminPage; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "overview",   label: "Overview",       icon: LayoutDashboard },
  { id: "users",      label: "Users",          icon: Users },
  { id: "analytics",  label: "Analytics",      icon: BarChart3 },
  { id: "records",    label: "Records",        icon: ClipboardList },
  { id: "settings",   label: "Settings",       icon: Settings },
];

export function Sidebar({ activePage, onNavigate, collapsed, onToggle, totalTransactions, pendingCount, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  const isMobileCollapsed = mobileOpen ? false : collapsed;
  
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed md:relative md:sticky z-50 flex flex-col border-r border-white/5 transition-all duration-300 h-[100dvh] top-0 left-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          width: isMobileCollapsed ? "68px" : "220px",
          background: "rgba(5,14,8,0.98)",
          backdropFilter: "blur(16px)",
        }}
      >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 overflow-hidden">
        <Logo dark size={28} />
        {!isMobileCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">NyotaCredit</span>
            <span className="text-[10px] text-green-400/70 truncate">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const showBadge = item.id === "users" && pendingCount > 0;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer relative group ${
                isActive
                  ? "bg-green-500/15 text-green-400 border border-green-500/25"
                  : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!isMobileCollapsed && <span className="truncate">{item.label}</span>}
              {showBadge && (
                <span
                  className="ml-auto flex-shrink-0 h-4 w-4 rounded-full text-[9px] font-bold grid place-items-center"
                  style={{ background: "#f59e0b", color: "#000" }}
                >
                  {pendingCount}
                </span>
              )}
              {/* Tooltip when collapsed */}
              {isMobileCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-lg text-xs font-semibold text-white bg-black/90 border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Stats pill */}
      {!isMobileCollapsed && (
        <div className="mx-3 mb-3 rounded-xl p-3 border border-white/5 hidden sm:block" style={{ background: "rgba(16,185,129,0.05)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={11} className="text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Live System</span>
          </div>
          <div className="text-sm font-bold text-white">{totalTransactions} Accounts</div>
          <div className="text-[10px] text-white/40 mt-0.5">{pendingCount} pending review</div>
        </div>
      )}

      {/* Logout button */}
      <div className="px-2 pb-2 border-t border-white/5 pt-2">
        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer relative group"
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!isMobileCollapsed && <span className="truncate">Logout</span>}
          {isMobileCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 rounded-lg text-xs font-semibold text-white bg-black/90 border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Collapse toggle (Desktop only) */}
      <button
        onClick={onToggle}
        className="hidden md:flex items-center justify-center py-3 border-t border-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
      >
        {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>
    </aside>
    </>
  );
}
