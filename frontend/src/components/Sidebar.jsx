// src/components/Header.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../hooks/useUser";

const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/add-student", label: "Add Student" },
    { path: "/view-student", label: "View Students" },
  ];

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student System</h1>

        <nav className="space-x-4 flex items-center">
          {user && navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-yellow-300 transition duration-200 font-medium ${
                location.pathname === link.path ? "border-b-2 border-yellow-300" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={logout}
              className="ml-4 bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-4 bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm font-semibold transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Sidebar;
