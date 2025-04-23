import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Upload, Tag } from "lucide-react";

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
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No authentication token found");
      setErrorMessage("You must be logged in to create a post");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      console.log("Authentication token found");
    }
  }, [navigate]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));

    if (previews.length === 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

      const response = await axios.post("http://localhost:5000/api/posts", formData, {
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
    <div className="bg-[#f2ecf9] min-h-screen pt-20">
    <div className="fixed top-0 left-0 w-full z-20">
      <Navbar />
    </div>

    <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 z-10">
      <Sidebar />
    </div>

      
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4 mx-auto max-w-3xl" role="alert"
            style={{ marginTop: '5rem',zIndex: 100  }}
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-auto max-w-3xl" role="alert"
            style={{ marginTop: '5rem',zIndex: 100  }}>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

         <div className="flex justify-center pt-24 pb-10">

          <div className="w-full max-w-6xl bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 h-full flex flex-col gap-2 justify-center items-center border border-gray-300 rounded-lg overflow-auto p-4">
              {previews.length > 0 ? (
                <div className="w-full">
                  {previews.map((src, index) => (
                    <div key={index} className="relative mb-4">
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-[419px] h-[419px] object-cover rounded-md"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 text-sm mt-2"
                    type="button"
                  >
                    Add more photos
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-400">Upload photo(s)</span>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                  
                </div>
                <span className="font-medium"></span>
              </div>

              <Textarea
                placeholder="Write a caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={3000}
                className="h-40 resize-none border-gray-300"
              />
              <div className="text-xs text-right text-gray-500">
                {caption.length}/3000 characters
              </div>

              <div>
                <p className="flex items-center gap-1 text-sm font-medium">
                  <Tag className="w-4 h-4" /> TAG PEOPLE
                </p>
                <Textarea
                  placeholder="Add tags here to get featured (separate with commas)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="h-24 resize-none mt-2 border-gray-300"
                />
              </div>

              <div className="mt-auto flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  type="button"
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default NewPost;