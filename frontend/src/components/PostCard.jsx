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
import PostDetails from './PostDetails';
import axios from 'axios';

const PostCard = ({ post }) => {
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
    return mediaUrl?.startsWith('http')
      ? mediaUrl
      : `http://localhost:5000${mediaUrl}`;
  };

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/likes/${post._id}`);
      const data = await response.json();
      setLikeCount(data.likes || post.likeCount || 0);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const checkSaveStatus = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?._id;
    if (!userId || !post._id) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/posts/saved/${userId}`);
      const savedPostIds = res.data.map(p => p._id);
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
      const url = `http://localhost:5000/api/likes/${post._id}`;
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
        `http://localhost:5000/api/posts/save/${post._id}`,
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
        className="relative w-[419px] h-[419px] overflow-hidden rounded-lg bg-gray-100 group cursor-pointer"
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

        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            showOverlay ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex space-x-6 text-white">
            <div className="flex items-center space-x-1">
              {isLiked ? (
                <HeartIconSolid
                  className="h-6 w-6 text-red-500"
                  onClick={handleLikeToggle}
                />
              ) : (
                <HeartIcon
                  className="h-6 w-6"
                  onClick={handleLikeToggle}
                />
              )}
              <span>{likeCount}</span>
            </div>

            <div className="flex items-center space-x-1">
              <ChatBubbleOvalLeftIcon className="h-6 w-6" />
              <span>{post.commentCount || 0}</span>
            </div>

            <div className="flex items-center space-x-1">
              {isSaved ? (
                <BookmarkSolidIcon
                  className="h-6 w-6 text-white"
                  onClick={handleSaveToggle}
                />
              ) : (
                <BookmarkIcon
                  className="h-6 w-6"
                  onClick={handleSaveToggle}
                />
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 p-2 flex items-center space-x-2">
          <img
            src={
              post.userId?.profilePicture
                ? getMediaUrl(post.userId.profilePicture)
                : 'https://via.placeholder.com/40'
            }
            alt={post.userId?.username || 'User'}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
          <span className="text-white text-sm font-semibold drop-shadow">
            {post.userId?.username || 'Unknown'}
          </span>
        </div>
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

export default PostCard;
