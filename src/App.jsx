import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import TripExplorer from "./pages/TripExplorer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Pages */}
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Booking */}
        <Route
          path="/booking"
          element={<Booking />}
        />

        {/* Payment */}
        <Route
          path="/payment"
          element={<Payment />}
        />

        {/* Booking Confirmation */}
        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />

        {/* Trip Explorer */}
        <Route
          path="/trip-explorer"
          element={<TripExplorer />}
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={<Contact />}
        />

      </Routes>

      {/* Footer ONLY on Home page */}
      {location.pathname === "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;