import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
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
    <>
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
 <div className="profile-container">

  <button
    className="profile-btn"
    onClick={() => {setShowProfile(!showProfile); setMenuOpen(false)}}
  >
    <i className="bi bi-person-circle"></i>
    {user.name}
    <i className="bi bi-caret-down-fill ms-2"></i>
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
    {user && showProfile && (
    <div className="profile-dropdown">

     <div className="profile-info">

  

  <p className="mb-3">
    <i className="bi bi-envelope-fill me-2 text-primary"></i>
    <strong>Email:</strong><br />
    {user.email}
  </p>

  <p className="mb-3">
    <i className="bi bi-telephone-fill me-2 text-success"></i>
    <strong>Phone:</strong><br />
    {user.phone}
  </p>

  <p className="mb-3">
    <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
    <strong>Address:</strong><br />
    {user.address}
  </p>

</div>

      <hr />

      <Link
        to="/profile"
        onClick={() => setShowProfile(false)}
      >
        Edit Profile
      </Link>

      <button
        onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-right"></i>
        {" "}
        Logout
      </button>
       <button
      className="btn btn-secondary mt-3"
      onClick={() => setShowProfile(false)}
    >
      Close
    </button>

    </div>
  )}
    </>
  );
}

export default Navbar;