import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bookmarkApi, categoryApi, collectionApi, tagApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Star, ExternalLink, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load favorites
      const favs = await bookmarkApi.getAll({ isFav: "true" });
      
      // Load tags, categories, and collections
      const [tagData, categoryData, collectionData] = await Promise.all([
        tagApi.getUserTags(),
        categoryApi.getAll(),
        collectionApi.getAll()
      ]);
      
      setTags(tagData);
      setCategories(categoryData);
      setCollections(collectionData);
      setFavorites(favs);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to get names by ID
  const getTagName = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.name : tagId;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? (category.emoji ? `${category.emoji} ${category.name}` : category.name) : categoryId;
  };

  const getCollectionName = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.name : collectionId;
  };

  const handleSummarize = async (bookmarkId: string) => {
    setSummarizingId(bookmarkId);
    try {
      const response = await bookmarkApi.summarize(bookmarkId);
      // Update the bookmark with the new summary
      setFavorites(prev => prev.map(b => 
        b.id === bookmarkId ? { ...b, summary: response.summary } : b
      ));
      
      // Navigate to the bookmark detail page
      navigate(`/dashboard/bookmarks/${bookmarkId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating summary",
        description: error.message,
      });
    } finally {
      setSummarizingId(null);
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
                className="p-6 hover:shadow-lg transition-all duration-300 border-warning/30 cursor-pointer"
                onClick={() => navigate(`/dashboard/bookmarks/${bookmark.id}`)}
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
                {bookmark.summary && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {bookmark.summary}
                  </p>
                )}
                
                {/* Display category */}
                {bookmark.category && (
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryName(bookmark.category)}
                    </Badge>
                  </div>
                )}
                
                {/* Display tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {bookmark.tags?.slice(0, 3).map((tagId: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {getTagName(tagId)}
                    </Badge>
                  ))}
                </div>
                
                {/* Display collections */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {bookmark.collections?.slice(0, 2).map((collectionId: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {getCollectionName(collectionId)}
                    </Badge>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSummarize(bookmark.id);
                  }}
                  disabled={summarizingId === bookmark.id}
                >
                  {summarizingId === bookmark.id ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-2" />
                      AI Summary
                    </>
                  )}
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
