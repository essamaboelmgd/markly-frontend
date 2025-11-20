import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { bookmarkApi, categoryApi, collectionApi } from "@/lib/api";
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookmarks, categories, collections] = await Promise.all([
        bookmarkApi.getAll(),
        categoryApi.getAll(),
        collectionApi.getAll(),
      ]);

      setStats({
        totalBookmarks: bookmarks.length,
        favorites: bookmarks.filter((b: any) => b.isFavorite).length,
        categories: categories.length,
        collections: collections.length,
      });

      setRecentBookmarks(bookmarks.slice(0, 5));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading dashboard",
        description: error.message,
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

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your bookmarks.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Bookmarks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Bookmarks</h2>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading bookmarks...
            </div>
          ) : recentBookmarks.length > 0 ? (
            <div className="space-y-3">
              {recentBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Bookmark className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{bookmark.title}</p>
                      <p className="text-sm text-muted-foreground">{bookmark.url}</p>
                    </div>
                  </div>
                  {bookmark.isFavorite && (
                    <Star className="h-4 w-4 text-warning fill-warning" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No bookmarks yet. Start adding some!
            </div>
          )}
        </Card>

        {/* Trending Tags */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Trending Tags</h2>
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
