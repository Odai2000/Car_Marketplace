const authorizeRole = (...roles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles;

    if (!userRoles) {
      return res
        .status(401)
        .json({ message: "User assigned roles not found." });
    }

    const allowedRoles = roles.length === 1 && Array.isArray(roles[0]) ? roles[0] : roles;

    // checks if user is authorized
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (hasRole) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden. insufficient permissions." });
    }
  };
};

module.exports = authorizeRole;     