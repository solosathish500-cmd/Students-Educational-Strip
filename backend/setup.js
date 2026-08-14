/* global process */

import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err.message);
    return;
  }
  console.log("Connected to Aiven Cloud! Building tables...");

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      phone VARCHAR(50),
      college_name VARCHAR(255),
      department VARCHAR(255),
      password VARCHAR(255)
    )
  `;

  const createStudentsTable = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      trip_destination VARCHAR(255),
      payment_status VARCHAR(50) DEFAULT 'Pending',
      college_name VARCHAR(255),
      department VARCHAR(255),
      travel_date DATE,
      number_of_students INT
    )
  `;

  // Run the commands
  db.query(createUsersTable, (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    } else {
      console.log("✅ Users table created successfully!");
    }

    db.query(createStudentsTable, (err) => {
      if (err) {
        console.error("Error creating students table:", err.message);
      } else {
        console.log("✅ Students table created successfully!");
      }
      
      console.log("Database setup is complete!");
      db.end();
      process.exit();
    });
  });
});