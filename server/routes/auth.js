const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();
const pool = require('../db');

const secretKey = process.env.JWT_SECRET;

//Registration

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({ error: 'Username and password are required'});
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at', [username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0]});
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Database error'});
  }
});

//Login

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if(!username || !password) {
    return res.status(400).json({ error: 'Username and password is required'});
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials'});
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials'});
    }

    const token = jwt.sign({ id: user.id, username: user.username}, secretKey, { expiresIn: '1d'});

    res.json({ token });
  } catch (error) {
    console.error('Error logging in', error);
    res.status(500).json({ error : 'Database error'});
  }
});

module.exports = router;





