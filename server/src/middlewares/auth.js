const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        
        console.log("----- AUTH DEBUG -----");
        console.log("Cookies token:", token);
        console.log("Auth header:", req.headers.authorization);

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
            if (token === "null" || token === "undefined") {
                token = null;
            }
        }
        
        console.log("Extracted token:", token);
        console.log("----------------------");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};

module.exports = { userAuth };
