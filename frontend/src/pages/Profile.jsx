const Profile = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <>
      <div className="pt-16 p-4 text-center">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p>Posts will be displayed here.</p>
      </div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">Logout</button>
    </>
  );
};

export default Profile;