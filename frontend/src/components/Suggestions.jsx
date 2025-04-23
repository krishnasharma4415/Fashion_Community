import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Suggestions() {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const users = [
    {
      img: "https://tse1.mm.bing.net/th?id=OIP.Kq8gNRaxp_XMi4Xzb8n57AHaJQ&pid=Api&P=0&h=180",
      name: "rishabh_ranjan_ishwar",
      followed: "nafisa_rehmani + 10 more"
    },
    {
      img: "https://i.pravatar.cc/40?img=2",
      name: "vanshika_tyagi",
      followed: "rishabh_ranjan_ishwar + 10 more"
    },
    {
      img: "https://i.pravatar.cc/40?img=3",
      name: "sona_sarojini",
      followed: "vanshika_tyagi + 13 more"
    },
    {
      img: "https://i.pravatar.cc/40?img=4",
      name: "krishna_sharma",
      followed: "nafisa_rehmani + 11 more"
    },
    {
      img: "https://i.pravatar.cc/40?img=5",
      name: "nafisa_rehmani07",
      followed: "rishabh_ranjan_ishwar + 12 more"
    },
    {
      img: "https://srmap.edu.in/wp-content/uploads/2022/09/hema-kumar-microsite-page-1.jpg",
      name: "hema_kumar",
      followed: "krishna_sharma + 6 more"
    },
    {
      img: "https://i.pravatar.cc/40?img=7",
      name: "shivangi_mishra",
      followed: "sona_sarojini + 8 more"
    },
    {
      img: "https://i.pravatar.cc/40?img=8",
      name: "avinash_singh",
      followed: "krishna_sharma + 9 more"
    },
    {
      img: "https://i.pravatar.cc/40?img=9",
      name: "megha_jain",
      followed: "hema_kumar + 7 more"
    }
  ];

  const handleUserClick = (username) => {
    navigate(`/FollowProfile/${username}`);
  };

  return (
    <div className="bg-purple-100 p-4 rounded-xl text-sm text-gray-800 w-full max-w-md lg:w-auto">
      <h2 className="font-semibold mb-4 text-lg">People you may know</h2>

      <div className="overflow-y-auto space-y-4 pr-1">
        {(showAll ? users : users.slice(0, 5)).map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-3 sm:gap-4 md:gap-5 cursor-pointer"
            onClick={() => handleUserClick(user.name)}
          >
            <img
              src={user.img}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="truncate">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">
                Followed by {user.followed}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!showAll && users.length > 5 && (
        <p
          className="text-center text-gray-600 mt-4 hover:underline cursor-pointer"
          onClick={() => setShowAll(true)}
        >
          See More ▾
        </p>
      )}

      <footer className="mt-6 text-xs text-center text-gray-500">
        <p>User Since Jan 2025</p>
        <p>© Fashion. 2025 FROM CSE R</p>
      </footer>
    </div>
  );
}