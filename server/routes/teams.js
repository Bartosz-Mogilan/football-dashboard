const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');


//Getting all teams

router.get('/', authenticateToken, async (req, res) => {

    try {
        const result = await pool.query('SELECT * FROM teams');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Database error'});
    }
});

//Getting a team by ID

router.get('/:id', authenticateToken, async (req, res) => {
    const teamId = parseInt(req.params.id, 10);

    try {
      const result = await pool.query('SELECT * FROM teams WHERE id = $1', [teamId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching team:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  //Creating a new team

  router.post('/', authenticateToken, async (req, res) => {
    const { name, abbreviation, logo_url, founded_year, stadium } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO teams (name, abbreviation, logo_url, founded_year, stadium) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, abbreviation, logo_url, founded_year, stadium]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating a team:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Updating team by ID

router.put('/:id', authenticateToken, async (req, res) => {
    const teamId = parseInt(req.params.id, 10);
    const { name, abbreviation, logo_url, founded_year, stadium } = req.body;

    try {
      const result = await pool.query(
        'UPDATE teams SET name = $1, abbreviation = $2, logo_url = $3, founded_year = $4, stadium = $5 WHERE id = $6 RETURNING *',
        [name, abbreviation, logo_url, founded_year, stadium, teamId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

//Deleting team by ID

router.delete('/:id', authenticateToken, async (req, res) => {
    const teamId = parseInt(req.params.id, 10);

    try {
      const result = await pool.query('DELETE FROM teams WHERE id = $1 RETURNING *', [teamId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json({ message: 'Team deleted successfully' });
    } catch (error) {
      console.error('Error deleting team:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

module.exports = router;