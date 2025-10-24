import defaultProfilePic from '../assets/profile-pic.jpg';

/**
 * Get the correct profile picture URL
 * @param {string} profilePicture - The user's profile picture URL from database
 * @returns {string} - The correct URL to display
 */
export const getProfilePictureUrl = (profilePicture) => {
  // If no profile picture is set, return the default
  if (!profilePicture) {
    return defaultProfilePic;
  }
  
  // If it's already a full URL (Cloudinary), return as is
  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }
  
  // If it's a local path, prepend the server URL
  return `${import.meta.env.VITE_API_URL || 'https://fashion-community-backend.onrender.com'}${profilePicture}`;
};

/**
 * Get media URL for any type of media (posts, etc.)
 * @param {string} url - The media URL from database
 * @returns {string} - The correct URL to display
 */
export const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL || 'https://fashion-community-backend.onrender.com'}${url}`;
};