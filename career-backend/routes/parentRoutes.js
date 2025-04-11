const express = require("express");
const pool = require("../db");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// 📌 Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

// 📌 Verify Child's Email
// router.post("/verify-parent", async (req, res) => {
//     const { parentEmail, childEmail } = req.body;
  
//     try {
//       // Check if child exists in Users table
//       const childQuery = await pool.query(`SELECT * FROM "Users" WHERE email = $1`, [childEmail]);
  
//       if (childQuery.rows.length === 0) {
//         return res.status(400).json({ success: false, message: "Child email not found." });
//       }
  
//       // Send an email to the child for approval
//       await transporter.sendMail({
//         from: process.env.SMTP_EMAIL,
//         to: childEmail,
//         subject: "Parent Verification Request",
//         text: `Your parent with email ${parentEmail} wants to link with you. Approve it in your dashboard.`,
//       });
  
//       res.json({ success: true, message: "Verification email sent to child." });
//     } catch (error) {
//       console.error("Parent Verification Error:", error);
//       res.status(500).json({ success: false, message: "Error verifying parent-child link." });
//     }
//   });
  

// 📌 Approve Parent Request (Child Approves)
// router.post("/approve-parent", async (req, res) => {
//     const { childEmail, parentEmail } = req.body;

//     try {
//         // Check if parent exists
//         const parentQuery = await pool.query(`SELECT id FROM "Users" WHERE email = $1 AND role = 'parent'`, [parentEmail]);
//         if (parentQuery.rows.length === 0) {
//             return res.status(404).json({ message: "No parent found with this email." });
//         }

//         const parent = parentQuery.rows[0];

//         // Link Parent & Child
//         await pool.query(`UPDATE "Users" SET parent_id = $1 WHERE email = $2`, [parent.id, childEmail]);

//         res.json({ message: "Parent linked successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "Approval failed." });
//     }
// });




// Save or Update Parent Details
// Route to save parent details
router.post("/save-parent-details", async (req, res) => {
    try {
        const {
            userId, dob, occupation, phone_number, child_email,
            highest_education, industry_experience, preferred_career_paths,
            career_concerns, connect_with_parents, mentorship_interest, special_certifications
        } = req.body;

        // Ensure userId is valid
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Ensure ParentDetails has a unique constraint on user_id
        // await pool.query(`
        //     ALTER TABLE ParentDetails ADD CONSTRAINT unique_user_id UNIQUE (user_id);
        // `);

        // Insert or Update Parent Details
        const result = await pool.query(
            `INSERT INTO ParentDetails 
            (user_id, dob, occupation, phone_number, child_email, highest_education,
            industry_experience, preferred_career_paths, career_concerns,
            connect_with_parents, mentorship_interest, special_certifications)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (user_id) DO UPDATE SET
            dob = EXCLUDED.dob,
            occupation = EXCLUDED.occupation,
            phone_number = EXCLUDED.phone_number,
            child_email = EXCLUDED.child_email,
            highest_education = EXCLUDED.highest_education,
            industry_experience = EXCLUDED.industry_experience,
            preferred_career_paths = EXCLUDED.preferred_career_paths,
            career_concerns = EXCLUDED.career_concerns,
            connect_with_parents = EXCLUDED.connect_with_parents,
            mentorship_interest = EXCLUDED.mentorship_interest,
            special_certifications = EXCLUDED.special_certifications
            RETURNING *;`, // Fixed missing closing `)`
            [userId, dob, occupation, phone_number, child_email, highest_education,
             industry_experience, preferred_career_paths, career_concerns,
             connect_with_parents, mentorship_interest, special_certifications]
        );

        // Update "is_detailsfilled" in Users table
        await pool.query(`UPDATE "Users" SET is_detailsfilled = TRUE WHERE id = $1`, [userId]);

        res.status(200).json({ message: "Details saved successfully", details: result.rows[0] });
    } catch (error) {
        console.error("Error saving parent details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

  
  // Fetch Parent Details
  router.get("/user-details/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
      const result = await pool.query("SELECT * FROM ParentDetails WHERE user_id = $1", [user_id]);
  
      if (result.rows.length > 0) {
        res.json({ details: result.rows[0] });
      } else {
        res.status(404).json({ message: "No parent details found." });
      }
    } catch (error) {
      console.error("Error fetching parent details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  // Fetch Teacher Details
// routes/authRoutes.js
router.get("/teacher-details/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM TeacherDetails WHERE user_id = $1", [user_id]);

    if (result.rows.length > 0) {
      res.json({ details: result.rows[0] });
    } else {
      res.status(404).json({ message: "No teacher details found." });
    }
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;



// Fetch Parent Details & Verified Child
// router.get("/user-details/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Get parent details
//         const parentResult = await pool.query("SELECT * FROM ParentDetails WHERE user_id = $1", [userId]);
//         const parentDetails = parentResult.rows[0];

//         if (!parentDetails) {
//             return res.status(404).json({ message: "Parent details not found" });
//         }

//         // Fetch child's name from Users table
//         const childResult = await pool.query("SELECT full_name, email FROM Users WHERE email = $1", [parentDetails.child_email]);
//         const verifiedChild = childResult.rows[0] || null;

//         res.json({ details: parentDetails, verifiedChild });
//     } catch (error) {
//         console.error("Error fetching details:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });
