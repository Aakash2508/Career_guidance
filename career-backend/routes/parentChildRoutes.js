const express = require("express");
const pool = require("../db");
const nodemailer = require("nodemailer");
require("dotenv").config();
const router = express.Router();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// 📌 Request Parent-Child Link
router.post("/verify-parent", async (req, res) => {
  const { parentEmail, childEmail } = req.body;

  try {
    // Fetch parent and child user IDs
    const parentRes = await pool.query(`SELECT id, full_name FROM "Users" WHERE email = $1`, [parentEmail]);
    const childRes = await pool.query(`SELECT id, full_name FROM "Users" WHERE email = $1`, [childEmail]);

    if (parentRes.rows.length === 0 || childRes.rows.length === 0) {
      return res.status(400).json({ message: "Parent or child email not found" });
    }

    const parent = parentRes.rows[0];
    const child = childRes.rows[0];

    // Insert request in ParentChildLinks (pending status)
    await pool.query(
      `INSERT INTO ParentChildLinks (parent_id, child_id, status) VALUES ($1, $2, 'pending')`,
      [parent.id, child.id]
    );

    // 📌 Corrected Approval Link (child clicks this link)
    const approvalLink = `http://localhost:5173/approve-parent?parentId=${parent.id}&childId=${child.id}`;

    // Send Email to Child
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: childEmail,
      subject: "Parent Approval Request",
      html: `
        <p>Your parent <strong>${parent.full_name}</strong> (${parentEmail}) wants to link with you.</p>
        <p>Click the button below to approve:</p>
        <a href="${approvalLink}" 
           style="display:inline-block;padding:10px 20px;margin-top:10px;font-size:16px;color:white;background:#28a745;border:none;border-radius:5px;text-decoration:none;">
           Approve Parent
        </a>
      `,
    });

    res.json({ message: "Approval request sent successfully!" });
  } catch (error) {
    console.error("Error sending parent verification email:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Parent Approval API (Updates Database)
router.get("/approve-parent", async (req, res) => {
  const { parentId, childId } = req.query;

  try {
    const updateRes = await pool.query(
      `UPDATE ParentChildLinks SET status = 'approved' WHERE parent_id = $1 AND child_id = $2 RETURNING *`,
      [parentId, childId]
    );

    if (updateRes.rowCount === 0) {
      return res.status(400).send("Invalid or expired request.");
    }

    // Also update Users table to link parent-child
    await pool.query(
      `UPDATE "Users" SET parent_id = $1 WHERE id = $2`,
      [parentId, childId]
    );

    res.send("<h2>Parent successfully linked!</h2><p>You can now check details in your dashboard.</p>");
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).send("Error processing approval.");
  }
});

// 📌 Get Parent Details for Child's Dashboard
router.get("/get-parent/:childId", async (req, res) => {
    const { childId } = req.params;
  
    try {
      const parentQuery = await pool.query(
        `SELECT u.full_name, u.email FROM ParentChildLinks p
         JOIN "Users" u ON p.parent_id = u.id
         WHERE p.child_id = $1 AND p.status = 'approved'`,
        [childId]
      );
  
      if (parentQuery.rows.length === 0) {
        return res.status(404).json({ message: "No parent linked." });
      }
  
      res.json(parentQuery.rows[0]);
    } catch (error) {
      console.error("Error fetching parent details:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/get-verified-child/:parentId", async (req, res) => {
    const { parentId } = req.params;
  
    try {
      const childQuery = await pool.query(
        `SELECT u.full_name, u.email FROM ParentChildLinks p
         JOIN "Users" u ON p.child_id = u.id
         WHERE p.parent_id = $1 AND p.status = 'approved'`,
        [parentId]
      );
  
      if (childQuery.rows.length === 0) {
        return res.status(404).json({ message: "No verified child linked." });
      }
  
      res.json(childQuery.rows[0]);
    } catch (error) {
      console.error("Error fetching verified child details:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  

module.exports = router;
