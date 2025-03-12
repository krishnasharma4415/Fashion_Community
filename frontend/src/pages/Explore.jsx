const Explore = () => {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Trending Fashion Posts</h1>
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <img
              key={idx}
              src={`https://source.unsplash.com/random/300x300?fashion&sig=${idx}`}
              alt="Fashion Post"
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default Explore;
  