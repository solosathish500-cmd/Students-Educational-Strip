import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          Student Trip
        </Link>

        <div className="navbar-nav ms-auto">

          {/* Home */}
          <Link className="nav-link text-white" to="/">
            Home
          </Link>

          {/* Booking */}
          <Link className="nav-link text-white" to="/booking">
            Booking
          </Link>

          {/* Trip Explorer */}
          <Link className="nav-link text-white" to="/trip-explorer">
            Trip Explorer
          </Link>

          {/* Login */}
          <Link className="nav-link text-white" to="/login">
            Login
          </Link>

          {/* Register */}
          <Link className="nav-link text-white" to="/register">
            Register
          </Link>

          {/* Contact */}
          <Link className="nav-link text-white" to="/contact">
            Contact Us
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;