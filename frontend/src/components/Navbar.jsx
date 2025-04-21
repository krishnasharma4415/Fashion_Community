import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-[#8c9cc8] text-black shadow-md">

      <Link to="/" className="font-bold text-xl">FashionHub</Link>
      <div className="flex gap-6">

      <Link to="/Profile" className="flex items-center gap-2">
          <FaUser /> {/* Icon added here */}
        </Link>
      </div>
    </nav>
  );
}
