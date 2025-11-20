import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { bookmarkApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  Star,
  Edit,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    const filtered = bookmarks.filter((bookmark) =>
      bookmark.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBookmarks(filtered);
  }, [searchQuery, bookmarks]);

  const loadBookmarks = async () => {
    try {
      const data = await bookmarkApi.getAll();
      setBookmarks(data);
      setFilteredBookmarks(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading bookmarks",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBookmark = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      url: formData.get("url"),
      description: formData.get("description"),
    };

    try {
      await bookmarkApi.create(data);
      toast({
        title: "Bookmark added",
        description: "Your bookmark has been saved successfully.",
      });
      setIsDialogOpen(false);
      loadBookmarks();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding bookmark",
        description: error.message,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Bookmarks</h1>
            <p className="text-muted-foreground">
              Manage and organize your saved bookmarks
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Bookmark
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Bookmark</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddBookmark} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Bookmark title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Brief description"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary">
                  Save Bookmark
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              className="pl-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-full">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Bookmarks Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading bookmarks...</p>
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
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
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookmarks found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Start adding bookmarks to see them here"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="rounded-full bg-gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bookmark
              </Button>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
