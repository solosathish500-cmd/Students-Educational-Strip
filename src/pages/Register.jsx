import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    college_name: "",
    department: "",
    password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check passwords
    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match.");
      setMessageType("danger");
      return;
    }

    // Minimum password length
    if (formData.password.length < 6) {
      setMessage(
        "Password must contain at least 6 characters."
      );
      setMessageType("danger");
      return;
    }

    setMessage("Creating your account...");
    setMessageType("info");

    try {
      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            college_name: formData.college_name,
            department: formData.department,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Registration successful! Redirecting to login..."
        );
        setMessageType("success");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(
          data.message || "Registration failed."
        );
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        "Unable to connect to backend."
      );
      setMessageType("danger");
    }
  };

  return (
    <div
      className="container-fluid bg-light d-flex align-items-center justify-content-center py-5"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "100%",
          maxWidth: "550px",
        }}
      >

        {/* Heading */}
        <div className="text-center mb-4">

          <h2 className="text-success fw-bold">
            Student Registration
          </h2>

          <p className="text-muted">
            Create your Student Trip account
          </p>

        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>

          {/* Student Name */}
          <div className="mb-3">

            <label className="form-label fw-bold">
              Student Name
            </label>

            <input
              type="text"
              name="full_name"
              className="form-control"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

          </div>

          {/* Email */}
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

          {/* Phone */}
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

          {/* College */}
          <div className="mb-3">

            <label className="form-label fw-bold">
              College Name
            </label>

            <input
              type="text"
              name="college_name"
              className="form-control"
              placeholder="Enter your college name"
              value={formData.college_name}
              onChange={handleChange}
              required
            />

          </div>

          {/* Department */}
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

              <option value="Civil">
                Civil
              </option>

              <option value="Mechanical">
                Mechanical
              </option>

              <option value="Diploma">
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

          {/* Password */}
          <div className="mb-3">

            <label className="form-label fw-bold">
              Password
            </label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <small className="text-muted">
              Minimum 6 characters
            </small>

          </div>

          {/* Confirm Password */}
          <div className="mb-3">

            <label className="form-label fw-bold">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirm_password"
              className="form-control"
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />

          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="btn btn-success w-100"
          >
            Create Account
          </button>

        </form>

        {/* Message */}
        {message && (
          <div
            className={`alert alert-${messageType} mt-3 text-center`}
          >
            {message}
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-4">

          <p className="mb-1">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="fw-bold text-primary"
          >
            Login Here
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Register;