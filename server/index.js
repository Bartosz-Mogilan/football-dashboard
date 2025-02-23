const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const teamsRouter = require('./routes/teams');
const playersRouter = require('./routes/players');
const matchesRouter = require('./routes/matches');
const playerStatsRouter = require('./routes/playerStats');
const teamStatsRouter = require('./routes/teamStats');

app.use('/teams', teamsRouter);
app.use('/players', playersRouter);
app.use('/matches', matchesRouter);
app.use('/player_stats', playerStatsRouter);
app.use('/team_stats', teamStatsRouter);

//Starting server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

