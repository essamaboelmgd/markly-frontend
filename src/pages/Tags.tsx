import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tagApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Tag, TrendingUp } from "lucide-react";

export default function Tags() {
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await tagApi.getUserTags();
      setTags(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading tags",
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
          <h1 className="text-3xl font-bold mb-2">Tags</h1>
          <p className="text-muted-foreground">
            Explore and manage your bookmark tags
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tags...</p>
          </div>
        ) : tags.length > 0 ? (
          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">All Tags</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant="outline"
                    className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                  >
                    <Tag className="h-3 w-3 mr-2" />
                    {tag.name}
                    {tag.count && (
                      <Badge variant="secondary" className="ml-2">
                        {tag.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
              <div className="space-y-3">
                {tags
                  .sort((a, b) => (b.count || 0) - (a.count || 0))
                  .slice(0, 10)
                  .map((tag, index) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Tag className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{tag.name}</span>
                      </div>
                      <Badge variant="secondary">{tag.count || 0} bookmarks</Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tags yet</h3>
            <p className="text-muted-foreground">
              Tags will appear here as you organize your bookmarks
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
