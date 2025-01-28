const Profile = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md p-6 flex items-center justify-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="rounded-full w-24 h-24"
        />
        <div className="ml-6">
          <h1 className="text-2xl font-bold">User Name</h1>
          <p>Fashion Enthusiast | Stylist</p>
          <div className="flex gap-6 mt-2">
            <div>
              <span className="font-bold">200</span> Followers
            </div>
            <div>
              <span className="font-bold">180</span> Following
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold">Posts</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[...Array(6)].map((_, idx) => (
            <img
              key={idx}
              src="https://via.placeholder.com/200"
              alt="Post"
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
