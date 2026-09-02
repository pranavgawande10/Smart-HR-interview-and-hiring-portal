export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("authorizeRoles - Allowed Roles:", roles);
    console.log("authorizeRoles - Current User Role:", req.user?.role);
    if (!roles.includes(req.user.role)) {
      console.log("authorizeRoles - Role mismatch: ACCESS DENIED");
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    console.log("authorizeRoles - Role matched: ACCESS GRANTED");
    next();
  };
};