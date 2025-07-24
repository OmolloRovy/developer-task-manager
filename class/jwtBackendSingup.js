const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
app.post('/api/users/signup', async (req, res) => {

    const {email, password} = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await user.create({email, password: hash});

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.json({user, token});
}) 

app.post('/api/users/login', async (req, res) => {
    const user = await user.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).json({message: 'User not found'});
    };
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
        return res.status(401).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.json({user, token});
})


// protecting routes using jwt middleware
//the how
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
//the use
app.get("/api/users/profile", auth, (req, res) => {
    res.send(`Welcome ${req.user.id}`);
});