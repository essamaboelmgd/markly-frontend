import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface SelectItem {
  id: string;
  name: string;
}

interface MultiSelectDropdownProps {
  items: SelectItem[];
  selectedItems: string[]; // Array of selected item IDs
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  label?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  placeholder = "Select...",
  isMulti = false,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleItemClick = useCallback(
    (itemId: string) => {
      if (isMulti) {
        const newSelection = selectedItems.includes(itemId)
          ? selectedItems.filter((id) => id !== itemId)
          : [...selectedItems, itemId];
        onSelectionChange(newSelection);
      } else {
        onSelectionChange([itemId]);
        setIsOpen(false); // Close dropdown after single selection
      }
    },
    [isMulti, selectedItems, onSelectionChange]
  );

  const handleClearSelection = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent dropdown from toggling
      onSelectionChange([]);
      if (!isMulti) {
        setIsOpen(false);
      }
    },
    [onSelectionChange, isMulti]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue = isMulti
    ? selectedItems.length > 0
      ? `${selectedItems.length} selected`
      : placeholder
    : selectedItems.length > 0
    ? items.find((item) => item.id === selectedItems[0])?.name || placeholder
    : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}:
        </label>
      )}
      <button
        type="button"
        className="flex justify-between items-center w-full bg-background border border-input rounded-md shadow-sm py-2 px-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
        onClick={handleToggle}
      >
        <span className="block truncate text-foreground">{displayValue}</span>
        <span className="flex items-center">
          {selectedItems.length > 0 && (
            <X
              size={16}
              className="text-muted-foreground hover:text-foreground mr-1"
              onClick={handleClearSelection}
            />
          )}
          <ChevronDown
            size={16}
            className={`transform transition-transform text-foreground ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-popover shadow-lg border border-border max-h-60 overflow-auto">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input text-sm bg-background text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking search
              />
            </div>
          </div>
          <ul className="py-1">
            {filteredItems.length === 0 ? (
              <li className="text-muted-foreground px-3 py-2 text-sm">No options</li>
            ) : (
              filteredItems.map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer select-none relative py-2 pl-10 pr-4 text-sm
                    ${selectedItems.includes(item.id) ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="block truncate">{item.name}</span>
                  {selectedItems.includes(item.id) && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent-foreground">
                      ✓
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;