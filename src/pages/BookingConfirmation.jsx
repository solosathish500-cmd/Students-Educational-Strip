import { useState } from "react";

function BookingConfirmation() {

  const [booking] = useState(() => {

    const savedBooking =
      localStorage.getItem("latestBooking");

    if (!savedBooking) {
      return null;
    }

    try {
      return JSON.parse(savedBooking);
    } catch (error) {
      console.error(
        "Invalid booking data:",
        error
      );

      return null;
    }
  });

  const handlePrint = () => {
    window.print();
  };

  // ================================
  // NO BOOKING
  // ================================

  if (!booking) {
    return (
      <div className="container mt-5 mb-5">

        <div className="card shadow p-5 text-center">

          <h2 className="text-danger">
            No Booking Found
          </h2>

          <p className="mt-3 text-muted">
            There is no recent booking confirmation
            available.
          </p>

        </div>

      </div>
    );
  }

  // ================================
  // PRICE
  // ================================

  const originalPrice =
    Number(booking.original_price || 0);

  const discountPercent =
    Number(booking.discount_percent || 0);

  const discountAmount =
    Number(booking.discount_amount || 0);

  const finalPrice =
    Number(
      booking.final_price ?? originalPrice
    );

  return (
    <div className="container mt-5 mb-5">

      {/* PRINT */}

      <div className="text-end mb-3 no-print">

        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePrint}
        >
          🖨 Print / Download Confirmation
        </button>

      </div>

      {/* CONFIRMATION */}

      <div
        className="card shadow p-4"
        id="booking-confirmation"
      >

        {/* HEADER */}

        <div className="text-center mb-4">

          <h1 className="text-success fw-bold">
            Booking Confirmed
          </h1>

          <p className="text-muted">
            Your trip booking has been successfully
            confirmed.
          </p>

        </div>

        <hr />

        {/* ================= STUDENT ================= */}

        <h4 className="text-primary mt-4">
          Student Information
        </h4>

        <div className="row mt-3">

          <div className="col-md-6 mb-3">
            <strong>Student Name:</strong>
            <p>{booking.full_name || "N/A"}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>College Name:</strong>
            <p>{booking.college_name || "N/A"}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Department:</strong>
            <p>{booking.department || "N/A"}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Email:</strong>
            <p>{booking.email || "N/A"}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Phone Number:</strong>
            <p>{booking.phone || "N/A"}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Number of Students:</strong>
            <p>
              {booking.number_of_students || 1}
            </p>
          </div>

        </div>

        <hr />

        {/* ================= TRIP ================= */}

        <h4 className="text-primary mt-4">
          Trip Information
        </h4>

        <div className="row mt-3">

          <div className="col-md-6 mb-3">
            <strong>Destination:</strong>
            <p>
              {booking.trip_destination || "N/A"}
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Travel Date:</strong>
            <p>
              {booking.travel_date || "N/A"}
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Trip Duration:</strong>
            <p>
              {booking.duration
                ? `${booking.duration} Days`
                : "N/A"}
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Room & Food:</strong>
            <p>
              {booking.room_food ||
                "Room and food provided"}
            </p>
          </div>

        </div>

        <hr />

        {/* ================= PRICE ================= */}

        <h4 className="text-primary mt-4">
          Price & Discount Information
        </h4>

        <div className="row mt-3">

          <div className="col-md-6 mb-3">

            <strong>Original Price:</strong>

            <p>
              ₹
              {originalPrice.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          <div className="col-md-6 mb-3">

            <strong>Discount:</strong>

            <p className="text-success fw-bold">
              {discountPercent}%
            </p>

          </div>

          <div className="col-md-6 mb-3">

            <strong>Discount Amount:</strong>

            <p className="text-success fw-bold">
              ₹
              {discountAmount.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          <div className="col-md-6 mb-3">

            <strong>Final Price:</strong>

            <h4 className="text-success fw-bold">
              ₹
              {finalPrice.toLocaleString(
                "en-IN"
              )}
            </h4>

          </div>

        </div>

        {/* DISCOUNT MESSAGE */}

        {discountPercent > 0 && (

          <div className="alert alert-success text-center">

            🎉 <strong>Congratulations!</strong>

            <br />

            You received{" "}
            <strong>
              {discountPercent}% discount
            </strong>{" "}
            on your booking.

          </div>

        )}

        {discountPercent === 0 && (

          <div className="alert alert-secondary text-center">

            No discount was applied to this booking.

          </div>

        )}

        <hr />

        {/* ================= PAYMENT ================= */}

        <h4 className="text-primary mt-4">
          Payment Information
        </h4>

        <div className="row mt-3">

          {/* STATUS */}

          <div className="col-md-6 mb-3">

            <strong>Payment Status:</strong>

            <p className="mt-2">

              <span
                className={
                  booking.payment_status === "Paid"
                    ? "badge bg-success"
                    : "badge bg-warning text-dark"
                }
              >
                {booking.payment_status ||
                  "Pending"}
              </span>

            </p>

          </div>

          {/* METHOD */}

          <div className="col-md-6 mb-3">

            <strong>Payment Method:</strong>

            <p>
              {booking.payment_method ||
                "Not selected"}
            </p>

          </div>

          {/* PAYMENT ID */}

          <div className="col-md-6 mb-3">

            <strong>Payment ID:</strong>

            <p>
              {booking.payment_id || "N/A"}
            </p>

          </div>

          {/* BOOKING ID */}

          <div className="col-md-6 mb-3">

            <strong>Booking ID:</strong>

            <p>
              {booking.bookingId || "N/A"}
            </p>

          </div>

        </div>

        <hr />

        {/* THANK YOU */}

        <div className="text-center mt-4">

          <h5 className="text-success fw-bold">
            Thank You for Booking With Student Trip!
          </h5>

          <p className="text-muted">
            We wish you a safe and enjoyable journey.
          </p>

        </div>

      </div>

      {/* PRINT CSS */}

      <style>
        {`
          @media print {

            body {
              background: white !important;
            }

            .no-print {
              display: none !important;
            }

            #booking-confirmation {
              box-shadow: none !important;
              border: none !important;
            }

            .container {
              width: 100% !important;
              max-width: 100% !important;
            }

          }
        `}
      </style>

    </div>
  );
}

export default BookingConfirmation;