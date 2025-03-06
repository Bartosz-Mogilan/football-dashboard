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
    if(isNaN(matchId)) {
      return res.status(400).json({ error: 'Invalid match ID'});
    }

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
    const { match_date, home_team_id, away_team_id, home_score, away_score, venue } = req.body;
    if (!match_date || !home_team_id || !away_team_id) {
      return res.status(400).json({ error: 'match_date, home_team_id, and away_team_id are required' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO matches (match_date, home_team_id, away_team_id, home_score, away_score, venue) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [match_date, home_team_id, away_team_id, home_score, away_score, venue]
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
    if (isNaN(matchId)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }

    const { match_date, home_team_id, away_team_id, home_score, away_score, venue } = req.body;

    try {
      const result = await pool.query(
        'UPDATE matches SET match_date = $1, home_team_id = $2, away_team_id = $3, home_score = $4, away_score = $5, venue = $6 WHERE id = $7 RETURNING *',
        [match_date, home_team_id, away_team_id, home_score, away_score, venue, matchId]
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
    if (isNaN(matchId)) {
      return res.status(400).json({ error: 'Invalid match ID' });
    }
    
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