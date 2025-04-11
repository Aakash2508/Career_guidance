const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/authMiddleware');

// Fetch student details
router.get('/student-details', authenticate, async (req, res) => {
    try {
        const { userId } = req.session;
        const result = await pool.query('SELECT * FROM student_details WHERE user_id = $1', [userId]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.json(null); // No details found
        }
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Save student details

router.post('/student-details', authenticate, async (req, res) => {
    try {
        const { userId } = req.session;
        const { dob, gender, school_name, grade, career_interest_id, subject_interest_id, extra_curricular, learning_style, strengths, weaknesses } = req.body;

        // 🔍 Fetch `full_name` from `User` table
        const userResult = await pool.query('SELECT full_name FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        const full_name = userResult.rows[0].full_name;

        // Check if student details already exist
        const existing = await pool.query('SELECT * FROM student_details WHERE user_id = $1', [userId]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Student details already submitted' });
        }

        // Insert new student details
        const result = await pool.query(
            `INSERT INTO student_details (user_id, full_name, dob, gender, school_name, grade, career_interest_id, subject_interest_id, extra_curricular, learning_style, strengths, weaknesses) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [userId, full_name, dob, gender, school_name, grade, career_interest_id, subject_interest_id, extra_curricular, learning_style, strengths, weaknesses]
        );

        res.json({ message: 'Student details saved successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error saving student details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
