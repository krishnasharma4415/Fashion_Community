import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Camera,
  User,
  Mail,
  FileText,
  Save,
  ArrowLeft,
  Upload,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { getProfilePictureUrl } from "../utils/imageUtils";
import "../styles/Profile.css";

const EditProfilePage = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userData, setUserData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user._id;

        if (!token || !userId) {
          navigate("/login");
          return;
        }

        console.log("Testing token:", token);
        const tokenTest = await fetch("http://localhost:5000/api/auth/check-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).catch(err => {
          console.error("Token test failed:", err);
          return { ok: false };
        });

        if (!tokenTest.ok) {
          console.log("Token test failed, redirecting to login");
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch user data: ${errorData.message || response.status}`);
        }

        const data = await response.json();
        console.log("User data fetched:", data);
        setUserData(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setEmail(data.email || "");
        setPreviewUrl(data.profilePicture ? getProfilePictureUrl(data.profilePicture) : getProfilePictureUrl(null));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ text: "Failed to load user data: " + error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);



  const handleFileChange = (file) => {
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setMessage({ text: "Please select an image file", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ text: "Image size must be less than 5MB", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    setProfilePicture(file);
    setIsChanged(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case 'username':
        setUsername(value);
        break;
      case 'bio':
        setBio(value);
        break;
      case 'email':
        setEmail(value);
        break;
    }
    setIsChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio || "");
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      console.log("Submitting form data:", {
        username,
        bio,
        hasProfilePicture: !!profilePicture
      });

      console.log("Token being sent:", token);
      console.log("Token length:", token ? token.length : 0);

      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'profilePicture' ? 'FILE' : pair[1]));
      }

      const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
      console.log("Testing token with user fetch:", userId);
      const userTest = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("User fetch test result:", userTest.status);

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);

        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || "Unknown error";
        } catch (e) {
          errorMessage = errorText || `Error ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Response data:", data);

      setMessage({ text: "Profile updated successfully", type: "success" });

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Trigger custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUser }));

      // Update the preview URL immediately
      if (data.user.profilePicture) {
        setPreviewUrl(data.user.profilePicture);
      }

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: "Error: " + error.message, type: "error" });
    } finally {
      setLoading(false);
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
          {message.text && (
            <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
              }`}>
              {message.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          )}

          <div className="max-w-4xl mx-auto p-6">
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
                  <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
                  <p className="text-gray-600">Update your profile information</p>
                </div>
              </div>

              {showPreview && (
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-[#9fb3df] text-white rounded-lg hover:bg-[#8c9cc8] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Edit
                </button>
              )}
            </div>

            {!showPreview ? (
              /* Edit Mode */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Profile Picture Section */}
                  <div className="lg:w-2/5 bg-gradient-to-br from-[#f2ecf9] to-[#e0d7f9] p-8">
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">Profile Picture</h3>

                      {/* Current Profile Picture */}
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src={previewUrl || getProfilePictureUrl(null)}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Camera Icon Overlay */}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Upload Area */}
                      <div
                        className={`w-full p-6 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${dragActive
                          ? 'border-[#9fb3df] bg-[#9fb3df]/10'
                          : 'border-[#e0d7f9] hover:border-[#9fb3df] hover:bg-[#9fb3df]/5'
                          }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('profile-picture').click()}
                      >
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-[#9fb3df] mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">
                            Drag & drop or click to upload
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG up to 5MB
                          </p>
                        </div>

                        <input
                          type="file"
                          id="profile-picture"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>

                      {/* Preview Button */}
                      {userData && (
                        <button
                          onClick={() => setShowPreview(true)}
                          className="mt-6 px-4 py-2 bg-white text-[#9fb3df] border border-[#9fb3df] rounded-lg hover:bg-[#9fb3df] hover:text-white transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview Profile
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="lg:w-3/5 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Username */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4" />
                          Username
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fb3df] focus:border-transparent transition-all"
                          required
                          minLength="3"
                          maxLength="20"
                          placeholder="Enter your username"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          3-20 characters, letters and numbers only
                        </p>
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                          disabled
                          placeholder="Your email address"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <FileText className="w-4 h-4" />
                          Bio
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9fb3df] focus:border-transparent transition-all resize-none"
                          rows="4"
                          maxLength="150"
                          placeholder="Tell us about yourself..."
                        />
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">
                            Share your fashion style and interests
                          </p>
                          <p className="text-xs text-gray-500">
                            {bio.length}/150
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-6 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => navigate(-1)}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !isChanged}
                          className="flex-1 px-6 py-3 bg-[#9fb3df] text-white rounded-lg hover:bg-[#8c9cc8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              /* Preview Mode */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-[#f2ecf9] to-[#e0d7f9] p-8 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4">
                    <img
                      src={previewUrl || getProfilePictureUrl(null)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{username}</h2>
                  <p className="text-gray-600 text-sm">{email}</p>
                </div>

                {/* Profile Stats */}
                <div className="flex justify-around py-4 border-b border-gray-100">
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800">{userData?.posts || 0}</div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800">{userData?.followers || 0}</div>
                    <div className="text-xs text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-800">{userData?.following || 0}</div>
                    <div className="text-xs text-gray-500">Following</div>
                  </div>
                </div>

                {/* Bio */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {bio || "Fashion enthusiast sharing style inspiration"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage; 