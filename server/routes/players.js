const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');

//Getting all players

router.get('/', authenticateToken, async (req, res) => {

    try {
      const result = await pool.query('SELECT * FROM players');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Getting specific player by ID

router.get('/:id', authenticateToken, async (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    if (isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    try {
      const result = await pool.query('SELECT * FROM players WHERE id = $1', [playerId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Player not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching player:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Creating a new player

router.post('/', authenticateToken, async (req, res) => {
    const { name, team_id, position, date_of_birth, nationality } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO players (name, team_id, position, date_of_birth, nationality) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, team_id, position, date_of_birth, nationality]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating player:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Updating a player

router.put('/:id', authenticateToken, async (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    if (isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    const { name, team_id, position, date_of_birth, nationality } = req.body;

    try {
      const result = await pool.query(
        'UPDATE players SET name = $1, team_id = $2, position = $3, date_of_birth = $4, nationality = $5 WHERE id = $6 RETURNING *',
        [name, team_id, position, date_of_birth, nationality, playerId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Player not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating player:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Deleting a player

router.delete('/:id', authenticateToken, async (req, res) => {
    const playerId = parseInt(req.params.id, 10);
    if (isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    try {
      const result = await pool.query('DELETE FROM players WHERE id = $1 RETURNING *', [playerId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Player not found' });
      }
      res.json({ message: 'Player deleted successfully' });
    } catch (error) {
      console.error('Error deleting player:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

module.exports = router;