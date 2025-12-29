import React from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Menu,
  X,
  School,
} from "lucide-react";
import { clsx } from "clsx";

const SidebarItem = ({ icon, label, active, onClick }) => {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        active
          ? "bg-primary/10 text-primary border-r-2 border-primary"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon
        size={20}
        className={
          active ? "text-primary" : "text-gray-400 group-hover:text-white"
        }
      />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Layout = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "batches", label: "Batches", icon: School },
    { id: "payments", label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex bg-darker text-gray-100 font-sans selection:bg-primary/30">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-white/5 transition-transform duration-300 transform",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <School size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">
                Bhagwat Library
              </h1>
              <p className="text-xs text-gray-500">Admin </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">
                  admin@example.com
                </p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold">
            {menuItems.find((i) => i.id === activeTab)?.label}
          </span>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="hidden lg:block mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {menuItems.find((i) => i.id === activeTab)?.label}
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your institute efficiently.
              </p>
            </header>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
