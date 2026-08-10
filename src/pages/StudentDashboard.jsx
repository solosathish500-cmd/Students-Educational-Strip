import { useEffect, useState } from "react";

function StudentDashboard() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch booking");
        }

        return response.json();
      })
      .then((data) => {
        // Backend returns an array of bookings
        if (data.length > 0) {
          setBooking(data[0]);
        } else {
          setMessage("No booking found.");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
        setMessage("Unable to connect to backend.");
        setLoading(false);
      });
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading dashboard...</h4>
      </div>
    );
  }

  // No booking
  if (!booking) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          {message || "No booking found."}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">

      {/* Dashboard Heading */}
      <div className="text-center mb-4">
        <h2 className="text-success">
          Student Dashboard
        </h2>

        <p className="text-muted">
          View your trip booking details
        </p>
      </div>

      {/* Student Information */}
      <div className="card shadow mb-4">

        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            Student Information
          </h5>
        </div>

        <div className="card-body">

          <div className="row">

            <div className="col-md-6 mb-3">
              <strong>Student Name</strong>
              <p className="mb-0">
                {booking.full_name}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>College Name</strong>
              <p className="mb-0">
                {booking.college_name}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Department</strong>
              <p className="mb-0">
                {booking.department}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Email</strong>
              <p className="mb-0">
                {booking.email}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Phone Number</strong>
              <p className="mb-0">
                {booking.phone}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Trip Information */}
      <div className="card shadow mb-4">

        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            Trip Information
          </h5>
        </div>

        <div className="card-body">

          <div className="row">

            <div className="col-md-6 mb-3">
              <strong>Destination</strong>
              <p className="mb-0">
                {booking.trip_destination}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Travel Date</strong>
              <p className="mb-0">
                {booking.travel_date}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Number of Students</strong>
              <p className="mb-0">
                {booking.number_of_students}
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Room</strong>
              <p className="mb-0 text-success">
                ✓ Included
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Food</strong>
              <p className="mb-0 text-success">
                ✓ Included
              </p>
            </div>

            <div className="col-md-6 mb-3">
              <strong>Booking Status</strong>
              <p className="mb-0">
                <span className="badge bg-success">
                  {booking.payment_status || "Pending"}
                </span>
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Price Information */}
      <div className="card shadow mb-4">

        <div className="card-header bg-warning">
          <h5 className="mb-0">
            Payment Details
          </h5>
        </div>

        <div className="card-body">

          <div className="row mb-3">

            <div className="col-6">
              Original Price
            </div>

            <div className="col-6 text-end fw-bold">
              ₹
              {Number(
                booking.original_price || 0
              ).toLocaleString("en-IN")}
            </div>

          </div>

          <div className="row mb-3">

            <div className="col-6">
              Discount
            </div>

            <div className="col-6 text-end text-success fw-bold">
              - ₹
              {Number(
                booking.discount_amount || 0
              ).toLocaleString("en-IN")}
            </div>

          </div>

          <hr />

          <div className="row">

            <div className="col-6">
              <strong className="fs-5">
                Final Price
              </strong>
            </div>

            <div className="col-6 text-end">
              <strong className="fs-5 text-success">
                ₹
                {Number(
                  booking.final_price || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </div>
      </div>

      {/* Booking Status */}
      <div className="card shadow">

        <div className="card-body text-center">

          <h5>
            Booking Status
          </h5>

          <span className="badge bg-success fs-6 px-4 py-2">
            Booking Confirmed
          </span>

          <p className="text-muted mt-3 mb-0">
            Thank you for booking your educational trip with us.
          </p>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;