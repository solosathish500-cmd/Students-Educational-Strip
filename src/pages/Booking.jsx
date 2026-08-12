import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    college_name: "",
    department: "",
    email: "",
    phone: "",
    trip_destination: "",
    travel_date: "",
    number_of_students: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // TRIP PRICES
  // =====================================================

  const tripPrices = {
    Goa: 7000,
    Munnar: 7000,
    Agra: 9000,
    Manali: 6000,
    Ooty: 7000,
    Ladakh: 10000,
  };

  // =====================================================
  // NORMALIZE TEXT
  // =====================================================

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =====================================================
  // CHECK SPECIAL COLLEGE
  // =====================================================

  const isSpecialCollege = () => {
    const college = normalizeText(formData.college_name);

    const specialCollegeNames = [
      "svpp",
      "svpcet",
      "svpcet college",
      "sri venkatesa perumal college",
      "sei venkatesa perumal college",
      "sri venkatesa perumal colege",
      "sei venkatesa perumal colege",
      "sri venkatesa perumal collage",
      "sei venkatesa perumal collage",
    ];

    return specialCollegeNames.includes(college);
  };

  // =====================================================
  // GET DISCOUNT
  // =====================================================

  const getDiscountPercent = () => {
    if (!isSpecialCollege()) {
      return 0;
    }

    const department = normalizeText(formData.department);

    // CSE-AIML = 10%
    if (
      department === "cse-aiml" ||
      department === "cse aiml" ||
      department === "cse-ai&ml" ||
      department === "cse ai&ml" ||
      department === "aiml"
    ) {
      return 10;
    }

    // CSE-AI = 5%
    if (
      department === "cse-ai" ||
      department === "cse ai"
    ) {
      return 5;
    }

    return 0;
  };

  // =====================================================
  // CURRENT DISCOUNT
  // =====================================================

  const currentDiscount = getDiscountPercent();

  // =====================================================
  // PRICE CALCULATIONS
  // =====================================================

  const selectedPrice =
    tripPrices[formData.trip_destination] || 0;

  const selectedStudents =
    Number(formData.number_of_students) || 0;

  const originalPrice =
    selectedPrice * selectedStudents;

  const discountAmount =
    (originalPrice * currentDiscount) / 100;

  const finalPrice =
    originalPrice - discountAmount;

  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("Processing booking...");
    setMessageType("info");

    const pricePerStudent =
      tripPrices[formData.trip_destination] || 0;

    const studentCount =
      Number(formData.number_of_students) || 1;

    const bookingOriginalPrice =
      pricePerStudent * studentCount;

    const discountPercent =
      getDiscountPercent();

    const bookingDiscountAmount =
      (bookingOriginalPrice * discountPercent) / 100;

    const bookingFinalPrice =
      bookingOriginalPrice - bookingDiscountAmount;

    const bookingData = {
      ...formData,

      number_of_students: studentCount,

      original_price: bookingOriginalPrice,

      discount_percent: discountPercent,

      discount_amount: bookingDiscountAmount,

      final_price: bookingFinalPrice,

      payment_status: "Pending",
    };

    console.log("Booking Data:", bookingData);

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const latestBooking = {
          ...bookingData,
          bookingId: data.bookingId,
        };

        localStorage.setItem(
          "latestBooking",
          JSON.stringify(latestBooking)
        );

        setMessage(
          "Booking created successfully! Redirecting to payment..."
        );

        setMessageType("success");

        setTimeout(() => {
          navigate("/payment");
        }, 1000);
      } else {
        setMessage(
          data.message || "Booking failed."
        );

        setMessageType("danger");
      }
    } catch (error) {
      console.error("Booking error:", error);

      localStorage.setItem(
        "latestBooking",
        JSON.stringify(bookingData)
      );

      setMessage(
        "Backend unavailable. Continuing to payment..."
      );

      setMessageType("warning");

      setTimeout(() => {
        navigate("/payment");
      }, 1500);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(-45deg, #16002e, #2d0757, #4b1680, #210044)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite",
        padding: "50px 20px",
        overflow: "hidden",
      }}
    >

      {/* =================================================
          ANIMATION CSS
      ================================================= */}

      <style>
        {`
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }

            50% {
              background-position: 100% 50%;
            }

            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes fadeDown {
            0% {
              opacity: 0;
              transform: translateY(-40px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes cardEntrance {
            0% {
              opacity: 0;
              transform: translateY(60px) scale(0.95);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(25px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes discountPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 rgba(52, 211, 153, 0);
            }

            50% {
              transform: scale(1.02);
              box-shadow: 0 8px 25px rgba(52, 211, 153, 0.25);
            }

            100% {
              transform: scale(1);
              box-shadow: 0 0 0 rgba(52, 211, 153, 0);
            }
          }

          @keyframes buttonGlow {
            0% {
              box-shadow: 0 8px 20px rgba(75, 22, 128, 0.35);
            }

            50% {
              box-shadow:
                0 8px 30px rgba(123, 44, 191, 0.65),
                0 0 15px rgba(168, 85, 247, 0.35);
            }

            100% {
              box-shadow: 0 8px 20px rgba(75, 22, 128, 0.35);
            }
          }

          @keyframes priceAppear {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .booking-header {
            animation: fadeDown 1s ease forwards;
          }

          .booking-card {
            animation: cardEntrance 1s ease forwards;
          }

          .booking-field {
            animation: fadeUp 0.7s ease forwards;
          }

          .discount-box {
            animation: discountPulse 2s ease-in-out infinite;
          }

          .price-summary {
            animation: priceAppear 0.5s ease forwards;
          }

          .payment-button {
            animation: buttonGlow 2.5s ease-in-out infinite;
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .payment-button:hover {
            transform: translateY(-4px) scale(1.01);
            box-shadow:
              0 12px 35px rgba(123, 44, 191, 0.65);
          }

          .booking-input {
            transition:
              border 0.3s ease,
              box-shadow 0.3s ease,
              transform 0.2s ease;
          }

          .booking-input:focus {
            border-color: #7b2cbf !important;
            box-shadow:
              0 0 0 4px rgba(123, 44, 191, 0.15) !important;
            transform: translateY(-1px);
          }

          .booking-card {
            transition: transform 0.3s ease;
          }

          .booking-card:hover {
            transform: translateY(-3px);
          }
        `}
      </style>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center mb-5 booking-header">

        <h1
          style={{
            color: "#ffffff",
            fontWeight: "800",
            fontSize: "42px",
            letterSpacing: "1px",
            marginBottom: "10px",
            textShadow:
              "0 4px 15px rgba(0,0,0,0.4)",
          }}
        >
          Trip Booking
        </h1>

        <p
          style={{
            color: "#ddd0f5",
            fontSize: "18px",
          }}
        >
          Plan your educational trip with us
        </p>

      </div>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div
        className="mx-auto booking-card"
        style={{
          maxWidth: "950px",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "25px",
          padding: "35px",
          boxShadow:
            "0 25px 70px rgba(0,0,0,0.45)",
        }}
      >

        <form onSubmit={handleSubmit}>

          {/* STUDENT NAME */}

          <div className="mb-4 booking-field">

            <label
              className="form-label fw-bold"
              style={{ color: "#321052" }}
            >
              Student Name
            </label>

            <input
              type="text"
              name="full_name"
              className="form-control form-control-lg booking-input"
              placeholder="Enter your name"
              value={formData.full_name}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #c9b5df",
              }}
            />

          </div>

          {/* COLLEGE */}

          <div className="mb-4 booking-field">

            <label
              className="form-label fw-bold"
              style={{ color: "#321052" }}
            >
              College Name
            </label>

            <input
              type="text"
              name="college_name"
              className="form-control form-control-lg booking-input"
              placeholder="Enter your college"
              value={formData.college_name}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #c9b5df",
              }}
            />

            <small
              style={{
                color: "#76548f",
              }}
            >
              Special discount available for
              SVPP, SVPCET or Sri Venkatesa
              Perumal College.
            </small>

          </div>

          {/* DEPARTMENT */}

          <div className="mb-4 booking-field">

            <label
              className="form-label fw-bold"
              style={{ color: "#321052" }}
            >
              Department
            </label>

            <select
              name="department"
              className="form-select form-select-lg booking-input"
              value={formData.department}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #c9b5df",
              }}
            >

              <option value="">
                Select Department
              </option>

              <option value="CSE">
                CSE
              </option>

              <option value="CSE-AI">
                CSE-AI
              </option>

              <option value="CSE-AIML">
                CSE-AIML
              </option>

              <option value="ECE">
                ECE
              </option>

              <option value="EEE">
                EEE
              </option>

              <option value="MECH">
                MECH
              </option>

              <option value="CIVIL">
                CIVIL
              </option>

              <option value="DIPLOMA">
                Diploma
              </option>

              <option value="MBA">
                MBA
              </option>

              <option value="MCA">
                MCA
              </option>

              <option value="BPT">
                BPT
              </option>

            </select>

          </div>

          {/* =================================================
              DISCOUNT MESSAGE
          ================================================= */}

          {formData.college_name.trim() !== "" &&
            formData.department !== "" && (

              <div className="mb-4">

                {currentDiscount === 10 && (
                  <div
                    className="discount-box"
                    style={{
                      background:
                        "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                      border:
                        "1px solid #34d399",
                      borderRadius: "15px",
                      padding: "18px",
                      color: "#065f46",
                    }}
                  >

                    <strong
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      🎉 10% Discount Applied!
                    </strong>

                    <br />

                    CSE-AIML students from
                    Sri Venkatesa Perumal College
                    receive a 10% discount.

                  </div>
                )}

                {currentDiscount === 5 && (
                  <div
                    className="discount-box"
                    style={{
                      background:
                        "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                      border:
                        "1px solid #34d399",
                      borderRadius: "15px",
                      padding: "18px",
                      color: "#065f46",
                    }}
                  >

                    <strong
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      🎉 5% Discount Applied!
                    </strong>

                    <br />

                    CSE-AI students from
                    Sri Venkatesa Perumal College
                    receive a 5% discount.

                  </div>
                )}

                {currentDiscount === 0 && (
                  <div
                    style={{
                      background: "#f1f1f1",
                      borderRadius: "15px",
                      padding: "15px",
                      color: "#555",
                    }}
                  >
                    No special discount is applicable
                    for the selected college and
                    department.
                  </div>
                )}

              </div>
            )}

          {/* EMAIL */}

          <div className="mb-4 booking-field">

            <label
              className="form-label fw-bold"
              style={{ color: "#321052" }}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control form-control-lg booking-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #c9b5df",
              }}
            />

          </div>

          {/* PHONE */}

          <div className="mb-4 booking-field">

            <label
              className="form-label fw-bold"
              style={{ color: "#321052" }}
            >
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              className="form-control form-control-lg booking-input"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #c9b5df",
              }}
            />

          </div>

          {/* DESTINATION */}

          <div className="mb-4 booking-field">

            <label
              className="form-label fw-bold"
              style={{ color: "#321052" }}
            >
              Destination
            </label>

            <select
              name="trip_destination"
              className="form-select form-select-lg booking-input"
              value={formData.trip_destination}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #c9b5df",
              }}
            >

              <option value="">
                Select Destination
              </option>

              <option value="Goa">
                Goa
              </option>

              <option value="Munnar">
                Munnar
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

              <option value="Ladakh">
                Ladakh
              </option>

            </select>

          </div>

          {/* TRAVEL DATE */}

          <div className="mb-4 booking-field">

            <label
              className="form-label fw-bold"
              style={{ color: "#321052" }}
            >
              Travel Date
            </label>

            <input
              type="date"
              name="travel_date"
              className="form-control form-control-lg booking-input"
              value={formData.travel_date}
              onChange={handleChange}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #c9b5df",
              }}
            />

          </div>

          {/* NUMBER OF STUDENTS */}

          <div className="mb-4 booking-field">

            <label
              className="form-label fw-bold"
              style={{ color: "#321052" }}
            >
              Number of Students
            </label>

            <input
              type="number"
              name="number_of_students"
              className="form-control form-control-lg booking-input"
              placeholder="Enter number of students"
              min="1"
              value={formData.number_of_students}
              onChange={handleChange}
              required
              style={{
                borderRadius: "12px",
                border: "1px solid #c9b5df",
              }}
            />

          </div>

          {/* =================================================
              PRICE SUMMARY
          ================================================= */}

          {formData.trip_destination &&
            formData.number_of_students && (

              <div
                className="price-summary"
                style={{
                  background:
                    "linear-gradient(135deg,#f5edff,#eee2ff)",
                  border:
                    "1px solid #c8a8e9",
                  borderRadius: "20px",
                  padding: "25px",
                  marginBottom: "25px",
                }}
              >

                <h4
                  style={{
                    color: "#4b1680",
                    fontWeight: "800",
                  }}
                >
                  Booking Summary
                </h4>

                <hr />

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Price per student
                  </span>

                  <strong>
                    ₹
                    {selectedPrice.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Number of students
                  </span>

                  <strong>
                    {selectedStudents}
                  </strong>

                </div>

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Original Price
                  </span>

                  <strong>
                    ₹
                    {originalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                {currentDiscount > 0 && (

                  <div
                    className="d-flex justify-content-between mb-2"
                    style={{
                      color: "#198754",
                    }}
                  >

                    <span>
                      Discount ({currentDiscount}%)
                    </span>

                    <strong>
                      - ₹
                      {discountAmount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                )}

                <hr />

                <div
                  className="d-flex justify-content-between align-items-center"
                >

                  <span
                    style={{
                      fontSize: "22px",
                      fontWeight: "800",
                      color: "#321052",
                    }}
                  >
                    Final Price
                  </span>

                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "900",
                      color: "#6a1b9a",
                    }}
                  >
                    ₹
                    {finalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>
            )}

          {/* =================================================
              SUBMIT BUTTON
          ================================================= */}

          <button
            type="submit"
            className="btn w-100 payment-button"
            style={{
              background:
                "linear-gradient(135deg,#4b1680,#7b2cbf)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding: "15px",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            Continue to Payment →
          </button>

        </form>

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (

          <div
            className={`alert alert-${messageType} mt-4 text-center`}
            style={{
              borderRadius: "12px",
              animation: "fadeUp 0.5s ease",
            }}
          >
            {message}
          </div>

        )}

      </div>

    </div>
  );
}

export default Booking;