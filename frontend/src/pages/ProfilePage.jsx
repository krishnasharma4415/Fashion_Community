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
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const openPost = (post) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  useEffect(() => {
    // Check if user is authenticated first
    const checkAuthentication = async () => {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!token || !userData._id) {
        console.log("No auth token or user data found, redirecting to login");
        setError("User not authenticated. Please log in.");
        setLoading(false);
        
        // Optional: redirect to login after a delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return false;
      }
      
      console.log("Auth token found, proceeding with profile data fetch");
      return true;
    };
    
    const fetchData = async () => {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) return;
      
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?._id;
      const token = localStorage.getItem("authToken");

      if (!userId || !token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user data for ID:", userId);
        console.log("Using token:", token.substring(0, 10) + "...");
        
        const [userRes, postRes] = await Promise.all([
          fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then(res => {
            if (!res.ok) {
              console.error("User fetch failed with status:", res.status);
              throw new Error(`Failed to fetch user: ${res.status}`);
            }
            return res.json();
          }),
          fetch(`http://localhost:5000/api/posts/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then(res => {
            if (!res.ok) {
              console.error("Posts fetch failed with status:", res.status);
              throw new Error(`Failed to fetch posts: ${res.status}`);
            }
            return res.json();
          }),
        ]);

        console.log("User data received:", userRes);
        setUser(userRes);
        setPosts(postRes);
      } catch (error) {
        console.error("❌ Error fetching profile data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchSavedPosts = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?._id;
    const token = localStorage.getItem("authToken");

    if (!userId || !token) return;

    try {
      const saved = await fetch(`http://localhost:5000/api/posts/saved/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch saved posts: ${res.status}`);
        return res.json();
      });
      
      setSavedPosts(saved);
    } catch (error) {
      console.error("❌ Error fetching saved posts:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "saved") fetchSavedPosts();
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading profile...</div>;
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f2ecf9]">
        <div className="bg-red-100 p-6 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button 
            onClick={handleLogin}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
                  src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="avatar-img"
                />
              </div>
              <div className="profile-info">
                <div className="flex items-center mb-4">
                  <h1 className="username mr-4">{user.username}</h1>
                  <button 
                    onClick={handleEditProfile}
                    className="edit-profile-btn hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                </div>
                
                <div className="profile-stats">
                  <span><strong>{posts.length}</strong> posts</span>
                  <span><strong>{user.followers ? user.followers.length : 0}</strong> followers</span>
                  <span><strong>{user.following ? user.following.length : 0}</strong> following</span>
                </div>
                <p className="bio">{user.bio || "Fashion lover"}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
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

          {/* Post Grid */}
          {postsToDisplay.length === 0 ? (
            <div className="text-center mt-10 text-gray-500">
              {activeTab === "saved" ? "No saved posts yet." : "No posts yet."}
            </div>
          ) : (
            <div className="posts-grid mt-4">
              {postsToDisplay.map((post) => (
                <PostCard key={post._id} post={post} onClick={() => openPost(post)} />
              ))}
            </div>
          )}

          {/* Post Modal */}
          {selectedPost && (
            <PostDetails post={selectedPost} onClose={closePost} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
