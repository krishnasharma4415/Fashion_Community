import { useState } from "react";
import { FaHeart, FaRegComment, FaRegBookmark, FaEllipsisH, FaTimes } from "react-icons/fa";

export default function PostDetails({ post, onClose }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Sample comments - in a real app, these would come from your API
  const comments = post.commentsList || [
    { username: "vanshika_tyagi", text: "Absolutely love this look!" },
    { username: "sona_sarojini", text: "Where did you get this outfit?" },
    { username: "krishna_sharma", text: "🔥🔥 Stunning!" },
  ];

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  // Format the date - assuming post.createdAt is available
  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : "05 April, 2025"; // Fallback date

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f2ecf9] rounded-xl shadow-lg w-full max-w-3xl overflow-hidden">
        <div className="flex">
          {/* Left side - Image/Video */}
          <div className="w-2/3 bg-black">
            {post.type === 'video' ? (
              <video
                src={post.mediaUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={post.imageUrl || post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          
          {/* Right side - Details */}
          <div className="w-1/3 flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={post.userAvatar}
                  alt={post.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-bold">{post.username}</span>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            {/* Comments section */}
            <div className="flex-grow overflow-y-auto p-4">
              {/* Caption */}
              <div className="flex items-start space-x-3 mb-4">
                <img
                  src={post.userAvatar}
                  alt={post.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="font-bold mr-1">{post.username}</span>
                  <span>{post.caption}</span>
                  <p className="text-gray-400 text-xs mt-1">{formattedDate}</p>
                </div>
              </div>
              
              {/* Comments */}
              <div className="space-y-3 mt-6">
                <h3 className="font-semibold">Comments</h3>
                {comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div>
                      <span className="font-semibold mr-1">{comment.username}</span>
                      <span>{comment.text}</span>
                      <p className="text-gray-400 text-xs mt-1">1h</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Like, Comment, Save buttons */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-4">
                  <button onClick={handleLikeToggle}>
                    <FaHeart className={`text-xl ${isLiked ? 'text-red-500' : 'text-gray-500'}`} />
                  </button>
                  <button>
                    <FaRegComment className="text-xl text-gray-500" />
                  </button>
                </div>
                <button>
                  <FaRegBookmark className="text-xl text-gray-500" />
                </button>
              </div>
              <div>
                <p className="font-semibold">{isLiked ? (post.likes || 0) + 1 : post.likes || 0} likes</p>
              </div>
              
              {/* Add comment form */}
              <div className="mt-2 flex items-center">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-grow bg-transparent focus:outline-none"
                />
                <button className="text-blue-500 font-semibold">Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}