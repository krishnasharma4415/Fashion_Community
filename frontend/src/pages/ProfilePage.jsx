import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
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

  if (loading) return <div className="text-center mt-10 text-lg">Loading profile...</div>;

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
                <button className="edit-profile-btn">Edit Profile</button>
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
              onClick={() => setActiveTab("posts")}
            >
              <i className="fas fa-th"></i> POSTS
            </button>
            <button
              className={`tab ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              <i className="fas fa-bookmark"></i> SAVED
            </button>
          </div>

          <div className="posts-grid mt-4">
            {posts.map((post) => (
              <div key={post._id} className="post-item" onClick={() => openPost(post)}>
                <img
                  src={
                    post.media[0]?.url?.startsWith("http")
                      ? post.media[0].url
                      : `http://localhost:5000${post.media[0]?.url}`
                  }
                  alt={`Post ${post._id}`}
                />
                <div className="post-overlay">
                  <span><i className="fas fa-heart"></i> {post.likeCount || 0}</span>
                  <span><i className="fas fa-comment"></i> {post.commentCount || 0}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-4 max-w-lg w-full relative shadow-lg">
                <button
                  onClick={closePost}
                  className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                >
                  &times;
                </button>
                <img
                  src={
                    selectedPost.media[0]?.url?.startsWith("http")
                      ? selectedPost.media[0].url
                      : `http://localhost:5000${selectedPost.media[0]?.url}`
                  }
                  alt="Full Post"
                  className="w-full rounded-lg object-cover"
                />
                <div className="mt-4 text-sm">
                  <p><i className="fas fa-heart text-red-500"></i> {selectedPost.likeCount || 0} likes</p>
                  <p><i className="fas fa-comment text-blue-400"></i> {selectedPost.commentCount || 0} comments</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
