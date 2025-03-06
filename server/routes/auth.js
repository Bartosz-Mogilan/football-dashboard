const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const secretKey = process.env.JWT_SECRET || 'your_secret_key';


router.post('/login', (req, res) => {
  const { username } = req.body;
  
  if(!username) {
    return res.status(400).json({ error: 'Username is required'});
  }

  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;



