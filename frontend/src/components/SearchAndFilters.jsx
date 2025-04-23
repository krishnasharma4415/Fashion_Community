import React from "react";
import { Search, X } from "lucide-react";

const SearchAndFilters = ({
  onSearch,
  onFilterChange,
  activeFilter,
  searchValue = "",
  filters = ["Summer", "Winter", "Formals", "Traditional"]
}) => {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleFilterClick = (filter) => {
    onFilterChange(filter);
  };

  const clearSearch = () => {
    onSearch("");
  };

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="Search by caption, username, or tags..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Search posts"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-2.5"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => handleFilterClick(filter)}
            className={`cursor-pointer rounded-full px-4 py-1 text-sm transition-colors duration-200 ${
              activeFilter === filter
                ? "bg-black text-white"
                : "bg-[#e5e5ea] text-black hover:bg-gray-300"
            }`}
            aria-pressed={activeFilter === filter}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilters;