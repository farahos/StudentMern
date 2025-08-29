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

  // Links navigation oo af-Soomaali ah
  const navLinks = [
    { path: "/dashboard", label: "Warbixin Guud" },
    { path: "/add-student", label: "Kudar Arday" },
    { path: "/view-student", label: "Ardayda Dhammaan" },
    { path: "/attendance", label: "Xaadirinta" },
    { path: "/absent-students", label: "Ardayda Maqan" },
    { path: "/bills", label: "Biilasha" }
  ];

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nidaamka Ardayda</h1>

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
              Ka Bax
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-4 bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm font-semibold transition"
            >
              Soo Gal
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Sidebar;
