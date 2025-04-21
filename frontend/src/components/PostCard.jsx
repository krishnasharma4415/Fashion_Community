import { useState } from "react";
import { FaHeart, FaRegComment, FaRegBookmark, FaEllipsisH } from "react-icons/fa";

export default function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);

  const comments = post?.comments || [
    { username: "vanshika_tyagi", text: "Absolutely love this look!" },
    { username: "sona_sarojini", text: "Where did you get this outfit?" },
    { username: "krishna_sharma", text: "🔥🔥 Stunning!" },
  ];

  const userImage = post?.user?.profileImage || "https://randomuser.me/api/portraits/women/75.jpg";
  const username = post?.user?.username || "nafisa_rehmani07";
  const postImage = post?.imageUrl || "https://i.pinimg.com/736x/58/f9/23/58f923e31ce3ecad2d6d544a7244331f.jpg";
  const caption = post?.caption || "Fashion with leather";
  const createdAt = post?.createdAt || "05 April, 2025";

  return (
    <div className="max-w-md mx-auto bg-[#f2ecf9] p-4 rounded-xl shadow-sm mb-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={userImage}
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-bold">{username}</span>
        </div>
        <FaEllipsisH className="text-xl cursor-pointer" />
      </div>

      {/* Post Image */}
      <div className="rounded-xl overflow-hidden">
        <img
          src={postImage}
          alt="post"
          className="w-full object-cover"
        />
      </div>

      {/* Interaction Icons */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex space-x-4 text-xl">
          <FaHeart className="hover:text-red-500 cursor-pointer" />
          <FaRegComment
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => setShowComments((prev) => !prev)}
          />
        </div>
        <FaRegBookmark className="text-xl cursor-pointer hover:text-gray-600" />
      </div>

      {/* Caption & Comments */}
      <div className="mt-2 text-sm px-1">
        <span className="font-bold mr-2">{username}</span>
        {caption}

        {/* Toggle Comments */}
        {comments.length > 0 && (
          <p
            onClick={() => setShowComments((prev) => !prev)}
            className="text-blue-500 text-sm mt-1 cursor-pointer"
          >
            {showComments ? "Hide Comments" : `View all ${comments.length} Comments`}
          </p>
        )}

        {/* Comments List */}
        {showComments && (
          <div className="mt-2 space-y-1">
            {comments.map((comment, index) => (
              <p key={index} className="text-sm">
                <span className="font-semibold">{comment.username}</span> {comment.text}
              </p>
            ))}
          </div>
        )}

        <p className="text-gray-400 text-xs mt-1">{createdAt}</p>
      </div>
    </div>
  );
}
