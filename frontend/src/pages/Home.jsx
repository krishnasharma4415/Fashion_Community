const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="font-bold text-lg">Fashion Platform</div>
        <input
          type="text"
          placeholder="Search"
          className="border px-4 py-2 rounded-lg w-1/3"
        />
        <div className="flex gap-6">
          <span className="cursor-pointer">Home</span>
          <span className="cursor-pointer">Explore</span>
          <span className="cursor-pointer">Notifications</span>
          <span className="cursor-pointer">Profile</span>
        </div>
      </nav>

      {/* Content */}
      <div className="flex p-6">
        {/* Feed */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Post Card */}
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white p-4 shadow-md rounded-lg space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="User"
                    className="rounded-full w-12 h-12"
                  />
                  <span className="font-bold">User Name</span>
                </div>
                <img
                  src="https://via.placeholder.com/500"
                  alt="Post"
                  className="w-full rounded-lg"
                />
                <p>
                  This is a sample caption with #hashtags for a post. ✨
                </p>
                <div className="flex gap-6 text-gray-600">
                  <span>Like</span>
                  <span>Comment</span>
                  <span>Share</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <aside className="w-1/4 pl-6">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="font-bold mb-4">Trending</h3>
            <ul className="space-y-2">
              <li>#FashionGoals</li>
              <li>#OOTD</li>
              <li>#RunwayStyle</li>
              <li>#SustainableFashion</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;
