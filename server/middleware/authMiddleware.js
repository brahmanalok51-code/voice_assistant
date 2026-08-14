import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      req.userId = decoded.id;
      return next();
    }

    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};