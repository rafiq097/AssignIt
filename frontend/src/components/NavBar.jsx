import { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <a href="/">AssignIt</a>
        </div>

        {/* Menu Toggle for Mobile */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
              <Link
                to="/home"
                className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/teams"
                className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Teams
              </Link>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Links for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="text-white hover:text-gray-200">
            Home
          </Link>
          {/* <Link to="/teams" className="text-white hover:text-gray-200">
            Teams
          </Link> */}
          <Link to="/dashboard" className="text-white hover:text-gray-200">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
