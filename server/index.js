const express = require('express');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const authenticateToken = require('./authMiddleware');

app.use(express.json());

//Teams Endpoints

//Retrive teams from database

app.get('/teams', async (req, res) => {

    try{
        const result = await pool.query('SELECT * FROM teams');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching teams: ", error);
        res.status(500).json({ error: 'Database error' });
    }
});

//Retrieving a specific team by id

app.get('/teams/: id', authenticateToken, async (req, res) => {
    
    try {
        const result = await pool.query('SELECT * FROM teams WHERE id = $1', [teamId]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found'});
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching team', error);
        res.status(500).json({ error: 'Database error'});
    }
});

//Create a new team

app.post('/teams', authenticateToken, async (req, res) => {
    const { name, abbreviation, logo_url, founded_year, stadium } = req.body;

    try {
        const result = await pool.query('INSERT INTO teams (name, abbreviation, logo_url, founded_year, stadium) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, abbreviation, logo_url, founded_year, stadium]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating a team', error);
        res.status(500).json({ error: 'Database error'});
    }
});

//Update a team by id

app.put('/teams/:id', authenticateToken, async (req, res) => {
    const teamId = parseInt(req.params.id, 10);
    const { name, abbreviation, logo_url, founded_year, stadium } = req.body;

    try {
        const result = await pool.query('UPDATE teams SET name = $1, abbreviation = $2, logo_url = $3, founded_year = $4, stadium = $5 WHERE id = $6 RETURNING *', [name, abbreviation, logo_url, founded_year, stadium, teamId ]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found'});
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating team: ', error);
        res.status(500).json({ error: 'Database error'});
    }
});

//Delete a team

app.delete('/teams/:id', authenticateToken, async (req, res) => {
    const teamId = parseInt(req.params.id, 10);

    try {
        const result = await pool.query('DELETE FROM teams WHERE id = $1 RETURNING *', [teamId]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found'});
        }
        res.json({ message: 'Team deleted successfully'});
    } catch (error) {
        console.error('Error deleting team', error);
        res.status(500).json({ error: 'Database error'});
    }
});

//Player endpoints 

// get all player stats
app.get('/player_stats', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM player_stats');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching player stats:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
  // get a single player stat record by ID
  app.get('/player_stats/:id', authenticateToken, async (req, res) => {
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
  
  // create a new player stat record
  app.post('/player_stats', authenticateToken, async (req, res) => {
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
  
  // update a player stat record by ID
  app.put('/player_stats/:id', authenticateToken, async (req, res) => {
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
  
  // deleting a player stat record by ID
  app.delete('/player_stats/:id', authenticateToken, async (req, res) => {
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
  
  //Team stat endpoints
  
  // get all team stats
  app.get('/team_stats', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM team_stats');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching team stats:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
  // get a single team stat record by ID
  app.get('/team_stats/:id', authenticateToken, async (req, res) => {
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
  
  // create a new team stat record
  app.post('/team_stats', authenticateToken, async (req, res) => {
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
  
  // update a team stat record by ID
  app.put('/team_stats/:id', authenticateToken, async (req, res) => {
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
  
  // deleting a team stat record by ID
  app.delete('/team_stats/:id', authenticateToken, async (req, res) => {
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
  
//Starting the server

  app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
  });
