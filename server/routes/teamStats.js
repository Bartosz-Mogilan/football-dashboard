const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');

//Getting all team stats

router.get('/', authenticateToken, async (req, res) => {

    try {
      const result = await pool.query('SELECT * FROM team_stats');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching team stats:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Getting a specific teams stats

router.get('/:id', authenticateToken, async (req, res) => {
    const statId = parseInt(req.params.id, 10);

    try {
      const result = await pool.query('SELECT * FROM team_stats WHERE id = $1', [statId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team stat not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching team stat:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Creating a new teams stats

router.post('/', authenticateToken, async (req, res) => {
    const { match_id, team_id, possession, shots_on_target, corners, fouls } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO team_stats (match_id, team_id, possession, shots_on_target, corners, fouls)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [match_id, team_id, possession, shots_on_target, corners, fouls]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating team stat:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Updating a teams stats

router.put('/:id', authenticateToken, async (req, res) => {
    const statId = parseInt(req.params.id, 10);
    const { match_id, team_id, possession, shots_on_target, corners, fouls } = req.body;

    try {
      const result = await pool.query(
        `UPDATE team_stats
         SET match_id = $1, team_id = $2, possession = $3, shots_on_target = $4, corners = $5, fouls = $6
         WHERE id = $7 RETURNING *`,
        [match_id, team_id, possession, shots_on_target, corners, fouls, statId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team stat not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating team stat:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Deleting a teams stats

router.delete('/:id', authenticateToken, async (req, res) => {
    const statId = parseInt(req.params.id, 10);
    
    try {
      const result = await pool.query('DELETE FROM team_stats WHERE id = $1 RETURNING *', [statId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team stat not found' });
      }
      res.json({ message: 'Team stat deleted successfully' });
    } catch (error) {
      console.error('Error deleting team stat:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
  module.exports = router;