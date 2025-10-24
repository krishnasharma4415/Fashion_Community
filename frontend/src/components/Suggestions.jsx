import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Users, 
  UserPlus, 
  Loader2, 
  RefreshCw, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getProfilePictureUrl } from "../utils/imageUtils";

export default function Suggestions() {
  const [showAll, setShowAll] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [followLoading, setFollowLoading] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to see suggestions");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/recommendations/users?limit=15", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError("Failed to load suggestions");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      if (error.response?.status === 401) {
        setError("Please log in to see suggestions");
      } else {
        setError("Failed to load suggestions");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleFollowUser = async (userId, username) => {
    try {
      setFollowLoading(prev => new Set([...prev, userId]));
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to follow users");
        return;
      }

      await axios.post(`http://localhost:5000/api/follows/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFollowingUsers(prev => new Set([...prev, userId]));
      
      // Remove user from suggestions after following
      setUsers(prev => prev.filter(user => user._id !== userId));
      
    } catch (error) {
      console.error("Error following user:", error);
      setError("Failed to follow user");
      setTimeout(() => setError(""), 3000);
    } finally {
      setFollowLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };



  const handleRefresh = () => {
    fetchSuggestions();
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 w-full max-w-md lg:w-auto">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#9fb3df]" />
          <span className="ml-2 text-gray-600">Loading suggestions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 w-full max-w-md lg:w-auto">
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#9fb3df] text-white rounded-lg hover:bg-[#8c9cc8] transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 w-full max-w-md lg:w-auto">
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm mb-3">No new suggestions</p>
            <p className="text-gray-500 text-xs">Check back later for new people to follow</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 w-full max-w-md lg:w-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#9fb3df]" />
          <h2 className="font-semibold text-lg text-gray-800">Suggestions</h2>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-[#9fb3df]/10 rounded-full transition-colors"
          title="Refresh suggestions"
        >
          <RefreshCw className="w-4 h-4 text-gray-500 hover:text-[#9fb3df]" />
        </button>
      </div>

      {/* User List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {(showAll ? users : users.slice(0, 5)).map((user) => (
          <div
            key={user._id}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#f2ecf9]/50 transition-all duration-200"
          >
            {/* Profile Picture */}
            <div 
              className="cursor-pointer"
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={getProfilePictureUrl(user.profilePicture)}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#e0d7f9] group-hover:border-[#9fb3df] transition-colors"
              />
            </div>

            {/* User Info */}
            <div 
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => handleUserClick(user._id)}
            >
              <p className="font-semibold text-gray-800 truncate hover:text-[#9fb3df] transition-colors">
                {user.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.followedBy}
              </p>
              {user.bio && (
                <p className="text-xs text-gray-400 truncate mt-1">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Follow Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollowUser(user._id, user.username);
              }}
              disabled={followLoading.has(user._id)}
              className="px-3 py-1.5 bg-[#9fb3df] text-white text-xs font-medium rounded-lg hover:bg-[#8c9cc8] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
            >
              {followLoading.has(user._id) ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <UserPlus className="w-3 h-3" />
              )}
              {followLoading.has(user._id) ? 'Following...' : 'Follow'}
            </button>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {users.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-center text-[#9fb3df] hover:text-[#8c9cc8] font-medium text-sm flex items-center justify-center gap-1 hover:bg-[#9fb3df]/5 rounded-lg transition-all duration-200"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              See More ({users.length - 5} more)
            </>
          )}
        </button>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Fashion Community</p>
          <p className="text-xs text-gray-400">© 2025 Fashion. Connect & Share Style</p>
        </div>
      </div>
    </div>
  );
}