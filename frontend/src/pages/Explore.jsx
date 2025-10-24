import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExplorePostCard from "../components/ExplorePostCard";
import Portrait from "../components/Portrait";
import SearchAndFilters from "../components/SearchAndFilters";

export default function ExplorePage() {
  const [squares, setSquares] = useState([]);
  const [filteredSquares, setFilteredSquares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get("/api/posts/explore", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!squares.length) return;

    let results = [...squares];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(post => {
        const username = post.userId?.username || '';
        const caption = post.caption || '';
        const tags = post.tags || [];
        
        return (
          caption.toLowerCase().includes(query) ||
          username.toLowerCase().includes(query) ||
          tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }

    if (activeFilter) {
      results = results.filter(post => 
        post.category === activeFilter ||
        (post.tags && post.tags.includes(activeFilter))
      );
    }

    console.log("Filtered results:", results);
    setFilteredSquares(results);
  }, [searchQuery, activeFilter, squares]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  if (loading) return <div className="text-center py-10">Loading posts...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-[#f2ecf9] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Enhanced Header */}
          <div className="sticky top-0 z-20 bg-[#f2ecf9]/95 backdrop-blur-sm border-b border-white/20">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Fashion</h1>
                <p className="text-gray-600">Discover trending styles and connect with creators</p>
              </div>
              <SearchAndFilters
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                activeFilter={activeFilter}
                searchValue={searchQuery}
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {filteredSquares.length === 0 && !loading ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#e0d7f9] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#8c9cc8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {searchQuery || activeFilter ? "No matches found" : "No posts to explore"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchQuery || activeFilter 
                    ? "Try adjusting your search or filters to discover more content" 
                    : "Check back later for new content from the community!"}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Array.from({ length: Math.ceil(filteredSquares.length / 5) }).map((_, groupIdx) => {
                  const startIdx = groupIdx * 5;
                  const group = filteredSquares.slice(startIdx, startIdx + 5);
                  const isEven = groupIdx % 2 === 0;
                  const squaresPosts = group.slice(0, 4);
                  const portrait = group[4];

                  return (
                    <div key={groupIdx} className="flex gap-6 justify-center">
                      {isEven ? (
                        <>
                          <div className="grid grid-cols-2 gap-6">
                            {squaresPosts.map((post) => (
                              <div key={post._id}>
                                <ExplorePostCard post={post} />
                              </div>
                            ))}
                          </div>

                          {portrait && (
                            <div className="w-[419px] h-[840px] bg-gradient-to-br from-[#e0d7f9] to-[#9fb3df] rounded-xl shadow-lg overflow-hidden">
                              <Portrait post={portrait} />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {portrait && (
                            <div className="w-[419px] h-[840px] bg-gradient-to-br from-[#e0d7f9] to-[#9fb3df] rounded-xl shadow-lg overflow-hidden">
                              <Portrait post={portrait} />
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-6">
                            {squaresPosts.map((post) => (
                              <div key={post._id}>
                                <ExplorePostCard post={post} />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
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