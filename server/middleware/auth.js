const mongoose = require('mongoose');

//checks token and sets req.user

exports.protect = async (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = auth.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // id and role from token
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: "Not authorized, token invalid" });
    }
    
};
//check role of user
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Not authorized, role not allowed" });
        }
        next();
    };
};