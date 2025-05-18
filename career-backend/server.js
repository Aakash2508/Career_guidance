// const express = require("express");
// const cors = require("cors");
// const authRoutes = require("./routes/authRoutes");
// require("dotenv").config();
// const session = require("express-session");

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.use("/api", authRoutes);
// app.use(session({
//   secret:process.env.SECRET_KEY,  // Change this to a strong, random secret
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }   // Set to true if using HTTPS
// }));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// server.js
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const authRoutes = require("./routes/authRoutes");
const parentRoutes = require("./routes/parentRoutes");
const interestsRoutes = require("./routes/interests");
const parentChildRoutes =require("./routes/parentChildRoutes")

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", parentRoutes);
app.use("/api", interestsRoutes);
app.use("/api",parentChildRoutes);



// app.get("/api/approve-parent", async (req, res) => {
//     const { parentId, childId } = req.query;
  
//     if (!parentId || !childId) {
//       return res.status(400).json({ message: "Invalid request parameters" });
//     }
  
//     try {
//       await pool.query(
//         `UPDATE "Users" SET parent_id = $1 WHERE id = $2`,
//         [parentId, childId]
//       );
  
//       res.send("<h2>Parent successfully linked!</h2><p>You can now check details in your dashboard.</p>");
//     } catch (error) {
//       console.error("Approval Error:", error);
//       res.status(500).send("Error processing approval.");
//     }
//   });


// app.get("/api/user-details/:userId", async (req, res) => {
//     const { userId } = req.params;
//     try {
//       const userQuery = await pool.query(`SELECT * FROM "Users" WHERE id = $1`, [userId]);
//       if (userQuery.rows.length === 0) return res.status(404).json({ message: "User not found" });
//       res.json(userQuery.rows[0]);
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   });
  
//   app.post("/api/update-user-details", async (req, res) => {
//     const { userId, dob, grade, school_board, school_name, career_interest, subject_interest, occupation, phone_number, subject_specialization, years_of_experience } = req.body;
//     try {
//       await pool.query(
//         `UPDATE "Users" SET dob=$1, grade=$2, school_board=$3, school_name=$4, career_interest=$5, subject_interest=$6, occupation=$7, phone_number=$8, subject_specialization=$9, years_of_experience=$10 WHERE id=$11`,
//         [dob, grade, school_board, school_name, career_interest, subject_interest, occupation, phone_number, subject_specialization, years_of_experience, userId]
//       );
//       res.json({ message: "User details updated successfully" });
//     } catch (error) {
//       console.error("Error updating user details:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   });
  
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
