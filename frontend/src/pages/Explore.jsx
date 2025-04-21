import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
// import SearchAndFilters from "../Components/SearchAndFilters";

export default function ExplorePage() {
  const [squares, setSquares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from your API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts/");
        console.log("Response Data:", response.data);

        if (Array.isArray(response.data)) {
          setSquares(response.data);
        } else {
          console.error("Expected array but got:", typeof response.data);
          console.log("Actual Response:", response.data);
          setSquares([]);
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

  const renderPostCard = (post, height = "419px") => (
    <div
      key={post._id}
      className="rounded-md shadow-md overflow-hidden bg-[#cfc46a]"
      style={{ width: "419px", height }}
    >
      <img
        src={post.media?.[0]?.url}
        alt={post.caption || "Fashion post"}
        className="w-full h-4/5 object-cover"
      />
      <div className="p-2 h-1/5">
      <p className="font-semibold truncate">{post.userId?.username || "Unknown"}</p>
      <p className="text-sm text-gray-700 truncate">{post.caption || "No caption"}</p>
      </div>
    </div>
  );

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
            {/* <SearchAndFilters /> */}
          </div>

          <div className="max-w-[1260px] mx-auto">
            {Array.from({ length: Math.ceil(squares.length / 5) }).map((_, groupIdx) => {
              const startIdx = groupIdx * 5;
              const group = squares.slice(startIdx, startIdx + 5);

              const isEven = groupIdx % 2 === 0;

              const squaresPosts = group.slice(0, 4);
              const portrait = group[4];

              return (
                <div key={groupIdx} className="flex gap-4 mb-4">
                  {isEven ? (
                    <>
                      {/* Left - 4 squares */}
                      <div className="grid grid-cols-2 gap-4">
                        {squaresPosts.map((post) => (renderPostCard(post)))}
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
                        {squaresPosts.map((post) => (renderPostCard(post)))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
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