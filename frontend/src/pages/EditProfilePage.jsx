import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

const EditProfilePage = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch current user data
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

        // Test token with backend - see if it's valid
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

        // Fetch user data by ID
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
        setPreviewUrl(data.profilePicture ? `http://localhost:5000${data.profilePicture}` : "");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ text: "Failed to load user data: " + error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
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

      // Create the FormData object
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

      // Debug token
      console.log("Token being sent:", token);
      console.log("Token length:", token ? token.length : 0);
      
      // Log the FormData entries for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'profilePicture' ? 'FILE' : pair[1]));
      }
      
      // Direct fetch to user by ID to verify token works
      const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
      console.log("Testing token with user fetch:", userId);
      const userTest = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("User fetch test result:", userTest.status);

      // Update profile using PUT request
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

      // Success!
      setMessage({ text: "Profile updated successfully", type: "success" });
      
      // Update local storage user data
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Redirect after a short delay
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
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto bg-[#f2ecf9] min-h-screen">
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

            {message.text && (
              <div className={`p-3 rounded mb-4 ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={previewUrl || "https://via.placeholder.com/150"}
                    alt="Profile Preview"
                    className="w-full h-full rounded-full object-cover border-2 border-purple-200"
                  />
                  <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                      <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <label htmlFor="profile-picture" className="text-purple-600 cursor-pointer">
                  Change Profile Picture
                </label>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  minLength="3"
                  maxLength="20"
                />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  maxLength="150"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">{bio ? bio.length : 0}/150 characters</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    loading ? "bg-purple-300" : "bg-purple-600 hover:bg-purple-700"
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage; 