const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        let token;
        
        console.log("----- AUTH DEBUG -----");
        console.log("Auth header:", req.headers.authorization);
        console.log("Cookies token:", req.cookies?.token);

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
            if (token === "null" || token === "undefined") {
                token = null;
            }
        }
        
        if (!token && req.cookies?.token && req.cookies.token !== "null") {
            token = req.cookies.token;
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
