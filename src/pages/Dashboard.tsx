import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { bookmarkApi, categoryApi, collectionApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Bookmark, Star, FolderOpen, Layers, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBookmarks: 0,
    favorites: 0,
    categories: 0,
    collections: 0,
  });
  const [recentBookmarks, setRecentBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [bookmarks, categories, collections] = await Promise.all([
        bookmarkApi.getAll().catch(() => []),
        categoryApi.getAll().catch(() => []),
        collectionApi.getAll().catch(() => []),
      ]);

      setStats({
        totalBookmarks: Array.isArray(bookmarks) ? bookmarks.length : 0,
        favorites: Array.isArray(bookmarks) ? bookmarks.filter((b: any) => b.is_fav).length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        collections: Array.isArray(collections) ? collections.length : 0,
      });

      setRecentBookmarks(Array.isArray(bookmarks) ? bookmarks.slice(0, 5) : []);
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Error loading dashboard",
        description: error.message || "Failed to load dashboard data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      icon: Bookmark,
      label: "Total Bookmarks",
      value: stats.totalBookmarks,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Star,
      label: "Favorites",
      value: stats.favorites,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      icon: FolderOpen,
      label: "Categories",
      value: stats.categories,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Layers,
      label: "Collections",
      value: stats.collections,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  if (!isAuthenticated) {
    return null; // or redirect to login
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up w-full max-w-full overflow-x-hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here's an overview of your bookmarks.
          </p>
        </div>

        {/* Stats Grid - Responsive for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-full">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 w-full"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Bookmarks */}
        <Card className="p-4 md:p-6 w-full max-w-full">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold">Recent Bookmarks</h2>
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-6 md:py-8">
              Loading bookmarks...
            </div>
          ) : recentBookmarks.length > 0 ? (
            <div className="space-y-3 w-full max-w-full">
              {recentBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors w-full max-w-full"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Bookmark className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm md:text-base truncate">{bookmark.title || "Untitled"}</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{bookmark.url || "No URL"}</p>
                    </div>
                  </div>
                  {bookmark.is_fav && (
                    <Star className="h-4 w-4 text-warning fill-warning flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-6 md:py-8">
              No bookmarks yet. Start adding some!
            </div>
          )}
        </Card>

        {/* Trending Tags */}
        <Card className="p-4 md:p-6 w-full max-w-full">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Trending Tags</h2>
          <div className="flex flex-wrap gap-2">
            {["Development", "Design", "Marketing", "AI", "Productivity"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-muted text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}