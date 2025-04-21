import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // Backend connection can go here later
    console.log("Post submitted:", { image, caption, tags });
  };

  return (
    <div className="flex min-h-screen bg-[#f6f0fb]">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-60">
        <Navbar />

        <div className="flex justify-center mt-8">
          <div className="w-[1207px] h-[778.11px] bg-white rounded-lg shadow p-4 flex gap-4">
            {/* Image preview or upload */}
            <div className="w-1/2 h-full flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden">
              {image ? (
                <img src={image} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-400">Upload a photo</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Caption and Tags */}
            <div className="w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="avatar"
                  className="rounded-full w-10 h-10"
                />
                <span className="font-medium">krishna_sharma</span>
              </div>

              <Textarea
                placeholder="Write a caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={3000}
                className="h-40 resize-none border-gray-300"
              />

              <div>
                <p className="flex items-center gap-1 text-sm font-medium">
                  <Tag className="w-4 h-4" /> TAG PEOPLE
                </p>
                <Textarea
                  placeholder="Add tags here to get featured"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="h-24 resize-none mt-2 border-gray-300"
                />
              </div>

              <div className="mt-auto flex justify-end">
                <Button onClick={handleSubmit}>Post</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
