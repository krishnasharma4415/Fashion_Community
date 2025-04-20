import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Suggestions from "../Components/Suggestions";
import UpdateCard from "../Components/UpdateCard";


const Updates = () => {
  const [activeTab, setActiveTab] = useState("followers");

  return (
    <div className="h-screen flex flex-col bg-[#f2ecf9]">
      {/* Sticky Navbar at top */}
      <div className="sticky top-0 z-50 bg-[#f2ecf9]">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - sticky and full height */}
        <div className="w-[220px] bg-[#f2ecf9] sticky top-[64px] h-[calc(100vh-64px)]">
          <Sidebar />
        </div>

        {/* Scrollable main content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-[#f2ecf9]">
          {/* Tabs */}
          <div className="flex justify-center sticky top-0 z-40 bg-[#f2ecf9] pt-2 pb-4">
            <div className="flex gap-6 border-b border-gray-300">
              {["all", "mentions", "followers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-black font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Update Timeline (Replace with backend mapped data) */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 font-semibold">TODAY</p>
              {[...Array(5)].map((_, i) => (
                <UpdateCard
                  key={`today-${i}`}
                  username="rishabh_ranjan_ishwar"
                  message="has liked your post"
                  />
                  ))}
                  </div>
                
                  <div>
             <p className="text-sm text-gray-600 font-semibold">YESTERDAY</p>
              {[...Array(3)].map((_, i) => (
              <UpdateCard
               key={`yesterday-${i}`}
               username="rishabh_ranjan_ishwar"
               message="has liked your post"
              />
             ))}
             </div>

             <div>
    <p className="text-sm text-gray-600 font-semibold">EARLIER</p>
    {[...Array(4)].map((_, i) => (
      <UpdateCard
        key={`earlier-${i}`}
        username="rishabh_ranjan_ishwar"
        message="has liked your post"
      />
    ))}
  </div>
          </div>
        </div>

        {/* Suggestions - sticky and full height */}
        <div className="w-[280px] bg-[#f2ecf9] sticky top-[64px] h-[calc(100vh-64px)]">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Updates;
