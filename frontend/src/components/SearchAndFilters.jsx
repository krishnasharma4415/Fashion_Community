import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const SearchAndFilters = () => {
  const filters = ["Summer", "Winter", "Formals", "Traditional"];
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {/* Centered Search Bar */}
      <div className="flex justify-center w-full">
        <div className="flex items-center gap-2 bg-[#e5e5ea] rounded-xl px-3 w-full max-w-md h-10">
          <Search className="text-black mr-2" size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-sm placeholder:text-gray-500"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="text-gray-500 hover:text-black"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filters (left-aligned) */}
      <div className="flex items-center gap-2 flex-wrap">
        <button className="bg-[#e5e5ea] p-2 rounded-full hover:bg-gray-300">
          <SlidersHorizontal size={18} />
        </button>
        {filters.map((filter) => (
          <span
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`cursor-pointer rounded-full px-4 py-1 text-sm transition-colors duration-200 ${
              activeFilter === filter
                ? "bg-black text-white"
                : "bg-[#e5e5ea] text-black hover:bg-gray-300"
            }`}
          >
            {filter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilters;
