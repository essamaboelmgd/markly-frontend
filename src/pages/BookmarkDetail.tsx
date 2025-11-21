import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  Folder, 
  Tags, 
  Star, 
  Pencil, 
  Brain,
  ExternalLink,
  Calendar,
  X
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { bookmarkApi, categoryApi, collectionApi, tagApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
  emoji?: string;
}

interface Collection {
  id: string;
  name: string;
}

interface TagType {
  id: string;
  name: string;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  summary?: string;
  description?: string;
  tags: TagType[];
  collections: Collection[];
  categories: Category[];
  is_fav: boolean;
  created_at: string;
  user_id: string;
}

interface BookmarkData {
  url: string;
  title: string;
  summary: string;
  tags: string[];
  collections: string[];
  category_id?: string;
  is_fav?: boolean;
}

export default function BookmarkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [summarizeError, setSummarizeError] = useState<string | null>(null);
  
  // Form states
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [isFav, setIsFav] = useState(false);
  
  // Available options
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [allTags, setAllTags] = useState<TagType[]>([]);

  const loadBookmarkDetails = useCallback(async () => {
    if (!id) {
      navigate("/dashboard/bookmarks");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Load bookmark data
      const bookmarkData = await bookmarkApi.getById(id);
      
      // Load related data
      const [categoriesData, collectionsData, tagsData] = await Promise.all([
        categoryApi.getAll().catch(() => []),
        collectionApi.getAll().catch(() => []),
        tagApi.getUserTags().catch(() => [])
      ]);
      
      setCategories(categoriesData || []);
      setCollections(collectionsData || []);
      setTags(tagsData || []);
      setAllTags(tagsData || []);
      
      // Transform bookmark data
      const transformedBookmark: Bookmark = {
        id: bookmarkData.id,
        title: bookmarkData.title || "Untitled",
        url: bookmarkData.url || "",
        summary: bookmarkData.summary || "",
        description: bookmarkData.description || "",
        tags: (bookmarkData.tags || [])
          .map((tagId: string) => (tagsData || []).find((t: TagType) => t.id === tagId))
          .filter(Boolean) as TagType[],
        collections: (bookmarkData.collections || [])
          .map((colId: string) => (collectionsData || []).find((c: Collection) => c.id === colId))
          .filter(Boolean) as Collection[],
        categories: bookmarkData.category 
          ? (categoriesData || []).filter((cat: Category) => cat.id === bookmarkData.category) 
          : [],
        is_fav: bookmarkData.is_fav || false,
        created_at: bookmarkData.created_at || new Date().toISOString(),
        user_id: bookmarkData.user_id || ""
      };
      
      setBookmark(transformedBookmark);
      
      // Set form values for editing
      setTitle(transformedBookmark.title);
      setUrl(transformedBookmark.url);
      setSummary(transformedBookmark.summary || "");
      setSelectedCategory(transformedBookmark.categories[0]?.id || "");
      setSelectedCollections(transformedBookmark.collections.map(c => c.id));
      setSelectedTags(transformedBookmark.tags.map(t => t.id));
      setIsFav(transformedBookmark.is_fav);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookmark details.");
      console.error("Error loading bookmark details:", err);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadBookmarkDetails();
  }, [loadBookmarkDetails]);

  const handleToggleFavorite = async () => {
    if (!bookmark) return;
    
    try {
      await bookmarkApi.update(bookmark.id, { is_fav: !bookmark.is_fav });
      loadBookmarkDetails(); // Reload to reflect changes
      toast({
        title: "Success",
        description: `Bookmark ${!bookmark.is_fav ? "added to" : "removed from"} favorites.`
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update favorite status."
      });
    }
  };

  const handleSummarizeBookmark = async () => {
    if (!bookmark) return;
    
    setSummarizing(true);
    setSummarizeError(null);
    
    try {
      const result = await bookmarkApi.summarize(bookmark.id);
      // Update the bookmark with the new summary
      setBookmark(prev => prev ? { ...prev, summary: result.summary } : null);
      setSummary(result.summary);
      toast({
        title: "Success",
        description: "Bookmark summarized successfully."
      });
    } catch (err: any) {
      setSummarizeError(err.message || "Failed to summarize bookmark.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to summarize bookmark."
      });
    } finally {
      setSummarizing(false);
    }
  };

  const handleEditBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmark) return;
    
    setEditLoading(true);
    
    try {
      const bookmarkData: BookmarkData = {
        url: url.trim(),
        title: title.trim(),
        summary: summary.trim(),
        tags: selectedTags,
        collections: selectedCollections,
        category_id: selectedCategory || undefined,
        is_fav: isFav
      };
      
      await bookmarkApi.update(bookmark.id, bookmarkData);
      setIsEditModalOpen(false);
      loadBookmarkDetails(); // Reload to reflect changes
      toast({
        title: "Success",
        description: "Bookmark updated successfully."
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update bookmark."
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAddNewTag = () => {
    if (!newTagInput.trim()) return;
    
    // Check if tag already exists
    const existingTag = [...tags, ...allTags].find(
      tag => tag.name.toLowerCase() === newTagInput.trim().toLowerCase()
    );
    
    if (existingTag) {
      if (!selectedTags.includes(existingTag.id)) {
        setSelectedTags(prev => [...prev, existingTag.id]);
      }
    } else {
      // In a real app, you would call an API to create the tag
      // For now, we'll just add it to the selected tags
      const newTag: TagType = {
        id: `new-${Date.now()}`,
        name: newTagInput.trim()
      };
      
      setAllTags(prev => [...prev, newTag]);
      setSelectedTags(prev => [...prev, newTag.id]);
    }
    
    setNewTagInput("");
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading bookmark details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 bg-destructive/10 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Bookmark</h2>
            <p className="text-destructive mb-6">{error}</p>
            <Button onClick={loadBookmarkDetails} className="bg-destructive hover:bg-destructive/90">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!bookmark) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 bg-warning/10 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold text-warning mb-4">Bookmark Not Found</h2>
            <p className="text-warning mb-6">The bookmark you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/dashboard/bookmarks")}>
              Back to Bookmarks
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const displayCategory = bookmark.categories.length > 0 ? bookmark.categories[0] : null;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bookmark Details</h1>
            <p className="text-muted-foreground">View and manage your bookmark details</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Bookmark
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard/bookmarks")}
            >
              Back to Bookmarks
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{bookmark.title}</h1>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-lg"
              >
                <ExternalLink className="w-4 h-4" />
                {bookmark.url}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleToggleFavorite}
                variant={bookmark.is_fav ? "default" : "outline"}
                size="sm"
              >
                <Star
                  className={`w-4 h-4 ${bookmark.is_fav ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                onClick={handleSummarizeBookmark}
                variant="outline"
                size="sm"
                disabled={summarizing}
              >
                <Brain className="w-4 h-4 mr-2" />
                {summarizing ? "Summarizing..." : "AI Summary"}
              </Button>
            </div>
          </div>

          {/* Summary/Description */}
          <div className="prose max-w-none text-foreground mb-8">
            {summarizing ? (
              <p className="text-primary italic">Generating summary...</p>
            ) : bookmark.summary ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{bookmark.summary}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">No summary available for this bookmark.</p>
            )}
          </div>

          {/* Category */}
          {displayCategory && (
            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
              <BookOpen className="w-4 h-4" />
              Category: {displayCategory.emoji} {displayCategory.name}
            </div>
          )}

          {/* Collections */}
          {bookmark.collections && bookmark.collections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Collections:</h3>
              <div className="flex flex-wrap gap-2">
                {bookmark.collections.map((col) => (
                  <span
                    key={col.id}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    <Folder className="w-3 h-3" />
                    {col.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {bookmark.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    <Tags className="w-3 h-3" />
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center text-sm text-muted-foreground pt-6 border-t border-border">
            <Calendar className="w-4 h-4 mr-2" />
            Added on: {formatDateTime(bookmark.created_at)}
          </div>
        </Card>

        {summarizeError && (
          <Card className="p-4 bg-destructive/10 border-destructive/50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-destructive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Error</h3>
                <div className="mt-2 text-sm text-destructive">
                  <p>{summarizeError}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Edit Bookmark Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bookmark</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBookmark} className="space-y-5">
            <div>
              <Label htmlFor="edit-url">URL *</Label>
              <Input
                id="edit-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter bookmark title"
              />
            </div>
            <div>
              <Label htmlFor="edit-summary">Summary</Label>
              <Textarea
                id="edit-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Optional description or notes"
              />
            </div>
            <div>
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(categories || []).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(
                      selectedCategory === cat.id ? "" : cat.id
                    )}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat.emoji ? `${cat.emoji} ${cat.name}` : cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Collections</Label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[24px]">
                {selectedCollections.map((colId) => {
                  const collection = [...(collections || [])].find(c => c.id === colId);
                  return collection ? (
                    <span
                      key={colId}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {collection.name}
                      <button
                        type="button"
                        onClick={() => handleCollectionToggle(colId)}
                        className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(collections || [])
                  .filter(col => !selectedCollections.includes(col.id))
                  .map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleCollectionToggle(col.id)}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 flex items-center gap-1"
                    >
                      <Folder className="w-3 h-3" />
                      {col.name}
                    </button>
                  ))}
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tagId) => {
                  const tag = [...(tags || []), ...(allTags || [])].find(t => t.id === tagId);
                  return tag ? (
                    <span
                      key={tagId}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tagId)}
                        className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewTag();
                    }
                  }}
                  placeholder="Add new tag"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddNewTag}
                  disabled={!newTagInput.trim()}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[...(tags || []), ...(allTags || [])]
                  .filter(tag => !selectedTags.includes(tag.id))
                  .map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80"
                    >
                      {tag.name}
                    </button>
                  ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-isFav"
                checked={isFav}
                onChange={(e) => setIsFav(e.target.checked)}
              />
              <Label htmlFor="edit-isFav">Mark as Favorite</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-primary"
                disabled={editLoading || !url.trim() || !title.trim()}
              >
                {editLoading ? "Updating..." : "Update Bookmark"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}