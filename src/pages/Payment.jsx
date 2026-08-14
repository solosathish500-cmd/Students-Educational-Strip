import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  // Get booking data directly from localStorage
  const [booking] = useState(() => {
    const savedBooking = localStorage.getItem("latestBooking");

    if (!savedBooking) {
      return null;
    }

    try {
      return JSON.parse(savedBooking);
    } catch (error) {
      console.error("Invalid booking data:", error);
      return null;
    }
  });

  const [selectedMethod, setSelectedMethod] = useState("");
  const [processing, setProcessing] = useState(false);

  // --------------------------------------------------
  // NO BOOKING
  // --------------------------------------------------

  if (!booking) {
    return (
      <div style={styles.page}>
        <div className="travel-stars"></div>

        <div className="cloud cloud1">☁️</div>
        <div className="cloud cloud2">☁️</div>

        <div className="plane plane1">✈️</div>

        <div style={styles.noBookingCard}>
          <div style={styles.bigIcon}>🧳</div>

          <h2 style={{ color: "#fff", fontWeight: "800" }}>
            No Booking Found
          </h2>

          <p style={{ color: "#d8d8f5" }}>
            Please complete a trip booking before making a payment.
          </p>

          <button
            onClick={() => navigate("/booking")}
            style={styles.primaryButton}
          >
            Go to Booking
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------

  const originalPrice = Number(booking.original_price) || 0;
  const discountAmount = Number(booking.discount_amount) || 0;
  const finalPrice = Number(booking.final_price) || originalPrice - discountAmount;
  const discountPercent = Number(booking.discount_percent) || 0;

  // --------------------------------------------------
  // UPDATE DATABASE STATUS FUNCTION (NEW)
  // --------------------------------------------------

  const updatePaymentStatus = async (status) => {
    try {
      if (!booking || !booking.bookingId) {
        console.error("No booking ID found to update.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${booking.bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: status }),
      });

      if (!response.ok) {
        console.error("Failed to update status in database");
      } else {
        console.log(`Successfully updated database status to: ${status}`);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  // --------------------------------------------------
  // PAYMENT HANDLERS (UPDATED)
  // --------------------------------------------------

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    setProcessing(true);

    // If they choose Pay Later, we keep it Pending in the DB. Otherwise, it is Paid.
    const dbStatus = selectedMethod === "Pay Later" ? "Pending" : "Paid";

    // 1. Update the backend database
    await updatePaymentStatus(dbStatus);

    // 2. Update local storage with the new data
    const updatedBooking = {
      ...booking,
      payment_method: selectedMethod,
      payment_status: dbStatus,
    };

    localStorage.setItem("latestBooking", JSON.stringify(updatedBooking));

    // 3. Show success alert and navigate
    alert("Payment Processed Successfully!");
    
    setTimeout(() => {
      navigate("/booking-confirmation");
    }, 500);
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    setProcessing(true);

    // 1. Tell backend to mark as Canceled
    await updatePaymentStatus("Canceled");

    // 2. Update local storage
    const updatedBooking = {
      ...booking,
      payment_status: "Canceled",
    };
    localStorage.setItem("latestBooking", JSON.stringify(updatedBooking));

    alert("Booking Canceled.");

    // Redirect user back to the home or booking page after canceling
    setTimeout(() => {
      navigate("/booking");
    }, 500);
  };

  return (
    <div style={styles.page}>

      {/* ============================================
          ANIMATED BACKGROUND
      ============================================ */}

      <div className="travel-background">

        {/* Stars */}
        <div className="stars"></div>

        {/* Moon */}
        <div className="moon">🌙</div>

        {/* Clouds */}
        <div className="cloud cloud1">☁️</div>
        <div className="cloud cloud2">☁️</div>
        <div className="cloud cloud3">☁️</div>

        {/* Airplanes */}
        <div className="plane plane1">✈️</div>
        <div className="plane plane2">✈️</div>

        {/* Decorative luggage */}
        <div className="travel-icon suitcase">🧳</div>
        <div className="travel-icon globe">🌎</div>

      </div>

      {/* ============================================
          MAIN CONTENT
      ============================================ */}

      <div style={styles.content}>

        {/* HEADER */}

        <div style={styles.header}>

          <div style={styles.paymentIcon}>
            💳
          </div>

          <h1 style={styles.title}>
            Secure Payment
          </h1>

          <p style={styles.subtitle}>
            Complete your payment and get ready for your journey
          </p>

        </div>

        {/* ==========================================
            PAYMENT CARD
        ========================================== */}

        <div style={styles.card}>

          {/* Booking Summary */}

          <div style={styles.summaryCard}>

            <div style={styles.sectionTitle}>
              🧳 Booking Summary
            </div>

            <div style={styles.line}></div>

            <div style={styles.infoRow}>
              <span>Student</span>
              <strong>
                {booking.full_name || "N/A"}
              </strong>
            </div>

            <div style={styles.infoRow}>
              <span>College</span>
              <strong>
                {booking.college_name || "N/A"}
              </strong>
            </div>

            <div style={styles.infoRow}>
              <span>Department</span>
              <strong>
                {booking.department || "N/A"}
              </strong>
            </div>

            <div style={styles.infoRow}>
              <span>Destination</span>

              <strong style={styles.destination}>
                📍 {booking.trip_destination || "N/A"}
              </strong>
            </div>

            <div style={styles.infoRow}>
              <span>Travel Date</span>

              <strong>
                {booking.travel_date || "N/A"}
              </strong>
            </div>

            <div style={styles.infoRow}>
              <span>Students</span>

              <strong>
                {booking.number_of_students || 0}
              </strong>
            </div>

            <div style={styles.line}></div>

            {/* Price */}

            <div style={styles.priceRow}>
              <span>Original Price</span>

              <strong>
                ₹
                {originalPrice.toLocaleString("en-IN")}
              </strong>
            </div>

            {discountPercent > 0 && (
              <>
                <div style={styles.discountRow}>
                  <span>
                    Discount ({discountPercent}%)
                  </span>

                  <strong>
                    - ₹
                    {discountAmount.toLocaleString("en-IN")}
                  </strong>
                </div>
              </>
            )}

            <div style={styles.line}></div>

            <div style={styles.finalPriceRow}>

              <span>
                Amount to Pay
              </span>

              <strong>
                ₹
                {finalPrice.toLocaleString("en-IN")}
              </strong>

            </div>

          </div>

          {/* ========================================
              PAYMENT METHODS
          ======================================== */}

          <h3 style={styles.methodTitle}>
            Select Payment Method
          </h3>

          <div style={styles.methods}>

            {/* UPI */}

            <button
              type="button"
              onClick={() => setSelectedMethod("UPI")}
              style={{
                ...styles.methodButton,
                ...(selectedMethod === "UPI"
                  ? styles.selectedMethod
                  : {}),
              }}
            >
              <div style={styles.methodIcon}>
                📱
              </div>

              <strong>UPI</strong>

              <small>
                Google Pay / PhonePe
              </small>
            </button>

            {/* CARD */}

            <button
              type="button"
              onClick={() => setSelectedMethod("Card")}
              style={{
                ...styles.methodButton,
                ...(selectedMethod === "Card"
                  ? styles.selectedMethod
                  : {}),
              }}
            >
              <div style={styles.methodIcon}>
                💳
              </div>

              <strong>Card</strong>

              <small>
                Debit / Credit Card
              </small>
            </button>

            {/* PAY LATER */}

            <button
              type="button"
              onClick={() => setSelectedMethod("Pay Later")}
              style={{
                ...styles.methodButton,
                ...(selectedMethod === "Pay Later"
                  ? styles.selectedMethod
                  : {}),
              }}
            >
              <div style={styles.methodIcon}>
                🕒
              </div>

              <strong>Pay Later</strong>

              <small>
                Pay before trip
              </small>
            </button>

          </div>

          {/* Selected payment */}

          {selectedMethod && (
            <div style={styles.selectedMessage}>

              ✓ {selectedMethod} selected

            </div>
          )}

          {/* ========================================
              PAY & CANCEL BUTTONS
          ======================================== */}

          <button
            type="button"
            onClick={handlePayment}
            disabled={processing}
            style={{
              ...styles.payButton,
              opacity: processing ? 0.7 : 1,
            }}
          >
            {processing
              ? "Processing Payment..."
              : `Pay ₹${finalPrice.toLocaleString("en-IN")} →`}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={processing}
            style={{
              ...styles.cancelButton,
              opacity: processing ? 0.7 : 1,
            }}
          >
            Cancel Booking
          </button>

          <p style={styles.securityText}>
            🔒 Your payment information is secure
          </p>

        </div>

        {/* Footer text */}

        <div style={styles.bottomText}>
          ✈️ Your journey starts here
        </div>

      </div>

      {/* ============================================
          ANIMATION CSS
      ============================================ */}

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .travel-background {
            position: fixed;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
          }

          .stars {
            position: absolute;
            inset: 0;

            background-image:
              radial-gradient(
                2px 2px at 20% 30%,
                white,
                transparent
              ),
              radial-gradient(
                2px 2px at 70% 20%,
                white,
                transparent
              ),
              radial-gradient(
                1px 1px at 40% 70%,
                white,
                transparent
              ),
              radial-gradient(
                2px 2px at 85% 60%,
                white,
                transparent
              ),
              radial-gradient(
                1px 1px at 15% 80%,
                white,
                transparent
              );

            background-size: 350px 350px;

            animation: starsMove 15s linear infinite;
            opacity: 0.6;
          }

          @keyframes starsMove {
            from {
              transform: translateY(0);
            }

            to {
              transform: translateY(-350px);
            }
          }

          .moon {
            position: absolute;
            top: 8%;
            right: 10%;

            font-size: 65px;

            animation:
              moonFloat 4s ease-in-out infinite;
          }

          @keyframes moonFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-15px);
            }
          }

          .cloud {
            position: absolute;
            font-size: 65px;
            opacity: 0.25;
          }

          .cloud1 {
            top: 18%;
            left: -120px;
            animation: cloudMove 35s linear infinite;
          }

          .cloud2 {
            top: 45%;
            left: -180px;
            font-size: 50px;
            animation: cloudMove 45s linear infinite;
          }

          .cloud3 {
            top: 72%;
            left: -150px;
            font-size: 75px;
            animation: cloudMove 55s linear infinite;
          }

          @keyframes cloudMove {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(
                calc(100vw + 300px)
              );
            }
          }

          .plane {
            position: absolute;
            font-size: 38px;
          }

          .plane1 {
            top: 25%;
            left: -100px;

            animation:
              planeMove 18s linear infinite;
          }

          .plane2 {
            top: 65%;
            left: -150px;
            font-size: 28px;

            animation:
              planeMove 25s linear infinite;
            animation-delay: 7s;
          }

          @keyframes planeMove {
            0% {
              transform:
                translateX(0)
                translateY(0)
                rotate(-8deg);
            }

            50% {
              transform:
                translateX(50vw)
                translateY(-40px)
                rotate(-3deg);
            }

            100% {
              transform:
                translateX(
                  calc(100vw + 300px)
                )
                translateY(-100px)
                rotate(-8deg);
            }
          }

          .travel-icon {
            position: absolute;
            font-size: 55px;
            opacity: 0.18;

            animation:
              iconFloat 5s ease-in-out infinite;
          }

          .suitcase {
            bottom: 10%;
            left: 7%;
          }

          .globe {
            bottom: 12%;
            right: 7%;
            animation-delay: 2s;
          }

          @keyframes iconFloat {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform:
                translateY(-20px)
                rotate(5deg);
            }
          }

          .method-button:hover {
            transform: translateY(-6px);
          }

          @media (max-width: 768px) {

            .payment-card {
              width: 95%;
            }

            .methods {
              grid-template-columns: 1fr;
            }

            .title {
              font-size: 32px;
            }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    overflow: "hidden",

    background:
      "linear-gradient(135deg, #08001a 0%, #17004a 40%, #32006b 70%, #09001c 100%)",

    padding: "50px 20px",
  },

  content: {
    position: "relative",
    zIndex: 5,
    maxWidth: "950px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  paymentIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 15px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg,#8b5cf6,#ec4899)",

    fontSize: "32px",

    boxShadow:
      "0 15px 40px rgba(139,92,246,0.4)",
  },

  title: {
    color: "white",
    fontSize: "42px",
    fontWeight: "900",
    margin: "0",
    letterSpacing: "1px",
  },

  subtitle: {
    color: "#d8d8f5",
    fontSize: "16px",
    marginTop: "8px",
  },

  card: {
    width: "100%",

    background:
      "rgba(255,255,255,0.94)",

    backdropFilter: "blur(20px)",

    borderRadius: "28px",

    padding: "30px",

    boxShadow:
      "0 30px 80px rgba(0,0,0,0.5)",

    border:
      "1px solid rgba(255,255,255,0.3)",
  },

  summaryCard: {
    background:
      "linear-gradient(135deg,#f7f0ff,#eee4ff)",

    borderRadius: "20px",

    padding: "25px",

    border:
      "1px solid #d8c4f2",
  },

  sectionTitle: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#38105d",
  },

  line: {
    height: "1px",
    background: "#d5c7e5",
    margin: "16px 0",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",

    padding: "7px 0",

    color: "#555",
  },

  destination: {
    color: "#6d28d9",
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",

    padding: "7px 0",

    color: "#444",
  },

  discountRow: {
    display: "flex",
    justifyContent: "space-between",

    padding: "7px 0",

    color: "#059669",

    fontWeight: "700",
  },

  finalPriceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    fontSize: "24px",
    fontWeight: "900",

    color: "#38105d",
  },

  methodTitle: {
    marginTop: "30px",
    marginBottom: "15px",

    color: "#321052",

    fontWeight: "800",
  },

  methods: {
    display: "grid",

    gridTemplateColumns:
      "repeat(3, 1fr)",

    gap: "15px",
  },

  methodButton: {
    minHeight: "130px",

    border:
      "2px solid #d8c4f2",

    borderRadius: "18px",

    background: "white",

    color: "#321052",

    cursor: "pointer",

    display: "flex",
    flexDirection: "column",

    alignItems: "center",
    justifyContent: "center",

    gap: "5px",

    transition:
      "all 0.3s ease",

    boxShadow:
      "0 5px 15px rgba(60,20,100,0.08)",
  },

  selectedMethod: {
    border:
      "2px solid #7c3aed",

    background:
      "linear-gradient(135deg,#f3e8ff,#ede9fe)",

    transform:
      "translateY(-5px)",

    boxShadow:
      "0 15px 30px rgba(124,58,237,0.25)",
  },

  methodIcon: {
    fontSize: "32px",
  },

  selectedMessage: {
    marginTop: "18px",

    padding: "12px",

    borderRadius: "12px",

    textAlign: "center",

    background: "#ecfdf5",

    color: "#047857",

    fontWeight: "700",
  },

  payButton: {
    width: "100%",

    marginTop: "25px",

    padding: "17px",

    border: "none",

    borderRadius: "15px",

    cursor: "pointer",

    color: "white",

    fontSize: "19px",

    fontWeight: "800",

    background:
      "linear-gradient(135deg,#7c3aed,#db2777)",

    boxShadow:
      "0 12px 30px rgba(124,58,237,0.35)",

    transition:
      "all 0.3s ease",
  },

  cancelButton: {
    width: "100%",

    marginTop: "15px",

    padding: "15px",

    border: "none",

    borderRadius: "15px",

    cursor: "pointer",

    color: "white",

    fontSize: "17px",

    fontWeight: "700",

    background: "#ef4444", // A nice red for the cancel button

    boxShadow:
      "0 10px 20px rgba(239, 68, 68, 0.25)",

    transition:
      "all 0.3s ease",
  },

  securityText: {
    textAlign: "center",

    marginTop: "15px",

    marginBottom: "0",

    color: "#777",

    fontSize: "13px",
  },

  bottomText: {
    textAlign: "center",

    marginTop: "25px",

    color: "#d8d8f5",

    fontSize: "15px",

    fontWeight: "600",
  },

  noBookingCard: {
    position: "relative",
    zIndex: 5,

    maxWidth: "500px",

    margin: "15vh auto",

    textAlign: "center",

    padding: "45px 30px",

    borderRadius: "25px",

    background:
      "rgba(255,255,255,0.12)",

    backdropFilter: "blur(20px)",

    border:
      "1px solid rgba(255,255,255,0.2)",

    boxShadow:
      "0 25px 60px rgba(0,0,0,0.4)",
  },

  bigIcon: {
    fontSize: "70px",
    marginBottom: "15px",
  },

  primaryButton: {
    marginTop: "20px",

    padding: "13px 30px",

    border: "none",

    borderRadius: "12px",

    color: "white",

    background:
      "linear-gradient(135deg,#7c3aed,#db2777)",

    fontWeight: "700",

    cursor: "pointer",
  },
};

export default Payment;