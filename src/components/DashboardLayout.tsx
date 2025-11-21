import { ReactNode, useState, useEffect } from "react";
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
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Close mobile sidebar when resizing to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Bookmark, label: "All Bookmarks", path: "/dashboard/bookmarks" },
    { icon: Star, label: "Favorites", path: "/dashboard/favorites" },
    { icon: Sparkles, label: "AI Suggested", path: "/dashboard/ai-suggested" },
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
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 z-50",
          "md:z-40",
          sidebarCollapsed ? "w-16" : "w-64",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
              className="rounded-full hidden md:flex"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded-full md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {mainNavItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 rounded-xl",
                    isActive(item.path) && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Button>
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="my-4 border-t" />
                <Link 
                  to="/admin"
                  onClick={() => setMobileSidebarOpen(false)}
                >
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
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 rounded-xl",
                    isActive(item.path) && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                handleLogout();
                setMobileSidebarOpen(false);
              }}
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
          "flex-1 flex flex-col transition-all duration-300 w-full",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
          "ml-0" // Always 0 on mobile since sidebar overlays
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Search */}
            <div className="flex-1 max-w-md mx-2 md:mx-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks..."
                  className="pl-10 rounded-full text-sm md:text-base"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-medium">{user?.username}</p>
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

        {/* Page Content - Added max-width and padding adjustments for mobile */}
        <main className="flex-1 p-4 md:p-6 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}