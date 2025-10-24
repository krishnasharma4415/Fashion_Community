import { API_BASE_URL } from '../config/api.js';

const API_BASE = `${API_BASE_URL}/api`;

const getToken = () => localStorage.getItem("authToken");

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

export const createPost = (formData) => {
    return fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}` 
      },
      body: formData,
    }).then(res => res.json());
  };
  
  export const getAllPosts = () =>
    fetch(`${API_BASE}/posts`).then(res => res.json());
  
  export const getPostById = (postId) =>
    fetch(`${API_BASE}/posts/${postId}`).then(res => res.json());

  export const getPostsByUserId = (userId) =>
    fetch(`${API_BASE}/posts/user/${userId}`).then((res) => res.json());
  
  export const deletePost = (postId) =>
    fetch(`${API_BASE}/posts/${postId}`, {
      method: "DELETE",
      ...authHeader(),
    }).then(res => res.json());
  
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

export const likePost = async (postId) => {
  const res = await fetch(`${API_BASE}/likes/${postId}`, {
    method: "POST",
    ...authHeader(),
  });
  return res.json();
};

export const unlikePost = async (postId) => {
  const res = await fetch(`${API_BASE}/likes/${postId}`, {
    method: "DELETE",
    ...authHeader(),
  });
  return res.json();
};

export const getLikeCount = async (postId) => {
  const res = await fetch(`${API_BASE}/likes/${postId}`);
  return res.json(); 
};

// ---------------------- COMMENTS ----------------------

export const addComment = async (postId, content) => {
    const res = await fetch(`${API_BASE}/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ content })
    });
    return res.json();
  };
  
  export const getComments = async (postId) => {
    const res = await fetch(`${API_BASE}/comments/${postId}`);
    return res.json();
  };
  
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

export const getUserById = (userId) =>
    fetch(`${API_BASE}/users/${userId}`).then((res) => res.json());
  
  export const updateUser = (userId, data) =>
    fetch(`${API_BASE}/users/${userId}`, {
      method: "PUT",
      headers: {
        ...authHeader().headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    }).then(res => res.json());
  
  export const deleteUser = (userId) =>
    fetch(`${API_BASE}/users/${userId}`, {
      method: "DELETE",
      ...authHeader(),
    }).then((res) => res.json());
// ---------------------- FOLLOWS ----------------------

export const followUser = (userId) =>
    fetch(`${API_BASE}/follows/${userId}`, {
      method: "POST",
      ...authHeader()
    }).then(res => res.json());
  
  export const unfollowUser = (userId) =>
    fetch(`${API_BASE}/follows/${userId}`, {
      method: "DELETE",
      ...authHeader()
    }).then(res => res.json());
  
  export const getFollowersCount = (userId) =>
    fetch(`${API_BASE}/follows/${userId}/followers`)
      .then(res => res.json());
  
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
