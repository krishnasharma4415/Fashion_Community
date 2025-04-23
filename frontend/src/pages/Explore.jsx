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
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          setSquares(response.data);
          setFilteredSquares(response.data);
        } else {
          console.error("Expected array but got:", typeof response.data);
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
      results = results.filter(post => {
        const username = post.username || post.user?.username || '';
        const caption = post.caption || '';
        const tags = post.tags || [];
        
        return (
          caption.toLowerCase().includes(query) ||
          username.toLowerCase().includes(query) ||
          tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }

    // Apply category filter
    if (activeFilter) {
      results = results.filter(post => 
        post.category === activeFilter ||
        (post.tags && post.tags.includes(activeFilter))
      );
    }

    console.log("Filtered results:", results);
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
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
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
                {searchQuery || activeFilter 
                  ? "No posts match your search criteria" 
                  : "No posts available"}
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
                        <div className="grid grid-cols-2 gap-4">
                          {squaresPosts.map((post) => (
                            <div key={post._id}>
                              <PostCard post={post} />
                            </div>
                          ))}
                        </div>

                        {portrait && (
                          <div className="w-[419px] h-[840px] bg-[#cfc46a] rounded-md">
                            <Potrait post={portrait} />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {portrait && (
                          <div className="w-[419px] h-[840px] bg-[#cfc46a] rounded-md">
                            <Potrait post={portrait} />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          {squaresPosts.map((post) => (
                            <div key={post._id}>
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

          <div className="mt-10 text-center text-sm text-gray-500">
            User Since: Jan 2025 <br />
            © Fashion. 2025 | ver 0.4
          </div>
        </main>
      </div>
    </div>
  );
}