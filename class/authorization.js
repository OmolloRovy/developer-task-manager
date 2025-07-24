//authentication middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(403).json({message: 'Unauthorized'});
  }
}


// authorization middleware
const authorize = (roles) =>{
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

// use
app.get("/api/admin-only", auth, authorize(['admin']), (req, res) => {
    res.send("Welcome Admin");
});