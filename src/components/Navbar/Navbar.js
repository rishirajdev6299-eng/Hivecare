import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
 // console.log("Navbar User:", user);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setMenuOpen(false);
    alert("Logged out successfully!");
    navigate("/login");
  };
  
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/services?search=${searchTerm}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-brand">
        <img
          src={logo}
          alt="Hive Care Logo"
          className="logo"
        />

        <Link
          to="/"
          className="brand-text"
        >
          Hive Care
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <div
        className={`navbar-links ${menuOpen ? "active" : ""
          }`}
      >
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

        <Link to="/services"onClick={() => setMenuOpen(false)}>
          Services
        </Link>

        <Link to="/history" onClick={() => setMenuOpen(false)}>
          My Bookings
        </Link>

        {user ? (
          <>
 <div className="user-section">
  <span className="user-name">
    <i className="bi bi-person-circle"></i> {user.name}
  </span>

  <button
    className="btn btn-danger logout-btn"
    onClick={handleLogout}
  >
    <i className="bi bi-power"></i> 
  </button>
</div>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>

            <Link to="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;