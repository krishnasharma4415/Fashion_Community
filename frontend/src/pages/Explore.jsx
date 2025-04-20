import React from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SearchAndFilters from "../Components/SearchAndFilters";

const filters = ["Summer", "Winter", "Formals", "Traditional"];
const posts = Array.from({ length: 20 }).map((_, i) => ({ id: i }));

export default function ExplorePage() {
  return (
    <div className="bg-[#f2ecf9] h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Visible with collapsible toggle */}
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
  {/* Sticky Header */}
  <div className="sticky top-0 z-20 bg-[#f2ecf9] px-6 pt-4">
    <SearchAndFilters />
  </div>
         <div className="max-w-[1260px] mx-auto">
  {Array.from({ length: Math.ceil(posts.length / 5) }).map((_, groupIdx) => {
    const startIdx = groupIdx * 5;
    const group = posts.slice(startIdx, startIdx + 5);

    const isEven = groupIdx % 2 === 0;

    const squares = group.slice(0, 4);
    const portrait = group[4];

    return (
      <div key={groupIdx} className="flex gap-4 mb-4">
        {isEven ? (
          <>
            {/* Left - 4 squares */}
            <div className="grid grid-cols-2 gap-4">
              {squares.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#f0de79] rounded-md"
                  style={{ width: '419px', height: '419px' }}
                />
              ))}
            </div>

            {/* Right - portrait */}
            {portrait && (
              <div
                className="bg-[#cfc46a] rounded-md"
                style={{ width: '419px', height: '840px' }}
              />
            )}
          </>
        ) : (
          <>
            {/* Left - portrait */}
            {portrait && (
              <div
                className="bg-[#cfc46a] rounded-md"
                style={{ width: '419px', height: '840px' }}
              />
            )}

            {/* Right - 4 squares */}
            <div className="grid grid-cols-2 gap-4">
              {squares.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#cfc46a] rounded-md"
                  style={{ width: '419px', height: '419px' }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  })}
</div>

 {/* Footer */}
 <div className="mt-10 text-center text-sm text-gray-500">
    User Since: Jan 2025 <br />
  © Fashion. 2025 | ver 0.4
  </div>
   </main>
  </div>
  </div>
    
  );
}
