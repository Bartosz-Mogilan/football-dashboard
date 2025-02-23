const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');

//Getting all matches 

router.get('/', authenticateToken, async (req, res) => {

    try {
      const result = await pool.query('SELECT * FROM matches');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Getting a specific match

router.get('/:id', authenticateToken, async (req, res) => {
    const matchId = parseInt(req.params.id, 10);

    try {
      const result = await pool.query('SELECT * FROM matches WHERE id = $1', [matchId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching match:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Creating new match 

router.post('/', authenticateToken, async (req, res) => {
    const { match_date, home_team_id, away_team_id, home_score, away_score, season, venue } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO matches (match_date, home_team_id, away_team_id, home_score, away_score, season, venue) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [match_date, home_team_id, away_team_id, home_score, away_score, season, venue]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating match:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Updating a match

router.put('/:id', authenticateToken, async (req, res) => {
    const matchId = parseInt(req.params.id, 10);
    const { match_date, home_team_id, away_team_id, home_score, away_score, season, venue } = req.body;

    try {
      const result = await pool.query(
        'UPDATE matches SET match_date = $1, home_team_id = $2, away_team_id = $3, home_score = $4, away_score = $5, season = $6, venue = $7 WHERE id = $8 RETURNING *',
        [match_date, home_team_id, away_team_id, home_score, away_score, season, venue, matchId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating match:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Deleting a match

router.delete('/:id', authenticateToken, async (req, res) => {
    const matchId = parseInt(req.params.id, 10);
    try {
      const result = await pool.query('DELETE FROM matches WHERE id = $1 RETURNING *', [matchId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }
      res.json({ message: 'Match deleted successfully' });
    } catch (error) {
      console.error('Error deleting match:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
  module.exports = router;