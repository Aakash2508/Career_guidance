const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/authMiddleware');

router.get('/user', authenticate, async (req, res) => {
    try {
        const { userId } = req.session;
        const result = await pool.query('SELECT id, full_name, email, role FROM public."Users" WHERE id = $1', [userId]);

        if (result.rows.length > 0) {
            res.json({ user: result.rows[0] });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
