import { useState } from "react";
import { FaHeart, FaRegComment, FaRegBookmark, FaEllipsisH } from "react-icons/fa";

export default function PostCard() {
  const [showComments, setShowComments] = useState(false);

  const comments = [
    { username: "vanshika_tyagi", text: "Absolutely love this look!" },
    { username: "sona_sarojini", text: "Where did you get this outfit?" },
    { username: "krishna_sharma", text: "🔥🔥 Stunning!" },
  ];

  return (
    <div className="max-w-md mx-auto bg-[#f2ecf9] p-4 rounded-xl shadow-sm mb-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src="https://randomuser.me/api/portraits/women/75.jpg"
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-bold">nafisa_rehmani07</span>
        </div>
        <FaEllipsisH className="text-xl" />
      </div>

      {/* Image */}
      <div className="rounded-xl overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/58/f9/23/58f923e31ce3ecad2d6d544a7244331f.jpg"
          alt="post"
          className="w-full object-cover"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex space-x-4 text-xl">
          <FaHeart className="hover:text-red-500 cursor-pointer" />
          <FaRegComment className="hover:text-blue-500 cursor-pointer" />
        </div>
        <FaRegBookmark className="text-xl cursor-pointer hover:text-gray-600" />
      </div>

      {/* Caption */}
      <div className="mt-2 text-sm px-1">
        <span className="font-bold mr-2">nafisa_rehmani07</span>
        Fashion with leather
        <p className="text-gray-600 text-xs mt-1">...more</p>

        {/* Toggle Comments */}
        <p
          onClick={() => setShowComments((prev) => !prev)}
          className="text-blue-500 text-sm mt-1 cursor-pointer"
        >
          {showComments ? "Hide Comments" : "View all Comments"}
        </p>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-2 space-y-1">
            {comments.map((comment, index) => (
              <p key={index} className="text-sm">
                <span className="font-semibold">{comment.username}</span>{" "}
                {comment.text}
              </p>
            ))}
          </div>
        )}

        <p className="text-gray-400 text-xs mt-1">05 April, 2025</p>
      </div>
    </div>
  );
}
