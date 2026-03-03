import { Link, useLocation } from "react-router-dom";
import { Home, Upload, Search, LayoutDashboard, Folder, Shield, LogIn, UserPlus, LogOut, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export function Navigation() {
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();

  const navItems: { path: string; label: string; icon: typeof Home; protected: boolean; adminOnly?: boolean }[] = [
    { path: "/", label: "Home", icon: Home, protected: false },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, protected: true },
    { path: "/myfiles", label: "My Files", icon: Folder, protected: true },
    { path: "/upload", label: "Upload", icon: Upload, protected: true },
    { path: "/search", label: "Search", icon: Search, protected: true },
    { path: "/system-overview", label: "System Overview", icon: Shield, protected: false },
    { path: "/audit", label: "Audit", icon: ClipboardList, protected: true, adminOnly: true },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (!item.protected) return true;
    if (!user) return false;
    if (item.adminOnly) return user.role === "admin";
    return true;
  });

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-md">
              <span className="text-white font-bold text-base">UAMS</span>
            </div>
            <span className="font-display font-bold text-xl text-primary truncate hidden sm:inline">
              Universal Archive
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {!isLoading &&
              visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">{item.label}</span>
                  </Link>
                );
              })}
            {!isLoading && !user && (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gap-1 bg-primary hover:bg-primary/90">
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Register</span>
                  </Button>
                </Link>
              </>
            )}
            {!isLoading && user && (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <span className="text-sm text-muted-foreground hidden md:inline">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-1 text-muted-foreground">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
