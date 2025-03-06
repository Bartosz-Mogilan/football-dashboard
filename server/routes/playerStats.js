const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');

//Getting all player stats

router.get('/', authenticateToken, async (req, res) => {

    try {
      const result = await pool.query('SELECT * FROM player_stats');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching player stats:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Getting a single player stats

router.get('/:id', authenticateToken, async (req, res) => {
    const statId = parseInt(req.params.id, 10);
    if (isNaN(statId)) {
      return res.status(400).json({ error: 'Invalid stat ID' });
    }

    try {
      const result = await pool.query('SELECT * FROM player_stats WHERE id = $1', [statId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Player stat not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching player stat:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Creating player stats

router.post('/', authenticateToken, async (req, res) => {
    const { player_id, player_name, goals, assists } = req.body;
    if (!player_id) {
      return res.status(400).json({ error:  'player_id are required' });
    }

    try {
      const result = await pool.query(
        `INSERT INTO player_stats (player_id, player_name, goals, assists)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [player_id, player_name, goals, assists]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating player stat:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Updating player stats

router.put('/:id', authenticateToken, async (req, res) => {
    const statId = parseInt(req.params.id, 10);
    if (isNaN(statId)) {
      return res.status(400).json({ error: 'Invalid stat ID' });
    }

    const { player_id, player_name, goals, assists } = req.body;

    try {
      const result = await pool.query(
        `UPDATE player_stats
         SET player_id = $1, player_name = COALESCE($2, player_name), goals = $3, assists = $4
         WHERE id = $5 RETURNING *`,
        [player_id, player_name, goals, assists, statId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Player stat not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating player stat:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Deleting a player stats

router.delete('/:id', authenticateToken, async (req, res) => {
    const statId = parseInt(req.params.id, 10);
    if (isNaN(statId)) {
      return res.status(400).json({ error: 'Invalid stat ID' });
    }

    try {
      const result = await pool.query('DELETE FROM player_stats WHERE id = $1 RETURNING *', [statId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Player stat not found' });
      }
      res.json({ message: 'Player stat deleted successfully' });
    } catch (error) {
      console.error('Error deleting player stat:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
  module.exports = router;

