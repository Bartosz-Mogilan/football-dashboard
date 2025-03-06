require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// Routes
const teamsRouter = require('./routes/teams');
const playersRouter = require('./routes/players');
const matchesRouter = require('./routes/matches');
const playerStatsRouter = require('./routes/playerStats');
const authRouter = require('./routes/auth');



app.use('/teams', teamsRouter);
app.use('/players', playersRouter);
app.use('/matches', matchesRouter);
app.use('/player_stats', playerStatsRouter);
app.use('/auth', authRouter);


//Starting server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

