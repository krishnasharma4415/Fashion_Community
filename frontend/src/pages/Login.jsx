const Login = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side */}
      <div className="w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">Join the Fashion Community!</h1>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <form className="bg-white p-8 shadow-lg rounded-lg w-3/4 space-y-4">
          <h2 className="text-2xl font-bold">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-md"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
            Login
          </button>
          <div className="text-center">
            <p>Don't have an account? <span className="text-blue-500 cursor-pointer">Sign Up</span></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
