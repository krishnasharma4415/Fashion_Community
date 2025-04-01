import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../services/userService";

const EditProfile = () => {
  const [user, setUser] = useState({ username: "", bio: "" });

  useEffect(() => {
    async function fetchProfile() {
      const data = await getUserProfile();
      setUser(data);
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(user);
    alert("Profile updated!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" name="username" value={user.username} onChange={handleChange} />
        <textarea name="bio" value={user.bio} onChange={handleChange} />
        <button type="submit" className="bg-green-500 text-white p-2">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
