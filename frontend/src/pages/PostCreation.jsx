const PostCreation = () => {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <form className="bg-white p-8 shadow-lg rounded-lg space-y-4 w-1/2">
          <h1 className="text-2xl font-bold">Create a New Post</h1>
          <input type="file" className="w-full border p-2 rounded-md" />
          <textarea
            placeholder="Write a caption..."
            className="w-full border p-2 rounded-md h-24"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Post
          </button>
        </form>
      </div>
    );
  };
  
  export default PostCreation;
  