const PostCard = ({ username, userImg, postImg, caption }) => {
    return (
      <div className="bg-white p-4 shadow-md rounded-lg space-y-4">
        <div className="flex items-center gap-4">
          <img src={userImg} alt="User" className="rounded-full w-12 h-12" />
          <span className="font-bold">{username}</span>
        </div>
        <img src={postImg} alt="Post" className="w-full rounded-lg" />
        <p>{caption}</p>
        <div className="flex gap-6 text-gray-600">
          <span>Like</span>
          <span>Comment</span>
          <span>Share</span>
        </div>
      </div>
    );
  };
  
  export default PostCard;
  