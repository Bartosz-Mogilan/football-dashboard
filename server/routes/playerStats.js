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
    const { match_id, player_id, minutes_played, goals, assists, shots, fouls_committed } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO player_stats (match_id, player_id, minutes_played, goals, assists, shots, fouls_committed)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [match_id, player_id, minutes_played, goals, assists, shots, fouls_committed]
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
    const { match_id, player_id, minutes_played, goals, assists, shots, fouls_committed } = req.body;

    try {
      const result = await pool.query(
        `UPDATE player_stats
         SET match_id = $1, player_id = $2, minutes_played = $3, goals = $4, assists = $5, shots = $6, fouls_committed = $7
         WHERE id = $8 RETURNING *`,
        [match_id, player_id, minutes_played, goals, assists, shots, fouls_committed, statId]
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

