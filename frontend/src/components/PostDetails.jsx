import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark, FaTimes } from "react-icons/fa";
import { getProfilePictureUrl, getMediaUrl } from "../utils/imageUtils";

export default function PostDetails({ post, onClose }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    checkIfLiked();
  }, [post._id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${post._id}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const checkIfLiked = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const response = await fetch(`http://localhost:5000/api/likes/${post._id}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount || post.likeCount || 0);
        setIsLiked(data.isLiked || false);
      }
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Please log in to like posts");
        return;
      }

      if (isLiked) {
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

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Please log in to comment");
        return;
      }

      setLoading(true);

      const response = await fetch(`http://localhost:5000/api/comments/${post._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      const data = await response.json();

      if (response.ok) {
        fetchComments();
        setNewComment("");
      } else {
        console.error("Error adding comment:", data.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    : "05 April, 2025";

  const getMediaUrl = (url) => {
    // If it's already a full URL (Cloudinary), return as is
    if (url?.startsWith('http')) {
      return url;
    }
    // For legacy local uploads, construct the full URL
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200">
        <div className="flex flex-col lg:flex-row h-[85vh] max-h-[700px]">
          <div className="w-full lg:w-3/5 bg-black relative">
            {post.media && post.media.length > 0 && post.media[0].type === 'video' ? (
              <video
                src={getMediaUrl(post.media[0].url)}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={post.media && post.media.length > 0
                  ? getMediaUrl(post.media[0].url)
                  : 'https://via.placeholder.com/600x600'}
                alt={post.caption}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <div className="w-full lg:w-2/5 flex flex-col bg-[#f2ecf9]/30">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={getProfilePictureUrl(post.userId?.profilePicture)}
                    alt={post.userId?.username || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#e0d7f9]"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{post.userId?.username || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500">Fashion enthusiast</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              <div className="flex items-start space-x-3 mb-4">
                <img
                  src={getProfilePictureUrl(post.userId?.profilePicture)}
                  alt={post.userId?.username || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="font-bold mr-1">{post.userId?.username || 'Unknown'}</span>
                  <span>{post.caption}</span>
                  <p className="text-gray-400 text-xs mt-1">{formattedDate}</p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <h3 className="font-semibold">Comments</h3>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment, index) => (
                    <div key={comment._id || index} className="flex items-start space-x-3">
                      <img
                        src={getProfilePictureUrl(comment.userId?.profilePicture)}
                        alt={comment.userId?.username || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-semibold mr-1">{comment.userId?.username || 'Unknown'}</span>
                        <span>{comment.content}</span>
                        <p className="text-gray-400 text-xs mt-1">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString()
                            : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-4">
                  <button onClick={handleLikeToggle}>
                    {isLiked ? (
                      <FaHeart className="text-xl text-red-500" />
                    ) : (
                      <FaRegHeart className="text-xl text-gray-500" />
                    )}
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
                <p className="font-semibold">{likeCount} likes</p>
              </div>

              <div className="mt-2 flex items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow bg-transparent focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={loading || !newComment.trim()}
                  className={`font-semibold ${loading || !newComment.trim() ? 'text-blue-300' : 'text-blue-500'
                    }`}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}