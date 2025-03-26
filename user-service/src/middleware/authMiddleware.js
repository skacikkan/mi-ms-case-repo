const jwt = require('jsonwebtoken');

const authMiddleware = {
  // TOKEN VERIFICATION
  verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Token error' });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token formatted incorrectly' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token invalid' });
      }
      
      req.userId = decoded.id;
      req.userRole = decoded.role;
      return next();
    });
  },
  
  
  // ROLE BASED VERIFICATION
  checkRole(roles) {
    return (req, res, next) => {
      if (!roles.includes(req.userRole)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      return next();
    };
  } 
}; 

module.exports = authMiddleware;