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
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/booking" element={<Booking />} />

        <Route path="/payment" element={<Payment />} />

        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />

        <Route path="/trip-explorer" element={<TripExplorer />} />

        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* Footer only on Home page */}
      {location.pathname === "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/Students-Educational-Strip">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;