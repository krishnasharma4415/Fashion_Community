import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark, FaTimes } from "react-icons/fa";

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
      const response = await fetch(`http://localhost:5000/api/likes/${post._id}`);
      const data = await response.json();
      setLikeCount(data.likes || post.likeCount || 0);
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
    return url?.startsWith('http') 
      ? url 
      : `http://localhost:5000${url}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f2ecf9] rounded-xl shadow-lg w-full max-w-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 bg-black">
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
          
          <div className="w-full md:w-1/3 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={post.userId?.profilePicture 
                    ? getMediaUrl(post.userId.profilePicture) 
                    : 'https://via.placeholder.com/40'}
                  alt={post.userId?.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-bold">{post.userId?.username || 'Unknown'}</span>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4">
              <div className="flex items-start space-x-3 mb-4">
                <img
                  src={post.userId?.profilePicture 
                    ? getMediaUrl(post.userId.profilePicture) 
                    : 'https://via.placeholder.com/40'}
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
                        src={comment.userId?.profilePicture 
                          ? getMediaUrl(comment.userId.profilePicture) 
                          : 'https://via.placeholder.com/40'}
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
                  className={`font-semibold ${
                    loading || !newComment.trim() ? 'text-blue-300' : 'text-blue-500'
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