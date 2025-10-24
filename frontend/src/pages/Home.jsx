import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import Suggestions from "../components/Suggestions";
import { useEffect, useState } from "react";
import axios from "axios";

const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get("/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
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

  return { posts, loading };
};

export default function Home() {
  const { posts, loading } = useFetchPosts();

  return (
    <div className="bg-[#f2ecf9] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto">
          {/* Header Section */}
          <div className="sticky top-0 bg-[#f2ecf9]/95 backdrop-blur-sm border-b border-white/20 z-10">
            <div className="max-w-2xl mx-auto px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800 text-center">Fashion Feed</h1>
              <p className="text-gray-600 text-center text-sm mt-1">Discover the latest trends and styles</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-2xl mx-auto px-6 py-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6">
                  <div className="w-12 h-12 border-3 border-[#e0d7f9] border-t-[#9fb3df] rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Loading your feed</h3>
                <p className="text-gray-500 text-center">Discovering amazing fashion content...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#e0d7f9] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#8c9cc8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your feed is empty</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Follow other users to see their posts in your feed, or create your own content!</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => window.location.href = '/explore'}
                    className="bg-[#e0d7f9] hover:bg-[#d4c5f9] text-[#8c9cc8] px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Discover People
                  </button>
                  <button 
                    onClick={() => window.location.href = '/post-creation'}
                    className="bg-[#9fb3df] hover:bg-[#8c9cc8] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map(post => (
                  <div key={post._id} className="flex justify-center">
                    <PostCard post={post} />
                  </div>
                ))}
                
                {/* Load more indicator */}
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">You've seen all posts</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="hidden lg:block sticky top-0 h-full w-[280px] bg-white/30 backdrop-blur-sm border-l border-white/20">
          <Suggestions />
        </div>
      </div>
    </div>
  );
}
