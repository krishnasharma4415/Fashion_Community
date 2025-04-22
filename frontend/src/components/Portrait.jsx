import { useState } from 'react';
import { HeartIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import PostDetails from './PostDetails';

const Portrait = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleClick = () => {
    setShowDetails(true);
  };

  return (
    <>
      <div
        className="relative w-[419px] h-[840px] overflow-hidden rounded-lg bg-gray-100 group cursor-pointer"
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
        onClick={handleClick}
      >
        {/* Video Content (Only videos allowed) */}
        <video
          src={post.mediaUrl}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          muted
          loop
          playsInline
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            showOverlay ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex space-x-6 text-white">
            <div className="flex items-center space-x-1">
              {isLiked ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" onClick={handleLikeToggle} />
              ) : (
                <HeartIcon className="h-6 w-6" onClick={handleLikeToggle} />
              )}
              <span>{isLiked ? post.likes + 1 : post.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChatBubbleOvalLeftIcon className="h-6 w-6" />
              <span>{post.comments}</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="absolute top-0 left-0 p-2 flex items-center space-x-2">
          <img
            src={post.userAvatar}
            alt={post.username}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
          <span className="text-white text-sm font-semibold drop-shadow">{post.username}</span>
        </div>
      </div>

      {showDetails && <PostDetails post={post} onClose={() => setShowDetails(false)} />}
    </>
  );
};

export default Portrait;