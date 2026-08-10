/* global process */

import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// =====================================================
// MYSQL CONNECTION
// =====================================================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


// =====================================================
// CHECK MYSQL CONNECTION
// =====================================================

db.connect((error) => {
  if (error) {
    console.error(
      "MySQL connection failed:",
      error.message
    );
  } else {
    console.log("MySQL Connected Successfully!");
  }
});


// =====================================================
// TEST BACKEND
// =====================================================

app.get("/", (req, res) => {
  res.send("Student Trip Backend is Running!");
});


// =====================================================
// REGISTER API
// =====================================================

app.post("/api/register", (req, res) => {

  const {
    full_name,
    email,
    phone,
    college_name,
    department,
    password,
  } = req.body;


  // Check required fields
  if (
    !full_name ||
    !email ||
    !phone ||
    !college_name ||
    !department ||
    !password
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }


  // Check whether email already exists
  const checkSql = `
    SELECT id
    FROM users
    WHERE email = ?
  `;


  db.query(
    checkSql,
    [email],
    (error, results) => {

      if (error) {

        console.error(
          "Email check failed:",
          error.message
        );

        return res.status(500).json({
          message: "Database error",
          error: error.message,
        });
      }


      // Email already registered
      if (results.length > 0) {

        return res.status(409).json({
          message: "Email already registered",
        });
      }


      // Insert student
      const insertSql = `
        INSERT INTO users
        (
          full_name,
          email,
          phone,
          college_name,
          department,
          password
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `;


      db.query(
        insertSql,
        [
          full_name,
          email,
          phone,
          college_name,
          department,
          password,
        ],
        (insertError, result) => {

          if (insertError) {

            console.error(
              "Registration failed:",
              insertError.message
            );

            return res.status(500).json({
              message: "Registration failed",
              error: insertError.message,
            });
          }


          console.log(
            "New student registered:",
            full_name
          );


          return res.status(201).json({
            message: "Registration successful",
            userId: result.insertId,
          });

        }
      );

    }
  );
});


// =====================================================
// BOOKING API
// =====================================================

app.post("/api/bookings", (req, res) => {

  const {
    full_name,
    college_name,
    email,
    phone,
    trip_destination,
    travel_date,
    number_of_students,
    payment_status,
  } = req.body;


  // Check required fields
  if (
    !full_name ||
    !college_name ||
    !email ||
    !phone ||
    !trip_destination ||
    !travel_date ||
    !number_of_students
  ) {

    return res.status(400).json({
      message: "All booking fields are required",
    });
  }


  const sql = `
    INSERT INTO students
    (
      full_name,
      college_name,
      email,
      phone,
      trip_destination,
      travel_date,
      number_of_students,
      payment_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;


  db.query(
    sql,
    [
      full_name,
      college_name,
      email,
      phone,
      trip_destination,
      travel_date,
      number_of_students,
      payment_status || "Pending",
    ],
    (error, result) => {

      if (error) {

        console.error(
          "Booking failed:",
          error.message
        );

        return res.status(500).json({
          message: "Booking failed",
          error: error.message,
        });
      }


      console.log(
        "New booking created:",
        result.insertId
      );


      return res.status(201).json({
        message: "Booking successful",
        bookingId: result.insertId,
      });

    }
  );
});


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});