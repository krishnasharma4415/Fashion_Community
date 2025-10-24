import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import PostDetails from "../components/PostDetails";
import axios from "axios";
import { getProfilePictureUrl } from "../utils/imageUtils";
import { getApiUrl } from "../config/api";
import "../styles/Profile.css";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);

  const openPost = (post) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  useEffect(() => {
    if (!userId) {
      navigate('/home');
      return;
    }
    fetchUserData();
  }, [userId, navigate]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      
      // Fetch user profile with stats
      const [userRes, postsRes] = await Promise.all([
        axios.get(getApiUrl(`/api/users/${userId}/profile`), {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(getApiUrl(`/api/posts/user/${userId}`), {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUser(userRes.data);
      setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      
      // If it's the current user's profile, redirect to main profile page
      if (userRes.data.isOwnProfile) {
        navigate('/profile');
        return;
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 404) {
        setError("User not found");
      } else if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load user profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (followLoading) return;
    
    setFollowLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (user.isFollowing) {
        // Unfollow
        await axios.delete(getApiUrl(`/api/follows/${userId}`), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(prev => ({
          ...prev,
          isFollowing: false,
          stats: { ...prev.stats, followers: prev.stats.followers - 1 }
        }));
      } else {
        // Follow
        await axios.post(getApiUrl(`/api/follows/${userId}`), {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(prev => ({
          ...prev,
          isFollowing: true,
          stats: { ...prev.stats, followers: prev.stats.followers + 1 }
        }));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };



  if (loading) return <div className="text-center mt-10 text-lg">Loading profile...</div>;
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f2ecf9]">
        <div className="bg-white p-8 rounded-lg text-center max-w-md shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/explore')}
            className="px-6 py-2 bg-[#9fb3df] text-white rounded-lg hover:bg-[#8c9cc8] transition-colors"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

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
                  src={getProfilePictureUrl(user.profilePicture)}
                  alt="Profile"
                  className="avatar-img"
                />
              </div>
              <div className="profile-info">
                <div className="flex items-center mb-4">
                  <h1 className="username mr-4">{user.username}</h1>
                  <button 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      user.isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-[#9fb3df] text-white hover:bg-[#8c9cc8]'
                    } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {followLoading ? 'Loading...' : user.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
                
                <div className="profile-stats">
                  <span><strong>{user.stats?.posts || 0}</strong> posts</span>
                  <span><strong>{user.stats?.followers || 0}</strong> followers</span>
                  <span><strong>{user.stats?.following || 0}</strong> following</span>
                </div>
                <p className="bio">{user.bio || "Fashion enthusiast"}</p>
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
          </div>

          {posts.length === 0 ? (
            <div className="text-center mt-10 text-gray-500">
              <div className="w-16 h-16 bg-[#e0d7f9] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#8c9cc8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p>No posts yet.</p>
            </div>
          ) : (
            <div className="posts-grid mt-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onClick={() => openPost(post)} />
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

export default UserProfile;