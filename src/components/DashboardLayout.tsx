import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Bookmark,
  Star,
  FolderOpen,
  Layers,
  Tag,
  User,
  Settings,
  LogOut,
  Search,
  Menu,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Bookmark, label: "All Bookmarks", path: "/dashboard/bookmarks" },
    { icon: Star, label: "Favorites", path: "/dashboard/favorites" },
    { icon: FolderOpen, label: "Categories", path: "/dashboard/categories" },
    { icon: Layers, label: "Collections", path: "/dashboard/collections" },
    { icon: Tag, label: "Tags", path: "/dashboard/tags" },
  ];

  const bottomNavItems = [
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 z-40",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b flex items-center justify-between">
            {!sidebarCollapsed && (
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-primary">
                  <Bookmark className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Markly
                </span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="rounded-full"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {mainNavItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 rounded-xl",
                    isActive(item.path) && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="my-4 border-t" />
                <Link to="/admin">
                  <Button
                    variant={isActive("/admin") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 rounded-xl",
                      isActive("/admin") && "bg-admin-accent/10 text-admin-accent"
                    )}
                  >
                    <Shield className="h-5 w-5 shrink-0" />
                    {!sidebarCollapsed && <span>Admin Panel</span>}
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 border-t space-y-1">
            {bottomNavItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 rounded-xl",
                    isActive(item.path) && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks..."
                  className="pl-10 rounded-full"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
