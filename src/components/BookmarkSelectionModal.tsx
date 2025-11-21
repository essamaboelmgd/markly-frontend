import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";

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

interface BookmarkSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BackendBookmark[];
  onSelectBookmarks: (selectedIds: string[]) => void;
  initialSelectedBookmarkIds: string[];
}

const BookmarkSelectionModal: React.FC<BookmarkSelectionModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmarks,
  initialSelectedBookmarkIds,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedBookmarkIds);

  useEffect(() => {
    setSelectedIds(initialSelectedBookmarkIds);
  }, [initialSelectedBookmarkIds]);

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBookmark = (bookmarkId: string) => {
    setSelectedIds((prev) =>
      prev.includes(bookmarkId)
        ? prev.filter((id) => id !== bookmarkId)
        : [...prev, bookmarkId]
    );
  };

  const handleApplySelection = () => {
    onSelectBookmarks(selectedIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Select Bookmarks</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search bookmarks by title or URL..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-80 overflow-y-auto border border-border rounded-md p-2">
            {filteredBookmarks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No bookmarks found.</p>
            ) : (
              filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer mb-1
                    ${selectedIds.includes(bookmark.id) ? "bg-accent border-accent" : "hover:bg-muted"}`}
                  onClick={() => handleToggleBookmark(bookmark.id)}
                >
                  <div>
                    <p className="font-medium text-foreground">{bookmark.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{bookmark.url}</p>
                  </div>
                  {selectedIds.includes(bookmark.id) && (
                    <span className="text-accent-foreground font-semibold">Selected</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={handleApplySelection}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Apply Selection ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkSelectionModal;