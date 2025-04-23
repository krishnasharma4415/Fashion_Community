import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

const FollowProfile = () => {
  const { profileId } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [posts, setPosts] = useState([]);

  const userProfiles = {
    "Gigi_Hadid": {
      username: "Gigi_Hadid",
      followers: 1200,
      following: 300,
      bio: "Fashion Enthusiast | Blogger ✨ #StyleInspo",
      avatar: "https://i.pinimg.com/736x/83/05/bc/8305bcc8d0e550be62f69b111635b7f5.jpg",
    },
    "sona_sarojini": {
      username: "sona_sarojini",
      followers: 800,
      following: 150,
      bio: "Just vibes and vintage 📸",
      avatar: "https://i.pinimg.com/originals/7e/d9/14/7ed9141a4c6d8d8eaaeb7cb77ef8df20.jpg",
    },
  };

  const userProfile = userProfiles[profileId];

  useEffect(() => {
    setPosts(
      Array.from({ length: 9 }, (_, i) => ({
        id: `post-${i + 1}`,
        imageUrl: `https://via.placeholder.com/300?text=${profileId}+Post+${i + 1}`,
        likes: 100 + i * 10,
        comments: 20 + i,
        liked: false,
        saved: false,
        commentText: "",
        commentList: [],
      }))
    );
  }, [profileId]);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        console.log(`Fetching follow status for ${profileId}`);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };
    fetchFollowStatus();
  }, [profileId]);

  const followUser = async () => {
    setLoadingFollow(true);
    try {
      console.log(`Sending follow request to ${profileId}`);
      setIsFollowing(true);
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const unfollowUser = async () => {
    setLoadingFollow(true);
    try {
      console.log(`Sending unfollow request to ${profileId}`);
      setIsFollowing(false);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser();
    } else {
      followUser();
    }
  };

  const openPost = (post) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const toggleSave = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, saved: !post.saved } : post))
    );
  };

  const handleCommentChange = (id, text) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, commentText: text } : post))
    );
  };

  const submitComment = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              commentList: [...post.commentList, post.commentText],
              comments: post.comments + 1,
              commentText: "",
            }
          : post
      )
    );
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Profile not found 😢
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="h-full bg-[#f3e8ff]">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f2ecf9] min-h-screen">
          <div className="profile-header">
            <div className="profile-avatar">
              <img src={userProfile.avatar} alt="Profile" className="avatar-img" />
            </div>
            <div className="profile-info">
              <h1 className="username">{userProfile.username}</h1>
              <button
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  isFollowing
                    ? "bg-gray-300 text-black hover:bg-gray-400"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                } ${loadingFollow ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleFollowToggle}
                disabled={loadingFollow}
              >
                {loadingFollow ? "Please wait..." : isFollowing ? "Following" : "Follow"}
              </button>
              <div className="profile-stats">
                <span><strong>{posts.length}</strong> posts</span>
                <span><strong>{userProfile.followers}</strong> followers</span>
                <span><strong>{userProfile.following}</strong> following</span>
              </div>
              <p className="bio">{userProfile.bio}</p>
            </div>
          </div>

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
            {posts
              .filter((post) => (activeTab === "posts" ? true : post.saved))
              .map((post) => (
                <div key={post.id} className="post-item" onClick={() => openPost(post)}>
                  <img src={post.imageUrl} alt={`Post ${post.id}`} />
                  <div className="post-overlay">
                    <span><i className="fas fa-heart"></i> {post.likes}</span>
                    <span><i className="fas fa-comment"></i> {post.comments}</span>
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
                  src={selectedPost.imageUrl}
                  alt="Full Post"
                  className="w-full rounded-lg object-cover"
                />
                <div className="mt-4 text-sm space-y-2">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(selectedPost.id)}>
                      <i
                        className={`fas fa-heart ${selectedPost.liked ? "text-red-500" : "text-gray-400"}`}
                      ></i>
                    </button>
                    <button onClick={() => toggleSave(selectedPost.id)}>
                      <i
                        className={`fas fa-bookmark ${selectedPost.saved ? "text-blue-500" : "text-gray-400"}`}
                      ></i>
                    </button>
                  </div>
                  <p>{selectedPost.likes} likes</p>
                  <p>{selectedPost.comments} comments</p>
                  <div className="comment-section">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={selectedPost.commentText}
                      onChange={(e) => handleCommentChange(selectedPost.id, e.target.value)}
                      className="border p-2 w-full mt-2"
                    />
                    <button
                      onClick={() => submitComment(selectedPost.id)}
                      className="mt-2 text-sm bg-purple-500 text-white px-3 py-1 rounded-md"
                    >
                      Post
                    </button>
                    <div className="mt-2 text-xs">
                      {selectedPost.commentList.map((comment, index) => (
                        <p key={index}>💬 {comment}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowProfile;
