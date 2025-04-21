import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import PostCard from "../Components/PostCard";
import Suggestions from "../Components/Suggestions";
import { useEffect, useState } from "react";
import axios from "axios";

const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading };
};

export default function Home() {
  return (
    <div className="bg-[#f2ecf9] h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Visible with collapsible toggle */}
        <Sidebar />

        {/* Post Feed - Scrollable Middle */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </div>

        {/* Suggestions - Sticky Right (optional on mobile) */}
        <div className="hidden lg:block sticky top-0 h-full w-[250px]">
          <Suggestions />
        </div>
      </div>
    </div>
  );
}
