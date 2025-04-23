import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import PostDetails from "../components/PostDetails";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const openPost = (post) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log("👤 User data from localStorage:", userData);
      const userId = userData?._id;

      if (!userId) return;

      try {
        const [userRes, postRes] = await Promise.all([
          fetch(`http://localhost:5000/api/users/${userId}`).then(res => res.json()),
          fetch(`http://localhost:5000/api/posts/user/${userId}`).then(res => res.json()),
        ]);

        setUser(userRes);
        setPosts(postRes);
      } catch (error) {
        console.error("❌ Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSavedPosts = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?._id;

    if (!userId) return;

    try {
      const saved = await fetch(`http://localhost:5000/api/posts/saved/${userId}`).then(res => res.json());
      setSavedPosts(saved);
    } catch (error) {
      console.error("❌ Error fetching saved posts:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "saved") fetchSavedPosts();
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading profile...</div>;

  const postsToDisplay = activeTab === "posts" ? posts : savedPosts;

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto bg-[#f2ecf9] min-h-screen">
          {user && (
            <div className="profile-header">
              <div className="profile-avatar">
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="avatar-img"
                />
              </div>
              <div className="profile-info">
                <h1 className="username">{user.username}</h1>
                <div className="profile-stats">
                  <span><strong>{posts.length}</strong> posts</span>
                  <span><strong>1,200</strong> followers</span>
                  <span><strong>300</strong> following</span>
                </div>
                <p className="bio">{user.bio || "Fashion lover"}</p>
              </div>
            </div>
          )}

          <div className="profile-tabs mt-6">
            <button
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => handleTabChange("posts")}
            >
              <i className="fas fa-th"></i> POSTS
            </button>
            <button
              className={`tab ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => handleTabChange("saved")}
            >
              <i className="fas fa-bookmark"></i> SAVED
            </button>
          </div>

          {postsToDisplay.length === 0 ? (
            <div className="text-center mt-10 text-gray-500">
              {activeTab === "saved" ? "No saved posts yet." : "No posts yet."}
            </div>
          ) : (
            <div className="posts-grid mt-4">
              {postsToDisplay.map((post) => (
                <PostCard key={post._id} post={post} onClick={openPost} />
              ))}
            </div>
          )}

          {selectedPost && (
            <PostDetails post={selectedPost} onClose={closePost} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

