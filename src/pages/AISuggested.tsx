import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { bookmarkApi, categoryApi, collectionApi, tagApi } from "@/lib/api";
import { ExternalLink, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import BookmarkSelectionModal from "@/components/BookmarkSelectionModal";

interface AISuggestion {
  url: string;
  title: string;
  summary: string;
  category: string;
  collection: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface BackendBookmark {
  id: string;
  url: string;
  title: string;
  summary: string;
  tags: string[];
  collections: string[];
  category: string | null;
  created_at: string;
  user_id: string;
  is_fav: boolean;
  thumbnail?: string;
}

export default function AISuggested() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [savingBookmarkId, setSavingBookmarkId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Filter states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>(undefined);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string | undefined>(undefined);
  const [selectedTagsFilter, setSelectedTagsFilter] = useState<string[]>([]);
  const [selectedBookmarksFilter, setSelectedBookmarksFilter] = useState<string>("");
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  
  // Data needed for saving bookmarks (categories, collections, tags)
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allBookmarks, setAllBookmarks] = useState<BackendBookmark[]>([]);
  const [loadingMetaData, setLoadingMetaData] = useState(true);

  const filteredBookmarksForModal = useMemo(() => {
    let filtered = allBookmarks;
    if (selectedCategoryFilter) {
      filtered = filtered.filter((bm) => bm.category === selectedCategoryFilter);
    }
    if (selectedCollectionFilter) {
      filtered = filtered.filter((bm) => bm.collections?.includes(selectedCollectionFilter));
    }
    return filtered;
  }, [allBookmarks, selectedCategoryFilter, selectedCollectionFilter]);

  // Load metadata for filters
  const loadMetaData = useCallback(async () => {
    setLoadingMetaData(true);
    try {
      const [fetchedCategories, fetchedCollections, fetchedTags, fetchedBookmarks] = await Promise.all([
        categoryApi.getAll(),
        collectionApi.getAll(),
        tagApi.getUserTags(),
        bookmarkApi.getAll(),
      ]);
      setAllCategories(fetchedCategories || []);
      setAllCollections(fetchedCollections || []);
      setAllTags(fetchedTags || []);
      setAllBookmarks(fetchedBookmarks || []);
    } catch (err: any) {
      setError(err.message || "Failed to load metadata for suggestions.");
    } finally {
      setLoadingMetaData(false);
    }
  }, []);

  useEffect(() => {
    loadMetaData();
  }, [loadMetaData]);

  const fetchAISuggestions = useCallback(async () => {
    setLoadingSuggestions(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategoryFilter) {
        queryParams.append("category", selectedCategoryFilter);
      }
      if (selectedCollectionFilter) {
        queryParams.append("collection", selectedCollectionFilter);
      }
      if (selectedTagsFilter.length > 0) {
        queryParams.append("tag", selectedTagsFilter.join(","));
      }
      if (selectedBookmarksFilter) {
        queryParams.append("bookmarks", selectedBookmarksFilter);
      }

      const queryString = queryParams.toString();
      const url = `https://markly-api.essamaboelmgd.cloud/api/agent/suggestions${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI suggestions.");
      }

      const fetchedSuggestions = await response.json();
      setSuggestions(fetchedSuggestions || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI suggestions.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch AI suggestions.",
      });
    } finally {
      setLoadingSuggestions(false);
    }
  }, [selectedCategoryFilter, selectedCollectionFilter, selectedTagsFilter, selectedBookmarksFilter, toast]);

  const handleSaveSuggestion = useCallback(
    async (suggestion: AISuggestion, index: number) => {
      setSavingBookmarkId(suggestion.url); // Use URL as a temporary ID for tracking
      try {
        // Map AI suggestion names to existing IDs or create new ones
        const category = allCategories.find(
          (cat) => cat.name.toLowerCase() === suggestion.category.toLowerCase()
        );
        const collection = allCollections.find(
          (col) => col.name.toLowerCase() === suggestion.collection.toLowerCase()
        );

        const tagIds: string[] = [];
        for (const tagName of suggestion.tags) {
          let tag = allTags.find(
            (t) => t.name.toLowerCase() === tagName.toLowerCase()
          );
          if (!tag) {
            // If tag doesn't exist, create it
            try {
              const response = await fetch("https://markly-api.essamaboelmgd.cloud/api/tags", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
                },
                body: JSON.stringify({ name: tagName }),
              });

              if (response.ok) {
                tag = await response.json();
                if (tag) {
                  setAllTags((prev) => [...prev, tag]); // Update local tags state
                }
              }
            } catch (err) {
              console.error("Failed to create tag:", err);
            }
          }
          if (tag) {
            tagIds.push(tag.id);
          }
        }

        // Create bookmark with proper structure
        const bookmarkData = {
          url: suggestion.url,
          title: suggestion.title,
          summary: suggestion.summary,
          tag_ids: tagIds,
          collection_ids: collection ? [collection.id] : [],
          category_id: category ? category.id : undefined,
          is_fav: false,
        };

        await bookmarkApi.create(bookmarkData);

        toast({
          title: "Success",
          description: "Bookmark saved successfully!",
        });

        // Remove the saved suggestion from the list
        setSuggestions((prev) => prev.filter((_, i) => i !== index));
      } catch (err: any) {
        setError(err.message || "Failed to save bookmark.");
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Failed to save bookmark.",
        });
      } finally {
        setSavingBookmarkId(null);
      }
    },
    [allCategories, allCollections, allTags, toast]
  );

  if (loadingMetaData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading filters...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loadingSuggestions) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Generating AI suggestions...</p>
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
            <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Suggestions</h2>
            <p className="text-destructive mb-6">{error}</p>
            <Button onClick={fetchAISuggestions} className="bg-destructive hover:bg-destructive/90">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-foreground flex relative w-full">
        <div className="flex-1 p-4 md:p-6 transition-all duration-300 w-full max-w-full">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 md:mb-8 text-center flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-purple-600" /> AI Suggestions
            </h1>

            <div className="bg-card rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-purple-200 dark:border-purple-800 text-center">
              <p className="text-base md:text-lg text-foreground mb-4">
                Get personalized bookmark suggestions based on your recent activity.
              </p>

              {/* Filter Section */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                {/* Category Filter */}
                <MultiSelectDropdown
                  label="Filter by Category"
                  items={allCategories.map((cat) => ({ id: cat.id, name: cat.name }))}
                  selectedItems={selectedCategoryFilter ? [selectedCategoryFilter] : []}
                  onSelectionChange={(ids) => setSelectedCategoryFilter(ids[0] || undefined)}
                  placeholder="All Categories"
                  isMulti={false}
                />

                {/* Collection Filter */}
                <MultiSelectDropdown
                  label="Filter by Collection"
                  items={allCollections.map((col) => ({ id: col.id, name: col.name }))}
                  selectedItems={selectedCollectionFilter ? [selectedCollectionFilter] : []}
                  onSelectionChange={(ids) => setSelectedCollectionFilter(ids[0] || undefined)}
                  placeholder="All Collections"
                  isMulti={false}
                />

                {/* Tags Filter (Multi-select) */}
                <MultiSelectDropdown
                  label="Filter by Tags"
                  items={allTags.map((tag) => ({ id: tag.id, name: tag.name }))}
                  selectedItems={selectedTagsFilter}
                  onSelectionChange={setSelectedTagsFilter}
                  placeholder="All Tags"
                  isMulti={true}
                />

                {/* Bookmark IDs Filter */}
                <div>
                  <label htmlFor="bookmarkIdsFilter" className="block text-sm font-medium text-foreground mb-1">
                    Filter by Bookmarks:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBookmarkModalOpen(true)}
                    className="mt-1 w-full bg-background border border-input rounded-md shadow-sm py-2 px-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                  >
                    {selectedBookmarksFilter.split(",").filter(Boolean).length > 0
                      ? `${selectedBookmarksFilter.split(",").filter(Boolean).length} bookmark(s) selected`
                      : "Select Bookmarks"}
                  </button>
                </div>
              </div>

              <Button
                onClick={fetchAISuggestions}
                disabled={loadingSuggestions}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 md:py-3 px-6 md:px-8 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center mx-auto gap-2"
              >
                {loadingSuggestions ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> Generating Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" /> Generate New Suggestions
                  </>
                )}
              </Button>
            </div>

            <BookmarkSelectionModal
              isOpen={isBookmarkModalOpen}
              onClose={() => setIsBookmarkModalOpen(false)}
              bookmarks={filteredBookmarksForModal}
              onSelectBookmarks={(ids) => setSelectedBookmarksFilter(ids.join(","))}
              initialSelectedBookmarkIds={selectedBookmarksFilter.split(",").filter(Boolean)}
            />

            {suggestions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={`${suggestion.url}-${index}`} 
                    className="bg-card rounded-2xl shadow-md p-4 md:p-6 border border-green-100 flex flex-col"
                  >
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {suggestion.title}
                    </h2>
                    <a
                      href={suggestion.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mb-3 block truncate text-sm md:text-base"
                    >
                      {suggestion.url}
                    </a>
                    <div className="text-foreground text-base mb-4 prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {suggestion.summary}
                      </ReactMarkdown>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestion.category && (
                        <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          Category: {suggestion.category}
                        </span>
                      )}
                      {suggestion.collection && (
                        <span className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          Collection: {suggestion.collection}
                        </span>
                      )}
                      {suggestion.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-green-500/20 text-green-700 dark:text-green-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium"
                        >
                          Tag: {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleSaveSuggestion(suggestion, index)}
                      disabled={savingBookmarkId === suggestion.url}
                      className="mt-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2 self-end w-full sm:w-auto"
                    >
                      {savingBookmarkId === suggestion.url ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Bookmark"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              !loadingSuggestions && (
                <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 text-center text-muted-foreground border border-border">
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted" />
                  <p className="text-xl font-semibold mb-2">No suggestions yet!</p>
                  <p className="mb-4">Click the button above to generate some AI-powered bookmark ideas.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}