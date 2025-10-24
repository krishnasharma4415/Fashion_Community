import { useState, useEffect } from 'react';
import axios from 'axios';

const FollowButton = ({ userId, username, className = "" }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID
    const userData = JSON.parse(localStorage.getItem("user"));
    const currentId = userData?._id;
    setCurrentUserId(currentId);

    // Don't show follow button for own posts
    if (currentId === userId) return;

    // Check if already following
    checkFollowStatus();
  }, [userId]);

  const checkFollowStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/follows/${userId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (loading) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (isFollowing) {
        // Unfollow
        await axios.delete(`/api/follows/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(false);
      } else {
        // Follow
        await axios.post(`/api/follows/${userId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if it's the current user's own post
  if (currentUserId === userId) return null;

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-[#9fb3df] text-white hover:bg-[#8c9cc8]'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;