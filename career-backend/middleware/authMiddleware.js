const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }


    
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });

        req.user = user; // Store user data in request
        next(); // Proceed to next middleware/route
    });
};

module.exports = authenticateToken;
