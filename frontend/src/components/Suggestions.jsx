import { useState } from "react";

export default function Suggestions() {
  const [visibleCount, setVisibleCount] = useState(4); // Show 4 users initially

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
      img: "https://i.pravatar.cc/40?img=6",
      name: "hema_kumar",
      followed: "krishna_sharma + 6 more"
    },
    {
      img: "https://i.pravatar.cc/40?img=7",
      name: "rishabh_ranjan_ishwar",
      followed: "nafisa_rehmani + 10 more"
    }
  ];

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, users.length));
  };

  return (
    <div className="bg-purple-100 p-4 rounded-xl text-sm text-gray-800 w-full max-w-md lg:w-auto">
      <h2 className="font-semibold mb-4 text-lg">People you may know</h2>

      <div className="space-y-4">
        {users.slice(0, visibleCount).map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-3 sm:gap-4 md:gap-5"
          >
            <img
              src={user.img}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="truncate">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {`Followed by ${user.followed}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < users.length && (
        <p
          className="text-center text-gray-600 mt-6 hover:underline cursor-pointer"
          onClick={showMore}
        >
          See More ▾
        </p>
      )}

      <footer className="mt-8 text-xs text-center text-gray-500">
        <p>User Since Jan 2025</p>
        <p>© Fashion. 2025 FROM CSE R</p>
      </footer>
    </div>
  );
}
