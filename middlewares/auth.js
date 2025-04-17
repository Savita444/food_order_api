const jwt = require('jsonwebtoken');

const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. No token.' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Unauthorized role access' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = {
  verifySuperAdmin: verifyToken(['superadmin']),
  verifyHotelAdmin: verifyToken(['hoteladmin']),
  verifyUser: verifyToken(['user']),
  verifyAny: verifyToken([]), // allows all logged-in users
};
