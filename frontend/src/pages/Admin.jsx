import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaFlag, FaBell, FaBars } from "react-icons/fa";
import logo from "../assets/logo.png";

const statsData = {
  totalUsers: 25,
  totalPosts: 25,
  flaggedPosts: 2,
  activeUsers: 13
};

const recentUsers = [
  { id: 1, name: "rishabh_ranjan_ishwar", joinedTime: "2m ago", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
  { id: 2, name: "vanshika_tyagi", joinedTime: "2m ago", avatar: "https://randomuser.me/api/portraits/women/67.jpg" },
  { id: 3, name: "sona_sarojini", joinedTime: "2m ago", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
  { id: 4, name: "krishna_sharma", joinedTime: "2m ago", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 5, name: "nafisa_rehmani07", joinedTime: "2m ago", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
  { id: 6, name: "hema_kumar", joinedTime: "2m ago", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 7, name: "rishabh_ranjan_ishwar", joinedTime: "2m ago", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
];

const Admin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchRecentUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = await res.json();
        setRecentUsers(users.slice(-7).reverse()); 
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchStats();
    fetchRecentUsers();
  }, []);

  const chartData = {
    dates: ["15 Apr", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "21 Apr"],
  };

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/admin" },
    { icon: <FaUsers />, label: "Users", path: "/admin/users" },
    { icon: <FaFlag />, label: "Flagged Post", path: "/admin/flagged" },
    { icon: <FaBell />, label: "Updates", path: "/admin/updates" },
  ];

  return (
    <div className="flex h-screen bg-[#E9E8EF]">
      <div
        className={`fixed top-0 left-0 h-full bg-[#E9E8EF] text-black z-40 transition-all duration-300 ease-in-out
        ${isOpen ? "w-48" : "w-0"} 
        md:static md:flex md:flex-col md:w-48 
        overflow-hidden md:overflow-visible`}
        role="navigation"
      >
        <div className="p-4 flex justify-center">
          <img 
            src={logo} 
            alt="Fashion Community" 
            className="h-8 w-auto"
          />
        </div>

        <div className="flex flex-col items-start py-8 px-4 space-y-6 flex-grow">
          {navItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`flex items-center space-x-4 hover:text-purple-600 cursor-pointer
                ${item.label === "Dashboard" ? "bg-white rounded-md p-2 w-full" : ""}`}
            >
              <div className="text-xl">{item.icon}</div>
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="md:hidden p-4 flex justify-center items-center">
          <button onClick={toggleSidebar} aria-label="Toggle sidebar" className="text-2xl">
            <FaBars />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-end mb-4">
          <div className="bg-black text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <h1 className="font-bold text-2xl mb-6">Dashboard</h1>

        Stats cards row
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#e2e2da] rounded-lg p-4 shadow-sm">
            <p className="text-center font-semibold mb-2">Total Users</p>
            <p className="text-4xl font-bold text-center">{stats.userCount || 0}</p>
          </div>
          <div className="bg-[#e2e2da] rounded-lg p-4 shadow-sm">
            <p className="text-center font-semibold mb-2">Total Posts</p>
            <p className="text-4xl font-bold text-center">{stats.postCount || 0}</p>
          </div>
          <div className="bg-[#e2e2da] rounded-lg p-4 shadow-sm">
            <p className="text-center font-semibold mb-2">Comments</p>
            <p className="text-4xl font-bold text-center">{stats.commentCount || 0}</p>
          </div>
          <div className="bg-[#e2e2da] rounded-lg p-4 shadow-sm">
            <p className="text-center font-semibold mb-2">Likes</p>
            <p className="text-4xl font-bold text-center">{stats.likeCount || 0}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">New Users Joined</h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-600">{chartData.dates[0]} - {chartData.dates[chartData.dates.length - 1]}</span>
                <button className="ml-2 bg-white p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-[#e2e2da] rounded-lg p-4 h-72">
              <svg viewBox="0 0 800 300" className="w-full h-full">
                <path
                  d="M0,200 C50,150 100,250 150,200 C200,150 250,180 300,120 C350,60 400,120 450,150 C500,180 550,90 600,120 C650,150 700,250 750,200 L750,300 L0,300 Z"
                  fill="rgba(100, 149, 237, 0.3)"
                  strokeWidth="2"
                  stroke="#6495ED"
                />
                <path
                  d="M0,200 C50,150 100,250 150,200 C200,150 250,180 300,120 C350,60 400,120 450,150 C500,180 550,90 600,120 C650,150 700,250 750,200"
                  fill="none"
                  strokeWidth="3"
                  stroke="#6495ED"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="0" cy="200" r="5" fill="#6495ED" />
                <circle cx="150" cy="200" r="5" fill="#6495ED" />
                <circle cx="300" cy="120" r="5" fill="#6495ED" />
                <circle cx="450" cy="150" r="5" fill="#6495ED" />
                <circle cx="600" cy="120" r="5" fill="#6495ED" />
                <circle cx="750" cy="200" r="5" fill="#6495ED" />
              </svg>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <h2 className="font-semibold mb-3">Recent Users</h2>
            <div className="bg-[#e2e2da] rounded-lg p-4">
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user.profilePicture || "https://i.pravatar.cc/150?img=12"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="text-sm">{user.username}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;