import { useState, useEffect } from 'react';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';
import { getApiUrl } from '../config/api.js';
import axios from 'axios';
import { getProfilePictureUrl, getMediaUrl } from '../utils/imageUtils';
import PostDetails from './PostDetails';
import FollowButton from './FollowButton';

const ExplorePostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkLikeStatus();
    checkSaveStatus();
  }, [post._id]);

  const getMediaUrl = (mediaUrl) => {
    // If it's already a full URL (Cloudinary), return as is
    if (mediaUrl?.startsWith('http')) {
      return mediaUrl;
    }
    // For legacy local uploads, construct the full URL
    return getApiUrl(mediaUrl);
  };

  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      const response = await fetch(getApiUrl(`/api/likes/${post._id}/status`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount || post.likeCount || 0);
        setIsLiked(data.isLiked || false);
      }
    } catch (error) {
      console.error("Error checking like status:", error);
      // Fallback to post data
      setLikeCount(post.likeCount || 0);
    }
  };

  const checkSaveStatus = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?._id;
    if (!userId || !post._id) return;

    try {
      const res = await axios.get(getApiUrl(`/api/posts/saved/${userId}`));
      const savedPostIds = Array.isArray(res.data) ? res.data.map(p => p._id) : [];
      setIsSaved(savedPostIds.includes(post._id));
    } catch (err) {
      console.error("Error checking save status:", err);
    }
  };

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert("Please log in to like posts");
      return;
    }

    try {
      const url = getApiUrl(`/api/likes/${post._id}`);
      const method = isLiked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setLikeCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert("Please log in to save posts");
      return;
    }

    try {
      const response = await axios.post(
        getApiUrl(`/api/posts/save/${post._id}`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleClick = () => {
    setShowDetails(true);
  };

  return (
    <>
      <div
        className="relative w-[419px] h-[419px] overflow-hidden rounded-xl bg-white group cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#9fb3df]/30"
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
        onClick={handleClick}
      >
        {/* Media */}
        {post.media && post.media.length > 0 && (
          post.media[0].type === 'video' ? (
            <video
              src={getMediaUrl(post.media[0].url)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={getMediaUrl(post.media[0].url)}
              alt={post.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )
        )}

        {/* Enhanced overlay with your color palette */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center transition-all duration-300 ${
            showOverlay ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex space-x-8 text-white">
            <button 
              className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              onClick={handleLikeToggle}
            >
              {isLiked ? (
                <HeartIconSolid className="h-7 w-7 text-red-400" />
              ) : (
                <HeartIcon className="h-7 w-7 hover:text-red-400 transition-colors duration-200" />
              )}
              <span className="text-xs font-semibold">{likeCount}</span>
            </button>

            <button className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
              <ChatBubbleOvalLeftIcon className="h-7 w-7 hover:text-[#9fb3df] transition-colors duration-200" />
              <span className="text-xs font-semibold">{post.commentCount || 0}</span>
            </button>

            <button 
              className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              onClick={handleSaveToggle}
            >
              {isSaved ? (
                <BookmarkSolidIcon className="h-7 w-7 text-[#9fb3df]" />
              ) : (
                <BookmarkIcon className="h-7 w-7 hover:text-[#9fb3df] transition-colors duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced user info with follow button */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
            <div className="relative">
              <img
                src={getProfilePictureUrl(post.userId?.profilePicture)}
                alt={post.userId?.username || 'User'}
                className="w-8 h-8 rounded-full object-cover border-2 border-[#e0d7f9]"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-gray-800 text-sm font-semibold">
              {post.userId?.displayName || post.userId?.username || 'Unknown'}
            </span>
          </div>
          
          <FollowButton 
            userId={post.userId?._id} 
            username={post.userId?.username}
            className="text-xs px-3 py-1"
          />
        </div>

        {/* Subtle accent corner */}
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#9fb3df] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {showDetails && (
        <PostDetails
          post={post}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default ExplorePostCard;