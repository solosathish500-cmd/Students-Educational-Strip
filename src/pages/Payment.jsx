import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState(() => {
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

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [upiId, setUpiId] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [cardName, setCardName] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  // =====================================================
  // NO BOOKING
  // =====================================================

  if (!booking) {
    return (
      <div className="container mt-5 mb-5">
        <div className="card shadow p-5 text-center">

          <h2 className="text-danger">
            No Booking Found
          </h2>

          <p className="text-muted mt-3">
            Please complete a booking before making
            a payment.
          </p>

          <button
            className="btn btn-success mt-3"
            onClick={() => navigate("/booking")}
          >
            Go to Booking
          </button>

        </div>
      </div>
    );
  }

  const finalPrice =
    Number(booking.final_price) || 0;

  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment = (e) => {
    e.preventDefault();

    setMessage("");

    // Check payment method
    if (!paymentMethod) {
      setMessage(
        "Please select a payment method."
      );

      return;
    }

    // UPI validation
    if (paymentMethod === "UPI") {
      if (!upiId.trim()) {
        setMessage(
          "Please enter your UPI ID."
        );

        return;
      }
    }

    // Card validation
    if (paymentMethod === "Card") {
      if (
        !cardNumber.trim() ||
        !cardName.trim() ||
        !expiry.trim() ||
        !cvv.trim()
      ) {
        setMessage(
          "Please fill all card details."
        );

        return;
      }

      if (cardNumber.length < 12) {
        setMessage(
          "Please enter a valid card number."
        );

        return;
      }

      if (cvv.length < 3) {
        setMessage(
          "Please enter a valid CVV."
        );

        return;
      }
    }

    // =================================================
    // PROCESS PAYMENT
    // =================================================

    setProcessing(true);
    setMessage(
      "Processing payment..."
    );

    setTimeout(() => {

      const updatedBooking = {
        ...booking,

        payment_status:
          paymentMethod === "Cash"
            ? "Pay Later"
            : "Paid",

        payment_method:
          paymentMethod,

        payment_id:
          "PAY" +
          Date.now(),

      };

      // Save updated booking
      localStorage.setItem(
        "latestBooking",
        JSON.stringify(updatedBooking)
      );

      setBooking(updatedBooking);

      setProcessing(false);

      // Go confirmation
      navigate(
        "/booking-confirmation"
      );

    }, 1500);
  };

  return (
    <div
      className="container-fluid bg-light py-5"
      style={{ minHeight: "90vh" }}
    >

      <div className="container">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-4">

          <h2 className="text-success fw-bold">
            Payment
          </h2>

          <p className="text-muted">
            Complete your payment to confirm
            your trip booking.
          </p>

        </div>

        {/* ================= PAYMENT CARD ================= */}

        <div
          className="card shadow mx-auto p-4"
          style={{ maxWidth: "800px" }}
        >

          {/* ================= BOOKING SUMMARY ================= */}

          <div className="card bg-light p-3 mb-4">

            <h5 className="fw-bold">
              Booking Summary
            </h5>

            <hr />

            <p>
              <strong>Student:</strong>{" "}
              {booking.full_name}
            </p>

            <p>
              <strong>College:</strong>{" "}
              {booking.college_name}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {booking.department}
            </p>

            <p>
              <strong>Destination:</strong>{" "}
              {booking.trip_destination}
            </p>

            <p>
              <strong>Number of Students:</strong>{" "}
              {booking.number_of_students}
            </p>

            <hr />

            <p>
              Original Price:{" "}
              <strong>
                ₹
                {Number(
                  booking.original_price || 0
                ).toLocaleString("en-IN")}
              </strong>
            </p>

            <p className="text-success">
              Discount:{" "}
              <strong>
                {booking.discount_percent || 0}%
              </strong>
            </p>

            <p className="text-success">
              Discount Amount:{" "}
              <strong>
                ₹
                {Number(
                  booking.discount_amount || 0
                ).toLocaleString("en-IN")}
              </strong>
            </p>

            <hr />

            <h3 className="text-success fw-bold">
              Amount to Pay: ₹
              {finalPrice.toLocaleString("en-IN")}
            </h3>

          </div>

          {/* ================= PAYMENT METHODS ================= */}

          <h5 className="fw-bold mb-3">
            Select Payment Method
          </h5>

          <div className="row">

            {/* UPI */}

            <div className="col-md-4 mb-3">

              <button
                type="button"
                className={`btn w-100 p-3 ${
                  paymentMethod === "UPI"
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() =>
                  setPaymentMethod("UPI")
                }
              >
                💳
                <br />
                UPI
              </button>

            </div>

            {/* CARD */}

            <div className="col-md-4 mb-3">

              <button
                type="button"
                className={`btn w-100 p-3 ${
                  paymentMethod === "Card"
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() =>
                  setPaymentMethod("Card")
                }
              >
                💳
                <br />
                Card
              </button>

            </div>

            {/* CASH */}

            <div className="col-md-4 mb-3">

              <button
                type="button"
                className={`btn w-100 p-3 ${
                  paymentMethod === "Cash"
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() =>
                  setPaymentMethod("Cash")
                }
              >
                💵
                <br />
                Pay Later
              </button>

            </div>

          </div>

          {/* ================= UPI ================= */}

          {paymentMethod === "UPI" && (

            <div className="card p-3 mt-3">

              <h5 className="text-success">
                UPI Payment
              </h5>

              <p className="text-muted">
                Enter your UPI ID.
              </p>

              <input
                type="text"
                className="form-control"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) =>
                  setUpiId(e.target.value)
                }
              />

            </div>

          )}

          {/* ================= CARD ================= */}

          {paymentMethod === "Card" && (

            <div className="card p-3 mt-3">

              <h5 className="text-success">
                Card Payment
              </h5>

              <div className="mb-3">

                <label className="form-label">
                  Card Number
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="1234567890123456"
                  maxLength="16"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Card Holder Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter card holder name"
                  value={cardName}
                  onChange={(e) =>
                    setCardName(e.target.value)
                  }
                />

              </div>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Expiry
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(e.target.value)
                    }
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    CVV
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="CVV"
                    maxLength="4"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                  />

                </div>

              </div>

            </div>

          )}

          {/* ================= CASH ================= */}

          {paymentMethod === "Cash" && (

            <div className="alert alert-info mt-3">

              <h5>
                Pay Later
              </h5>

              <p className="mb-0">
                You can pay the amount later
                according to the trip payment
                instructions.
              </p>

            </div>

          )}

          {/* ================= ERROR ================= */}

          {message && (

            <div className="alert alert-danger mt-3">
              {message}
            </div>

          )}

          {/* ================= PAY BUTTON ================= */}

          {paymentMethod && (

            <button
              type="button"
              className="btn btn-success w-100 mt-4"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing
                ? "Processing..."
                : paymentMethod === "Cash"
                ? "Confirm Pay Later"
                : `Pay ₹${finalPrice.toLocaleString(
                    "en-IN"
                  )}`}
            </button>

          )}

        </div>
      </div>
    </div>
  );
}

export default Payment;