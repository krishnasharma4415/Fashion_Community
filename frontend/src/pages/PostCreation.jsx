import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api.js";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { 
  Upload, 
  Tag, 
  X, 
  Image as ImageIcon, 
  Camera, 
  Sparkles,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  ArrowLeft
} from "lucide-react";
import { getProfilePictureUrl, getMediaUrl } from "../utils/imageUtils";

const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`border p-2 rounded-md ${className}`} {...props} />
));

const Textarea = ({ className = "", ...props }) => (
  <textarea className={`border p-2 rounded-md ${className}`} {...props} />
);

const Button = ({ className = "", children, ...props }) => (
  <button className={`bg-blue-500 text-white px-4 py-2 rounded-md ${className}`} {...props}>
    {children}
  </button>
);

const NewPost = () => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
      console.log("No authentication token found");
      setErrorMessage("You must be logged in to create a post");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      console.log("Authentication token found");
      setCurrentUser(userData);
    }
  }, [navigate]);

  const handleImageUpload = (files) => {
    if (!files || files.length === 0) return;

    // Validate file types and sizes
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        setErrorMessage("Please select only image files");
        setTimeout(() => setErrorMessage(""), 3000);
        return false;
      }
      
      if (!isValidSize) {
        setErrorMessage("Image size must be less than 10MB");
        setTimeout(() => setErrorMessage(""), 3000);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(validFiles);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const removeImage = (index) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));

    if (previews.length === 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getMediaUrl = (url) => {
    if (url?.startsWith('http')) return url;
    return getApiUrl(url);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || !caption.trim()) {
      setErrorMessage("At least one image and a caption are required.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("media", file);
    });
    formData.append("caption", caption);
    if (tags.trim()) formData.append("tags", tags);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("Using token:", token);

      const response = await axios.post(getApiUrl("/api/posts"), formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      console.log("✅ Post created:", response.data);

      setPreviews([]);
      setCaption("");
      setTags("");
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setSuccessMessage("🎉 Post uploaded successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/explore"); 
      }, 2000);
    } catch (error) {
      console.error("❌ Error uploading post:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 401) {
          setErrorMessage("Your session has expired. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setErrorMessage(error.response.data.message || "Failed to upload post");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        setErrorMessage("No response from server. Please check your connection.");
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f2ecf9]">
      {/* Fixed Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-[#f2ecf9]">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <X className="w-5 h-5" />
              {errorMessage}
            </div>
          )}

          <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Create New Post</h1>
                  <p className="text-gray-600">Share your fashion inspiration</p>
                </div>
              </div>
              
              {previews.length > 0 && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-[#9fb3df] text-white rounded-lg hover:bg-[#8c9cc8] transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              )}
            </div>

            {!showPreview ? (
              /* Creation Mode */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Upload Section */}
                  <div className="lg:w-3/5 bg-gradient-to-br from-[#f2ecf9] to-[#e0d7f9]">
                    <div 
                      className={`h-96 lg:h-[600px] flex flex-col items-center justify-center p-8 border-2 border-dashed transition-all duration-300 ${
                        dragActive 
                          ? 'border-[#9fb3df] bg-[#9fb3df]/10' 
                          : previews.length > 0 
                            ? 'border-transparent' 
                            : 'border-[#e0d7f9] hover:border-[#9fb3df]'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {previews.length > 0 ? (
                        <div className="w-full h-full relative">
                          <div className="grid gap-4 h-full">
                            {previews.map((src, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={src}
                                  alt={`preview-${index}`}
                                  className="w-full h-full object-cover rounded-xl shadow-lg"
                                />
                                <button
                                  onClick={() => removeImage(index)}
                                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  type="button"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-[#9fb3df] px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
                            type="button"
                          >
                            <ImageIcon className="w-4 h-4" />
                            Add More
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full group">
                          <div className="bg-white/80 p-6 rounded-full mb-4 group-hover:bg-white transition-colors">
                            <Upload className="w-12 h-12 text-[#9fb3df]" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Photos</h3>
                          <p className="text-gray-500 text-center mb-4">
                            Drag and drop your images here, or click to browse
                          </p>
                          <div className="bg-[#9fb3df] text-white px-6 py-2 rounded-lg group-hover:bg-[#8c9cc8] transition-colors">
                            Choose Files
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileInputChange}
                            ref={fileInputRef}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Caption and Details Section */}
                  <div className="lg:w-2/5 p-6 flex flex-col">
                    {/* User Info */}
                    {currentUser && (
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <img
                          src={getProfilePictureUrl(currentUser?.profilePicture)}
                          alt="Your profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#e0d7f9]"
                        />
                        <span className="font-semibold text-gray-800">{currentUser.username}</span>
                      </div>
                    )}

                    {/* Caption */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                      <textarea
                        placeholder="Write a caption that captures your style..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        maxLength={3000}
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#9fb3df] focus:border-transparent transition-all"
                      />
                      <div className="text-xs text-right text-gray-500 mt-1">
                        {caption.length}/3000 characters
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-6">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4" />
                        Tags & Mentions
                      </label>
                      <textarea
                        placeholder="Add hashtags and mentions (e.g., #fashion #style @username)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#9fb3df] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(-1)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading || selectedFiles.length === 0 || !caption.trim()}
                        className="flex-1 px-4 py-3 bg-[#9fb3df] text-white rounded-lg hover:bg-[#8c9cc8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        type="button"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Share Post
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Preview Mode */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={getProfilePictureUrl(currentUser?.profilePicture)}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-sm">{currentUser?.username}</span>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                {/* Post Image */}
                {previews[0] && (
                  <div className="aspect-square">
                    <img
                      src={previews[0]}
                      alt="Post preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <Heart className="w-6 h-6 text-gray-700" />
                      <MessageCircle className="w-6 h-6 text-gray-700" />
                      <Share className="w-6 h-6 text-gray-700" />
                    </div>
                    <Bookmark className="w-6 h-6 text-gray-700" />
                  </div>

                  <div className="text-sm font-semibold mb-2">0 likes</div>

                  {caption && (
                    <div className="text-sm">
                      <span className="font-semibold mr-2">{currentUser?.username}</span>
                      {caption}
                    </div>
                  )}

                  {tags && (
                    <div className="text-sm text-[#9fb3df] mt-1">
                      {tags}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">Just now</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;