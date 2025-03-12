import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">Join the Fashion Community!</h1>
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-lg rounded-lg w-3/4 space-y-4"
        >
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
            Sign Up
          </button>
          <div className="text-center">
            <p>
              Already have an account?{" "}
              <span className="text-blue-500 cursor-pointer">Login</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
