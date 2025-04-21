const API_BASE = "http://localhost:5000/api";

// Helper function to get the token
const getToken = () => localStorage.getItem("token");

// Auth headers
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

const jsonAuthHeader = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  }
});

// ---------------------- AUTH ----------------------

export const register = async ({ username, email, password }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  };
  
  export const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  };

// ---------------------- POSTS ----------------------

// 📤 Upload post with multiple files
export const createPost = (formData) => {
    return fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}` // Let browser auto-handle multipart boundaries
      },
      body: formData,
    }).then(res => res.json());
  };
  
  // 📄 Get all posts
  export const getAllPosts = () =>
    fetch(`${API_BASE}/posts`).then(res => res.json());
  
  // 📄 Get a single post by ID
  export const getPostById = (postId) =>
    fetch(`${API_BASE}/posts/${postId}`).then(res => res.json());
  
  // 🗑️ Delete a post
  export const deletePost = (postId) =>
    fetch(`${API_BASE}/posts/${postId}`, {
      method: "DELETE",
      ...authHeader(),
    }).then(res => res.json());
  
  // 📤 Upload a single file (e.g., profile pic or temporary media preview)
  export const uploadSingleFile = (file) => {
    const formData = new FormData();
    formData.append("media", file);
  
    return fetch(`${API_BASE}/posts/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData,
    }).then(res => res.json());
  };

// ---------------------- LIKES ----------------------

// Like a post
export const likePost = async (postId) => {
  const res = await fetch(`${API_BASE}/likes/${postId}`, {
    method: "POST",
    ...authHeader(),
  });
  return res.json();
};

// Unlike a post
export const unlikePost = async (postId) => {
  const res = await fetch(`${API_BASE}/likes/${postId}`, {
    method: "DELETE",
    ...authHeader(),
  });
  return res.json();
};

// Get like count of a post
export const getLikeCount = async (postId) => {
  const res = await fetch(`${API_BASE}/likes/${postId}`);
  return res.json(); // returns { likes: number }
};

// ---------------------- COMMENTS ----------------------

export const addComment = async (postId, content) => {
    const res = await fetch(`${API_BASE}/comments/${postId}`, {
      method: "POST",
      headers: authHeader().headers,
      body: JSON.stringify({ content })
    });
    return res.json();
  };
  
  // 🔹 Get all comments for a post
  export const getComments = async (postId) => {
    const res = await fetch(`${API_BASE}/comments/${postId}`);
    return res.json();
  };
  
  // 🔹 Delete a comment
  export const deleteComment = async (commentId) => {
    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return res.json();
  };

// ---------------------- USERS ----------------------

// ✅ Get user by ID
export const getUserById = (userId) =>
    fetch(`${API_BASE}/users/${userId}`).then((res) => res.json());
  
  // ✅ Update user (must match logged-in user)
  export const updateUser = (userId, data) =>
    fetch(`${API_BASE}/users/${userId}`, {
      method: "PUT",
      headers: {
        ...authHeader().headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    }).then(res => res.json());
  
  // ✅ Delete user account
  export const deleteUser = (userId) =>
    fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
      ...authHeader(),
    }).then((res) => res.json());
// ---------------------- FOLLOWS ----------------------

// Follow a user
export const followUser = (userId) =>
    fetch(`${API_BASE}/follows/${userId}`, {
      method: "POST",
      ...authHeader()
    }).then(res => res.json());
  
  // Unfollow a user
  export const unfollowUser = (userId) =>
    fetch(`${API_BASE}/follows/${userId}`, {
      method: "DELETE",
      ...authHeader()
    }).then(res => res.json());
  
  // Get number of followers for a user
  export const getFollowersCount = (userId) =>
    fetch(`${API_BASE}/follows/${userId}/followers`)
      .then(res => res.json());
  
  // Get number of users a user is following
  export const getFollowingCount = (userId) =>
    fetch(`${API_BASE}/follows/${userId}/following`)
      .then(res => res.json());
  

// ---------------------- ADMIN AUTH ----------------------

export const adminLogin = (data) => fetch(`${API_BASE}/admin/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// ---------------------- ADMIN USERS ----------------------

export const getAllUsers = () => fetch(`${API_BASE}/admin/users`, {
  method: "GET",
  ...authHeader(),
}).then(res => res.json());

export const deleteUserAdmin = (userId) =>
    fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "DELETE",
      ...authHeader()
    });

// ---------------------- ADMIN POSTS ----------------------

export const getAllPostsAdmin = () => fetch(`${API_BASE}/admin/posts`, {
  method: "GET",
  ...authHeader()
});

export const deletePostAdmin = (postId) => fetch(`${API_BASE}/admin/posts/${postId}`, {
  method: "DELETE",
  ...authHeader()
});

// ---------------------- ADMIN COMMENTS ----------------------

export const getAllCommentsAdmin = () => fetch(`${API_BASE}/admin/comments`, {
  method: "GET",
  ...authHeader()
});

export const deleteCommentAdmin = (commentId) => fetch(`${API_BASE}/admin/comments/${commentId}`, {
  method: "DELETE",
  ...authHeader()
});

// ---------------------- ADMIN LIKES ----------------------

export const getAllLikesAdmin = () => fetch(`${API_BASE}/admin/likes`, {
  method: "GET",
  ...authHeader()
});

export const deleteLikeAdmin = (likeId) => fetch(`${API_BASE}/admin/likes/${likeId}`, {
  method: "DELETE",
  ...authHeader()
});

// ---------------------- ADMIN STATS ----------------------

export const getAdminStats = () => fetch(`${API_BASE}/admin/stats`, {
  method: "GET",
  ...authHeader()
});

// ---------------------- ADMIN REPORTS ----------------------

export const getAllReports = () => fetch(`${API_BASE}/admin/reports`, {
  method: "GET",
  ...authHeader()
});

export const updateReportStatus = (reportId, status) => fetch(`${API_BASE}/admin/reports/${reportId}`, {
  method: "PUT",
  ...jsonAuthHeader(),
  body: JSON.stringify({ status }),
});
