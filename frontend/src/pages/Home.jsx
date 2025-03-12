import PostCard from "../components/PostCard";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex p-6">
        <div className="flex-1 space-y-6">
          {[...Array(5)].map((_, idx) => (
            <PostCard
              key={idx}
              username="User Name"
              userImg="https://via.placeholder.com/50"
              postImg="https://via.placeholder.com/500"
              caption="This is a sample caption with #hashtags for a post. ✨"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
