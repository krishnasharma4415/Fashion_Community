import { useState, useEffect } from 'react';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import PostDetails from './PostDetails';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Check if post is liked by user and get updated like count on component mount
  useEffect(() => {
    checkLikeStatus();
  }, [post._id]);

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/likes/${post._id}`);
      const data = await response.json();
      setLikeCount(data.likes || post.likeCount || 0);
      
      // If using context or state management, you could check if post is in user's liked posts
      // For now, we'll manage the liked state locally
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Please log in to like posts");
        return;
      }

      if (isLiked) {
        // Unlike post
        const response = await fetch(`http://localhost:5000/api/likes/${post._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setLikeCount(prev => Math.max(0, prev - 1));
        }
      } else {
        // Like post
        const response = await fetch(`http://localhost:5000/api/likes/${post._id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setLikeCount(prev => prev + 1);
        }
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleClick = () => {
    setShowDetails(true);
  };

  const getMediaUrl = (mediaUrl) => {
    return mediaUrl?.startsWith('http')
      ? mediaUrl
      : `http://localhost:5000${mediaUrl}`;
  };

  return (
    <>
      <div
        className="relative w-[419px] h-[419px] overflow-hidden rounded-lg bg-gray-100 group cursor-pointer"
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
        onClick={handleClick}
      >
        {/* Post Media */}
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

        {/* Hover Overlay */}
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
                  onClick={(e) => handleLikeToggle(e)}
                />
              ) : (
                <HeartIcon
                  className="h-6 w-6"
                  onClick={(e) => handleLikeToggle(e)}
                />
              )}
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChatBubbleOvalLeftIcon className="h-6 w-6" />
              <span>{post.commentCount || 0}</span>
            </div>
          </div>
        </div>

        {/* User Info */}
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