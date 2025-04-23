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
  const { posts, loading } = useFetchPosts();

  return (
    <div className="bg-[#f2ecf9] h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

      <div className="flex-1 overflow-y-auto px-4 py-6 flex justify-center">
      <div className="w-full max-w-xl space-y-6">
      {loading ? (
      <div>Loading posts...</div>
       ) : (
       posts.map(post => (
         <PostCard key={post._id} post={post} />
       ))
      )}
    </div>
  </div>
        <div className="hidden lg:block sticky top-0 h-full w-[250px]">
          <Suggestions />
        </div>
      </div>
    </div>
  );
}
