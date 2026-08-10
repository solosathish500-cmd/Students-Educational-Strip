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
  // NORMALIZE COLLEGE NAME
  // =====================================================

  const normalizeCollegeName = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[.,]/g, "");
  };

  // =====================================================
  // NORMALIZE DEPARTMENT
  // =====================================================

  const normalizeDepartment = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/_/g, "-");
  };

  // =====================================================
  // CHECK SPECIAL COLLEGE
  // =====================================================

  const isSpecialCollege = () => {
    const college = normalizeCollegeName(
      formData.college_name
    );

    console.log("Entered College:", college);

    // Short names
    if (
      college === "svpp" ||
      college === "svpcet"
    ) {
      return true;
    }

    // Full college names
    if (
      college.includes(
        "sri venkatesa perumal college"
      )
    ) {
      return true;
    }

    // Common spelling mistakes
    if (
      college.includes(
        "sei venkatesa perumal college"
      )
    ) {
      return true;
    }

    if (
      college.includes(
        "sri venkatesa perumal colege"
      )
    ) {
      return true;
    }

    if (
      college.includes(
        "sei venkatesa perumal colege"
      )
    ) {
      return true;
    }

    if (
      college.includes(
        "sri venkatesa perumal collage"
      )
    ) {
      return true;
    }

    if (
      college.includes(
        "sei venkatesa perumal collage"
      )
    ) {
      return true;
    }

    return false;
  };

  // =====================================================
  // GET DISCOUNT
  // =====================================================

  const getDiscountPercent = () => {
    const specialCollege = isSpecialCollege();

    const department = normalizeDepartment(
      formData.department
    );

    console.log("Special College:", specialCollege);
    console.log("Department:", department);

    // -----------------------------------------------
    // CSE-AIML = 10%
    // -----------------------------------------------

    if (
      specialCollege &&
      (
        department === "cse-aiml" ||
        department === "cseaiml" ||
        department === "aiml"
      )
    ) {
      return 10;
    }

    // -----------------------------------------------
    // CSE-AI = 5%
    // -----------------------------------------------

    if (
      specialCollege &&
      (
        department === "cse-ai" ||
        department === "cseai"
      )
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
  // PRICE PREVIEW
  // =====================================================

  const selectedPrice =
    tripPrices[formData.trip_destination] || 0;

  const selectedStudents =
    Number(formData.number_of_students) || 0;

  const previewOriginalPrice =
    selectedPrice * selectedStudents;

  const previewDiscountAmount =
    (previewOriginalPrice * currentDiscount) / 100;

  const previewFinalPrice =
    previewOriginalPrice - previewDiscountAmount;

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
  // SUBMIT BOOKING
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("Processing booking...");
    setMessageType("info");

    // -----------------------------------------------
    // PRICE CALCULATION
    // -----------------------------------------------

    const pricePerStudent =
      tripPrices[formData.trip_destination] || 0;

    const studentCount =
      Number(formData.number_of_students) || 1;

    const originalPrice =
      pricePerStudent * studentCount;

    const discountPercent =
      getDiscountPercent();

    const discountAmount =
      (originalPrice * discountPercent) / 100;

    const finalPrice =
      originalPrice - discountAmount;

    // -----------------------------------------------
    // BOOKING DATA
    // -----------------------------------------------

    const bookingData = {
      ...formData,

      number_of_students: studentCount,

      original_price: originalPrice,

      discount_percent: discountPercent,

      discount_amount: discountAmount,

      final_price: finalPrice,

      payment_status: "Pending",
    };

    console.log(
      "================================="
    );
    console.log("BOOKING DATA");
    console.log(
      "College:",
      formData.college_name
    );
    console.log(
      "Department:",
      formData.department
    );
    console.log(
      "Discount:",
      discountPercent + "%"
    );
    console.log(
      "Original Price:",
      originalPrice
    );
    console.log(
      "Discount Amount:",
      discountAmount
    );
    console.log(
      "Final Price:",
      finalPrice
    );
    console.log(
      "================================="
    );

    // -----------------------------------------------
    // SEND TO BACKEND
    // -----------------------------------------------

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
      console.error(
        "Booking error:",
        error
      );

      // Save locally
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
      className="container-fluid bg-light py-5"
      style={{ minHeight: "90vh" }}
    >

      {/* HEADER */}

      <div className="text-center mb-4">

        <h2 className="text-success fw-bold">
          Trip Booking
        </h2>

        <p className="text-muted">
          Fill in the details to book your student trip
        </p>

      </div>

      {/* BOOKING CARD */}

      <div
        className="card shadow mx-auto p-4"
        style={{ maxWidth: "900px" }}
      >

        <form onSubmit={handleSubmit}>

          {/* STUDENT NAME */}

          <div className="mb-3">

            <label className="form-label fw-bold">
              Student Name
            </label>

            <input
              type="text"
              name="full_name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

          </div>

          {/* COLLEGE NAME */}

          <div className="mb-3">

            <label className="form-label fw-bold">
              College Name
            </label>

            <input
              type="text"
              name="college_name"
              className="form-control"
              placeholder="Enter your college"
              value={formData.college_name}
              onChange={handleChange}
              required
            />

            <small className="text-muted">
              Special discount available for
              SVPP, SVPCET or Sri Venkatesa Perumal
              College.
            </small>

          </div>

          {/* DEPARTMENT */}

          <div className="mb-3">

            <label className="form-label fw-bold">
              Department
            </label>

            <select
              name="department"
              className="form-select"
              value={formData.department}
              onChange={handleChange}
              required
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

          {/* DISCOUNT MESSAGE */}

          {formData.college_name.trim() !== "" &&
            formData.department !== "" && (

              <div className="mb-3">

                {currentDiscount === 10 && (

                  <div className="alert alert-success">

                    🎉{" "}

                    <strong>
                      10% Discount Applied!
                    </strong>

                    <br />

                    SVPP / SVPCET /
                    Sri Venkatesa Perumal College
                    CSE-AIML students receive
                    a 10% discount.

                  </div>

                )}

                {currentDiscount === 5 && (

                  <div className="alert alert-success">

                    🎉{" "}

                    <strong>
                      5% Discount Applied!
                    </strong>

                    <br />

                    SVPP / SVPCET /
                    Sri Venkatesa Perumal College
                    CSE-AI students receive
                    a 5% discount.

                  </div>

                )}

                {currentDiscount === 0 && (

                  <div className="alert alert-secondary">

                    No special discount is applicable
                    for the selected college and
                    department.

                  </div>

                )}

              </div>

            )}

          {/* EMAIL */}

          <div className="mb-3">

            <label className="form-label fw-bold">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* PHONE */}

          <div className="mb-3">

            <label className="form-label fw-bold">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>

          {/* DESTINATION */}

          <div className="mb-3">

            <label className="form-label fw-bold">
              Destination
            </label>

            <select
              name="trip_destination"
              className="form-select"
              value={formData.trip_destination}
              onChange={handleChange}
              required
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

          <div className="mb-3">

            <label className="form-label fw-bold">
              Travel Date
            </label>

            <input
              type="date"
              name="travel_date"
              className="form-control"
              value={formData.travel_date}
              onChange={handleChange}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              required
            />

          </div>

          {/* NUMBER OF STUDENTS */}

          <div className="mb-3">

            <label className="form-label fw-bold">
              Number of Students
            </label>

            <input
              type="number"
              name="number_of_students"
              className="form-control"
              placeholder="Enter number of students"
              min="1"
              value={formData.number_of_students}
              onChange={handleChange}
              required
            />

          </div>

          {/* PRICE SUMMARY */}

          {formData.trip_destination &&
            formData.number_of_students && (

              <div className="card bg-light border p-3 mb-3">

                <h5 className="fw-bold">
                  Booking Summary
                </h5>

                <hr />

                <p className="mb-2">
                  Price per student:{" "}

                  <strong>
                    ₹
                    {selectedPrice.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </p>

                <p className="mb-2">
                  Number of students:{" "}

                  <strong>
                    {selectedStudents}
                  </strong>

                </p>

                <p className="mb-2">
                  Original Price:{" "}

                  <strong>
                    ₹
                    {previewOriginalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </p>

                {currentDiscount > 0 && (

                  <p className="mb-2 text-success">

                    Discount ({currentDiscount}%):{" "}

                    <strong>
                      - ₹
                      {previewDiscountAmount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </p>

                )}

                <hr />

                <h4 className="text-success fw-bold">

                  Final Price: ₹
                  {previewFinalPrice.toLocaleString(
                    "en-IN"
                  )}

                </h4>

              </div>

            )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="btn btn-success w-100"
          >
            Continue to Payment
          </button>

        </form>

        {/* MESSAGE */}

        {message && (

          <div
            className={`alert alert-${messageType} mt-3 text-center`}
          >
            {message}
          </div>

        )}

      </div>

    </div>
  );
}

export default Booking;