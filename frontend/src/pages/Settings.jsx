import { useState } from "react";
import { updateUserSettings } from "../services/userService";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserSettings({ email, password });
    alert("Settings updated!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="email" placeholder="New Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-500 text-white p-2">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;
