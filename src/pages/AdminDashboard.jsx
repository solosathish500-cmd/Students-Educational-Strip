import { useEffect, useState } from "react";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("All");
  const [status, setStatus] = useState("All");

  // Fetch bookings for Refresh button
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/bookings"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      setBookings(data);
      setMessage("");
    } catch (error) {
      console.error("Admin dashboard error:", error);
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Load bookings when dashboard opens
  useEffect(() => {
    let cancelled = false;

    const loadBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        if (!cancelled) {
          setBookings(data);
          setMessage("");
          setLoading(false);
        }
      } catch (error) {
        console.error("Admin dashboard error:", error);

        if (!cancelled) {
          setMessage("Unable to connect to backend.");
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  // Search and filter
  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(booking.full_name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(booking.college_name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(booking.email || "")
        .toLowerCase()
        .includes(searchText);

    const matchesDestination =
      destination === "All" ||
      booking.trip_destination === destination;

    const bookingStatus =
      booking.booking_status ||
      booking.status ||
      "Pending";

    const matchesStatus =
      status === "All" ||
      bookingStatus === status;

    return (
      matchesSearch &&
      matchesDestination &&
      matchesStatus
    );
  });

  // Statistics
  const totalBookings = bookings.length;

  const totalStudents = bookings.reduce(
    (total, booking) =>
      total +
      Number(booking.number_of_students || 0),
    0
  );

  const totalRevenue = bookings.reduce(
    (total, booking) =>
      total +
      Number(booking.final_price || 0),
    0
  );

  const pendingBookings = bookings.filter(
    (booking) =>
      (booking.booking_status ||
        booking.status ||
        "Pending") === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) =>
      (booking.booking_status ||
        booking.status) === "Confirmed"
  ).length;

  // Update booking status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      // Update frontend immediately
      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                booking_status: newStatus,
                status: newStatus,
              }
            : booking
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Unable to update booking status.");
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setBookings((previousBookings) =>
        previousBookings.filter(
          (booking) => booking.id !== id
        )
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete booking.");
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5">

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">
          Admin Dashboard
        </h2>

        <p className="text-muted">
          Manage Student Trip Bookings
        </p>
      </div>

      {/* Error Message */}
      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      {/* Statistics */}
      <div className="row g-4 mb-4">

        {/* Total Bookings */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Total Bookings
              </h6>

              <h2 className="text-primary">
                {totalBookings}
              </h2>
            </div>
          </div>
        </div>

        {/* Total Students */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Total Students
              </h6>

              <h2 className="text-success">
                {totalStudents}
              </h2>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Total Revenue
              </h6>

              <h2 className="text-warning">
                ₹
                {totalRevenue.toLocaleString(
                  "en-IN"
                )}
              </h2>
            </div>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Confirmed Bookings
              </h6>

              <h2 className="text-info">
                {confirmedBookings}
              </h2>

              <small className="text-muted">
                Pending: {pendingBookings}
              </small>
            </div>
          </div>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="card shadow mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* Search */}
            <div className="col-md-5">
              <label className="form-label fw-bold">
                Search Student
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Name, college or email"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            {/* Destination */}
            <div className="col-md-3">
              <label className="form-label fw-bold">
                Destination
              </label>

              <select
                className="form-select"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
              >
                <option value="All">
                  All Destinations
                </option>

                <option value="Goa">
                  Goa
                </option>

                <option value="Agra">
                  Agra
                </option>

                <option value="Manali">
                  Manali
                </option>

                <option value="Ooty">
                  Ooty
                </option>

                <option value="Munnar">
                  Munnar
                </option>

                <option value="Ladakh">
                  Ladakh
                </option>
              </select>
            </div>

            {/* Status */}
            <div className="col-md-2">
              <label className="form-label fw-bold">
                Status
              </label>

              <select
                className="form-select"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Refresh */}
            <div className="col-md-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={fetchBookings}
              >
                Refresh
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Booking Table */}
      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            All Student Bookings
          </h5>
        </div>

        <div className="card-body p-0">

          {/* Loading */}
          {loading ? (
            <div className="text-center p-5">
              <h5>
                Loading bookings...
              </h5>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center p-5">
              <h5>
                No bookings found.
              </h5>
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle mb-0">

                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>College</th>
                    <th>Department</th>
                    <th>Destination</th>
                    <th>Date</th>
                    <th>Students</th>
                    <th>Final Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredBookings.map(
                    (booking) => {

                      const currentStatus =
                        booking.booking_status ||
                        booking.status ||
                        "Pending";

                      return (
                        <tr key={booking.id}>

                          {/* ID */}
                          <td>
                            {booking.id}
                          </td>

                          {/* Student */}
                          <td>
                            <strong>
                              {booking.full_name}
                            </strong>

                            <br />

                            <small className="text-muted">
                              {booking.email}
                            </small>
                          </td>

                          {/* College */}
                          <td>
                            {booking.college_name}
                          </td>

                          {/* Department */}
                          <td>
                            {booking.department || "-"}
                          </td>

                          {/* Destination */}
                          <td>
                            <span className="badge bg-info text-dark">
                              {booking.trip_destination}
                            </span>
                          </td>

                          {/* Travel Date */}
                          <td>
                            {booking.travel_date}
                          </td>

                          {/* Number of Students */}
                          <td className="text-center">
                            {booking.number_of_students}
                          </td>

                          {/* Final Price */}
                          <td>
                            <strong>
                              ₹
                              {Number(
                                booking.final_price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </td>

                          {/* Status */}
                          <td>
                            <span
                              className={`badge ${
                                currentStatus ===
                                "Confirmed"
                                  ? "bg-success"
                                  : currentStatus ===
                                    "Cancelled"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {currentStatus}
                            </span>
                          </td>

                          {/* Actions */}
                          <td>

                            <div className="d-flex gap-2">

                              <select
                                className="form-select form-select-sm"
                                value={
                                  currentStatus
                                }
                                onChange={(e) =>
                                  updateStatus(
                                    booking.id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Pending">
                                  Pending
                                </option>

                                <option value="Confirmed">
                                  Confirmed
                                </option>

                                <option value="Cancelled">
                                  Cancelled
                                </option>
                              </select>

                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  deleteBooking(
                                    booking.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;