import { useEffect, useState, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { bookmarkApi, categoryApi, collectionApi, tagApi } from "@/lib/api";
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
  Folder,
  Tag,
  X,
  BookOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add bookmark form states
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isFav, setIsFav] = useState(false);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [bookmarksData, categoriesData, collectionsData, tagsData] = await Promise.all([
        bookmarkApi.getAll().catch(() => []),
        categoryApi.getAll().catch(() => []),
        collectionApi.getAll().catch(() => []),
        tagApi.getUserTags().catch(() => []),
      ]);

      // Ensure data is arrays
      const bookmarksArray = Array.isArray(bookmarksData) ? bookmarksData : [];
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
      const collectionsArray = Array.isArray(collectionsData) ? collectionsData : [];
      const tagsArray = Array.isArray(tagsData) ? tagsData : [];

      setCategories(categoriesArray);
      setCollections(collectionsArray);
      setTags(tagsArray);
      setAllTags(tagsArray);

      // Transform bookmarks to include full objects for tags, collections, and categories
      const transformedBookmarks: Bookmark[] = bookmarksArray.map((bm: any) => ({
        id: bm.id,
        title: bm.title || "Untitled",
        url: bm.url || "",
        summary: bm.summary || "",
        description: bm.description || "",
        tags: (bm.tags || [])
          .map((tagId: string) => tagsArray.find((t) => t.id === tagId))
          .filter(Boolean) as TagType[],
        collections: (bm.collections || [])
          .map((colId: string) => collectionsArray.find((c) => c.id === colId))
          .filter(Boolean) as Collection[],
        categories: bm.category 
          ? categoriesArray.filter((cat) => cat.id === bm.category) 
          : [],
        is_fav: bm.is_fav || false,
        created_at: bm.created_at || new Date().toISOString(),
      }));

      setBookmarks(transformedBookmarks);
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: error.message || "Failed to load bookmarks and related data",
      });
      setBookmarks([]);
      setCategories([]);
      setCollections([]);
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter bookmarks based on search and selected filters
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(lowerCaseQuery) ||
          bookmark.url.toLowerCase().includes(lowerCaseQuery) ||
          bookmark.description?.toLowerCase().includes(lowerCaseQuery) ||
          bookmark.tags.some((tag) => tag.name.toLowerCase().includes(lowerCaseQuery)) ||
          bookmark.collections.some((col) => col.name.toLowerCase().includes(lowerCaseQuery)) ||
          bookmark.categories.some((cat) => cat.name.toLowerCase().includes(lowerCaseQuery))
      );
    }

    if (selectedCategoryId) {
      filtered = filtered.filter((bookmark) =>
        bookmark.categories.some((cat) => cat.id === selectedCategoryId)
      );
    }

    if (selectedCollectionId) {
      filtered = filtered.filter((bookmark) =>
        bookmark.collections.some((col) => col.id === selectedCollectionId)
      );
    }

    if (selectedTagId) {
      filtered = filtered.filter((bookmark) =>
        bookmark.tags.some((tag) => tag.id === selectedTagId)
      );
    }

    // Sort by creation date, newest first
    return filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [bookmarks, searchQuery, selectedCategoryId, selectedCollectionId, selectedTagId]);

  const isFilterActive = useMemo(() => {
    return (
      searchQuery !== "" ||
      selectedCategoryId !== null ||
      selectedCollectionId !== null ||
      selectedTagId !== null
    );
  }, [searchQuery, selectedCategoryId, selectedCollectionId, selectedTagId]);

  const handleClearFilters = useCallback(() => {
    setSelectedCategoryId(null);
    setSelectedCollectionId(null);
    setSelectedTagId(null);
    setSearchQuery("");
  }, []);

  const handleAddNewTag = () => {
    if (!newTagInput.trim()) return;
    
    // Check if tag already exists
    const existingTag = allTags.find(
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

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "URL and Title are required fields.",
      });
      return;
    }

    setIsAdding(true);
    try {
      const bookmarkData: BookmarkData = {
        url: url.trim(),
        title: title.trim(),
        summary: summary.trim(),
        tags: selectedTags,
        collections: selectedCollections,
        category_id: selectedCategory || undefined,
        is_fav: isFav,
      };

      await bookmarkApi.create(bookmarkData);
      toast({
        title: "Bookmark added",
        description: "Your bookmark has been saved successfully.",
      });
      setIsAddDialogOpen(false);
      resetForm();
      loadData(); // Reload all data to ensure consistency
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding bookmark",
        description: error.message || "Failed to add bookmark.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim() || !editingBookmark) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "URL and Title are required fields.",
      });
      return;
    }

    setIsEditing(true);
    try {
      const bookmarkData: BookmarkData = {
        url: url.trim(),
        title: title.trim(),
        summary: summary.trim(),
        tags: selectedTags,
        collections: selectedCollections,
        category_id: selectedCategory || undefined,
        is_fav: isFav,
      };

      await bookmarkApi.update(editingBookmark.id, bookmarkData);
      toast({
        title: "Bookmark updated",
        description: "Your bookmark has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      resetForm();
      loadData(); // Reload all data to ensure consistency
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating bookmark",
        description: error.message || "Failed to update bookmark.",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleToggleFavorite = async (bookmarkId: string) => {
    const bookmark = bookmarks.find((bm) => bm.id === bookmarkId);
    if (!bookmark) return;

    try {
      await bookmarkApi.update(bookmarkId, { is_fav: !bookmark.is_fav });
      loadData(); // Reload data to reflect changes
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating bookmark",
        description: error.message,
      });
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string, bookmarkTitle: string) => {
    try {
      await bookmarkApi.delete(bookmarkId);
      toast({
        title: "Bookmark deleted",
        description: `Bookmark "${bookmarkTitle}" has been deleted successfully.`,
      });
      loadData(); // Reload data to reflect changes
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting bookmark",
        description: error.message,
      });
    }
  };

  const handleAISummary = async (bookmarkId: string) => {
    setSummarizingId(bookmarkId);
    try {
      const result = await bookmarkApi.summarize(bookmarkId);
      // Update the bookmark with the new summary
      setBookmarks(prev => prev.map(bm => 
        bm.id === bookmarkId ? { ...bm, summary: result.summary } : bm
      ));
      
      // Navigate to the bookmark detail page
      navigate(`/dashboard/bookmarks/${bookmarkId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error summarizing bookmark",
        description: error.message,
      });
    } finally {
      setSummarizingId(null);
    }
  };

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setSummary("");
    setSelectedTags([]);
    setNewTagInput("");
    setSelectedCollections([]);
    setSelectedCategory("");
    setIsFav(false);
  };

  const openEditDialog = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setUrl(bookmark.url);
    setTitle(bookmark.title);
    setSummary(bookmark.summary || "");
    setSelectedTags(bookmark.tags.map(t => t.id));
    setSelectedCollections(bookmark.collections.map(c => c.id));
    setSelectedCategory(bookmark.categories[0]?.id || "");
    setIsFav(bookmark.is_fav);
    setIsEditDialogOpen(true);
  };

  const getDefaultCategoryColor = (categoryName: string): string => {
    switch (categoryName.toLowerCase()) {
      case "development":
        return "bg-blue-500";
      case "design":
        return "bg-purple-500";
      case "productivity":
        return "bg-green-500";
      case "marketing":
        return "bg-red-500";
      case "finance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const categoriesForDisplay = useMemo(() => {
    return categories.map((cat) => {
      const count = bookmarks.filter((bm) =>
        bm.categories.some((c) => c.id === cat.id)
      ).length;
      const displayIcon = cat.emoji || "📚";
      const assignedColor = getDefaultCategoryColor(cat.name);

      return {
        ...cat,
        count,
        icon: displayIcon,
        color: assignedColor,
      };
    });
  }, [categories, bookmarks]);

  const collectionsForDisplay = useMemo(() => {
    return collections.map((col) => ({
      ...col,
      count: bookmarks.filter((bm) =>
        bm.collections.some((c) => c.id === col.id)
      ).length,
    }));
  }, [collections, bookmarks]);

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

          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
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
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter bookmark title"
                  />
                </div>
                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Optional description or notes"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(
                          selectedCategory === cat.id ? "" : cat.id
                        )}
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                          selectedCategory === cat.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                      const collection = collections.find(c => c.id === colId);
                      return collection ? (
                        <span
                          key={colId}
                          className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {collection.name}
                          <button
                            type="button"
                            onClick={() => handleCollectionToggle(colId)}
                            className="ml-1 text-blue-500 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {collections
                      .filter(col => !selectedCollections.includes(col.id))
                      .map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => handleCollectionToggle(col.id)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 flex items-center gap-1"
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
                      const tag = [...tags, ...allTags].find(t => t.id === tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => handleTagToggle(tagId)}
                            className="ml-1 text-purple-500 hover:text-purple-800"
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
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[...tags, ...allTags]
                      .filter(tag => !selectedTags.includes(tag.id))
                      .map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.id)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300"
                        >
                          {tag.name}
                        </button>
                      ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFav"
                    checked={isFav}
                    onChange={(e) => setIsFav(e.target.checked)}
                  />
                  <Label htmlFor="isFav">Mark as Favorite</Label>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary"
                  disabled={isAdding || !url.trim() || !title.trim()}
                >
                  {isAdding ? "Adding..." : "Add Bookmark"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> Search & Filter All Bookmarks
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search all bookmarks by title, URL, tags..."
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {isFilterActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm mt-4"
            >
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-base">Active Filters:</span>
                {searchQuery && (
                  <span className="bg-blue-200 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                    Search: "{searchQuery}" 
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-900" 
                       onClick={() => setSearchQuery("")} />
                  </span>
                )}
                {selectedCategoryId && (
                  <span className="bg-blue-200 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                    Category: {categoriesForDisplay.find(c => c.id === selectedCategoryId)?.name} 
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-900" 
                       onClick={() => setSelectedCategoryId(null)} />
                  </span>
                )}
                {selectedCollectionId && (
                  <span className="bg-blue-200 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                    Collection: {collectionsForDisplay.find(c => c.id === selectedCollectionId)?.name} 
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-900" 
                       onClick={() => setSelectedCollectionId(null)} />
                  </span>
                )}
                {selectedTagId && (
                  <span className="bg-blue-200 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                    Tag: {tags.find(t => t.id === selectedTagId)?.name} 
                    <X className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-900" 
                       onClick={() => setSelectedTagId(null)} />
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="flex-shrink-0 ml-0 sm:ml-auto px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md"
              >
                <X className="w-3 h-3" /> Clear All
              </button>
            </motion.div>
          )}
        </Card>

        {/* All Bookmarks Grid */}
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> All Bookmarks ({filteredBookmarks.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading bookmarks...</p>
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {filteredBookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  key={bookmark.id}
                  className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer border border-muted"
                  onClick={(e) => {
                    // Only navigate to detail page if not clicking on a link or button
                    if (!(e.target instanceof HTMLAnchorElement || e.target instanceof HTMLButtonElement)) {
                      navigate(`/dashboard/bookmarks/${bookmark.id}`);
                    }
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(bookmark.id);
                          }}
                        >
                          <Star 
                            className={`h-4 w-4 ${
                              bookmark.is_fav ? "text-yellow-400 fill-current" : "text-muted-foreground"
                            }`} 
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(bookmark);
                          }}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete "${bookmark.title}"?`)) {
                              handleDeleteBookmark(bookmark.id, bookmark.title);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    <h3 
                      className="font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/bookmarks/${bookmark.id}`);
                      }}
                    >
                      {bookmark.title}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mb-3 block truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {bookmark.url}
                    </a>
                    {bookmark.summary && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {bookmark.summary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {bookmark.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className={`${getDefaultCategoryColor(cat.name)} text-white text-xs px-2 py-1 rounded-full font-medium`}
                        >
                          {cat.emoji ? `${cat.emoji} ${cat.name}` : cat.name}
                        </span>
                      ))}
                      {bookmark.collections.map((col) => (
                        <span
                          key={col.id}
                          className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          <Folder className="inline-block w-3 h-3 mr-1" />
                          {col.name}
                        </span>
                      ))}
                      {bookmark.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          <Tag className="inline-block w-3 h-3 mr-1" />
                          {tag.name}
                        </span>
                      ))}
                      {(!bookmark.tags || bookmark.tags.length === 0) &&
                        (!bookmark.categories || bookmark.categories.length === 0) &&
                        (!bookmark.collections || bookmark.collections.length === 0) && (
                          <span className="text-xs text-muted-foreground italic">No tags or categories</span>
                        )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAISummary(bookmark.id);
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
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isFilterActive ? "No bookmarks match your filters" : "No bookmarks found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isFilterActive
                ? "Try adjusting your search or clearing some filters."
                : "Start adding bookmarks to see them here."}
            </p>
            {isFilterActive ? (
              <Button
                onClick={handleClearFilters}
                className="rounded-full bg-gradient-primary"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            ) : (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="rounded-full bg-gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bookmark
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Edit Bookmark Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          resetForm();
          setEditingBookmark(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bookmark</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBookmark} className="space-y-4">
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
              <Label htmlFor="edit-category">Category</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(
                      selectedCategory === cat.id ? "" : cat.id
                    )}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                  const collection = collections.find(c => c.id === colId);
                  return collection ? (
                    <span
                      key={colId}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {collection.name}
                      <button
                        type="button"
                        onClick={() => handleCollectionToggle(colId)}
                        className="ml-1 text-blue-500 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {collections
                  .filter(col => !selectedCollections.includes(col.id))
                  .map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => handleCollectionToggle(col.id)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 flex items-center gap-1"
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
                  const tag = [...tags, ...allTags].find(t => t.id === tagId);
                  return tag ? (
                    <span
                      key={tagId}
                      className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tagId)}
                        className="ml-1 text-purple-500 hover:text-purple-800"
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
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[...tags, ...allTags]
                  .filter(tag => !selectedTags.includes(tag.id))
                  .map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300"
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
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary"
              disabled={isEditing || !url.trim() || !title.trim()}
            >
              {isEditing ? "Updating..." : "Update Bookmark"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}