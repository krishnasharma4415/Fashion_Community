import { useState, useRef } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [username, setUsername] = useState('rishabh_ranjan_ishwar');
  const [name, setName] = useState('Rishabh Ranjan Ishwar');
  const [bio, setBio] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  );
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (profileImage) {
        formData.append('profilePicture', profileImage);
      }
      formData.append('username', username);
      formData.append('name', name);
      formData.append('bio', bio);

      const token = localStorage.getItem('authToken');
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          Authorization: Bearer ${token},
        },
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="bg-[#f2ecf9] h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">Edit Profile</h2>
            <div className="flex flex-col items-center space-y-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <img
                    src={previewUrl || '/default-avatar.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 mt-2 text-sm hover:underline"
                >
                  Change Profile Picture
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Form Fields */}
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    className="bg-gray-200 text-black px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default EditProfile;
