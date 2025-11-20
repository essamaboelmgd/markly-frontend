import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bookmarkApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Star, ExternalLink, Sparkles } from "lucide-react";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const bookmarks = await bookmarkApi.getAll();
      const favs = bookmarks.filter((b: any) => b.isFavorite);
      setFavorites(favs);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading favorites",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold mb-2">Favorite Bookmarks</h1>
          <p className="text-muted-foreground">
            Your most important bookmarks in one place
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="p-6 hover:shadow-lg transition-all duration-300 border-warning/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {bookmark.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {bookmark.url}
                </p>
                {bookmark.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {bookmark.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {bookmark.tags?.slice(0, 3).map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full"
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  AI Summary
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground">
              Star your important bookmarks to see them here
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
