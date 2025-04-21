import React from "react";

const UpdateCard = ({ username, message }) => {
  return (
    <div className="flex items-center bg-white shadow rounded-md p-3 mt-2">
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
      <p className="text-sm">
        <span className="font-medium">{username}</span> {message}
      </p>
    </div>
  );
};

export default UpdateCard;
