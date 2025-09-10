import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes: verify JWT token
export const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
    }

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request object (without password)
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: "Token is not valid" });
    }
};

// Role-based authorization: allow only specified roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Access denied: insufficient permissions" });
        }
        next();
    };
};
