import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import "../styles/Profile.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = Array.from({ length: 9 }, (_, i) => ({
    id: `post-${i + 1}`,
    imageUrl: `https://via.placeholder.com/300?text=Post+${i + 1}`,
    likes: 120 + i * 5,
    comments: 30 + i * 2
  }));

  const openPost = (post) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="h-full bg-[#f3e8ff]">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f2ecf9] min-h-screen">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <img
                src="https://i.pinimg.com/736x/83/05/bc/8305bcc8d0e550be62f69b111635b7f5.jpg"
                alt="Profile"
                className="avatar-img"
              />
            </div>
            <div className="profile-info">
              <h1 className="username">Gigi_Hadid</h1>
              <button className="edit-profile-btn">Edit Profile</button>
              <div className="profile-stats">
                <span><strong>{posts.length}</strong> posts</span>
                <span><strong>1,200</strong> followers</span>
                <span><strong>300</strong> following</span>
              </div>
              <p className="bio">Fashion Enthusiast | Blogger ✨ #StyleInspo</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs mt-6">
            <button
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              <i className="fas fa-th"></i> POSTS
            </button>
            <button
              className={`tab ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              <i className="fas fa-bookmark"></i> SAVED
            </button>
          </div>

          {/* Posts Grid */}
          <div className="posts-grid mt-4">
            {posts.map((post) => (
              <div key={post.id} className="post-item" onClick={() => openPost(post)}>
                <img src={post.imageUrl} alt={`Post ${post.id}`} />
                <div className="post-overlay">
                  <span><i className="fas fa-heart"></i> {post.likes}</span>
                  <span><i className="fas fa-comment"></i> {post.comments}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Post Modal */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-4 max-w-lg w-full relative shadow-lg">
                <button
                  onClick={closePost}
                  className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                >
                  &times;
                </button>
                <img
                  src={selectedPost.imageUrl}
                  alt="Full Post"
                  className="w-full rounded-lg object-cover"
                />
                <div className="mt-4 text-sm">
                  <p><i className="fas fa-heart text-red-500"></i> {selectedPost.likes} likes</p>
                  <p><i className="fas fa-comment text-blue-400"></i> {selectedPost.comments} comments</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// import React, { useState } from "react";
// import Navbar from "../Components/Navbar"; // adjust path as needed
// import Sidebar from "../Components/Sidebar"; // adjust path as needed
// import "../styles/Profile.css";

// const ProfilePage = () => {
//   const [activeTab, setActiveTab] = useState("posts");

//   const posts = Array.from({ length: 9 }, (_, i) => ({
//     id: `post-${i + 1}`,
//     imageUrl: `https://via.placeholder.com/300?text=Post+${i + 1}`,
//     likes: 120,
//     comments: 30
//   }));

//   return (
    
//     <div className="h-screen flex flex-col">
//   {/* Navbar at the top */}
//   <div className="sticky top-0 z-50 bg-white shadow-md">
//     <Navbar />
//   </div>

//   {/* Main content with sidebar + profile */}
//   <div className="flex flex-1 overflow-hidden">
//     <div className="h-full bg-[#f3e8ff]">
//       <Sidebar />
//     </div>

//     <div className="flex-1 overflow-y-auto bg-[#f2ecf9] min-h-screen">
//       {/* Profile content stays here */}
//           {/* Header Section */}
//           <div className="profile-header">
//             <div className="profile-avatar">
//               <img
//                 src="https://i.pinimg.com/736x/83/05/bc/8305bcc8d0e550be62f69b111635b7f5.jpg"
//                 alt="Profile"
//                 className="avatar-img"
//               />
//             </div>
//             <div className="profile-info">
//               <h1 className="username">Gigi_Hadid</h1>
//               <button className="edit-profile-btn">Edit Profile</button>
//               <div className="profile-stats">
//                 <span><strong>{posts.length}</strong> posts</span>
//                 <span><strong>1,200</strong> followers</span>
//                 <span><strong>300</strong> following</span>
//               </div>
//               <p className="bio">Fashion Enthusiast | Blogger ✨ #StyleInspo</p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="profile-tabs mt-6">
//             <button
//               className={`tab ${activeTab === "posts" ? "active" : ""}`}
//               onClick={() => setActiveTab("posts")}
//             >
//               <i className="fas fa-th"></i> POSTS
//             </button>
//             <button
//               className={`tab ${activeTab === "saved" ? "active" : ""}`}
//               onClick={() => setActiveTab("saved")}
//             >
//               <i className="fas fa-bookmark"></i> SAVED
//             </button>
//           </div>

//           {/* Posts Grid */}
//           <div className="posts-grid mt-4">
//             {posts.map((post) => (
//               <div key={post.id} className="post-item">
//                 <img
//                   src={post.imageUrl}
//                   alt={`Post ${post.id}`}
//                 />
//                 <div className="post-overlay">
//                   <span><i className="fas fa-heart"></i> {post.likes}</span>
//                   <span><i className="fas fa-comment"></i> {post.comments}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


