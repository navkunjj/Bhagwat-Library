import React from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Menu,
  X,
  School,
  Sun,
  Moon,
} from "lucide-react";
import { clsx } from "clsx";

const SidebarItem = ({ icon, label, active, onClick, theme }) => {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        active
          ? "bg-primary/10 text-primary border-r-2 border-primary"
          : theme === "dark"
          ? "text-gray-400 hover:bg-white/5 hover:text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon
        size={20}
        className={clsx(
          active
            ? "text-primary"
            : theme === "dark"
            ? "text-gray-400 group-hover:text-white"
            : "text-slate-500 group-hover:text-slate-900"
        )}
      />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Layout = ({
  children,
  activeTab,
  onTabChange,
  theme,
  toggleTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "batches", label: "Batches", icon: School },
    { id: "payments", label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-darker text-slate-900 dark:text-gray-100 font-sans selection:bg-primary/30 transition-colors duration-300 overflow-hidden">
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
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-card border-r border-slate-200 dark:border-white/5 transition-all duration-300 transform",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-white/5">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
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
                theme={theme}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">
                  bhagwatlibrary0@gmail.com
                </p>
              </div>
              <button className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header (Desktop & Mobile) */}
        <header className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {menuItems.find((i) => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-200"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
