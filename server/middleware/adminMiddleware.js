const adminMiddleware = (req, res, next) => {
  console.log('User in adminMiddleware:', req.user);
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  };
  
  export default adminMiddleware;
  

