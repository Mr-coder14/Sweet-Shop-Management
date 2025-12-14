import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // 🔹 Public Navbar
  if (!auth || !auth.user) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/home">🍬 SweetShop</Link>
          </div>
          <div className="navbar-links">
            <Link to="/home" className={isActive("/home") ? "active" : ""}>
              Home
            </Link>
            <Link to="/login" className={isActive("/login") ? "active" : ""}>
              Login
            </Link>
            <Link to="/register" className={isActive("/register") ? "active" : ""}>
              Register
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // 🔹 Admin Navbar
  if (auth.user.role === "ADMIN") {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/admin/home">🍬 SweetShop Admin</Link>
          </div>
          <div className="navbar-links">
            <Link to="/admin/home" className={isActive("/admin/home") ? "active" : ""}>
              Admin Home
            </Link>
            <Link to="/admin/manage-sweets" className={isActive("/admin/manage-sweets") ? "active" : ""}>
              Manage Sweets
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // 🔹 User Navbar
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home">🍬 SweetShop</Link>
        </div>
        <div className="navbar-links">
          <Link to="/home" className={isActive("/home") ? "active" : ""}>
            Home
          </Link>
          <Link to="/user/dashboard" className={isActive("/user/dashboard") ? "active" : ""}>
            Dashboard
          </Link>
          <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
            Profile
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;