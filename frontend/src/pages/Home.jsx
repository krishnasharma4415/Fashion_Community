import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import PostCard from "../Components/PostCard";
import Suggestions from "../Components/Suggestions";


export default function Home() {
  return (
    <div className="bg-[#f2ecf9] h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Visible with collapsible toggle */}
        <Sidebar />

        {/* Post Feed - Scrollable Middle */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </div>

        {/* Suggestions - Sticky Right (optional on mobile) */}
        <div className="hidden lg:block sticky top-0 h-full w-[250px]">
          <Suggestions />
        </div>
      </div>
    </div>
  );
}
