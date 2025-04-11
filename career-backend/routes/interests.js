const express = require('express');
const pool = require('../db'); // Make sure db.js is correctly set up
const router = express.Router();

// ✅ GET All Career Interests
router.get("/career_interests", async (req, res) => {
    try {
      const result = await pool.query(`SELECT id, name FROM "career_interests"`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching career interests:", error);
      res.status(500).json({ message: "Error fetching career interests." });
    }
  });
  
  // Fetch subject interests
  router.get("/subject_interests", async (req, res) => {
    try {
      const result = await pool.query(`SELECT id, name FROM "subject_interests"`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching subject interests:", error);
      res.status(500).json({ message: "Error fetching subject interests." });
    }
  });
  

// ✅ ADD a New Career Interest
router.post('/career-interests', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO career_interests (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding career interest:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ ADD a New Subject Interest
router.post('/subject-interests', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO subject_interests (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding subject interest:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ UPDATE Career Interest
router.put('/career-interests/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE career_interests SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating career interest:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ UPDATE Subject Interest
router.put('/subject-interests/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE subject_interests SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating subject interest:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ DELETE Career Interest
router.delete('/career-interests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM career_interests WHERE id = $1', [id]);
        res.json({ message: 'Career interest deleted' });
    } catch (error) {
        console.error('Error deleting career interest:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ DELETE Subject Interest
router.delete('/subject-interests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM subject_interests WHERE id = $1', [id]);
        res.json({ message: 'Subject interest deleted' });
    } catch (error) {
        console.error('Error deleting subject interest:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
