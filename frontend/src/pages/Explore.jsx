import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import Potrait from "../components/Portrait";
import SearchAndFilters from "../components/SearchAndFilters";

export default function ExplorePage() {
  const [squares, setSquares] = useState([]);
  const [filteredSquares, setFilteredSquares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  // Fetch data from your API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts/");
        console.log("Response Data:", response.data);

        if (Array.isArray(response.data)) {
          setSquares(response.data);
          setFilteredSquares(response.data);
        } else {
          console.error("Expected array but got:", typeof response.data);
          console.log("Actual Response:", response.data);
          setSquares([]);
          setFilteredSquares([]);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Effect to filter posts when search or filter changes
  useEffect(() => {
    if (!squares.length) return;

    let results = [...squares];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        post =>
          (post.caption && post.caption.toLowerCase().includes(query)) ||
          (post.username && post.username.toLowerCase().includes(query)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Apply category filter
    if (activeFilter) {
      results = results.filter(
        post =>
          (post.category && post.category === activeFilter) ||
          (post.tags && post.tags.includes(activeFilter))
      );
    }

    setFilteredSquares(results);
  }, [searchQuery, activeFilter, squares]);

  // Handle search and filter changes
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  if (loading) return <div className="text-center py-10">Loading posts...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-[#f2ecf9] h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Visible with collapsible toggle */}
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-[#f2ecf9] px-6 pt-4">
            <SearchAndFilters
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              activeFilter={activeFilter}
              searchValue={searchQuery}
            />
          </div>

          <div className="max-w-[1260px] mx-auto">
            {filteredSquares.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-500">
                No posts found matching your search or filter criteria.
              </div>
            ) : (
              Array.from({ length: Math.ceil(filteredSquares.length / 5) }).map((_, groupIdx) => {
                const startIdx = groupIdx * 5;
                const group = filteredSquares.slice(startIdx, startIdx + 5);
                const isEven = groupIdx % 2 === 0;
                const squaresPosts = group.slice(0, 4);
                const portrait = group[4];

                return (
                  <div key={groupIdx} className="flex gap-4 mb-4">
                    {isEven ? (
                      <>
                        {/* Left - 4 squares */}
                        <div className="grid grid-cols-2 gap-4">
                          {filteredSquares.map((post, idx) => (
                            <div key={post._id || idx}>
                              <PostCard post={post} />
                            </div>
                          ))}
                        </div>

                        {/* Right - portrait */}
                        {portrait && (
                          <div
                            className="bg-[#cfc46a] rounded-md"
                            style={{ width: '419px', height: '840px' }}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {/* Left - portrait */}
                        {portrait && (
                          <div
                            className="bg-[#cfc46a] rounded-md"
                            style={{ width: '419px', height: '840px' }}
                          />
                        )}

                        {/* Right - 4 squares */}
                        <div className="grid grid-cols-2 gap-4">
                          {squaresPosts.map((post, idx) => (
                            <div key={post.id || idx}>
                              <PostCard post={post} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-sm text-gray-500">
            User Since: Jan 2025 <br />
            © Fashion. 2025 | ver 0.4
          </div>
        </main>
      </div>
    </div>
  );
}